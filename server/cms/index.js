const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Author = mongoose.model('Author');
const Item_image = mongoose.model('Item_image');
const Item_text = mongoose.model('Item_text');
const Item = mongoose.model('Item');
const Post = mongoose.model('Post');
const Tag = mongoose.model('Tag');
const Tagging = mongoose.model('Tagging');
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
      res.status(200).json({success:true})
    }
  })
})
//文章
router.get('/posts',function(req,res){
  const page = req.query.page
  res.json({
      "posts": [
            {
                  "id": 1, 
                  "title": "Hello1234443owefkrufdsjfksjkekdjs", 
                  "accepted": false, 
                  "publishedAt": "Jan 09, 2115", 
                  "status": 0
            }, 
            {
                  "id": 2, 
                  "title": "Hello Worldasdasd", 
                  "accepted": false, 
                  "publishedAt": "Apr 11, 2017", 
                  "status": 0
            }, 
            {
                  "id": 3, 
                  "title": "Thinking Aloud deneme", 
                  "accepted": false, 
                  "publishedAt": "Jun 12, 2016", 
                  "status": 0
            }, 
            {
                  "id": 4, 
                  "title": "The Curious Incident of the Dog in the Night-Time", 
                  "accepted": false, 
                  "publishedAt": "Aug 08, 2015", 
                  "status": 0
            }, 
            {
                  "id": 5, 
                  "title": "The Moving Finger", 
                  "accepted": false, 
                  "publishedAt": "Dec 24, 2015", 
                  "status": 0
            }, 
            {
                  "id": 6, 
                  "title": "Tirra Lirra by the River logo", 
                  "accepted": false, 
                  "publishedAt": "Jul 17, 2015", 
                  "status": 0
            }, 
            {
                  "id": 7, 
                  "title": "The Needle's Eye", 
                  "accepted": false, 
                  "publishedAt": "Dec 26, 2015", 
                  "status": 0
            }, 
            {
                  "id": 8, 
                  "title": "From Here to Eternity", 
                  "accepted": false, 
                  "publishedAt": "Dec 18, 2015", 
                  "status": 0
            }, 
            {
                  "id": 9, 
                  "title": "Consider the Lilies!", 
                  "accepted": false, 
                  "publishedAt": "Feb 09, 2016", 
                  "status": 0
            }, 
            {
                  "id": 10, 
                  "title": "|In Death Ground", 
                  "accepted": false, 
                  "publishedAt": "Jul 30, 2016", 
                  "status": 0
            }, 
            {
                  "id": 11, 
                  "title": "Vile Bodies test", 
                  "accepted": false, 
                  "publishedAt": "Feb 03, 2017", 
                  "status": 0
            }, 
            {
                  "id": 12, 
                  "title": "The Daffodil Sky", 
                  "accepted": false, 
                  "publishedAt": "Jul 17, 2015", 
                  "status": 0
            }, 
            {
                  "id": 13, 
                  "title": "Ego Dominus Tuus", 
                  "accepted": false, 
                  "publishedAt": "Jan 05, 2016", 
                  "status": 0
            }, 
            {
                  "id": 14, 
                  "title": "Surprised by Joy", 
                  "accepted": false, 
                  "publishedAt": "Oct 14, 2015", 
                  "status": 0
            }, 
            {
                  "id": 15, 
                  "title": "Precious Bane", 
                  "accepted": false, 
                  "publishedAt": "Nov 13, 2015", 
                  "status": 0
            }, 
            {
                  "id": 16, 
                  "title": "The Violent Bear It Away", 
                  "accepted": false, 
                  "publishedAt": "Sep 16, 2015", 
                  "status": 0
            }, 
            {
                  "id": 17, 
                  "title": "The Cricket on the Hearth", 
                  "accepted": false, 
                  "publishedAt": "Aug 10, 2015", 
                  "status": 0
            }, 
            {
                  "id": 18, 
                  "title": "This Lime Tree Bower 1", 
                  "accepted": false, 
                  "publishedAt": "Sep 25, 2015", 
                  "status": 0
            }, 
            {
                  "id": 19, 
                  "title": "Pale Kings and Princes", 
                  "accepted": false, 
                  "publishedAt": "Jul 05, 2015", 
                  "status": 0
            }, 
            {
                  "id": 20, 
                  "title": "No Country for Old Men", 
                  "accepted": false, 
                  "publishedAt": "Dec 22, 2015", 
                  "status": 0
            }
      ], 
      "meta": {
            "pagination": {
                  "page": 1, 
                  "limit": 20, 
                  "total": 129
            }
      }
})
})
router.post('/posts',function(req,res){
  const postD = req.body.post;
  let   tagD  = postD.taggings_attributes ? postD.taggings_attributes:null;
  let   itemD = postD.items_attributes ? postD.items_attributes:null;
  let  itemImage = null,itemText = null;
  let  sort_rank = 0
  if(tagD){
    tagD = tagD.map((v)=>{
      return _.mapKeys(v,(value,key)=>'name')
    })
  }
  if(itemD){
    itemImage = itemD.filter((v)=> v.target_type=='ItemImage')
    itemText = itemD.filter((v) =>  v.target_type=='ItemText')
  }
  const PostEntry = new Post({
    title:postD.title,
    published_at:moment(postD.published_at,"YYYY/MM/DD HH:mm"),
    lead_sentence:postD.ead_sentence,
  })
  Tag.create(tagD,function(err){
    if(err){
      res.status(400).json({"errorMessage":'创建标签失败'})
    }
  }).then(function(d0){
    d0.map(function(data){
      Tagging.create({
        'tag_id':data._id,
        'post_id':PostEntry._id
      })
    })
  })
  Item_image.create(itemImage,function(err){
    if(err){
      res.status(400).json({"errorMessage":'创建图片失败'})
    }
  }).then(function(d0){
    d0.map(function(data){
      Item.create({
        'post_id':PostEntry._id,
        'target_id':data._id,
        'target_type':'ItemImage',
        'sort_rank':++sort_rank
      })
    })
  })
   Item_text.create(itemText,function(err){
    if(err){
      res.status(400).json({"errorMessage":'创建内容失败'})
    }
  }).then(function(d0){
    d0.map(function(data){
      Item.create({
        'post_id':PostEntry._id,
        'target_id':data._id,
        'target_type':'ItemText',
        'sort_rank':++sort_rank
      })
    })
  })
  PostEntry.save()
})
/*
{
  "post":{
    "title":'测试哈哈哈',
    "published_at":"2017-07-15",
    "lead_sentence":"这就是测试简介",
    "items_attributes":[{
      "description":"{"entityMap":{"0":{"type":"LINK","mutability":"MUTABLE","data":{"url":"www.baidu.com"}}},"blocks":[{"key":"e5fcr","text":"dsadas","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[{"offset":0,"length":6,"key":0}]},{"key":"9hlsm","text":"dsadas","type":"blockquote","depth":0,"inlineStyleRanges":[],"entityRanges":[]},{"key":"a4lvm","text":"dsada","type":"unstyled","depth":0,"inlineStyleRanges":[{"offset":0,"length":5,"style":"ITALIC"}],"entityRanges":[]}]}",
      "editing":false,
      "is_new":false,
      "target_type":"ItemText"
    },{
      "caption":"博客banner",
      "editing":false,
      "is_new":false,
      "image":'base16的图片',
      "target_type":'ItemImage'
    },{
      "description":"{"entityMap":{},"blocks":[{"key":"1tnl","text":"博客","type":"header-two","depth":0,"inlineStyleRanges":[],"entityRanges":[]},{"key":"dusb","text":"这是博客","type":"blockquote","depth":0,"inlineStyleRanges":[],"entityRanges":[]},{"key":"eeo8o","text":"这是内容都开始的范德萨发生了房间撒可烦你jdkalsdjdjskla的数据萨克雷达打上卡了的金卡的的金卡了撒大声地京东卡拉斯附近的说法","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[]},{"key":"9u1n1","text":"","type":"header-two","depth":0,"inlineStyleRanges":[],"entityRanges":[]},{"key":"3q6r0","text":"","type":"header-two","depth":0,"inlineStyleRanges":[],"entityRanges":[]}]}",
      "editing":false,
      "is_new":false,
      "target_type":"ItemText"
    }],
    "taggings_attributes":[{
      "text":"react"
    },{
      "text":"wee"
    }]
  }
}

Tags表-------------------------------------------------------------
    t.string   "name",       limit: 255, null: false
    t.datetime "created_at"
    t.datetime "updated_at"

Taggings表-------------------------------------------------------------
    t.integer  "tag_id",       limit: 4,   null: false
    t.integer  "subject_id",   limit: 4,   null: false
    t.string   "subject_type", limit: 255, null: false
    t.datetime "created_at"
    t.datetime "updated_at"

item_images表-------------------------------------------------------------
    t.string "image",   limit: 255, null: false
    t.string "caption", limit: 255

item_texts表-------------------------------------------------------------
    t.text "description", limit: 65535, null: false

items表------------------------------------------------------------------
    t.integer  "post_id",     limit: 4,   null: false
    t.integer  "sort_rank",   limit: 4,   null: false
    t.integer  "target_id",   limit: 4,   null: false
    t.string   "target_type", limit: 255, null: false
    t.datetime "created_at",              null: false
    t.datetime "updated_at",              null: false

posts表------------------------------------------------------------------
    t.string   "title",         limit: 255,                 null: false
    t.boolean  "accepted",                  default: false, null: false
    t.datetime "published_at"
    t.string   "lead_sentence", limit: 255
    t.datetime "created_at",                                null: false
    t.datetime "updated_at",                                null: false
*/
router.post('/posts',function(req,res){
  var postD = req.body.post;
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
  console.log(plainPass, hashedPass)
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
