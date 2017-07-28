var mongoose = require('mongoose');

var PostSchema = new mongoose.Schema({
    title: {type:String,required: true},
    accepted: {
        type:Boolean,
        default:false
    },
    lead_sentence:String,
    published_at: {
        type: Date,
        default: Date.now
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now,
        index:true
    },
});

mongoose.model('Post', PostSchema);
