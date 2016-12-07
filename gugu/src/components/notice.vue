<template>
	<transition name='fade'>
		<div class="notice" v-if='isShowing'>{{notices[0]}}</div>
	</transition>
</template>

<script>
	import Vue from 'vue';

	export default {
		data() {
			return {
				isShowing: false,
				notices: [] 	// 剩余提示
			}
		},
		watch: {
			notices() {
				if (this.notices.length >= 1) {
					this.isShowing = true;
				} else {
					this.isShowing = false;
				}
			}
		},
		methods: {
			push(notice, ms = 2000) {
				this.notices.push(notice);

				setTimeout(() => {
					this.notices.splice(0, 1);
				}, ms)
			}
		},
		mounted() {
			Vue.prototype.$notice = {
				push: this.push
			}
		}
	}
</script>

<style scoped>
	.notice{
		max-width:80vw;
		padding:7px 12px;
		border-radius:5px;
		position:fixed;
		z-index:55;
		left:50%;
		bottom:10%;
		transform:translateX(-50%);
		background:rgba(0,0,0,.6);
		color:#fff;
		font-size:16px;
	}
</style>