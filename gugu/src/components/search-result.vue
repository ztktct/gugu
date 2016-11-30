<template>
	<div class="container">
		<Loading :isLoading='isLoading' :automatic='true'>
			<BookLists :bookLists='bookLists'></BookLists>
		</Loading>
	</div>
</template>

<script>
    import {API_ADDRESS} from '../vuex/localdata';
    import BookLists from './books-lists';
    import Loading from '../components/loading';

	export default {
		data() {
			return {
				isLoading: false,
				bookLists: [] // 书籍列表
			}
		},
		components: {
			BookLists,
			Loading
		},
		watch: {
			'$route'(to, from) {
			    // 对路由hash变化作出响应...
			    if (this.$route.params.query) {
			    	this.getBookLists();
			    }
			}
		},
	    methods: {
	    	// 获取书籍列表
	    	getBookLists() {
	    		this.isLoading = true;
	    		this.bookLists = [];
	    		this.$http.get(API_ADDRESS + '/book/fuzzy-search?query=' + this.$route.params.query)
	    		.then(response => {
	    			this.bookLists = response.body.books;
	    			this.isLoading = false;
	    		});
	    	}
	    },
	    activated() {
	    	this.getBookLists();
	    }
    }
</script>