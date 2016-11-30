<template>
	<div class="page page-fixed">
		<Navbar 
		:hasSearchIcon='false' 
		:hasLeftBorder='false' >
			<h2 class="navbar-h2">{{tag}}</h2>
		</Navbar>
		<div class="container">
			<BookLists :bookLists='bookLists'></BookLists>
		</div>
	</div>
</template>

<script>
    import {API_ADDRESS} from '../vuex/localdata';
	import BookLists from '../components/books-lists';
	import Navbar from '../components/navbar';

	export default {
		data() {
			return {
				bookLists: [],
				tag: this.$route.params.tag
			}
		},
		components: {
			BookLists,
			Navbar
		},
		mounted() {
			this.$http.get(API_ADDRESS + `/book/by-tags?tags=${this.tag}&start=0&limit=50`)
			.then(response => {
				this.bookLists = response.body.books;
			})
		}
	}
</script>