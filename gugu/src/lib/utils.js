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

export {
	getDifferentNum,
	randomArray
};
