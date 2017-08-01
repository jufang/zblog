const express = require('express'),
      path = require('path'), 
      logger = require('morgan'),
      cookieParser = require('cookie-parser'),
      bodyParser = require('body-parser'),
      compression = require('compression'),
      favicon = require('serve-favicon'),
      cors = require('cors'),

      session = require('express-session'),
      MongoStore = require('connect-mongo')(session),
      mongoose = require('mongoose'),
      // 加载.env文件
      dotenv = require('dotenv'),

      // Webpack imports
      webpack = require('webpack'),
      config = require('../webpack.config.dev'),
      webpackDevMiddleware = require('webpack-dev-middleware'),
      webpackHotMiddleware = require('webpack-hot-middleware');

//加载.env的配置文件
dotenv.config();

const app = express(),
      serverPort = process.env.PORT || process.env.DEV_PORT || 3000; // 开发环境取.env的dev_port端口


// 在dev环境  运行webpack.config.dev.js配置环境 ，运行React-hot-loader
if (process.env.NODE_ENV !== 'production') {
  const compiler = webpack(config);
  app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: config.output.publicPath })); // noInfo flag prevents webpacks (verbose) default console logs and only logs errors and warnings
  app.use(webpackHotMiddleware(compiler));
}

// 请求解析的中间件
app.use(bodyParser.json({limit: '5mb'})); //解析 Content-Type:application/json
app.use(bodyParser.urlencoded({ extended: false })); // 解析 application/x-www-form-urlencoded
app.use(cookieParser()); 

// 可以跨域请求
app.use(cors());

// gzip 压缩
app.use(compression());

// 设置app的root路径
const root = path.resolve(__dirname, '..');  

// 网页tab的logo
app.use(favicon(path.join(root, 'public', 'favicon.ico')));

// 设置静态访问路径
app.use(express.static(path.join(root, 'public')));

// 控制台日志输出
if(process.env.NODE_ENV !== 'production')
  app.use(logger('dev'));

const startDbPromise = require(path.join(root,'db'))(process.env.DATABASE_URI);

startDbPromise.then(() => {
  app.use(session({
    secret: process.env.SESSION_SECRET,
    store: new MongoStore({
      mongooseConnection: mongoose.connection
    }),
    cookie: {
      maxAge: new Date(Date.now() + 1000 * 60 * 60 * 24) 
    },
    resave: true,
    saveUninitialized: true
  }))
  app.use('/cms/api/v1/authors', require('./cms/author'));
  app.use('/cms/api/v1/posts', require('./cms/post'));

  app.get('/cms/*', (req,res,next) => {
    res.sendFile('/index.html', {root: path.join(root, 'public')})
  });
  app.get('/*', (req,res,next) => {
    res.sendFile('/client.html', {root: path.join(root, 'public')})
  });
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
  
    // 起服务
  app.listen(serverPort, (err, res) => err ?
    handleError(err) :
    console.log(`app served on port ${serverPort}`));
}).catch(err => console.log(err));

function handleError(err){
  switch (err.code){
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
