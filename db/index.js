const mongoose = require('mongoose');
mongoose.Promise = global.Promise;


module.exports = (URI) => {
    // 连接mongodb数据库
    const db = mongoose.connect(URI).connection;

    // 注册 mongoose models
    require('./models/author');
    require('./models/post');
    require('./models/tag');
    // 当数据库连接上返回一个promise对象
    return new Promise(function(resolve, reject) {
      db.on('connected', () => !console.log("MongoDB connected!"));
      db.on('open', resolve); 
      db.on('error', reject);
    });
};
