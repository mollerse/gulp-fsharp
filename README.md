# gulp-F#
[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][depstat-image]][depstat-url]

> F# Interactive plugin for [gulp](https://github.com/wearefractal/gulp)

## Usage

First, install `gulp-fsharp` as a development dependency:

```shell
npm install -D gulp-fsharp
```

Then, add it to your `gulpfile.js`:

```javascript
var fsharp = require("gulp-fsharp");

gulp.src("./src/*.fsx")
	.pipe(fsharp());
```

## API

### fsharp(options)

#### options.*
Options will be passed to [node-fsharp](https://github.com/mollerse/node-fsharp)

options.path will be set to the path of the file it gets from `gulp.src`.

## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)

[npm-url]: https://npmjs.org/package/gulp-fsharp
[npm-image]: https://badge.fury.io/js/gulp-fsharp.png

[travis-url]: http://travis-ci.org/mollerse/gulp-fsharp
[travis-image]: https://secure.travis-ci.org/mollerse/gulp-fsharp.png?branch=master

[depstat-url]: https://david-dm.org/mollerse/gulp-fsharp
[depstat-image]: https://david-dm.org/mollerse/gulp-fsharp.png?theme=shields.io
