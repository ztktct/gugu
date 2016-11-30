<template>
    <div class="navbar" :style="{backgroundColor: bgcolor}">
        <!-- 左侧返回图标 -->
        <div class="navbar-left" v-if='hasLeftIcon'>
            <div class="navbar-icon" :class="{'hasLeftBorder': hasLeftBorder}" @touchstart='goback'>
                <Icon className='icon-iconfonticonfontjiantouzuo11'></Icon>
            </div>
        </div>
        <!-- 中间自定义区域 -->
        <div class="navbar-mid">
            <slot></slot>
            <slot name='navbar-mid'></slot>
        </div>
        <!-- 右侧搜索图标或其他 -->
        <div class="navbar-right">
            <div class="navbar-icon" 
              v-if="hasSearchIcon" 
              :class="{'hasRightBorder': hasRightBorder }"
              @touchstart="searchEvent">
                <Icon className='icon-sousuo'></Icon>
            </div>
            <slot name="navbar-right" v-else></slot>
        </div>
    </div>
</template>

<script>
  import Icon from './icons';
  export default {
    props: {
      hasLeftIcon: {   // 是否有左侧图标
        type: Boolean,
        default: true
      },
      hasLeftBorder: { // 按钮是否有右边框
        type: Boolean,
        default: true
      },
      hasRightBorder: { // 按钮是否有左边框
        type: Boolean,
        default: true
      },
      bgcolor: {        // 背景色
        type: String,
        default: '#4393E2'
      },
      hasSearchIcon: { // 是否有搜索图标
        type: Boolean,
        default: true
      },
      searchEvent: {   // 搜索按钮事件
        type: Function,
        default: function() {}
      }
    },
    components: {
      Icon
    },
    methods: {
        goback() {
            this.$router.go(-1);
        }
    }
  }
</script>

<style lang='scss' scoped>
    @import '../assets/style/sass_mixins';
    $height: 64px;
    $blue: #4393E2;
    .navbar{
        height: $height;
        background: $blue;
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: space-between;
		transition: transform .3s ease;
        /* navbar图标按钮样式 */
        &-icon {
            width: $height;
            text-align: center;
            align-self: stretch;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            &.hasLeftBorder {
                border-right: 1px solid darken($blue, 10%);
            }
            &.hasRightBorder {
                border-left: 1px solid darken($blue, 10%);
            }
            /* &:active{
            	background-color: darken($blue, 10%);
            } */
        }
        &-left,
        &-right {
            align-self: stretch;
            display: flex;
            align-items: center;
        }
        &-left {
            .iconfont {
                font-size: 20px;
            }
        }
        &-mid {
            flex: 1;
            width: 0;
        }
        &-right {
            .iconfont {
                font-size: 32px;
            }
        }
        &-h2,&-h3{
            font-weight: normal;
            @include ellipsis(1);
        }
        &-h3{
            padding-right: 20px;
            font-size: 14px;
        }
    }
</style>