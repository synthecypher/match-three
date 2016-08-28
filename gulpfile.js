/* jshint node: true */
'use strict';
const gulp               = require('gulp');
const gutil              = require('gulp-util');
const WebpackDevServer   = require('webpack-dev-server');
const webpack            = require('webpack');
const ghPages            = require('gulp-gh-pages');
const CleanWebpackPlugin = require('clean-webpack-plugin');

function build(config, callback) {
  config.plugins = [...config.plugins,
    new CleanWebpackPlugin([config.output.path])
  ];
  webpack(config, (err, stats) => {
    if (err) throw new gutil.PluginError("webpack", err);
    stats.toString(config.devServer.stats).split('\n').map((line) => {
      gutil.log(gutil.colors.blue("[webpack]"), line);
    });
    callback();
  });
}

gulp.task('build:dev', (callback) => {
  let config = require('./webpack.config');
  config.devtool = 'source-map';
  return build(config, callback);
});

gulp.task('build:production', (callback) => {
  let config = require('./webpack.config');
  config.plugins = [...config.plugins,
    new webpack.DefinePlugin({
      "process.env": {
        "NODE_ENV": JSON.stringify("production")
      }
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
  ];
  config.output = JSON.parse(JSON.stringify(config.output).replace(/.js/g, `.${Date.now()}.min.js`));
  return build(config, callback);
});

gulp.task('deploy', ['build:production'], () => {
  return gulp.src('./dist/**/*')
    .pipe(ghPages());
});

gulp.task('watch', (callback) => {
  let config = require('./webpack.config');
  config.devtool = 'source-map';
  config.entry.app.unshift(`webpack-dev-server/client?${config.devServer.host}:${config.devServer.port}/`);
  new WebpackDevServer(new webpack(config), config.devServer)
    .listen(config.devServer.port, config.devServer.host, (err) => {
      if (err) throw new gutil.PluginError('webpack-dev-server', err);
      gutil.log(gutil.colors.cyan(`http://${config.devServer.host}:${config.devServer.port}`));
    });
});
