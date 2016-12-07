// 已经加入书籍的数据
// 暂时用localstorage存储本地
// [
//  {
// 	  _id: 123456456,
// 	  cover: 'http://static.zongheng.com/upload/cover/shucheng/21/12321017.jpg',
// 	  title: '将夜',
//    auhor: '作者',
// 	  lastChapter: '第1264章 将夜',
// 	  updated: '2015-06-15UT20:52:36',
// 	  currentChapter: {
//      _index: 0,
// 	    title: '开头',
// 	    body: '...',
// 	    isVip: false,
// 	    cpContent: '...',
// 	    id: 222222,
// 	    currency: 25 
// 	  },
// 	  currentSource: {
// 	  	_id:书籍来源ID
// 	  	chaptersCount:总章节数
// 	  	host: 来源网站
// 	  	isCharge:是否付费
// 	  	lastChapter：最新章节名称
// 	  	link：链接地址
// 	  	name: 书源名称
// 	  	source: 书源
// 	  	updated：更新时间
// 	  }
//   }
// ]
[
  {
  	_id: 书籍ID,
  	cover: 封面,
  	title: 书名,
    author: 作者,
  	lastChapter: 最新章节,
  	updated: 更新时间(语义化)
  	currentChapter: 该书籍当前章节,
  	currentSource: 当前来源
  }
]

// 搜索历史
[
  title: 搜索过的标题
]