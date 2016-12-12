<template>
	<div class="page page-fixed book">
		<div class="book-top">
				<div class="book-top-bg" :style="'background-image:url('+ bookDetails.cover+')'"></div>
				<div class="book-top-bg2"></div>
				<Navbar 
				class='book-navbar'
				:hasLeftBorder='false'
				:hasSearchIcon='false'>
					<h2 class="navbar-h2">书籍详情</h2>
					<h3 class="navbar-h3" @click='download' slot='navbar-right'>缓存全本</h3>
				</Navbar>
				<div class="book-top-ctx">
					<div class="leftimg">
						<img :src="bookDetails.cover" height="64" width="48" :alt="bookDetails.title">
					</div>
					<div class="midctx">
						<h3>{{bookDetails.title}}</h3>
						<p>
							<router-link :to="'/search/result/'+bookDetails.author">{{bookDetails.author || '作者'}}</router-link> 
							| {{bookDetails.cat}} 
							| {{Math.ceil(bookDetails.wordCount / 10000) || 0}}万字
						</p>
						<p>{{bookDetails.updated | timeSemantic}}</p>
					</div>
					<div class="rightctx">
						<Btn :btnEvent='btnEvent'>开始阅读</Btn>
						<Btn v-if='!hasInShelf' :btnEvent='addToShelf'>+ 追更新</Btn>
						<Btn v-else className='disabled' :btnEvent='removeFromShelf'>- 不追更</Btn>
					</div>
				</div>
		</div>
		<div class="container">
			<Loading :isLoading='isloading' :automatic='true'>
				<ul class="book-states book-block">
					<li>
						<p>追更人数</p>
						<strong>{{bookDetails.latelyFollower}}</strong>
					</li>
					<li>
						<p>读者存留率</p>
						<strong>{{bookDetails.retentionRatio || 0}}%</strong>
					</li>
					<li>
						<p>日更新字数</p>
						<strong>{{bookDetails.serializeWordCount}}</strong>
					</li>
				</ul>
				<div class="book-keywords book-block">
					<ul>
						<router-link tag='li' :to="'/bookTags/'+tag" v-for='tag in bookDetails.tags'>{{tag}}</router-link>
					</ul>
				</div>
				<div class="book-introduce book-block" :class='{ellipsis: !showIntroduce}' @click='showIntroduceFn' v-html='bookDetails.longIntro'>
				</div>
				<div class="book-likes book-block">
					<h3>猜你喜欢</h3>
					<ul>
						<router-link tag='li' :to="'/bookDetails/'+book._id" v-for='book in booklikes'>
							<figure>
								<img :src="book.cover.substr(7)" height="64" width="48" :alt="book.title">
								<figcaption>{{book.title}}</figcaption>
							</figure>
						</router-link>
					</ul>
				</div>
			</Loading>
		</div>
	</div>
</template>

<script>
	import Navbar from '../components/navbar';
	import Btn from '../components/btn';
    import {API_ADDRESS} from '../vuex/localdata';
    import { mapState, mapActions } from 'vuex';
	import Loading from '../components/loading';
	import * as Book from '../lib/book_utils';

	export default{
		data() {
			return {
				isloading: false,
				bookId: 0,				// 书籍ID
				hasInShelf: false,		// 是否已经添加到书架
				bookDetails: {},		// 书籍详情
				booklikes: [],  		// 猜你喜欢相关书籍列表
				showIntroduce: false 	// 显示长介绍
			}
		},
		components: {
			Navbar,
			Btn,
			Loading
		},
		computed: {
			...mapState([
			    'bookShelf'
			])
		},
		methods: {
			...mapActions([
				'addShelf',
				'reduceShelf'
			]),
			// 开始阅读
			btnEvent() {
				this.$router.push('/bookReader/' + this.bookId);
			},
			// 显示长介绍
			showIntroduceFn() {
				this.showIntroduce = true;
			},
			// 缓存全本
			download() {
				this.$notice.push('功能完善中')
			},
			// 获取书籍相关信息
			getBookAndLikes() {
				this.isloading = true;
				// 检测书籍是否已被添加到书架
				this.hasInShelf = false;
				for (let shelf of this.bookShelf) {
					if (shelf._id === this.bookId) {
						this.hasInShelf = true;
						break;
					}
				}
				// 获取书籍详情
				this.$http.get(API_ADDRESS + '/book/' + this.bookId)
				.then(response => {
					this.showIntroduce = false;
					this.bookDetails = response.body;
					// 获取真实的封面地址
					this.bookDetails.cover = this.bookDetails.cover.substr(7);
					this.bookDetails.longIntro = this.bookDetails.longIntro.replace(/\r/g, '<br/>');
					this.isloading = false;
				});
				// 获取相关书籍，猜你喜欢
				this.$http.get(API_ADDRESS + '/book/' + this.bookId + '/recommend')
				.then(response => {
					this.booklikes = response.body.books;
				});
			},
			// 添加到书架，追更
			addToShelf() {
				let book = {
					_id: this.bookId,
					cover: this.bookDetails.cover,
					title: this.bookDetails.title,
					lastChapter: this.bookDetails.lastChapter,
					updated: this.bookDetails.updated,
					auhor: this.bookDetails.author
				};
				this.isloading = true;
				Book.getSources.call(this, this.bookId)
				.then(sources => {
					book.currentSource = sources[0]; // 默认第一个来源
					return Book.getChapters.call(this, book.currentSource);
				})
				.then((chapters) => {
					book.currentChapter = chapters[0];// 默认第一章
					book.currentChapter._index = 0;
					this.hasInShelf = true;
					this.addShelf(book);
					this.$notice.push('已添加到书架');
					this.isloading = false;
				})
			},
			// 取消追更，从书架删除
			removeFromShelf() {
				this.hasInShelf = false;
				this.reduceShelf(this.bookId);
				this.$notice.push('已从书架删除');
			}
		},
		watch: {
			'$route'(to, from) {
				if (this.$route.params.id) {
					this.bookId = this.$route.params.id;
					this.getBookAndLikes();
				}
			}
		},
		mounted() {
			this.bookId = this.$route.params.id;
			this.getBookAndLikes();
		}

	}
