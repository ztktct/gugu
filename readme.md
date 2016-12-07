# 我的阅读器 webapp 项目构思、实践、上线(一期)

 1、测试地址：http://ztktct.tk:3005
 2、APP下载地址：http://ztktct.tk:3005/gugu.apk

## 一、需求整理
    1、书架，存放收藏的图书
    2、搜索
    3、添加图书到书架
    4、从书架移除图书
    5、设置文章内容的样式

## 二、技术选型
    1、前端页面搭建采用VUE全家桶，vue, vue-cli, vue-router, vuex
    2、后端语言打算采用nodejs,虽然接口可以用追书提供的，但是由于存在跨域问题，需要服务器做下中间层
    3、服务器用的小鸟云，包了一年，不用白不用，centos6.7系统，用nginx来做反向代理

## 三、API设计
    一期打算只提供阅读功能，直接利用赘述神器提供的api接口，电脑上装个安卓模拟器，利用fiddler抓包获取

## 四、原型设计
> [磨刀平台](https://modao.cc/)

## 五、UI设计
    没有专业的设计师，打算直接在原型设计的时候考虑好，图标可由 [阿里巴巴](http://www.iconfont.cn/plus)提供！

## 感谢
    感谢 [Keegan小钢](http://keeganlee.me/post/practice/20160807) 提供的思路