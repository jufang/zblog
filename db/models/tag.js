var mongoose = require('mongoose');

var TagSchema = new mongoose.Schema({
    name: {type:String,required: true},
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    },
});

mongoose.model('Tag', TagSchema);
