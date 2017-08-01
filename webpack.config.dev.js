const webpack = require('webpack');
const path = require('path')
const  ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  devtool: 'cheap-module-eval-source-map',

  entry: {
    'cms': './cms/index.js',
    'client': './client/index.js'
  },
  // [
  //   'webpack-hot-middleware/client',
  //   './cms/index.js',
  // ],

  output: {
    path: __dirname + '/public/js/',
    filename: '[name]/index.js',
    publicPath: '/dist/',
  },
  resolve: {
    root: path.resolve(__dirname),
    modulesDirectories: ['node_modules'],
    extensions: ['', '.js', '.jsx', '.css', '.scss'],
    alias: {
      client:  path.resolve(__dirname, 'client'),
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
  module: {
    loaders: [
      {
        test: /\.jsx*$/,
        exclude: [/node_modules/, /.+\.config.js/],
        loader: 'babel',
        query: {
          presets: ['react-hmre'],
        },
      },
      {test: /\.css$/, loader: ExtractTextPlugin.extract('style-loader','css-loader?modules&importLoaders=1&localIdentName=[local]___[hash:base64:5]')},
      { test: /\.(jpg|png|gif)$/, loader: 'url-loader', exclude: /node_modules/ }
    ],
  },

  plugins: [
    new ExtractTextPlugin('./css/[name]/bundle.css', { ignoreOrder: true } ),
    new webpack.ProvidePlugin({
      'fetch': 'imports?this=>global!exports?global.fetch!whatwg-fetch'
    }),
    new webpack.HotModuleReplacementPlugin()
  ],
};
