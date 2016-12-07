<template>
	<div class="reader page page-fixed" :class='{reading: !showMenu, night: isNight}'>
		<Navbar
			:hasLeftBorder='false'
			:hasSearchIcon='false'
			bgcolor='#333'>
				<h2 class="navbar-h2">{{currentChapterCtx.title}}</h2>
				<h3 v-if='isAddShelf' @click='goToSources' class="navbar-h3" slot='navbar-right'>换源</h3>
		</Navbar>
		<div class="reader-container">
			<Loading :isLoading='isLoading' :automatic='true'>
				<!-- 一个章节，考虑预先加载下一章节 -->
				<!-- 应该有多个 .reader-chapter -->
				<div class="reader-chapter">
					<h2 class="reader-tit">{{currentChapterCtx.title}}</h2>
					<div class="reader-context">
						<div class="cpContent" ref='cpContent' v-html='currentChapterCtx.cpContent || currentChapterCtx.body'></div>
					</div>
				</div>
			</Loading>
		</div>
		<footer class="reader-footer">
			<ul>
				<li @click='changeNightMode'>
					<template v-if='!isNight'>
						<Icon className='icon-yejian'></Icon>
						<p>夜间</p>
					</template>
					<template v-else>
						<Icon className='icon-baitianmoshi'></Icon>
						<p>白天</p>
					</template>
				</li>
				<li>
					<Icon className='icon-shezhi'></Icon>
					<p>设置</p>
				</li>
				<li @click='download'>
					<Icon className='icon-iconfontxiazai'></Icon>
					<p>缓存</p>
				</li>
				<li @click='toggleCatalog'>
					<Icon className='icon-menu-a'></Icon>
					<p>目录</p>
				</li>
			</ul>
		</footer>
		
		<!-- 阅读提示 / 触摸板-->
		<div class="reader-tips hide" ref='touchpad'>
			<div class="left">上一页</div>
			<div class="mid">显示/隐藏菜单</div>
			<div class="right">下一页</div>
		</div>

		<!-- 目录 -->
		<div class="reader-catalog" v-if='showCatalog' @click='toggleCatalog'>
			<div class="context">
				<h3>{{currentChapterCtx.title}}</h3>
				<ul>
					<li 
					v-for='(chapter, index) in chapters' 
					@click.stop='toggleChapter(index)'
					:class='{current: index == currentIndex}'>
						{{chapter.title}}
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>

