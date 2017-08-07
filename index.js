var express=require("express");
var http=require("http");
var app=express();
var compression = require('compression');
var U=require("./util/U.js");
var router=require("./routes.js");
var path = require('path');
var favicon = require('serve-favicon');
var proxy = require('http-proxy-middleware');

// gzip 压缩
app.use(compression());

// 网页tab的logo
app.use(favicon(__dirname+"/public/favicon.ico"));

app.set('views', path.join(__dirname, 'views'));  
app.set('view engine', 'ejs');  

if(process.env.BLOGFRONT =='production'){
	app.use('(/cms)?/api/v1',proxy({
		target:'http://47.92.115.203:9001',
		changeOrigin:true,
		router:{
			'http://47.92.115.203:8087':'http://47.92.115.203:9001'
		}
	}))
}else{
	app.use('(/cms)?/api/v1',proxy({
		target:'http://127.0.0.1:3000',
		changeOrigin:true,
		router:{
			'http://127.0.0.1:8000':'http://127.0.0.1:3000'
		}
	}))
}

app.use(router);
app.use(express.static(__dirname+"/public"));

app.all("/:site/api/*",function(req,res){
	res.json({success:false,errMsg:"接口404"});
});
app.use(function(req,res){
	res.redirect("/not-found");
});
//如果本地环境

if(process.env.BLOGFRONT==="production"){
	app.listen(8087,function(){	
		console.log(U.formatLong(new Date-0)+"blog app run on port 8087");
	});
}else{
	app.listen(8000,function(){
		 console.log('blog app run on port http://localhost:8000  ' +app.get('env') +'  '+U.formatLong(new Date-0));
	});
}
