var express=require("express");
var connectLog=require("./util/connectLog.js");
var router=express();


//购物车页
function index(req,res){
	res.render("index");
}
function cms(req,res){
  res.render('cms')
}
//公共头 本地测试用
function commonHead_user(req,res){
	res.send("HELLO HEAD USER")
}
router.get("/",index);
router.get("/cms/*",cms);
router.get("/n/common/*",commonHead_user);
module.exports=router;
