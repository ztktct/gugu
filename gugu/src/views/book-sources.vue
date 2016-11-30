<template>
	<div class="page page-fixed">
		<Navbar
		:hasLeftBorder='false'
		:hasSearchIcon='false'>
			<h2 class="navbar-h2">换源</h2>
		</Navbar>
		<div class="container">
			<ul class="sources-lists">
				<li class="cell" v-for='source in sources' @click='changeSource(source)'>
					<div class="m">
						<h2>{{source.name}}</h2>
						<p>{{source.updated | timeSemantic}}：{{source.lastChapter}}</p>
					</div>
					<div class="r" v-if='source._id == currentSourceId'>
						<span>当前选择</span>
					</div>
				</li>
			</ul>
		</div>
	</div>
</template>

<script>
	import Navbar from '../components/navbar';
	import {mapState, mapActions} from 'vuex';
	import * as Book from '../lib/book_utils';

	export default {
		data() {
			return {
				bookId: 0,
				sources: [], 		// 所有来源
				currentSourceId: 0  // 当前来源ID
			}
		},
		components: {
			Navbar
		},
		computed: {
			...mapState([
				'bookShelf'
			])
		},
		methods: {
			...mapActions([
				'setShelfSource'
			]),
			changeSource(source) {
				let playload = {
					bookId: this.bookId,
					source: source
				}
				this.setShelfSource(playload);
				this.$router.replace('/bookReader/' + this.bookId)
			}
		},
		activated() {
			this.bookId = this.$route.params._id;
			for (let shelf of this.bookShelf) {
				if (shelf._id == this.bookId) {
					this.currentSourceId = shelf.currentSource._id;
					break;
				}
			}
			Book.getSources.call(this, this.bookId)
			.then(sources => {
				this.sources = sources;
				console.log(sources)
			});
		}
	}
</script>

<style lang='scss' scoped>
	@import '../assets/style/sass_mixins';
	.sources-lists{
		.cell{
			padding: 10px;
			align-items: center;
			@extend %one-px-border;
		}
		.m{
			flex: 1;
			width: 0;
			h2{
				margin: 10px 0;
				color: #333;
			}
			p{
				@include ellipsis(1);
				color: #999;
			}
		}
		.r{
			padding: 0 0 0 10px;
			span{
				display: inline-block;
				padding: 5px 10px;
				border-radius: 3px;
				background: #ccc;
				color: #fff;
			}
		}
	}
</style>