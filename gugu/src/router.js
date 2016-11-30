import Vue from 'vue';
import VueRouter from 'vue-router';

// 使用路由
Vue.use(VueRouter);

// 导入页面组件
import SearchKeywords from './components/search-keywords'; // 搜索页-关键词组件
import SearchResult from './components/search-result';// 搜索结果页

// 路由规则
const routerConfig = [
    {
        path: '/search',
        name: 'search',
        component: resolve => require(['./views/search'], resolve),
        children: [
            {
                path: 'keywords',
                component: SearchKeywords
            },
            {
                path: 'result/:query',
                component: SearchResult
            }
        ]
    },
    {
        path: '/bookDetails/:id',
        name: 'bookDetails',
        component: resolve => require(['./views/book-details'], resolve)
    },
    {
        path: '/bookReader/:bookId',
        name: 'bookReader',
        component: resolve => require(['./views/book-reader'], resolve)
    },
    {
        path: '/bookTags/:tag',
        name: 'bookTags',
        component: resolve => require(['./views/book-tags'], resolve) // 相似标签的书籍列表
    },
    {
        path: '/bookSources/:_id',
        name: 'bookSources',
        component: resolve => require(['./views/book-sources'], resolve)
    }
];

// 配置路由
const router = new VueRouter({
    routes: routerConfig
});

export default router;
