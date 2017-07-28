var mongoose = require('mongoose');

var TaggingSchema = new mongoose.Schema({
    tag_id: Number,
    subject_id: Number,
    subject_type:Number,
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
