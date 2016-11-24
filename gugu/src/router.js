import Vue from 'vue';
import VueRouter from 'vue-router';

// 使用路由
Vue.use(VueRouter);

// 导入页面组件
import Search from './views/search';  // 搜索页
import SearchKeywords from './components/search-keywords'; // 搜索页-关键词组件
import SearchResult from './components/search-result';// 搜索结果页
import BookDetails from './views/book-details'; // 书籍详情页
import BookReader from './views/book-reader';   // 章节内容页

// 路由规则
const routerConfig = [
    {
        path: '/search',
        name: 'search',
        component: Search,
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
        component: BookDetails
    },
    {
        path: '/bookReader',
        name: 'bookReader',
        component: BookReader
    }
];

// 配置路由
const router = new VueRouter({
    routes: routerConfig
});

export default router;
