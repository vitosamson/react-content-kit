var webpack = require('webpack');
var config = require('./webpack.config.js');

config.devtool = 'cheap-module-eval-source-map';
config.entry.app.push('webpack/hot/dev-server');
config.entry.app.push('webpack-dev-server/client?http://localhost:8080');
config.module.loaders[0].loaders.unshift('react-hot');
// config.plugins.unshift(new webpack.HotModuleReplacementPlugin());

module.exports = config;
