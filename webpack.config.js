const autoprefixer       = require('autoprefixer')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const HtmlWebpackPlugin  = require('html-webpack-plugin')
const Package            = require('./package')
const path               = require('path')
const process            = require('process')
const UglifyJSPlugin     = require('uglifyjs-webpack-plugin')
const webpack            = require('webpack')

let config = {}

config.context = path.join(__dirname, 'src')

config.entry = {
  app: './index.js'
}

config.output = {
  path: path.join(__dirname, 'dist'),
  filename: 'bundle.js',
  sourceMapFilename: 'bundle.js.map'
}

config.resolve = {
  alias: {
    assets: path.resolve('./src/assets')
  }
}

config.externals = {
  document: 'document',
  window: 'window',
  promise: 'Promise',
  image: 'Image'
}

config.module = {
  rules: [{
    test: /\.js$/,
    include: [
      path.resolve(__dirname, 'src')
    ],
    loader: 'babel-loader',
    query: {
      compact: true,
      presets: [
        ['es2015', {modules: false}]
      ]
    }
  }, {
    test: /\.png$/,
    use: 'file-loader'
  }, {
    test: /\.scss$/,
    loaders: ['style', 'css', 'postcss', 'sass']
  }, {
    test: /\.less$/,
    loaders: ['style', 'css', 'less']
  }, {
    test: /\.woff$/,
    loader: "url-loader?limit=10000&mimetype=application/font-woff&name=[path][name].[ext]"
  }, {
    test: /\.woff2$/,
    loader: "url-loader?limit=10000&mimetype=application/font-woff2&name=[path][name].[ext]"
  }, {
    test: /\.(eot|ttf)$/,
    loader: "file-loader"
  }, {
    test: /\.(jpe?g|png|gif|svg)$/i,
    loaders: [
      'file?hash=sha512&digest=hex&name=[hash].[ext]',
      'image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false'
    ]
  }, {
    test: /\.modernizrrc$/,
    loader: "modernizr"
  }, {
    test: /manifest.json$/,
    loader: 'file-loader?name=manifest.json!web-app-manifest-loader'
  }, {
    test: /\.json$/,
    loader: "json-loader"
  }]
}

config.devtool = 'source-map'

config.devServer = {
  contentBase: './dist',
  host: '0.0.0.0',
  port: process.env.PORT || 443,
  stats: {
    colors: true,
    chunks: false
  }
}

config.plugins = [
  new HtmlWebpackPlugin({
    title: Package.name.split(' ').map(word => word.charAt(0) + word.slice(1)).join(' '),
    template: './index.ejs'
  }),
  new CleanWebpackPlugin([
    'dist'
  ])
]

if ('NODE_ENV' in process.env) {
  config.plugins.push(new UglifyJSPlugin())
}

module.exports = config
