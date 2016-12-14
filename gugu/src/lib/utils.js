// 获得现在时间戳
let _now = Date.now || function() {
    return new Date().getTime();
}

// https://github.com/hanzichi/underscore-analysis/issues/21
// 函数去抖（连续事件触发结束后只触发一次）
// sample 1: debounce(function(){}, 1000)
// 连续事件结束后的 1000ms 后触发
// sample 1: debounce(function(){}, 1000, true)
// 连续事件触发后立即触发（此时会忽略第二个参数）
let debounce = function(func, wait, immediate) {
    var timeout, args, context, timestamp, result;

    var later = function() {
        // 定时器设置的回调 later 方法的触发时间，和连续事件触发的最后一次时间戳的间隔
        // 如果间隔为 wait（或者刚好大于 wait），则触发事件
        var last = _now() - timestamp;

        // 时间间隔 last 在 [0, wait) 中
        // 还没到触发的点，则继续设置定时器
        // last 值应该不会小于 0 吧？
        if (last < wait && last >= 0) {
            timeout = setTimeout(later, wait - last);
        } else {
            // 到了可以触发的时间点
            timeout = null;
            // 可以触发了
            // 并且不是设置为立即触发的
            // 因为如果是立即触发（callNow），也会进入这个回调中
            // 主要是为了将 timeout 值置为空，使之不影响下次连续事件的触发
            // 如果不是立即执行，随即执行 func 方法
            if (!immediate) {
                // 执行 func 函数
                result = func.apply(context, args);
                // 这里的 timeout 一定是 null 了吧
                // 感觉这个判断多余了
                if (!timeout) context = args = null;
            }
        }
    };

    // 嗯，闭包返回的函数，是可以传入参数的
    return function() {
        // 可以指定 this 指向
        context = this;
        args = arguments;

        // 每次触发函数，更新时间戳
        // later 方法中取 last 值时用到该变量
        // 判断距离上次触发事件是否已经过了 wait seconds 了
        // 即我们需要距离最后一次触发事件 wait seconds 后触发这个回调方法
        timestamp = _now();

        // 立即触发需要满足两个条件
        // immediate 参数为 true，并且 timeout 还没设置
        // immediate 参数为 true 是显而易见的
        // 如果去掉 !timeout 的条件，就会一直触发，而不是触发一次
        // 因为第一次触发后已经设置了 timeout，所以根据 timeout 是否为空可以判断是否是首次触发
        var callNow = immediate && !timeout;

        // 设置 wait seconds 后触发 later 方法
        // 无论是否 callNow（如果是 callNow，也进入 later 方法，去 later 方法中判断是否执行相应回调函数）
        // 在某一段的连续触发中，只会在第一次触发时进入这个 if 分支中
        if (!timeout) {
            // 设置了 timeout，所以以后不会进入这个 if 分支了
            timeout = setTimeout(later, wait);
        }
        // 如果是立即触发
        if (callNow) {
            // func 可能是有返回值的
            result = func.apply(context, args);
            // 解除引用
            context = args = null;
        }

        return result;
    };
};

