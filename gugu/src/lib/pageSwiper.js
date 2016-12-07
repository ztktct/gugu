// 触摸板：默认三区域: [1, 2, 1]
// ****************
// * 左 * 中 * 右 *
// * 侧 * 间 * 侧 *
// ****************
import Touch from './touch';
import { sumArray } from './utils';

(function() {
    'use strict';
    let root = this;

    class PageSwiper {
        constructor(touchpad, target, options = {}) {
            let _self = this;
            let defaults = {
                unit: 0, // 每次滑动的距离
                transitionProperty: ['transform'], // 动画属性，如 transform,opacity
                transitionTimingFunction: 'ease', // 动画时间函数，如 ease
                areaPercent: [1, 2, 1], // 触摸区域比例
                leftTapEnd: function() {}, // 左中右tap触发事件处理
                midTapEnd: function() {},
                rightTapEnd: function() {},
                prevHandle: function() {}, // 向左滑动超出范围回调
                beforePrevHandle: function() {}, // 向左滑动超出范围之前回调
                nextHandle: function() {}, // 向右滑动超出范围回调
                beforeNextHandle: function() {} // 向右滑动超出范围之前回调
            }

            for (let p in defaults) {
                if (typeof options[p] === 'undefined') {
                    options[p] = defaults[p];
                }
            }

            setTrasition(target, options);

            this._touchpad = touchpad;
            this._target = target;
            this._options = options;

            this.init();

            let touchpadWidth = _self.touchpadWidth; // 触摸板的宽度
            let { areaPercent } = options; // 三块区域划分比例
            let totlePercent = sumArray(areaPercent); // 触摸板总共分几份
            let midLeft = touchpadWidth * (sumArray(areaPercent, 0, 1) / totlePercent); // 左边界
            let midRight = touchpadWidth * (sumArray(areaPercent, 0, 2) / totlePercent); // 右边界

            /* eslint-disable no-new */
            new Touch({
                el: touchpad,
                stopPropagation: true,
                touchstart() {
                    // 手指触摸时停用过渡
                    canTransition(target, '0s');
                },
                touchend() {
                    // 触摸结束允许动画
                    canTransition(target);
                },
                touchmove(touches) {
                    let touch = touches[0];
                    let touchMove = touch.distance[0]; // 手指滑动的距离
                    let moved = _self.hasMoved; // 原先 target 已经滑动的距离
                    // 稍去抖动
                    if (touch.endTime - touch.beginTime <= 100 && Math.abs(touchMove) <= 30) {
                        return;
                    }
                    _self._target.style.webkitTransform = `translate3d(${touchMove + moved}px,0,0)`;
                    _self._target.style.transform = `translate3d(${touchMove + moved}px,0,0)`;
                },
                tap(touches) {
                    let touch = touches[0]; // 当前手指
                    let currentX = touch.currentPos[0]; // 当前手指x轴坐标

                    if (currentX >= midLeft && currentX <= midRight) {
                        // 触摸板中间区域
                        options.midTapEnd && options.midTapEnd(_self);
                    } else if (currentX < midLeft) {
                        // 触摸板左侧区域
                        _self.swiper(--_self.step);
                        options.leftTapEnd && options.leftTapEnd(_self);
                    } else if (currentX > midRight) {
                        // 触摸板右侧区域
                        _self.swiper(++_self.step);
                        options.rightTapEnd && options.rightTapEnd(_self);
                    }
                },
                quickSwiper(touches) {
                    let touch = touches[0]; // 当前手指
                    let moveX = touch.distance[0]; // 水平方向滑动的距离
                    // 向左快速滑动
                    if (moveX < 0) {
                        _self.swiper(++_self.step);
                    } else if (moveX > 0) {
                        _self.swiper(--_self.step);
                    }
                },
                longSwiper(touches) {
                    let touch = touches[0]; // 当前手指
                    let moveX = touch.distance[0]; // 水平方向滑动的距离
                    if (Math.abs(moveX) >= midLeft) {
                        if (moveX < 0) {
                            _self.swiper(++_self.step);
                        } else if (moveX > 0) {
                            _self.swiper(--_self.step);
                        }
                    } else {
                        _self.swiper(_self.step);
                    }
                }
            })
        }

        // 初始化
        init() {
            let target = this._target;
            let maxDistance = target.scrollWidth; // 最大滑动距离
            this.touchpadWidth = this._touchpad.offsetWidth; // 触摸板宽度
            this.step = 0; // 目标滑动的步数，一步的长度为 1unit
            this.unit = this._options.unit || target.offsetWidth; // 目标宽度，即每次滑动的距离
            this.maxStep = Math.floor(maxDistance / this.unit) - 1; // 计算最大步数
            this.hasMoved = 0; // 已经偏移的距离
            // 重置偏移位置
            targetTransform.call(this, 0);
            canTransition(this._target, '0s');
        }

        // 滑动
        swiper(step) {
            let options = this._options;
            // 最多允许超过一页
            if (step < -1) {
                step = -1;
            } else if (step > this.maxStep + 1) {
                step = this.maxStep + 1;
            }
            // 重新获取并指定下一步
            this.step = step;

            if (step < 0) {
                // 左滑超出范围
                options.beforePrevHandle && options.beforePrevHandle(this)
                options.prevHandle && options.prevHandle(this);
            } else if (step > this.maxStep) {
                // 右滑超出范围
                options.beforeNextHandle && options.beforeNextHandle(this)
                options.nextHandle && options.nextHandle(this);
            }
            targetTransform.call(this);
        }

        // 手动指定滑动位置
        slideTo(step) {
            step = Math.min(Math.max(step, 0), this.maxStep);
            this.swiper(step);
            canTransition(this._target, '0s');
        }

        // 阻止超出范围滑动
        stop() {
            if (this.step < 0) {
                this.step = 0;
                return;
            } else if (this.step > this.maxStep) {
                this.step = this.maxStep;
                return;
            }
        }
    }

    // 设置动画属性
    function setTrasition(dom, { transitionProperty, transitionTimingFunction }) {
        dom.style.webkitTransitionProperty = transitionProperty.toString();
        dom.style.transitionProperty = transitionProperty.toString();
        dom.style.webkitTransitionTimingFunction = transitionTimingFunction;
        dom.style.transitionTimingFunction = transitionTimingFunction;
    }
    // 动画时长，0则无动画
    function canTransition(dom, ms = '.3s') {
        dom.style.webkitTransitionDuration = ms;
        dom.style.transitionDuration = ms;
    }
    // 滑动距离
    function targetTransform() {
        this._target.style.webkitTransform = `translate3d(${-1 * this.step * this.unit}px,0,0)`;
        this._target.style.transform = `translate3d(${-1 * this.step * this.unit}px,0,0)`;
        this.hasMoved = -1 * this.step * this.unit;
    }

    if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = PageSwiper;
        }
        exports.PageSwiper = PageSwiper;
    } else {
        root.PageSwiper = PageSwiper;
    }
}.call(this))
