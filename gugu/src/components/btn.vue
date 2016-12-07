<template>
	<button class="btn" :class='className' @touchstart='btnEvent' :disabled='disabled'><slot></slot></button>
</template>

<script>
	export default {
		props: {
			btnEvent: {
				type: Function,
				default: function() {}
			},
			className: {
				type: String,
				default: ''
			},
			disabled: {
				type: Boolean,
				default: false
			}
		}
	}
</script>

<style lang='scss'>
	.btn{
		display: inline-block;
		-webkit-appearance: none;
		padding: 6px 10px;
		border-radius: 5px;
		background: #fff;
		color: #333;
		border: 0;
		text-align: center;
		&[disabled],&.disabled{
			background: #ccc;
			color: #fff;
		}
	}
</style>