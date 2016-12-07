import Vue from 'vue';
import App from './App';
import router from './router';
import store from './vuex/store';
import VueResource from 'vue-resource';
import { SERVER_ADDRESS } from './vuex/localdata';
import timeSemantic from './lib/timeSemantic';
import VueLazyload from 'vue-lazyload'

Vue.use(VueLazyload)
Vue.use(VueResource);
// vue-resource 全局设置
Vue.http.options.emulateJSON = true;
Vue.http.interceptors.push((request, next) => {
    request.url = SERVER_ADDRESS + request.url;
    // continue to next interceptor
    next(response => {
        if (!response.ok) {
            console.log(response)
            console.log('获取数据失败');
            return;
        }
        // SERVER_ADDRESS 为空表示直接使用追书神器官网的API
        // 不为空，则用的自己服务器
        if (SERVER_ADDRESS !== '') {
            response.body = JSON.parse(response.body);
        }
    });
});

// vue 过滤
Vue.filter('timeSemantic', function(value) {
    return timeSemantic(value)
})

// 移动端自适应解决方案
require('./lib/autoFontSize.js');

/* eslint-disable no-new */
new Vue({
    router,
    store,
    el: '#app',
    render: h => h(App)
});
