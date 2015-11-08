var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var path = require('path');

const scssPlugin = new ExtractTextPlugin('scss', 'app.css', {
  allChunks: true
});

module.exports = {
  entry: {
    app: ['./src/index.js']
  },
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'bundle.js',
    publicPath: '/build/'
  },
  module: {
    loaders: [{
      test: /\.js$/,
      loaders: ['babel'],
      include: [/src/, /node_modules\/mobiledoc-html-renderer/]
    }, {
      test: /\.scss$/,
      loader: scssPlugin.extract('style', 'css!sass')
    }]
  },
  resolve: {
    moduleDirectories: ['node_modules']
  },
  plugins: [
    scssPlugin,
    new webpack.ProvidePlugin({
      React: 'react'
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
  ]
}
