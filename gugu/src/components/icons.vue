<template>
    <i class="iconfont" :class="className" @click='clickEvent'></i>
</template>

<script>
	export default {
      props: {
        className: {
          type: String,
          default: ''
        },
        clickEvent: {
            type: Function,
            default: function() {}
        }
      }
	}
</script>

<style lang='scss'>
    @font-face {
        font-family: "iconfont";
        src: url('../assets/font/iconfont.eot?t=1479543437791');
        /* IE9*/
        src: url('../assets/font/iconfont.eot?t=1479543437791#iefix') format('embedded-opentype'), /* IE6-IE8 */
        url('../assets/font/iconfont.woff?t=1479543437791') format('woff'), /* chrome, firefox */
        url('../assets/font/iconfont.ttf?t=1479543437791') format('truetype'), /* chrome, firefox, opera, Safari, Android, iOS 4.2+*/
        url('../assets/font/iconfont.svg?t=1479543437791#iconfont') format('svg');
        /* iOS 4.1- */
    }
    
    .iconfont {
        font-family: "iconfont" !important;
        font-size: 16px;
        font-style: normal;
        -webkit-font-smoothing: antialiased;
        -webkit-text-stroke-width: 0.2px;
        -moz-osx-font-smoothing: grayscale;
    }
    
    .icon-sousuo:before {
        content: "\e600";
    }
    
    .icon-shuaxin:before {
        content: "\e601";
    }
    
    .icon-shezhi:before {
        content: "\e602";
    }
    
    .icon-iconfontxiazai:before {
        content: "\e60d";
    }
    
    .icon-tianjia:before {
        content: "\e667";
    }
    
    .icon-qingkongshanchu:before {
        content: "\e66c";
    }
    
    .icon-guanbi:before {
        content: "\e6b7";
    }
    
    .icon-lishi:before {
        content: "\e62a";
    }
    
    .icon-baitianmoshi:before {
        content: "\e610";
    }
    
    .icon-iconfonticonfontjiantouzuo11:before {
        content: "\e650";
    }
    
    .icon-yejian:before {
        content: "\e653";
    }
    
    .icon-xiazai:before {
        content: "\e63e";
    }
    
    .icon-menu-a:before {
        content: "\e649";
    }
    
    .icon-clear-day:before {
        content: "\e60b";
    }
    
    .icon-caidan:before {
        content: "\e625";
    }
    
    .icon-yejian1:before {
        content: "\e698";
    }
</style>