/*!
 * Touch.js v0.2.0
 * Copyright 2016-present Tong Zhang
 * All rights reserved.
 * 
 * Touch 构造函数接收一个配置对象 `options`
 * options:
 *   el: 触摸的元素，可以是css选择器，也可以是DOM元素
 *   relative: 位置相对参, 0：相对于浏览器窗口, 1：相对于整张页面, 2:相对于整个屏幕
 *   preventDefault: 是否取消默认行为
 *   stopPropagation: 是否阻止冒泡
 *   quickDuration: 小于多少ms算是快速滑动，默认300             
 *   quickDistance: 大于多少px算是快速滑动，默认30
 *   quickDirection: 滑动方向, 默认水平，可用：'vertical', 'both'
 *   quickSwiper(): 快速滑动, 接受两个参数，第一个参数保存各个手指的状态，第二个参数是原生event事件对象
 *   touchstart(): ----------↑
 *   touchmove(): -----------↑
 *   touchend(): ------------↑
 *   tap(): -----------------↑
 */
import {throttle} from './utils';
(function() {
    'use strict';

    // 将this赋值给局部变量 root
    // 客户端为window,服务端为 exports
    let root = this;

    let target; // 存储当前触摸元素

    class Touch {
        constructor(options = {}) {
            let _self = this;

            let defaults = {
                el: document, // 触摸的元素
                relative: 0, // 位置相对参，2:相对于整个屏幕，1：相对于整张页面，0：相对于浏览器窗口
                preventDefault: true, // 是否取消默认行为
                stopPropagation: false, // 是否阻止冒泡
                quickDuration: 300, // 小于多少ms算是快速滑动，默认300
                quickDistance: 30, // 大于多少px算是快速滑动，默认30
                quickDirection: 'horizontal', // 默认滑动方向水平，可用：'vertical', 'both'
                quickSwiper: function(fingers, event) {}, // 快速滑动时触发
                longSwiper: function(fingers, event) {}, // 非快速滑动				
                touchstart: function(fingers, event) {}, // 接受两个参数，第一个参数保存各个手指的状态，第二个参数是原生event事件对象
                touchmove: function(fingers, event) {},
                touchend: function(fingers, event) {},
                tap: function(fingers, event) {} // 模拟tap事件
            };

            for (let p in defaults) {
                if (typeof options[p] === 'undefined') {
                    options[p] = defaults[p];
                }
            }

            // 手指触摸的目标
            target = typeof options.el === 'string' ? document.querySelector(options.el) : options.el;
            this._target = target;
            this._options = options;

            // 将作为参数传出使用，存放每根手指的信息
            let outFingers = [];

            // 需要获取的是相对于哪个参照物的位置
            let relatives = ['client', 'page', 'screen'];
            let relative = relatives[options.relative];

            target.addEventListener('touchstart', touchStartHandle.bind(this));
            target.addEventListener('touchmove', touchMoveHandle.call(this));
            target.addEventListener('touchend', touchendHandle.bind(this));

            // 触摸开始事件处理程序
            function touchStartHandle(event) {
                stopAndprevent(event);

                let touches = event.changedTouches;
                let length = touches.length;
                for (let i = 0; i < length; i++) {
                    let finger = touches[i];
                    /* -----各个手指相关数据------ */
                    let summary = {
                        identifier: i, // 编号
                        initPos: [finger[relative + 'X'], finger[relative + 'Y']], // 初始位置
                        currentPos: [finger[relative + 'X'], finger[relative + 'Y']], // 当前位置
                        distance: [0, 0], // 移动距离
                        duration: 0, // 持续时间,ms
                        beginTime: Date.now(), // 触摸开始时间
                        endTime: Date.now() // 触摸结束时间
                    };
                    outFingers.push(summary);
                }

                options.touchstart && options.touchstart.call(this, outFingers, event);
            }

            // 触摸移动事件处理 函数节流，节省开销
            function touchMoveHandle(event) {
                return throttle(event => {
                    stopAndprevent(event);
                    let touches = event.changedTouches;
                    let length = touches.length;
                    for (let i = 0; i < length; i++) {
                        let finger = touches[i];
                        let outfinger = outFingers[i];
                        let currentX = finger[relative + 'X']; // 当前位置X
                        let currentY = finger[relative + 'Y']; // 当前位置Y
                        let distanceX = currentX - outfinger.initPos[0]; // 滑动距离X
                        let distanceY = currentY - outfinger.initPos[1]; // 滑动距离Y

                        outfinger.currentPos = [currentX, currentY];
                        outfinger.distance = [distanceX, distanceY];
                        outfinger.endTime = Date.now();
                    }

                    options.touchmove && options.touchmove.call(this, outFingers, event);
                }, 13, {trailing: false});
            }

            // 触摸结束事件处理
            function touchendHandle(event) {
                stopAndprevent(event);

                let tmpFingers = JSON.parse(JSON.stringify(outFingers));

                tmpFingers.forEach((finger, i) => {
                    finger.endTime = Date.now();
                    finger.duration = finger.endTime - finger.beginTime;
                    // 判断是否是快速滑动或者tap
                    if (finger.duration <= options.quickDuration) {
                        let hasSwiper = false;
                        // 快速滑动
                        switch (options.quickDirection) {
                            case 'horizontal':
                                if (Math.abs(finger.distance[0]) >= options.quickDistance) {
                                    hasSwiper = true;
                                    options.quickSwiper && options.quickSwiper.call(this, tmpFingers, event);
                                }
                                break;
                            case 'vertical':
                                if (Math.abs(finger.distance[1]) >= options.quickDistance) {
                                    hasSwiper = true;
                                    options.quickSwiper && options.quickSwiper.call(this, tmpFingers, event);
                                }
                                break;
                            case 'both':
                                if (Math.abs(finger.distance[1]) >= options.quickDistance || Math.abs(finger.distance[0]) >= options.quickDistance) {
                                    hasSwiper = true;
                                    options.quickSwiper && options.quickSwiper.call(this, tmpFingers, event);
                                }
                                break;
                        }
                        // tap
                        if (!hasSwiper) {
                            options.tap && options.tap.call(this, tmpFingers, event);
                        }
                    } else {
                    	// 长时间滑动
                        options.longSwiper && options.longSwiper.call(this, tmpFingers, event);
                    }
                });

                options.touchend && options.touchend.call(this, tmpFingers, event);

                let touches = event.changedTouches;
                let length = touches.length;
                for (let i = 0; i < length; i++) {
                    outFingers.splice(i, 1);
                }
            }

            // 阻止冒泡和取消默认
            function stopAndprevent(e) {
                _self._options.preventDefault && e.preventDefault();
                _self._options.stopPropagation && e.stopPropagation();
            }
        }

        // 允许其默认行为
        canDefault(){
            this._options.preventDefault = false;
        }
        canNotDefault(){
            this._options.preventDefault = true;
        }

        // 允许其冒泡
        canPropagation(){
            this._options.stopPropagation = false;
        }
        canNotPropagation(){
            this._options.stopPropagation = true;
        }
    }

    if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = Touch;
        }
        exports.Touch = Touch;
    } else {
        root.Touch = Touch;
    }
}.call(this));
