var test = require('tape');

var nonEmptyStream = require('./');
var through2 = require('through2');

test('acts as passthrough stream', function (t) {
  t.plan(1);

  var source = through2();
  var nonEmpty = nonEmptyStream();

  source
    .pipe(nonEmpty)
    .pipe(collectChunks(function (chunks) {
      t.deepEqual(chunks, ['a', 'b']);
    }));

  source.write('a');
  source.write('b');
  source.end();
});

test('emits error when ended with no upstream data', function (t) {
  t.plan(1);

  var source = through2();
  var nonEmpty = nonEmptyStream();

  source
    .pipe(nonEmpty)
    .on('error', function (error) {
      t.equal(error.message, 'No data from upstream');
    });

  source.end();
});

// returns stream that calls fn wth array of chunks when stream is ending
function collectChunks(fn) {
  var chunks = [];
  return through2(function (chunk, encoding, cb) {
    chunks.push(chunk.toString());
    cb(null, chunk);
  }, function (cb) {
    fn(chunks);
    cb();
  });
}