<script>
	import Navbar from '../components/navbar';
	import Icon from '../components/icons';
	import Loading from '../components/loading';
	import Promise from 'es6-promise';
	import PageSwiper from '../lib/pageSwiper';
	import {mapState, mapActions} from 'vuex';
	import * as Book from '../lib/book_utils';

	let pageSwiper = null;

	export default {
		data() {
			return {
				isLoading: false,
				bookId: 0,				// 书籍ID
				isNight: false,			// 是否是夜间模式
				showMenu: false,		// 是否显示菜单
				showCatalog: false, 	// 是否显示目录
				isAddShelf: false,		// 是否添加到书架
				currentSource: {}, 		// 当前书籍来源
				chapters: [],			// 所有章节信息
				currentIndex: 0, 		// 当前章节序号
				currentChapterCtx: {}	// 当前章节内容
			}
		},
		components: {
			Navbar,
			Icon,
			Loading
		},
		computed: {
			...mapState([
				'bookShelf'
			])
		},
		methods: {
			...mapActions([
				'setShelfChapter'
			]),
			// 切换夜间 / 白天模式
			changeNightMode() {
				let meta = document.querySelector('meta[name=theme-color]');
				this.isNight = !this.isNight;
				if (this.isNight) {
					meta.setAttribute('content', '#222222');
				} else {
					meta.setAttribute('content', '#4393E2');
				}
			},
			// 缓存全本
			download() {
				this.$notice.push('功能完善中')
			},
			// 切换显示目录
			toggleCatalog() {
				this.showCatalog = !this.showCatalog;
			},
			// 切换章节
			toggleChapter(index) {
				this.isLoading = true;
				this.showCatalog = false;	// 隐藏目录
				this.showMenu = false;	// 隐藏菜单
				return setCpcontext.call(this, this.chapters, index)
				.then(chapter => {
					this.isLoading = false;
					// 如果该书籍已添加到书架的话，会更新其当前章节
					let playload = {
						bookId: this.bookId,
						chapter: chapter,
						index: this.currentIndex
					}
					this.setShelfChapter(playload);
				})
			},
			goToSources() {
				this.$router.replace('/bookSources/' + this.bookId);
			}
		},
		mounted() {
			let _self = this;
			/* eslint-disable no-new */
			pageSwiper = new PageSwiper(this.$refs.touchpad, this.$refs.cpContent, {
				// 如果是第一章，阻止其向右滑动
				beforePrevHandle(swiper) {
					if (_self.currentIndex <= 0) {
						swiper.stop();
					}
				},
				// 返回上一章
				prevHandle(swiper) {
					--_self.currentIndex;
					if (_self.currentIndex < 0) {
						_self.currentIndex = 0;
						return;
					}
					// 获取上一章节内容
					_self.toggleChapter(_self.currentIndex)
					.then(() => {
						swiper.slideTo(swiper.maxStep);
					})
				},
				// 如果是最后一张，阻止其向左滑动
				beforeNextHandle(swiper) {
					if (_self.currentIndex >= _self.chapters.length - 1) {
						swiper.stop();
					}
				},
				// 翻到下一章
				nextHandle(swiper) {
					++_self.currentIndex;
					if (_self.currentIndex >= _self.chapters.length) {
						_self.currentIndex = _self.chapters.length - 1;
						return;
					}
					// 获取下一章节内容
					_self.toggleChapter(_self.currentIndex);
				},
				midTapEnd() {
					_self.showMenu = !_self.showMenu;
				}
			})
		},
		activated() {
			this.bookId = this.$route.params.bookId;
			// 检测是否已经添加到书架
			for (let shelf of this.bookShelf) {
				if (shelf._id == this.bookId) {
					this.isLoading = true;
					this.isAddShelf = true;
					this.currentSource = shelf.currentSource;
					Book.getChapters.call(this, this.currentSource)
						.then(chapters => {
							this.isLoading = false;
							this.chapters = chapters;
							setCpcontext.call(this, this.chapters, shelf.currentChapter._index);
						});
					return;
				}
			}
			// 如果书籍未收藏，默认第1个书源第
			this.isAddShelf = false;
			this.currentIndex = 0;
			this.isLoading = true;
			changeSource.call(this, 1).then(() => {
				this.isLoading = false;
			});
		},
		deactivated() {
			this.showMenu = false;
			this.showCatalog = false;
		}
	}

	// 设置书籍来源为第 `index` 个
	function setSources(bookId, index) {
		return new Promise(resolve => {
			Book.getSources.call(this, bookId)
			.then(sources => {
				if (sources.length === 1) index = 0;
				this.currentSource = sources[index];
				resolve(this.currentSource);
			})
		});
	}

	// 设置某个 `source` 来源的所有章节信息
	function setChapters(source) {
		return new Promise(resolve => {
			Book.getChapters.call(this, source)
			.then(chapters => {
				this.chapters = chapters;
				resolve(chapters);
			});
		});
	}

	// 显示第 `index` 章节的内容
	function setCpcontext(chapters, index) {
		return new Promise(resolve => {
			Book.getCpcontext.call(this, chapters, index)
			.then(chapter => {
				this.currentIndex = index;
				this.currentChapterCtx = chapter;
				setTimeout(() => {
					pageSwiper.init();
					resolve(chapter);
				});
			});
		});
	}

	// 换源
	function changeSource(index) {
		return new Promise(resolve => {
			setSources.call(this, this.bookId, index)
			.then(sources => {
				return setChapters.call(this, sources);
			}).then(chapters => {
				return setCpcontext.call(this, chapters, this.currentIndex)
			}).then(() => {
				resolve();
			})
		})
	}