// https://github.com/hanzichi/underscore-analysis/issues/22
// 函数节流（如果有连续事件响应，则每间隔一定时间段触发）
// 每间隔 wait(Number) milliseconds 触发一次 func 方法
// 如果 options 参数传入 {leading: false}
// 那么不会马上触发（等待 wait milliseconds 后第一次触发 func）
// 如果 options 参数传入 {trailing: false}
// 那么最后一次回调不会被触发
// **Notice: options 不能同时设置 leading 和 trailing 为 false**
// 示例：
// var throttled = throttle(updatePosition, 100);
// $(window).scroll(throttled);
// 调用方式（注意看 A 和 B console.log 打印的位置）：
// throttle(function, wait, [options])
// sample 1: throttle(function(){}, 1000)
// print: A, B, B, B ...
// sample 2: throttle(function(){}, 1000, {leading: false})
// print: B, B, B, B ...
// sample 3: throttle(function(){}, 1000, {trailing: false})
// print: A, A, A, A ...
// ----------------------------------------- //
let throttle = function(func, wait, options) {
    var context, args, result;

    // setTimeout 的 handler
    var timeout = null;

    // 标记时间戳
    // 上一次执行回调的时间戳
    var previous = 0;

    // 如果没有传入 options 参数
    // 则将 options 参数置为空对象
    if (!options) options = {};

    var later = function() {
        // 如果 options.leading === false
        // 则每次触发回调后将 previous 置为 0
        // 否则置为当前时间戳
        previous = options.leading === false ? 0 : _now();
        timeout = null;
        // console.log('B')
        result = func.apply(context, args);

        if (!timeout) context = args = null;
    };

    // 以滚轮事件为例（scroll）
    // 每次触发滚轮事件即执行这个返回的方法
    // throttle 方法返回的函数
    return function() {
        // 记录当前时间戳
        var now = _now();

        // 第一次执行回调（此时 previous 为 0，之后 previous 值为上一次时间戳）
        // 并且如果程序设定第一个回调不是立即执行的（options.leading === false）
        // 则将 previous 值（表示上次执行的时间戳）设为 now 的时间戳（第一次触发时）
        // 表示刚执行过，这次就不用执行了
        if (!previous && options.leading === false) previous = now;

        // 距离下次触发 func 还需要等待的时间
        var remaining = wait - (now - previous);
        context = this;
        args = arguments;

        // 要么是到了间隔时间了，随即触发方法（remaining <= 0）
        // 要么是没有传入 {leading: false}，且第一次触发回调，即立即触发
        // 此时 previous 为 0，wait - (now - previous) 也满足 <= 0
        // 之后便会把 previous 值迅速置为 now
        // ========= //
        // remaining > wait，表示客户端系统时间被调整过
        // 则马上执行 func 函数
        // @see https://blog.coding.net/blog/the-difference-between-throttle-and-debounce-in-underscorejs
        // ========= //

        // console.log(remaining) 可以打印出来看看
        if (remaining <= 0 || remaining > wait) {
            if (timeout) {
                clearTimeout(timeout);
                // 解除引用，防止内存泄露
                timeout = null;
            }

            // 重置前一次触发的时间戳
            previous = now;

            // 触发方法
            // result 为该方法返回值
            // console.log('A')
            result = func.apply(context, args);

            // 引用置为空，防止内存泄露
            // 感觉这里的 timeout 肯定是 null 啊？这个 if 判断没必要吧？
            if (!timeout) context = args = null;
        } else if (!timeout && options.trailing !== false) { // 最后一次需要触发的情况
            // 如果已经存在一个定时器，则不会进入该 if 分支
            // 如果 {trailing: false}，即最后一次不需要触发了，也不会进入这个分支
            // 间隔 remaining milliseconds 后触发 later 方法
            timeout = setTimeout(later, remaining);
        }

        // 回调返回值
        return result;
    };
};

/**
 * 随机获得 1 个在 max 范围内的且不与 a 数组内重复的数
 * @param  { Array } a 需要参考的数组
 * @param  { Number } max 数值的范围
 * @return { Number }   不重复的随机数
 */
function getDifferentNum(a, max) {
    let random = Math.floor(Math.random() * max);
    for (let i of a) {
        if (random === i) {
            return getDifferentNum(a, max);
        }
    }
    return random;
}

/**
 * 从数组 array 中获取 number 个 不同值组成的数组
 * @param  {[type]} array  [description]
 * @param  {[type]} number [description]
 * @param  {Number} amount [description]
 * @return {[type]}        [description]
 */
let randomArray = function(array, number, max = array.length) {
    let cacheArr = [];
    let cacheNum = [];
    for (let i = 0; i < number; i++) {
        cacheNum[i] = getDifferentNum(cacheNum, max)
    }
    cacheNum.forEach((n, i) => {
        cacheArr[i] = array[n]
    });
    return cacheArr;
}

// 指定范围数组求和, 不包括end
let sumArray = function(array, begin = 0, end = array.length) {
    let sum = 0;
    for (let i = begin; i < end; i++) {
        sum += parseFloat(array[i]);
    }
    return sum;
}

export {
    getDifferentNum,
    randomArray,
    sumArray,
    debounce,
    throttle
};
