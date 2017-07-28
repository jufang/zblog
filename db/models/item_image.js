var mongoose = require('mongoose');

var Item_imageSchema = new mongoose.Schema({
    image: { type:String,required: true},
    caption: String
});

mongoose.model('Item_image', Item_imageSchema);