</script>

<style lang='scss'>
	@import '../assets/style/sass_mixins';
	.reader{
		background: #f7dbc9 url(../assets/pager_bg.jpg) no-repeat center center;
		background-size: cover;
		.navbar{
			.navbar-icon:active{
				background-color: #333;
			}
		}
		/* 夜间模式 */
		&.night{
			background: #222;
			.reader-context,
			.reader-tit{
				color: #777;
			}
		}
		/* 阅读状态，不显示头部和底部 */
		&.reading{
			>.navbar{
				z-index: 15;
				transform: translate3d(0, -100%, 0);
			}
			.reader-footer{
				z-index: 15;
				transform: translate3d(0, 100%, 0);
			}
		}
		&-container{
			padding: 10px;
			height: 100%;
		}
		&-chapter{
			display: flex;
			flex-direction: column;
			height: 100%;
		}
		&-tit{
			font-weight: normal;
			margin: 5px 0 10px;
			font-size: 12px;
			color: darken(#a99284, 10%);
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}
		&-context{
			-webkit-perspective:1;
			font-size: 16px;
			line-height: 1.7;
			flex: 1;
			height: 100%;
			overflow: auto;
			color: #333;
			padding-bottom: 10px;
			.cpContent{
				flex: 1;
				text-indent: 2em;
				height: 100%;
				column-width: 100vw;
				column-width: calc(100vw - 20px);
				column-count: 1;
				padding-left: 10px;
				column-gap: 10px;
			}
		}
		/* 底栏 */
		&-footer{
			position: absolute;
			z-index: 10;
			bottom: 0;
			left: 0;
			right: 0;
			color: #fff;
			background-color: #333;
			font-size: 12px;
			transition: transform .3s ease;
			ul{
				display: flex;
				justify-content: center;
			}
			li{
				flex: 1;
				text-align: center;
				padding: 12px 0;
			}
			.iconfont{
				font-size: 18px;
				margin-bottom: 3px;
				display: inline-block;
			}
		}
		/* 阅读提示 */
		&-catalog,
		&-tips{
			position: absolute;
			left: 0;
			right: 0;
			bottom: 0;
			top: 0;
		}
		&-tips{
			z-index: 5;
			display: flex;
			background: rgba(#000,.8);
			color: #fff;
			.left,.right,.mid{
				display: inline-flex;
				align-items: center;
				justify-content: center;
				font-size: 28px;
				writing-mode: vertical-lr;
				height: 100%;
			}
			.left,.right{
				flex: 1;
			}
			.mid{
				border-right: 1px solid #fff;
				border-left: 1px solid #fff;
				flex: 2;
			}
			&.hide{
				opacity: 0;
			}
		}
		/* 目录 */
		&-catalog{
			z-index: 15;
			.context{
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%);
				padding-bottom:10px;
				width: 80vw;
				height: 70vh;
				overflow: hidden;
				display: flex;
				flex-direction: column;
				background: #fff;
			}
			h3{
				margin: 0;
				font-weight: normal;
				padding: 15px 10px 10px;
				box-shadow: 0 0 5px #999;
				@include ellipsis(1);
			}
			ul{
				flex: 1;
				padding: 10px;
				height: 100%;
				overflow: auto;
				&::-webkit-scrollbar{width:5px;}
				&::-webkit-scrollbar-track-piece{background:transparent;}
				&::-webkit-scrollbar-thumb:vertical{height: 20px;background:#4393E2;}
				&::-webkit-scrollbar-thumb:horizontal{width: 2px;background:#4393E2;}
			}
			li{
				padding: 12px 0;
				@include ellipsis(1);
				@extend %one-px-border;
				&.current{
					color: #4393E2;
				}
			}
		}
	}
</style>