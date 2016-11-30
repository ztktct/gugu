<template>
	<div class="container">
		<Loading :isLoading='isLoading' :automatic='true'>
			<div class="hot-keywords">
				<div class="hot-keywords-tit">
					<span>大家都在搜</span>
					<span @click='toggleWords'><Icon className='icon-shuaxin'></Icon>换一批</span>
				</div>
				<ul class="hot-keywords-lists">
					<li v-for='(word, index) in hotWords' @click='searchBook(word)' :key='index'>{{word}}</li>
				</ul>
			</div>
			<div class="history">
				<div class="history-tit">
					<span>搜索历史</span>
					<span @click='removeHistory'><Icon className='icon-qingkongshanchu'></Icon>清 空</span>
				</div>
				<ul class="history-lists">
					<li class="cell" v-for='history in bookHistory' @click='searchBook(history)'><Icon className='icon-lishi'></Icon>{{history}}</li>
				</ul>
			</div>
		</Loading>
	</div>
</template>

<script>
    import Icon from '../components/icons';
    import Loading from '../components/loading';
    import {API_ADDRESS} from '../vuex/localdata';
    import {randomArray} from '../lib/utils';
    import { mapState, mapActions } from 'vuex';

    export default {
    	data() {
    		return {
    			isLoading: false, // 加载中
    			hotWordsAll: [],  // 全部热门关键词
    			hotWords: []	  // 显示的热门搜索关键词
    		}
    	},
    	components: {
    		Icon,
    		Loading
    	},
        computed: {
        	...mapState([
        		'bookHistory'	// 搜索历史
        	])
        },
        methods: {
        	...mapActions([
        		'removeHistory' // 清空历史记录
        	]),
        	// 切换热门关键词
        	toggleWords() {
        		this.hotWords = randomArray(this.hotWordsAll, 8);
        	},
        	// 搜索书籍
        	searchBook(book) {
        		this.$router.push('result/' + book);
        		this.$emit('searchBook');
        	}
        },
        mounted() {
        	// 获取热门关键词
        	this.isLoading = true;
        	this.$http.get(API_ADDRESS + '/book/hot-word')
        		.then(response => {
        			this.isLoading = false;
        			this.hotWordsAll = response.body.hotWords;
        			this.hotWords = randomArray(this.hotWordsAll, 8);
        		});
        }
    }
</script>

<style lang='scss' scoped>
	.container,.hot-keywords,.history{
		display: flex;
		flex-direction: column;
	}
	
	.hot-keywords,.history{
		padding: 10px 20px;
		&-tit{
			display: flex;
			align-items: center;
			justify-content: space-between;
			color: #333;
			margin-bottom: 10px;
			.iconfont{
				margin-right: 5px;
			}
			.icon-qingkongshanchu{
				font-size: 12px;
			}
		}
	}
	.hot-keywords-lists{
		$colors: (#03a9f4, #f589f5, #f74d5b, #f5a15d, #935df5, #5cd2f2, #c1f559, #991199, #f0dd0b, #f02a0c);
		max-height: 98px;
		overflow: hidden;
		li{
			display: inline-block;
			padding: 5px 10px;
			color: #fff;
			border-radius: 4px;
			margin: 0 10px 10px 0;
			@for $i from 1 through 10{
				&:nth-of-type(#{$i}){
				 background-color: nth($colors, $i);
				};
			}
		}
	}
	.history,.history-lists{
		flex: 1;
	}
	.history-lists{
		overflow: auto;
		li{
			padding: 8px 0;
			font-size: 14px;
			.iconfont{
				margin-right: 10px;
			}
		}
	}
</style>