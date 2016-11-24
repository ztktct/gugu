<template>
	<div class="page page-fixed book">
		<div class="book-top">
			<div class="book-top-bg" :style="'background-image:url('+bookDetails.cover.substr(7)+')'"></div>
			<div class="book-top-bg2"></div>
			<Navbar 
			class='book-navbar'
			:hasLeftBorder='false'
			:hasSearchIcon='false'>
				<h2 class="navbar-h2">书籍详情</h2>
				<h3 class="navbar-h3" slot='navbar-right'>缓存全本</h3>
			</Navbar>
			<div class="book-top-ctx">
				<div class="leftimg">
					<img :src="bookDetails.cover.substr(7)" height="64" width="44" alt="">
				</div>
				<div class="midctx">
					<h3>{{bookDetails.title}}</h3>
					<p><em>{{bookDetails.author}}</em> | {{bookDetails.cat}} | {{Math.ceil(bookDetails.wordCount / 10000)}}万字</p>
					<p>14小时前</p>
				</div>
				<div class="rightctx">
					<Btn :btnEvent='btnEvent'>开始阅读</Btn>
					<Btn>+追更新</Btn>
				</div>
			</div>
		</div>
		<div class="container">
			<ul class="book-states">
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
			<div class="book-keywords">
				<ul>
					<li v-for='tag in bookDetails.tags'>{{tag}}</li>
				</ul>
			</div>
			<div class="book-introduce ellipsis">
				{{bookDetails.longIntro}}
			</div>
		</div>
	</div>
</template>

<script>
	import Navbar from '../components/navbar';
	import Btn from '../components/btn';
    import {API_ADDRESS} from '../vuex/localdata';

	export default{
		data() {
			return {
				bookDetails: null
			}
		},
		components: {
			Navbar,
			Btn
		},
		methods: {
			btnEvent() {
				this.$router.push('/bookReader');
			}
		},
		mounted() {
			this.$http.get(API_ADDRESS + '/book/' + this.$route.params.id)
			.then(response => {
				this.bookDetails = response.body;
			})
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
			padding: 5px 20px 10px;
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
				h3{
					font-weight: normal;
					margin: 5px 0 6px;
					@include ellipsis(1);
					transition: font-size .3s ease;
				}
				p{
					margin: 5px 0;
					transition: opacity .3s ease;
				}
				em{
					font-style: normal;
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
		&-states,&-keywords{
			padding: 15px 0;
			margin: 0 10px;
			@include one-px-border();
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
			margin-bottom: 15px;
			li{
				display: inline-block;
				border-radius: 4px;
				padding: 5px 12px;
				color: #fff;
				margin-right: 5px;
				margin-bottom: 5px;
				@for $i from 1 through 10{
					&:nth-of-type(#{$i}){
					 background-color: nth($colors, $i);
					};
				}
			}
		}
		&-introduce{
			margin: 0 10px 15px;
			font-size: 14px;
			line-height: 1.6;
			overflow: hidden;
			&.ellipsis{
				@include ellipsis(5);
				max-height: 1.6 * 5 * 1em;
			}
		}
	}
</style>