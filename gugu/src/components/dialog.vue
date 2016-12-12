<template>
	<transition name='fade'>
		<div class="m-dialog" v-if='show' @click='clickHandle'>
		    <div class="m-dialog-wrap" @click.stop>
		        <h3>{{title}}</h3>
		        <ul class="m-dialog-lists">
		        	<li class="cell" v-for='cell in lists' @click='cell.clickHandle'>{{cell.title}}</li>
		            <slot></slot>
		        </ul>
		    </div>
		</div>
	</transition>
</template>

<script>
	/**
	 * lists:[obj,obj]
	 *  --> obj:{
	 *        title:'',
	 *        clickHandle: function(){}
	 *      }
	 */
	export default {
		props: {
			show: {
				default: false,
				type: Boolean
			},
			title: {
				default: '标题',
				type: String
			},
			lists: {
				default: null,
				type: Array
			},
			clickHandle: {
				default: function() {},
				type: Function
			}
		}
	}
</script>

<style lang='scss'>
	@import '../assets/style/sass_mixins';

	.m-dialog{
    	@extend %fullpage;
		z-index:25;
		background-color:rgba(#000, .4);
		&-wrap{
			background:#fff;
			position:absolute;
			left:50%;
			top:50%;
			transform:translate(-50%,-50%);
			border-radius:3px;
			min-width:70%;
			max-width:80%;
			h3{
				padding:10px;
				margin:0;
				font-weight:normal;
				font-size:20px;
				color:#4393E2;
				@include one-px-border(#999);
				@include ellipsis(1);
			}
		}
		&-lists{
			padding:5px 10px;
			.cell{
				font-size:16px;
				padding:10px 5px;
				&:not(:last-child){
					@extend %one-px-border;
				};
			}
		}
	}
</style>