const path = require('path')

module.exports = function(app,root) {
  app.use('/cms/api/v1', require(path.join(root, 'server','cms')));


  //启动文件index.html
  app.get('/cms/*', (req,res,next) => res.sendFile('/index.html', {root: path.join(root, 'public')}));

  // 处理404错误
  app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  // 处理路由错误
  app.use((err, req, res, next) => {
    console.error(err); // 输出到控制台
    res.status(err.status || 500);
    res.send(err.message); // 输出到前端
  });
}
function handleError(err){
  switch (err.code) {
    case 'EACCES':
      console.error(`port ${serverPort} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`port ${serverPort} is already in use`);
      process.exit(1);
      break;
    default:
      console.log(err);
      process.exit(1);
  }
}