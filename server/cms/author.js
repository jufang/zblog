const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Author = mongoose.model('Author');
const Tag = mongoose.model('Tag');
const crypto 		= require('crypto');
const moment = require('moment');
const _ = require('lodash');

//登录与注册
router.post('/sign-in',function(req,res){
  const authorD = req.body.author;
  Author.findOne({'email':authorD.email},function(e,o){
    if(o==null){
      res.status(401).json({"errorMessage": "您的用户名或者密码错误" })
    }else{
      validatePassword(authorD.password,o.encrypted_password,function(err,isValidatePass){
        if (isValidatePass){
          res.json({success:true})
				}	else{
					res.status(401).json({"errorMessage": "您的用户名或者密码错误" })
				}
      })
    }
  })
})
router.post('/sign-up',function(req,res){
  const authorD = req.body.author;
  Author.findOne({'name':authorD.name},function(e,o){
    if(o){
      res.status(422).json({"errorMessage": "用户已存在" })
    }else{
      Author.findOne({'email':authorD.email},function(e1,o1){
        if(o1){
          res.status(422).json({"errorMessage":"邮箱已存在"})
        }else{
          const author = new Author({
            name:authorD.name,
            email:authorD.email,
            encrypted_password:saltAndHash(authorD.password),
            access_token:generateSalt()
          })
          author.save(function(err,data){
            if(err){
              res.status(400).json({"errorMessage":"创建用户失败"})
            }else{
              res.json({"accessToken":data.access_token})
            }
          })
        }
      })
    }
  })
})
router.delete('/sign-out',function(req,res){
  res.json({success:true})
})
//关于作者
router.get('/edit',function(req,res){
  Author.findOne({access_token:req.get("Authorization")},'name description introduction image ',function(err,data){
    if(err){
      res.status(400).json({"errorMessage":"编辑用户出错"})
    }else{
      res.json({name:data.name,description:data.description,introduction:data.introduction,image:data.image})
    }
  })
})
router.patch('/',function(req,res){
  const authorD = req.body.author;
  Author.findOneAndUpdate({access_token:req.get("Authorization")},authorD,{},function(err,data){
    if(data){
      res.json({success:true})
    }
  })
})
var generateSalt = function(){
	var set = '0123456789abcdefghijklmnopqurstuvwxyzABCDEFGHIJKLMNOPQURSTUVWXYZ';
	var salt = '';
	for (var i = 0; i < 10; i++) {
		var p = Math.floor(Math.random() * set.length);
		salt += set[p];
	}
	return salt;
}
var md5 = function(str) {
	return crypto.createHash('md5').update(str).digest('hex');
}

var saltAndHash = function(pass){
	var salt = generateSalt();
	return salt + md5(pass + salt);
}

var validatePassword = function(plainPass, hashedPass, callback){
	var salt = hashedPass.substr(0, 10);
	var validHash = salt + md5(plainPass + salt);
	callback(null, hashedPass === validHash);
}

module.exports = router;
