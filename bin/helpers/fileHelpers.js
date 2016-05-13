/**
 * @file fileHelpers
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project Pomegranate
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

'use strict';
var fs = require('fs-extra');
var path = require('path');
var mkdirp = require('mkdirp')
/**
 *
 * @module fileHelpers
 */

exports.isEmpty = function(path, cb) {
  fs.readdir(path, function(err, files) {
    if(err && 'ENOENT' != err.code) throw err;
    cb(!files || !files.length);
  });
}

exports.isDirectory = function(path, cb) {
  fs.stat(path, function(err, stats) {
    if(err && 'ENOENT' != err.code) throw err;
    if(err) {
      return cb(false)
    }
    cb(stats.isDirectory())
  })
}

exports.isFile = function(path, cb) {
  fs.stat(path, function(err, stats) {
    if(err && 'ENOENT' != err.code) throw err;
    if(err) {
      return cb(false)
    }
    cb(stats.isFile())
  })
}

exports.mkdir = function(dir, cb) {
  mkdirp(dir, '0755', function(err) {
    if(err) throw err;
    console.log('Creating directory: ./' + path.relative(process.cwd(), dir))
    cb && cb()
  })
}

exports.write = function(f, message, cb) {
  message = message || 'Creating';
  fs.writeFile(f.path, f.file, function() {
    console.log(message + ' file: ./' + path.relative(process.cwd(), f.path));
    cb && cb()
  });
}