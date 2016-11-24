// const SERVER_ADDRESS = 'http://192.168.0.103:3005/book?api='; // 本地环境
// const SERVER_ADDRESS = 'http://183.232.236.40:3005/book?api=';// 服务器
const SERVER_ADDRESS = ''; // 追书官方服务器

const API_ADDRESS = 'http://api.zhuishushenqi.com';
const API_ADDRESS_CHAPTER = 'http://chapter2.zhuishushenqi.com';
const localStorage = window.localStorage;

// 存取搜索记录
let setHistory = function(data) {
	if (typeof data !== 'string') data = JSON.stringify(data);
	localStorage.setItem('GUGU_BOOK_HISTORY', data);
}

let getHistory = function() {
	return JSON.parse(localStorage.getItem('GUGU_BOOK_HISTORY') || '[]');
}

// 存取书架书籍
let setShelf = function(data) {
	if (typeof data !== 'string') data = JSON.stringify(data);
	localStorage.setItem('GUGU_BOOK_SHELF', data);
}

let getShelf = function() {
	return JSON.parse(localStorage.getItem('GUGU_BOOK_SHELF') || '[]');
}

let guguBookHistory = getHistory(); 	// 搜索记录
let guguBookShelf = getShelf(); 		// 书架

export {
	SERVER_ADDRESS,
	API_ADDRESS,
	API_ADDRESS_CHAPTER,
	setHistory,
	getHistory,
	setShelf,
	getShelf,
	guguBookHistory,
	guguBookShelf
};
