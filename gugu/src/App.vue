<template>
    <div id="app">
        <Home></Home>
        <transition name='move' mode='in-out'>
          <keep-alive>
            <router-view></router-view>
          </keep-alive>
        </transition>
    </div>
</template>

<script>
  require('./assets/style/normalize.css');
  require('./assets/style/_module.scss');
  require('./assets/style/_animation.scss');
  import Home from './views/home';
  export default {
    components: {
      Home
    }
  }
  let app = document.getElementById('app')
  app.addEventListener('touchstart', function(e) {
    e.stopPropagation();
  })
  document.addEventListener('touchmove', function(e) {
    e.preventDefault();
  })
</script>
