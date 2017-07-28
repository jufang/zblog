var mongoose = require('mongoose');

var Item_textSchema = new mongoose.Schema({
    description: { type:String,required: true},
});

mongoose.model('Item_text', Item_textSchema);
