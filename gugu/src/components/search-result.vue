<template>
	<div class="container">
		<ul class="m-books-lists">
			<li class="cell" @click='lookDetails(book._id)' v-for='book in bookLists'>
				<div class="leftimg">
	                <img :src="book.cover.substr(7)" height="64" width="44" alt="">
	            </div>
	            <div class="rightctx">
	                <h3>{{book.title}}</h3>
	                <p>{{book.latelyFollower}}人在追 | {{book.retentionRatio || 0}}%读者存留 | {{book.author}}著</p>
	            </div>
			</li>
		</ul>
	</div>
</template>

<script>
    import {API_ADDRESS} from '../vuex/localdata';

	export default {
		data() {
			return {
				bookLists: [] // 书籍列表
			}
		},
		watch: {
			'$route'(to, from) {
			    // 对路由hash变化作出响应...
			    this.getBookLists();
			}
		},
	    methods: {
	    	// 获取书籍列表
	    	getBookLists() {
	    		this.$http.get(API_ADDRESS + '/book/fuzzy-search?query=' + this.$route.params.query)
	    		.then(response => {
	    			this.bookLists = response.body.books;
	    		});
	    	},
	    	// 查看书籍详情
	    	lookDetails(id) {
	    		this.$router.push('/bookDetails/' + id);
	    	}
	    },
	    activated() {
	    	this.getBookLists();
	    }
    }
</script>