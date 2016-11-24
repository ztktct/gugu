(function(){
	'use strict';

	// 将this赋值给局部变量 root
	// 客户端为window,服务端为 exports
	let root = this;
	
	let target ; // 存储当前触摸元素
	
	class Touch {
		constructor(options={}) {
			let defaults = {
				ele: document,	// 触摸的元素
				relative: 0,	// 位置相对参，2:相对于整个屏幕，1：相对于整张页面，0：相对于浏览器窗口
				preventDefault: true, // 是否取消默认行为
				stopPropagation: false, // 是否阻止冒泡
				touchstart: function(fingers, event) {}, // 接受两个参数，第一个参数保存各个手指的状态，第二个参数是原生event事件对象
				touchmove: function(fingers, event) {},
				touchend: function(fingers, event) {}
			};

			for(let p in defaults){
				if(typeof options[p] === 'undefined'){
					options[p] = defaults[p];
				}
			}

			// 手指触摸的目标
			target = typeof options.ele === 'string' ? document.querySelector(options.ele) : options.ele;
			this._target = target;

			// 将作为参数传出使用，存放每根手指的信息
			let outFingers = [];

			// 需要获取的是相对于哪个参照物的位置
			let relatives = ['client','page','screen'];
			let relative = relatives[options.relative];

			target.addEventListener('touchstart', touchStartHandle.bind(this));
			target.addEventListener('touchmove', touchMoveHandle.bind(this));
			target.addEventListener('touchend', touchendHandle.bind(this));

			// 触摸开始事件处理程序
			function touchStartHandle(event){
				stopAndprevent(event);

				let touches = event.changedTouches;
				let length = touches.length;
				for(let i = 0; i< length; i++){
					let finger = touches[i];
					let summary ={
						identifier: i,		// 编号
						initPos : [finger[relative+'X'],finger[relative+'Y']],		// 初始位置
						currentPos : [finger[relative+'X'],finger[relative+'Y']],	// 当前位置
						distance : [0, 0]	// 移动距离
					};
					outFingers.push(summary);
				}

				options.touchstart && options.touchstart.call(this, outFingers, event);
			}

			// 触摸移动事件处理
			function touchMoveHandle(event){
				stopAndprevent(event);

				let touches = event.changedTouches;
				let length = touches.length;
				for(let i = 0; i< length; i++){
					let finger = touches[i];
					let outfinger = outFingers[i];
					let currentX = finger[relative+'X'],
						currentY = finger[relative+'Y'],
						distanceX = currentX - outfinger.initPos[0],
						distanceY = currentY - outfinger.initPos[1];

					outfinger.currentPos = [currentX, currentY];
					outfinger.distance = [distanceX, distanceY];
				}

				options.touchmove && options.touchmove.call(this, outFingers, event);
			}

			// 触摸结束事件处理
			function touchendHandle(event){
				stopAndprevent(event);

				let touches = event.changedTouches;
				let length = touches.length;
				for(let i = 0; i< length; i++){
					outFingers.splice(i, 1);
				}

				options.touchend && options.touchend.call(this, outFingers, event);
			}

			// 阻止冒泡和取消默认
			function stopAndprevent(e){
				options.preventDefault && e.preventDefault();
				options.stopPropagation && e.stopPropagation();
			}
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