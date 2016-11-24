'use strict';
let express = require('express');
let app=express();
let bodyParser = require('body-parser');
let cheerio = require('cheerio');
let http = require('http');
let router = express.Router();
let url = require('url');
let queryString = require('querystring');
let iconv = require('iconv-lite'); // 编码转换

// 修改模板文件后缀为html
app.set('view engine','html');
app.engine('.html',require('ejs').__express);
// 代理静态资源
app.use(express.static(require('path').join(__dirname,'public')));

// 设定views变量，意为视图存放目录
app.set('views',__dirname+'/views');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

// 设置CORS
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
	next();
}); 

// 接受http请求为'/'时，渲染index页面
app.get('/',(req,res)=>{
	res.render('index');
});

// 接受http请求为'/book'时，返回数据
app.get('/book',(req, response)=>{
    let api = req.query.api;
    let urlParse = url.parse(api);
    let querys = queryString.parse(urlParse.query);
    let options = {
        method: 'GET',
        path: urlParse.pathname+'?'+ queryString.stringify(querys),
        hostname: urlParse.hostname,
        headers:{
            "Content-Type": "text/html;charset=utf-8",
            'Accept':'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Encoding':'gzip, deflate, sdch',
            'Accept-Language':'zh-CN,zh;q=0.8',
            'Connection':'keep-alive',
            'Host':urlParse.hostname,
            'User-Agent':' ZhuiShuShenQi/3.64 (Android 5.1.1; Nubia NX511J / Nubia NX511J; ????)[preload=false;locale=zh_CN;clientidbase=android-zte]',
            'X-User-Agent': 'ZhuiShuShenQi/3.64 (Android 5.1.1; Nubia NX511J / Nubia NX511J; ????)[preload=false;locale=zh_CN;clientidbase=android-zte]'
            //'User-Agent':'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1'
        }
    };
    
    http.get(options, function(res){
        let datas = '';
        res.setEncoding('utf8');
        res.on('data', function(data){
            datas += data;
        });
        res.on('end', function(){
            response.json(datas);
        });
    });
});

app.listen(3005);
