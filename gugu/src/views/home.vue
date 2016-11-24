<template>
    <div class="home page page-fixed">
        <!-- 首页navbar -->
        <Navbar class='home-navbar' 
        :hasLeftIcon="false" 
        :hasRightBorder="false" 
        :searchEvent='searchEvent'>
          <h2>咕咕日常</h2>
        </Navbar>
        <div class="container">
            <ul class="m-books-lists">
                <router-link to='/BookReader' class="cell hasNew" tag="li" v-for='book in bookShelf'>
                    <div class="leftimg">
                        <img :src="book.cover" height="64" width="44" alt="">
                    </div>
                    <div class="rightctx">
                        <h3>{{book.title}}</h3>
                        <p>{{book.updated + ':' + book.lastChapter}}</p>
                    </div>
                </router-link>
            </ul>
            <router-link to='/search/keywords' tag="div" class="addbooks cell">
                <Icon className='icon-tianjia'></Icon>
                <p>添加您喜欢的小说</p>
            </router-link>
        </div>
    </div>
</template>

<script>
    import Navbar from '../components/navbar';
    import Icon from '../components/icons';
    import { mapState } from 'vuex';

    export default {
        data() {
            return {
                shelf: []   // 书架
            }
        },
        components: {
            Navbar,
            Icon
        },
        computed: {
            ...mapState([
                'bookShelf'
            ])
        },
        methods: {
            searchEvent() {
                this.$router.push('/search/keywords')
            }
        }
    }
</script>

<style lang='scss' scoped>
  .home{
    z-index: 1;
    &-navbar{
      h2{
        font-weight: normal;
        font-size: 20px;
        padding-left: 10px;
      }
    }

    .addbooks{
        align-items: center;
        height: 54px;
        color: #333;
        font-size: 16px;
        .iconfont{
            font-size: 20px;
            margin: 0 20px 0 27px;
        }
    }
  }
</style>