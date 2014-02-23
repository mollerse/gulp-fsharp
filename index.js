var through = require('through2');
var gutil = require('gulp-util');
var fsharpi = require('fsharp');
var split = require('event-stream').split;

module.exports = function (opts) {
  'use strict';

  opts = opts || {};

  function fsharp(file, enc, callback) {
    var _this = this;

    // Do nothing if no contents
    if (file.isNull()) {
      _this.push(file);
      return callback();
    }

    opts.path = file.path;
    var result = fsharpi(opts);
    result.pipe(split())
      .on('data', function (buf) {
        if (!buf) { return; }
        gutil.log(
          '[' + gutil.colors.green('F# stdout') + ']',
          gutil.colors.magenta(file.relative),
          ':',
          buf.toString()
        );
      });
    result.on('error', function (err) {
      return _this.emit('error', new gutil.PluginError('gulp-fsharp', err));
    });

    _this.push(file);
    return callback();
  }

  return through.obj(fsharp);
};
