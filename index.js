var through2 = require('through2');
var xtend = require('xtend');

module.exports = nonEmptyStream;

nonEmptyStream.obj = objectMode;

function nonEmptyStream(options) {
  options = options || {};

  var count = 0;
  return through2(options, function transform(chunk, encoding, cb) {
    count += 1;
    cb(null, chunk);
  }, function flush(cb) {
    if (count > 0) {
      return cb();
    } else {
      return cb(new Error('No data from upstream'));
    }
  });
}

function objectMode(options) {
  var mergedOptions = xtend({}, options, {objectMode: true});
  return nonEmptyStream(mergedOptions);
}
