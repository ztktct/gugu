<template>
    <div class="home page page-fixed">
        <!-- 首页navbar -->
        <Navbar class='home-navbar' 
        :hasLeftIcon="false" 
        :hasRightBorder="false" 
        :searchEvent='searchEvent'>
          <h2>咕咕日常</h2>
        </Navbar>
        <div class="container" ref='touchContainer'>
            <Loading :temporary='temporary' :isLoading='isLoading' @startLoad='update'>
                <ul class="m-books-lists">
                    <li  class="cell"
                    v-for='(book, index) in bookShelf'
                    @click='reader(book, index)'
                    :class='{hasNew: hasNews[index] && hasNews[index] != 0}'>
                        <div class="leftimg">
                            <img :src="book.cover" height="64" width="44" alt="">
                        </div>
                        <div class="rightctx">
                            <h3>{{book.title}}</h3>
                            <p>{{book.currentSource.updated | timeSemantic}} : {{book.currentSource.lastChapter}}</p>
                        </div>
                    </li>
                </ul>
                <router-link to='/search/keywords' tag="div" class="addbooks cell">
                    <Icon className='icon-tianjia'></Icon>
                    <p>添加您喜欢的小说</p>
                </router-link>
            </Loading>
        </div>
    </div>
</template>

<script>
    import Navbar from '../components/navbar';
    import Icon from '../components/icons';
    import Loading from '../components/loading';
    import {API_ADDRESS} from '../vuex/localdata';
    import { mapState, mapActions } from 'vuex';

    export default {
        data() {
            return {
                temporary: true,
                hasNews: [],
                isLoading: false
            }
        },
        components: {
            Navbar,
            Icon,
            Loading
        },
        computed: {
            ...mapState([
                'bookShelf'
            ])
        },
        watch: {
            bookShelf() {
                if (this.bookShelf.length >= 1) {
                    this.temporary = false;
                }
            }
        },
        methods: {
            ...mapActions([
                'setShelfSource'
            ]),
            searchEvent() {
                this.$router.push('/search/keywords')
            },
            reader(book, index) {
                this.hasNews[index] = 0;
                this.$router.push('/BookReader/' + book._id);
            },
            update() {
                this.isLoading = true;
                this.hasNews = [];

                let bookIds = [];
                for (let shelf of this.bookShelf) {
                    bookIds.push(shelf._id)
                }

                this.$http.get(API_ADDRESS + '/book?view=updated&id=' + bookIds.toString())
                .then(response => {
                    let newInfo = response.body;
                    for (let shelf of this.bookShelf) {
                        for (let info of newInfo) {
                            if (info._id == shelf._id) {
                                if (info.updated != shelf.updated) {
                                    // 有更新
                                    let playLoad = {
                                        bookId: shelf._id,
                                        source: shelf.currentSource
                                    }
                                    playLoad.source.lastChapter = info.lastChapter;
                                    playLoad.source.updated = info.updated;
                                    this.setShelfSource(playLoad);
                                    this.hasNews.push(1);
                                    this.$notice.push('书籍已更新');
                                } else {
                                    this.hasNews.push(0);
                                }
                                break;
                            }
                        }
                    }
                    this.isLoading = false;
                }).catch(error => {
                    if (error) {
                        console.log(error)
                    }
                    this.isLoading = false;
                })
            }
        },
        mounted() {
            if (this.bookShelf.length > 0) {
                this.update();
                this.temporary = false;
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