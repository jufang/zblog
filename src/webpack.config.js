require('babel-polyfill');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var path = require('path');

module.exports = {
  devtool: 'cheap-module-eval-source-map',
  context: __dirname,
  entry: {
    'cms': './cms/index.js',
    'client': './client/index.js'
  },
  output: {
    path: './public/js',
    filename: '[name]/bundle.js'
  },
  
  module: {
    loaders: [
        { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' },
        {test: /^((?!\.global).)*(css)$/, loader: ExtractTextPlugin.extract('style-loader','css-loader?modules&importLoaders=1&localIdentName=[local]___[hash:base64:5]')},
        {
          test: /\.global.(scss|css)$/,
          loader: ExtractTextPlugin.extract('style-loader', 'css-loader')
        },
        { test: /\.(jpg|png|gif)$/, loader: 'url-loader', exclude: /node_modules/ }
    ]
  },
  resolve: {
    root: path.resolve(__dirname),
    modulesDirectories: ['node_modules'],
    extensions: ['', '.js', '.jsx', '.css'],
    alias: {
      client:  path.resolve(__dirname,  'client'),
      clientActions: path.resolve(__dirname,  'client', 'actions'),
      clientComponents: path.resolve(__dirname,  'client', 'components'),
      
      cms: path.resolve(__dirname,  'cms'),
      cmsActions: path.resolve(__dirname,  'cms', 'actions'),
      cmsComponents: path.resolve(__dirname,  'cms', 'components'),
      cmsCss:  path.resolve(__dirname,  'cms', 'css'),
      
      shared: path.resolve(__dirname,  'shared'),
      sharedActions: path.resolve(__dirname,  'shared', 'actions'),
      sharedComponents: path.resolve(__dirname,  'shared', 'component'),
      sharedCss: path.resolve(__dirname,  'shared', 'css')
    }
  },
  plugins: [
    new ExtractTextPlugin('../css/[name]/bundle.css', { ignoreOrder: true } )
  ]
};
