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

router.post('/',function (req,res){
  const body = req.body.post;
  const curPost = new Post({
    title:body.title,
    published_at:moment(body.published_at).format("YYYY/MM/DD HH:mm"),
    lead_sentence:body.lead_sentence,
    items:body.items_attributes.map((v)=>{
      return _.omit(v,['is_new','editing'])
    })
  })
  body.taggings_attributes.forEach((v)=>{
    Tag.findOne({text:v.text},function(e,data){
      if(data){
        curPost.tags.push(new Tag({_id:data._id}))
      }else{
        let TagEntry = new Tag({text:v.text})
        curPost.tags.push(TagEntry)
        TagEntry.save()
      }
      curPost.save(function(err,postdata){
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
router.get('/:id/edit',async(req,res)=>{
  let post = await Post.findById(req.params.id)
              .select('title published_at accepted lead_sentence tags items')
              .populate({path:'tags',select: 'text'})
  post.items = _.map(post.items,function(d){
    return _.mapKeys(d,(v,k)=>{
      if(k=='target_type'){
        return 'targetType'
      }else{
        return k
      } 
    })
  })
  res.send(post)
})
router.patch('/:id/',function(){})
function status(accepted,time){
  if(!accepted) return 0;
  if(+time >= +new Date()){
    return 1
  }else{
    return 2
  }
}
module.exports = router;
