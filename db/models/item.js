var mongoose = require('mongoose');

var ItemSchema = new mongoose.Schema({
    post_id: {type:Number,required: true},
    sort_rank: {type:Number,required: true},
    target_id:{type:Number,required: true},
    target_type:{type:String,required: true},
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    },
});

mongoose.model('Item', ItemSchema);