</script>

<style lang='scss' scoped>
	@import '../assets/style/sass_mixins';
	.book{
		display: flex;
		flex-direction: column;
		&-top{
			position: relative;
			overflow: hidden;
			height: 143px;
			&-bg,&-bg2{
				position: absolute;
				z-index: 3;
				top: -30px;
				left: -30px;
				right: -30px;
				bottom: -30px;
			}
			&-bg{
				transition: opacity .3s ease;
				filter: blur(25px);
				background-size: 300% auto;
				background-position: center top;
			}
			&-bg2{
				z-index: 2;
				background: #4393E2;
			}
			.navbar{
				position: relative;
				background-color: transparent !important;
				&-h2{
					transition: opacity .3s ease;
				}
			}
			/* 隐藏模式，只剩标题栏 */
			&.hidemode{
				.book-top-bg,
				.navbar-h2,
				.book-top-ctx .midctx p,
				.book-top-ctx .rightctx{
					opacity: 0;
				}
				.book-top-ctx .leftimg{
					transform: scale(0);
				}
				.book-top-ctx .midctx h3{
					font-size: 18px;
				}
			}
		}
		&-top-ctx{
			position: relative;
			z-index: 5;
			padding: 5px 10px 10px;
			display: flex;
			justify-content: space-between;
			color: #fff;
			.leftimg{
				margin-right: 10px;
				transition: transform .3s ease;
			}
			.midctx{
				flex: 1;
				width: 0;
				padding-right: 5px;
				h3{
					font-weight: normal;
					margin: 5px 0 6px;
					@include ellipsis(1);
					transition: font-size .3s ease;
					min-height: 16px;
				}
				p{
					@include ellipsis(1);
					margin: 5px 0;
					transition: opacity .3s ease;
				}
				a{
					color: #f07a0c;
				}
			}
			.rightctx{
				display: inline-flex;
				flex-direction: column;
				justify-content: center;
				transition: opacity .3s ease;
				.btn{
					width: 6em;
					font-size: 14px;
					&:first-child{
						margin-bottom: 5px;
					};
				}
			}
		}
		.container{
			flex: 1;
			height: 0;
			padding-top: 0;
		}
		&-block{
			padding: 15px 0;
			margin: 0 10px;
			&:first-child{
				margin-top: 10px;
			};
			&:not(:last-child){
				@include one-px-border();
			}
		}
		&-states{
			margin-top: 10px;
			display: flex;
			justify-content: space-between;
			text-align: center;
			font-size: 14px;
			li{
				flex: 1;
			}
			p{
				margin-bottom: 5px;
				color: #666;
			}
			strong{
				font-weight: normal;
				color: #333;
			}
		}
		&-keywords{
			$colors: (#03a9f4, #f589f5, #f74d5b, #f5a15d, #935df5, #5cd2f2, #c1f559, #991199, #f0dd0b, #f02a0c);
			padding-bottom: 7px;
			li{
				display: inline-block;
				border-radius: 4px;
				padding: 5px 12px;
				color: #fff;
				margin: 0 8px 8px 0;
				@for $i from 1 through 10{
					&:nth-of-type(#{$i}){
					 background-color: nth($colors, $i);
					};
				}
			}
		}
		&-introduce{
			font-size: 14px;
			line-height: 1.6;
			overflow: hidden;
			&.ellipsis{
				max-height: 1.6 * 5 * 1em;
				@extend %text-hide;
			}
		}
		&-likes{
			h3{
				font-weight: normal;
				margin: 0 0 10px;
			}
			ul{
				white-space: nowrap;
				overflow: auto;
			}
			li{
				display: inline-block;
				text-align: center;
				margin: 0 5px;
				max-width: 5em;
				&:first-child{
					margin-left: 0;
				}
				&:last-child{
					margin-right: 0;
				}
				figure{
					margin: 0;
				}
				figcaption{
					@include ellipsis(2);
				}
				img{
					margin-bottom: 5px;
					border-radius: 4px;
				}
			}
		}
	}
</style>