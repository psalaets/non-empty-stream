var through2 = require('through2');

module.exports = nonEmptyStream;

function nonEmptyStream() {
  var count = 0;

  return through2(function transform(chunk, encoding, cb) {
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
