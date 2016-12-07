import Vue from 'vue';
import Vuex from 'vuex';
import * as localdata from './localdata';
require('es6-promise').polyfill();

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        bookShelf: localdata.guguBookShelf,
        bookHistory: localdata.guguBookHistory
    },
    mutations: {
        // 添加到书架
        ADD_SHELF(state, book) {
            state.bookShelf.splice(0, 0, book);
            localdata.setShelf(state.bookShelf);
        },
        // 从书架删除
        REDUCE_SHELF(state, bookId) {
            let bookShelf = state.bookShelf;
            for (let i = 0, j = bookShelf.length; i < j; i++) {
                let shelf = bookShelf[i];
                if (shelf._id == bookId) {
                    state.bookShelf.splice(i, 1);
                    break;
                }
            }
            localdata.setShelf(state.bookShelf);
        },
        // 设置书籍的当前来源
        // playload = {
        //   bookId:'',
        //   source: {}
        // }
        SET_SHELF_SOURCE(state, playload) {
            for (let shelf of state.bookShelf) {
                if (shelf._id == playload.bookId) {
                    shelf.currentSource = playload.source;
                    localdata.setShelf(state.bookShelf);
                    return;
                }
            }
        },
        // 设置书籍当前章节
        // playload = {
        //   bookId:'',
        //   chapter: {},
        //   index: 0
        // }
        SET_SHELF_CHAPTER(state, playload) {
            for (let shelf of state.bookShelf) {
                if (shelf._id == playload.bookId) {
                    shelf.currentChapter = playload.chapter;
                    shelf.currentChapter._index = playload.index;
                    localdata.setShelf(state.bookShelf);
                    return;
                }
            }
        },
        // 添加搜索记录
        ADD_HISTORY(state, history) {
            let bookHistory = state.bookHistory;
            if (bookHistory.indexOf(history) != -1) {
                return;
            }
            state.bookHistory.splice(0, 0, history);
            localdata.setHistory(state.bookHistory);
        },
        // 清空历史记录
        REMOVE_HISTORY(state) {
            state.bookHistory = [];
            localdata.setHistory(state.bookHistory);
        }
    },
    actions: {
        addShelf({ commit }, book) {
            commit('ADD_SHELF', book);
        },
        reduceShelf({ commit }, bookId) {
            commit('REDUCE_SHELF', bookId);
        },
        setShelfSource({ commit }, playload) {
            commit('SET_SHELF_SOURCE', playload);
        },
        setShelfChapter({ commit }, playload) {
            commit('SET_SHELF_CHAPTER', playload);
        },
        addHistory({ commit }, history) {
            commit('ADD_HISTORY', history);
        },
        removeHistory({ commit }) {
            commit('REMOVE_HISTORY');
        }
    }
    //  getters: {
    //      articleMd: (state, getters) => {
    //          return marked(getters.articleList)
    //      },
    //      articleList: state => {
    //          return state.articleList
    //      }
    //  }
})
