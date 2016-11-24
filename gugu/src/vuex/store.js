import Vue from 'vue';
import Vuex from 'vuex';
import * as localdata from './localdata';

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
		REDUCE_SHELF(state, index, number) {
			state.bookShelf.splice(index, number);
			localdata.setShelf(state.bookShelf);
		},
		// 添加搜索记录
		ADD_HISTORY(state, history) {
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
		reduceShelf({ commit }, index, number = 1) {
			commit('REDUCE_SHELF', index, number)
		},
		addHistory({ commit }, history) {
			commit('ADD_HISTORY', history);
		},
		removeHistory({ commit }) {
			commit('REMOVE_HISTORY');
		}
	}
// 	getters: {
// 		articleMd: (state, getters) => {
// 			return marked(getters.articleList)
// 		},
// 		articleList: state => {
// 			return state.articleList
// 		}
// 	}
})
