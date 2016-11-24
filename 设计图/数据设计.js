// 已经加入书籍的数据
// 暂时用localstorage存储本地
// [
//  {
// 	  _id: 123456456,
// 	  cover: 'http://static.zongheng.com/upload/cover/shucheng/21/12321017.jpg',
// 	  title: '将夜',
// 	  lastChapter: '第1264章 将夜',
// 	  updated: '四天前'
//   }
// ]
[
  {
  	_id: 书籍ID,
  	cover: 封面,
  	title: 书名,
  	lastChapter: 最新章节,
  	updated: 更新时间(语义化)
  }
]

// 搜索历史
[
  title: 搜索过的标题
]