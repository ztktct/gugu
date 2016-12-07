import Promise from 'es6-promise';
import { API_ADDRESS, API_ADDRESS_CHAPTER } from '../vuex/localdata';

/**
 * 获取书籍来源
 * @param  {String} book_id 书籍ID
 * @return {Promise} 返回所有书籍来源
 */
function getSources(bookId) {
    return new Promise(resolve => {
        this.$http.get(API_ADDRESS + '/atoc?view=summary&book=' + bookId)
            .then(response => {
                let sources = response.body;
                resolve(sources);
            })
    })
}

// 获取某个 `source` 来源的所有章节信息
function getChapters(source) {
    return new Promise(resolve => {
        this.$http.get(API_ADDRESS + '/btoc/' + source._id + '?view=chapters')
            .then(response => {
                let chapters = response.body.chapters;
                resolve(chapters);
            })
    });
}

/**
 * 获取第 `index` 个章节的内容
 * @param  {Array} chapters 所有章节信息
 * @param  {Number} index    第几个章节
 * @return {Promise}         返回该章节内容
 */
function getCpcontext(chapters, index) {
    return new Promise(resolve => {
        if (index < 0) return;
        if (index >= chapters.length) {
        	index = chapters.length - 1;
        }
        let currentChapter = chapters[index];
        this.$http.get(API_ADDRESS_CHAPTER + '/chapter/' + currentChapter.link)
            .then(response => {
                let chapter = response.body.chapter;
                if (chapter.cpContent) {
                    chapter.cpContent = chapter.cpContent.replace(/\s+$/g, '').replace(/\r|\n/g, '<br/>　　');
                } else {
                    chapter.body = chapter.body.replace(/\s+$/g, '').replace(/\r|\n/g, '<br/>　　');
                }
                resolve(chapter);
            });
    })
}

export {
    getSources,
    getChapters,
    getCpcontext
}
