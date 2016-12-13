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
let request = require('request');// 发送请求
let compression = require('compression');

// gzip
app.use(compression());

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
    let api = req.originalUrl.substr(10);
    let urlParse = url.parse(api);
    let querys = queryString.parse(urlParse.query);
    let options = {
        method: 'GET',
        url: 'http://'+urlParse.host+urlParse.pathname+'?'+ queryString.stringify(querys),
        gzip:true
    };
    // 字体乱码考虑是否被gzip压缩！！！
    request(options, function(error, res, body){
        if (!error && res.statusCode == 200) {
            response.json(body);
        }
    });
});

app.listen(3003);
