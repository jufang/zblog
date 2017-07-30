var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var TagSchema = new Schema({
    name: {type: String, required: true },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    },
});

var PostSchema = new Schema({
    title: {type:String,required: true},
    accepted: {
        type:Boolean,
        default:false
    },
    lead_sentence:String,
    items:Array,
    Tags:[{type: Schema.Types.ObjectId, ref: 'Tag'}],
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
mongoose.model('Tag', TagSchema);
mongoose.model('Post', PostSchema);