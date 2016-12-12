<template>
    <div id="app">
        <Home></Home>
        <!-- 考虑页面流畅度，暂时停用切换效果 -->
        <!-- <transition name='move' mode='in-out'> -->
          <keep-alive>
            <router-view></router-view>
          </keep-alive>
        <!-- </transition> -->
        <Notice></Notice>
    </div>
</template>

<script>
  require('./assets/style/normalize.css');
  require('./assets/style/_module.scss');
  require('./assets/style/_animation.scss');
  import Home from './views/home';
  import Notice from './components/notice';
  export default {
    components: {
      Home,
      Notice
    }
  }
</script>
