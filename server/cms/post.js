'use strict';
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Post = mongoose.model('Post');
const Tag = mongoose.model('Tag');
const crypto 		= require('crypto');
const moment = require('moment');
const _ = require('lodash');
import { createPagination } from '../helper';


//取文章的列表
router.get('/', async (req,res,next)=>{
    await next();
  },
  createPagination(Post, { limit: 20 }),
  async (req1,res1, next) =>{
    res1.send(res1.data)
  }
)

function status(accepted,time){
  if(!accepted) return 0;
  if(+time >= +new Date()){
    return 1
  }else{
    return 2
  }
}
router.post('/posts',
    async ctx => {
        const body = ctx.request.body;
        ctx.body = await Post.create({
            title: body.title,
            content: body.content,
            author: ctx.passport.user._id,
            descendants: [],
            created_at: Date.now()
        });
        ctx.status = 201;
    }
);

router.post('/',function(req,res){
  const postD = req.body.post;
  let   tagD  = postD.taggings_attributes ? postD.taggings_attributes:null;
  let   itemD = postD.items_attributes ? postD.items_attributes:null;
  //定义文章的实体
  let PostEntry = new Post({
    title:postD.title,
    published_at:moment(postD.published_at).format("YYYY/MM/DD HH:mm"),
    lead_sentence:postD.lead_sentence,
    items:itemD.map((v)=>{
      return _.omit(v,['is_new','editing'])
    })
  })

  tagD.forEach((v)=>{
    Tag.findOne({text:v.text},function(e,data){
      if(data){
        PostEntry.tags.push(new Tag({_id:data._id}))
      }else{
        let TagEntry = new Tag({text:v.text})
        PostEntry.tags.push(TagEntry)
        TagEntry.save()
      }
      PostEntry.save(function(err,postdata){
        if(err){
          res.status(400).json({"errorMessage":"创建文章失败"})
        }else{
          res.json({success:true})
        }
      })
    })
  })
})
router.patch('/:id/acceptance',function(req,res){
  Post.findOne({_id:req.params.id},function(err,data){
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
router.get('/:id/edit',function(req,res){
  Post.findOne({_id:req.params.id})
  .populate({path:'tags',select: 'text'})
  .exec(function(err,data){
    const items = _.map(data.items,function(d){
      return _.mapKeys(d,(v,k)=>{
        if(k=='target_type'){
          return 'targetType'
        }else{
          return k
        } 
      })
    })
    if(err){
      if (err) res.status(400).json({"errorMessage":"查看文章失败"})
    }else{
      res.json({
        id:data.id,
        accepted:data.accepted,
        title:data.title,
        leadSentence:data.lead_sentence,
        publishedAt:data.published_at,
        items:items,
        tags:data.tags
      })
    }
  })
  
})
router.patch('/:id/',function(){})

module.exports = router;
