var ExtractTextPlugin = require('extract-text-webpack-plugin');
var DEV = process.env.DEV;
var LIVELOAD = process.env.LIVELOAD;


var config = {
  context: __dirname,
  entry: {
    app: [
      'babel-polyfill',
      './src/app.js'
    ]
  },
  output: {
    path: 'build',
    publicPath: 'build',
    filename: '[name].js',
    chunkFilename: '[chunkhash].js'
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          presets: ['react', 'es2015', 'stage-0']
        }
      }, {
        test: /\.less$/,
        loader: ExtractTextPlugin.extract('style', 'css!less')
      }
    ],
  },
  plugins: [
    new ExtractTextPlugin('[name].bundle.css', {
      allChunks: true
    })
  ]
};


if (LIVELOAD) {
  config.entry.app.push('webpack-dev-server/client?/');
}

if (!DEV) {
  // uglify
  // css min
}

module.exports = config;
