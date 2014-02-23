require('mocha');
var expect = require('chai').expect;
var sinon = require('sinon');
var stream = require('stream');
var gutil = require('gulp-util');
var es = require('event-stream');
var fs = require('fs');
var requireSubvert = require('require-subvert')(__dirname);

describe('gulp-fsharp', function () {
  'use strict';
  var fsharp, fsharpStub, duplex;

  beforeEach(function () {
    fsharpStub = sinon.stub();
    requireSubvert.subvert('fsharp', fsharpStub);
    fsharp = requireSubvert.require('../');
    duplex = new stream.PassThrough();
  });

  it('should ignore empty files', function (done) {
    var srcFile = new gutil.File({
      path: __dirname + '/fixtures/empty.fsx',
      contents: null
    });

    var s = fsharp();

    var n = 0;
    s.pipe(es.through(function (file) {
      expect(file.path).to.equal(srcFile.path);
      expect(file.contents).to.equal(null);
      expect(fsharpStub.callCount).to.equal(0);
      n++;
    }, function () {
      expect(n).to.equal(1);
      done();
    }));

    s.write(srcFile);
    s.end();
  });

  it('should call fsharp with path as option', function (done) {
    var srcFile = new gutil.File({
      path: __dirname + '/fixtures/empty.fsx',
      contents: fs.readFileSync(__dirname + '/fixtures/script.fsx')
    });

    var s = fsharp();
    var n = 0;

    fsharpStub.withArgs({path: srcFile.path}).returns(duplex);

    s.pipe(es.through(function (file) {
      expect(file.path).to.equal(srcFile.path);
      expect(fsharpStub.calledOnce).ok;
      n++;
    }, function () {
      expect(n).to.equal(1);
      done();
    }));

    s.write(srcFile);
    s.end();
  });

  it('should call fsharp with options', function (done) {
    var srcFile = new gutil.File({
      path: __dirname + '/fixtures/empty.fsx',
      contents: fs.readFileSync(__dirname + '/fixtures/script.fsx')
    });

    var s = fsharp({args: ['1', '2']});
    var n = 0;

    fsharpStub.withArgs({path: srcFile.path, args: ['1', '2']}).returns(duplex);

    s.pipe(es.through(function (file) {
      expect(file.path).to.equal(srcFile.path);
      expect(fsharpStub.calledOnce).ok;
      n++;
    }, function () {
      expect(n).to.equal(1);
      done();
    }));

    s.write(srcFile);
    s.end();
  });

  it('should re-emit errors', function (done) {
    var srcFile = new gutil.File({
      path: __dirname + '/fixtures/empty.fsx',
      contents: fs.readFileSync(__dirname + '/fixtures/script.fsx')
    });

    var s = fsharp();
    var n = 0;

    fsharpStub.withArgs({path: srcFile.path}).returns(duplex);

    s.pipe(es.through(function (file) {
      expect(file.path).to.equal(srcFile.path);
      expect(fsharpStub.calledOnce).ok;
      n++;
    }, function () {
      expect(n).to.equal(1);
    }));

    s.on('error', function (err) {
      expect(err).to.be.an.instanceof(gutil.PluginError);
      done();
    });

    s.write(srcFile);
    s.end();
    duplex.emit('error', 'msg');
  });

  it('should not log empty buffers', function (done) {
    var gutilMock = sinon.mock(gutil);
    var srcFile = new gutil.File({
      path: __dirname + '/fixtures/empty.fsx',
      contents: fs.readFileSync(__dirname + '/fixtures/script.fsx')
    });

    var s = fsharp();
    var n = 0;

    fsharpStub.withArgs({path: srcFile.path}).returns(duplex);
    gutilMock.expects('log').never();

    s.pipe(es.through(function (file) {
      expect(file.path).to.equal(srcFile.path);
      expect(fsharpStub.calledOnce).ok;
      n++;
    }, function () {
      expect(n).to.equal(1);
    }));

    duplex.on('end', function () {
      gutilMock.verify();
      gutilMock.restore();
      done();
    });

    s.write(srcFile);
    s.end();
    duplex.end();
  });

  it('should log non-empty buffers', function (done) {
    var gutilMock = sinon.mock(gutil);
    var srcFile = new gutil.File({
      path: __dirname + '/fixtures/empty.fsx',
      contents: fs.readFileSync(__dirname + '/fixtures/script.fsx')
    });

    var s = fsharp();
    var n = 0;

    fsharpStub.withArgs({path: srcFile.path}).returns(duplex);
    gutilMock.expects('log').twice();

    s.pipe(es.through(function (file) {
      expect(file.path).to.equal(srcFile.path);
      expect(fsharpStub.calledOnce).ok;
      n++;
    }, function () {
      expect(n).to.equal(1);
    }));

    duplex.on('end', function () {
      gutilMock.verify();
      gutilMock.restore();
      done();
    });

    s.write(srcFile);
    s.end();
    duplex.write('asdf\n');
    duplex.write('asdf\n');
    duplex.end();
  });
});