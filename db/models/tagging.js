var mongoose = require('mongoose');

var TaggingSchema = new mongoose.Schema({
    tag_id: {type:Number,required: true},
    post_id: {type:Number,required: true},
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    },
});

mongoose.model('Tagging', TaggingSchema);