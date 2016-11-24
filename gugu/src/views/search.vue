<template>
	<div class="page page-fixed">
		<Navbar :searchEvent="search">
			<div class="m-search-input">
				<input type="text" ref='input' v-model.trim='query' @focus='myfocus' @blur='showLists = false' placeholder="输入书名或者作者名">
				<Icon className='icon-guanbi' v-show='showClear' :clickEvent='clearQuery'></Icon>
				<transition name='fade'>
					<ul class="search-lists" v-if='showLists'>
						<li v-for='word in relativeWords' @click='relativeSearch(word)'>{{word}}</li>
					</ul>
				</transition>
			</div>
		</Navbar>
		<keep-alive>
			<router-view @searchBook='childSearch'></router-view>
		</keep-alive>
	</div>
</template>

<script>
	import Navbar from '../components/navbar';
    import Icon from '../components/icons';
    import {API_ADDRESS} from '../vuex/localdata';
    import { mapActions } from 'vuex';

    export default {
    	data() {
    		return {
    			query: '',	  			// 搜索词
    			showLists: false, 		// 是否显示搜索联想词(只要输入不为空，都为true)
    			canShowLists: true,		// 现在能否显示搜索联想词(通过点击关键词来搜索的话为false)
    			showClear: false,		// 是否显示清除按钮
    			relativeWords: [], 		// 搜索联想词
    			isSearchResult: false 	// 当前是否是搜索结果页
    		}
    	},
        components: {
            Navbar,
            Icon
        },
        watch: {
        	// 当搜索的时候联想关键词
        	query() {
        		let _self = this;
        		_self.showClear = _self.query.length >= 1 || false;
        		// 只有当输入不为空，并且允许关联词显示的情况下采取请求数据
        		if (_self.query !== '' && _self.canShowLists) {
        			_self.$http.get(API_ADDRESS + '/book/auto-complete?query=' + _self.query)
        			.then(response => {
        				_self.relativeWords = response.body.keywords;
        				_self.showLists = true;
        			});
        		} else {
        			_self.showLists = false;
        		}
        	}
        },
        methods: {
        	...mapActions([
        		'addHistory'	// 添加搜索记录
        	]),
        	// 清空输入
        	clearQuery() {
        		this.query = '';
        		this.$refs.input.focus();
        	},
        	// 手动获取焦点时，可以显示联想词
        	myfocus() {
        		this.canShowLists = true;
        	},
        	// 关键词子组件触发搜索
        	childSearch() {
        		this.query = this.$route.params.query;
        		this.canShowLists = false;
        		this.isSearchResult = true;
        		this.search();
        	},
        	// 点击关联词触发搜索
        	relativeSearch(book) {
        		this.query = book;
        		this.canShowLists = false;
        		this.isSearchResult = true;
        		this.search();
        	},
        	// 点击搜索按钮搜索
        	search() {
        		if (this.query !== '') {
        			this.addHistory(this.query);
        			if (this.isSearchResult && this.$route.params.query) {
        				this.$router.replace('/search/result/' + this.query);
        			} else {
        				this.$router.push('/search/result/' + this.query);
        				this.isSearchResult = true;
        			}
        		}
        	}
        },
        mounted() {
        	this.query = this.$route.params.query || '';
        	if (this.query) {
        		this.canShowLists = false
        		this.showClear = true;
        	};
    	}
    }
</script>

