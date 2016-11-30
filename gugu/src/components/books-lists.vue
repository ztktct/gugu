<template>
	<ul class="m-books-lists">
		<li class="cell" @click='lookDetails(book._id)' v-for='book in bookLists'>
			<div class="leftimg">
	            <img :src="book.cover ? book.cover.substr(7) : ''" height="64" width="48" alt="">
	        </div>
	        <div class="rightctx">
	            <h3>{{book.title}}</h3>
	            <p>{{book.latelyFollower}}人在追 | {{book.retentionRatio || 0}}%读者存留 | {{book.author}}著</p>
	        </div>
		</li>
	</ul>
</template>

<script>
	export default {
		props: ['bookLists'],
		methods: {
			// 查看书籍详情
	    	lookDetails(id) {
	    		this.$router.push('/bookDetails/' + id);
	    	}
		}
	}
</script>