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
                    @touchstart='touchstart(book)'
                    @touchend='touchend'
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
        <Vdialog :show='showDialog' :clickHandle='hideDialog' :title='dialogTitle'>
            <li class="cell" @click='deleteShelf'>删除</li>
        </Vdialog>
    </div>
</template>

<script>
    import Navbar from '../components/navbar';
    import Icon from '../components/icons';
    import Loading from '../components/loading';
    import Vdialog from '../components/dialog';
    import {API_ADDRESS} from '../vuex/localdata';
    import { mapState, mapActions } from 'vuex';

    export default {
        data() {
            return {
                temporary: true,
                hasNews: [],        // 每本书籍是否有更新
                isLoading: false,
                willDelete: '',     // 将要删除的书籍ID
                isTouching: false,   // 正在触摸
                touchTimer: null,
                showDialog: false,
                dialogTitle: ''
            }
        },
        components: {
            Navbar,
            Icon,
            Loading,
            Vdialog
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
                'setShelfSource',
                'setShelfUpdate',
                'reduceShelf'
            ]),
            searchEvent() {
                this.$router.push('/search/keywords')
            },
            reader(book, index) {
                this.hasNews.splice(index, 1, 0);
                this.setShelfUpdate(book);
                this.$router.push('/BookReader/' + book._id);
            },
            // 长按删除
            touchstart(book) {
                this.isTouching = true;
                this.touchTimer = setTimeout(() => {
                    if (this.isTouching) {
                        this.willDelete = book._id;
                        this.dialogTitle = book.title;
                        this.showDialog = true;
                    }
                }, 750);
            },
            touchend() {
                this.isTouching = false;
                clearTimeout(this.touchTimer);
            },
            // 删除书籍
            deleteShelf() {
                this.reduceShelf(this.willDelete);
                this.hideDialog();
            },
            // 隐藏对话框
            hideDialog() {
                this.showDialog = false;
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
                        this.$notice.push('请检查网络连接！')
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
    .m-books-lists{
        max-height:none;
    }
  }
</style>