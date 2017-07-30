const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Author = mongoose.model('Author');
const Post = mongoose.model('Post');
const Tag = mongoose.model('Tag');
const crypto 		= require('crypto');
const moment = require('moment');
const _ = require('lodash');

//登录与注册
router.post('/authors/sign-in',function(req,res){
  const authorD = req.body.author;
  Author.findOne({'email':authorD.email},function(e,o){
    if(o==null){
      res.status(401).json({"errorMessage": '您的用户名或者密码错误' })
    }else{
      validatePassword(authorD.password,o.encrypted_password,function(err,isValidatePass){
        if (isValidatePass){
          res.json({success:true})
				}	else{
					res.status(401).json({"errorMessage": '您的用户名或者密码错误' })
				}
      })
    }
  })
})
router.post('/authors/sign-up',function(req,res){
  const authorD = req.body.author;
  Author.findOne({'name':authorD.name},function(e,o){
    if(o){
      res.status(422).json({"errorMessage": '用户已存在' })
    }else{
      Author.findOne({'email':authorD.email},function(e1,o1){
        if(o1){
          res.status(422).json({"errorMessage":'邮箱已存在'})
        }else{
          const author = new Author({
            name:authorD.name,
            email:authorD.email,
            encrypted_password:saltAndHash(authorD.password),
            access_token:generateSalt()
          })
          author.save(function(err,data){
            if(err){
              res.status(400).json({"errorMessage":'创建用户失败'})
            }else{
              res.json({"accessToken":data.access_token})
            }
          })
        }
      })
    }
  })
})
router.delete('/authors/sign-out',function(req,res){
  res.json({success:true})
})
//关于作者
router.get('/authors/edit',function(req,res){
  Author.findOne({access_token:req.get("Authorization")},'name description introduction image ',function(err,data){
    if(err){
      res.status(400).json({"errorMessage":'编辑用户出错'})
    }else{
      res.json({name:data.name,description:data.description,introduction:data.introduction,image:data.image})
    }
  })
})
router.patch('/authors',function(req,res){
  const authorD = req.body.author;
  Author.findOneAndUpdate({access_token:req.get("Authorization")},authorD,{},function(err,data){
    if(data){
      res.json({success:true})
    }
  })
})
//文章
function status(accepted,time){
  if(!accepted) return 0;
  if(+time >= +new Date()){
    return 1
  }else{
    return 2
  }
}
router.get('/posts',function(req,res){
  const page = parseInt(req.query.page),
        limit = 20;
  Post.find({})
    .limit(limit)
    .skip(limit*(page-1))
    .select('id accepted title updated_at')
    .sort('-created_at')
    .exec(function(err,doc){
      doc = _.map(doc,(v)=>{
        return {
          "accepted":v.accepted,
          "title":v.title,
          "publishedAt":moment(v.updated_at).format("YYYY/MM/DD"),
          "id":v._id,
          "status":status(v.accepted,v.published_at)
        }
      }) 
      Post.count({}, function (err, count) {
        if (err) res.status(400).json({"errorMessage":'查看文章失败'})
        res.json({
          "meta":{
            "pagination":{"page":page,"limit":limit,"total":count},
          },
          "posts":doc
        })
      });
    })
})
router.post('/posts',function(req,res){
  const postD = req.body.post;
  let   tagD  = postD.taggings_attributes ? postD.taggings_attributes:null;
  let   itemD = postD.items_attributes ? postD.items_attributes:null;
  //定义文章的实体
  const PostEntry = new Post({
    title:postD.title,
    published_at:moment(postD.published_at,"YYYY/MM/DD HH:mm"),
    lead_sentence:postD.ead_sentence,
    items:itemD.map((v)=>{
      return _.omit(v,['is_new','editing'])
    })
  })

  tagD.forEach((v)=>{
    Tag.findOne({name:v.text},function(err,data){
      if(data){
        PostEntry.Tags.push(new Tag({_id:data._id}))
      }else{
        let TagEntry = new Tag({name:v.text})
        TagEntry.save()
        PostEntry.Tags.push(TagEntry)
      }
      PostEntry.save(function(err,postdata){
        if(err){
          res.status(400).json({"errorMessage":'创建文章失败'})
        }else{
          res.status(200).json({success:true})
        }
      })
    })
  })
})
router.patch('/posts/:id/acceptance',function(req,res){
  const id = req.params.id;
  Post.findOne({_id:id},function(err,data){
    const accepted = !data.accepted;
    data.accepted = accepted
    data.save(function(){
      res.json({
        status:status(accepted,data.published_at),
        accepted:accepted
      })
    })
  })
})
router.get('posts/:id/edit',function(req,res){
  const id = req.params.id;
  Post.findOne({_id:id},function(err,data){
    //res.json(data)
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


// router.get('/post', function(req, res, next) {
//   Post.findAsync({}, null, {sort:'-createdDate'})
//     .then(allPosts => res.json(allPosts))
//     .catch(err => !console.log(err) && next(err));
// });

// router.post('/post', function(req, res, next) {
//   const newPost = new Post(req.body);
//   newPost.saveAsync()
//     .then(savedPost => res.json(savedPost[0] || savedPost)) // sometimes returns array of [savedPost, 1], not sure if this a MongoDB or Mongoose version thing
//     .catch(err => !console.log(err) && next(err));
// });

// router.put('/post/:id', function(req, res, next) {
//   Post.findByIdAndUpdateAsync(req.params.id, req.body, {new:true}) // new option here says return the updated object to the following promise
//     .then(updatedPost => res.status(200).json(updatedPost))
//     .catch(err => !console.log(err) && next(err));
// });

// router.delete('/post/:id', function(req, res, next) {
//   Post.findByIdAndRemoveAsync(req.params.id)
//     .then(deletedPost => res.status(200).json(deletedPost))
//     .catch(err => !console.log(err) && next(err));
// });

module.exports = router;
