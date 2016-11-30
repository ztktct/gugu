<template>
    <div class="loading" 
    ref='loading' 
    :class='{ isLoading:  isLoading}'>
        <div class="loading-spinner" ref='spinner'>
            <svg class="spinner" width="22px" height="22px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
                <circle class="path" fill="none" stroke-width="6" stroke-linecap="round" cx="33" cy="33" r="30" style="stroke:#4288ed"></circle>
            </svg>
        </div>
        <slot></slot>
    </div>
</template>

<script>
    import Touch from '../lib/touch';

    export default{
        data() {
            return {
                isShowing: false   // 加载动画正在展示
            }
        },
        props: {
            isLoading: {
                type: Boolean,
                default: false
            },
            // 是否无需手动下拉加载，默认需要手动下拉
            automatic: {
                type: Boolean,
                default: false
            },
            // 暂时停止下拉加载
            temporary: {
                type: Boolean,
                default: false
            }
        },
        methods: {
            // 提示父组件可以开始加载
            startLoad() {
                this.$emit('startLoad');
            }
        },
        watch: {
            isLoading() {
                if (!this.isLoading) {
                    this.isShowing = false;
                    variable(this.$refs.spinner, -100, 0);
                }
            }
        },
        mounted() {
            let _self = this;
            let loading = this.$refs.loading;
            let spinner = this.$refs.spinner;
            let canMove = false;
            console.log(canMove)
            // 如果是自动加载，就不需要手控
            if (this.automatic) return;
            /* eslint-disable no-new */
            new Touch({
                el: loading,
                preventDefault: false,
                touchstart() {
                    canTransition(spinner, '0s');
                    loading.scrollTop += 1;
                    if (loading.scrollTop <= 1) {
                        canMove = true;
                    }
                },
                touchend(touches) {
                    canMove = false;
                    canTransition(spinner);
                    if (_self.isLoading || _self.isShowing || _self.temporary || _self.automatic) return;
                    let touch = touches[0];
                    let distance = touch.distance[1];
                    if (distance >= 100) {
                        _self.startLoad();
                        _self.isShowing = true;
                        variable(spinner, 50, 100);
                    } else {
                        _self.isShowing = false;
                        variable(spinner, -100, 0);
                    }
                },
                touchmove(touches) {
                    // 不触发下拉加载
                    if (_self.isLoading || _self.isShowing || !canMove || loading.scrollTop > 0 || _self.temporary || _self.automatic) return;
                    // 下拉加载
                    let touch = touches[0];
                    let distance = Math.min(touch.distance[1], 150);
                    const initDistance = -100;
                    variable(spinner, initDistance + distance, distance);
                }
            })
        }
    }
    // 动画时长，0则无动画
    function canTransition(dom, ms = '.3s') {
        dom.style.webkitTransitionDuration = ms;
        dom.style.transitionDuration = ms;
    }
    function variable(dom, distance, opacity) {
        dom.style.webkitTransform = `translate3d(-50%,${distance}%,0)`;
        dom.style.transform = `translate3d(-50%,${distance}%,0)`;
        dom.style.opacity = opacity / 100;
    }
</script>

<style lang='scss'>

    .loading{
        height: 100%;
        position: relative;
        overflow: auto;
        &-spinner{
            position: absolute;
            left: 50%;
            z-index: 11;
            background: #fff;
            border-radius: 50%;
            padding: 6px;
            box-shadow:  0 0 5px #666;
            opacity: 0;
            transform: translate3d(-50%, -100%, 0);
            transition: transform .3s ease, opacity .3s ease;
        }
        .path{
            opacity: 0;
        }
        &.isLoading{
            z-index: 43;
            .loading-spinner{
                transform:  translate3d(-50%, 50%, 0) !important;
                opacity: 1 !important;
            }
            .path{
                opacity: 1;
            }
        }
    }
	.spinner {
        -webkit-animation: rotator 1.4s linear infinite;
        animation: rotator 1.4s linear infinite
    }
    
    @-webkit-keyframes rotator {
        0% {
            -webkit-transform: rotate(0deg);
            transform: rotate(0deg)
        }
        100% {
            -webkit-transform: rotate(270deg);
            transform: rotate(270deg);
            -ms-transform: rotate(360deg)
        }
    }
    
    @keyframes rotator {
        0% {
            -webkit-transform: rotate(0deg);
            transform: rotate(0deg)
        }
        100% {
            -webkit-transform: rotate(270deg);
            transform: rotate(270deg);
            -ms-transform: rotate(360deg)
        }
    }
    
    .path {
        stroke-dasharray: 187;
        stroke-dashoffset: 50;
        -webkit-transform-origin: center;
        transform-origin: center;
        stroke: #4285F4;
        -webkit-animation: dash 1.4s ease-in-out infinite;
        animation: dash 1.4s ease-in-out infinite
    }
    
    @-webkit-keyframes dash {
        0% {
            stroke-dashoffset: 187
        }
        50% {
            stroke-dashoffset: 46.75;
            -webkit-transform: rotate(135deg);
            transform: rotate(135deg)
        }
        100% {
            stroke-dashoffset: 187;
            -webkit-transform: rotate(450deg);
            transform: rotate(450deg)
        }
    }
    @keyframes dash {
        0% {
            stroke-dashoffset: 187
        }
        50% {
            stroke-dashoffset: 46.75;
            -webkit-transform: rotate(135deg);
            transform: rotate(135deg)
        }
        100% {
            stroke-dashoffset: 187;
            -webkit-transform: rotate(450deg);
            transform: rotate(450deg)
        }
    }
</style>