var test = require('tape');

var nonEmptyStream = require('./');
var through2 = require('through2');

test('in default mode', function (t) {
  t.test('acts as passthrough stream', function (st) {
    st.plan(1);

    var source = through2();
    var nonEmpty = nonEmptyStream();

    source
      .pipe(nonEmpty)
      .pipe(collectChunks(function (chunks) {
        st.deepEqual(chunks, ['a', 'b']);
      }));

    source.write('a');
    source.write('b');
    source.end();
  });

  t.test('emits error when ended with no upstream data', function (st) {
    st.plan(1);

    var source = through2();
    var nonEmpty = nonEmptyStream();

    source
      .pipe(nonEmpty)
      .on('error', function (error) {
        st.equal(error.message, 'No data from upstream');
      });

    source.end();
  });
});

test('in object mode', function (t) {
  t.test('acts as passthrough stream', function (st) {
    st.plan(1);

    var source = through2.obj();
    var nonEmpty = nonEmptyStream.obj();

    source
      .pipe(nonEmpty)
      .pipe(collectChunks(function (chunks) {
        st.deepEqual(chunks, [{name: 'jill'}, {name: 'bob'}]);
      }, true));

    source.write({name: 'jill'});
    source.write({name: 'bob'});
    source.end();
  });

  t.test('emits error when ended with no upstream data', function (st) {
    st.plan(1);

    var source = through2.obj();
    var nonEmpty = nonEmptyStream.obj();

    source
      .pipe(nonEmpty)
      .on('error', function (error) {
        st.equal(error.message, 'No data from upstream');
      });

    source.end();
  });
});


// returns stream that calls fn wth array of chunks when stream is ending
function collectChunks(fn, objectMode) {
  var chunks = [];
  var options = {
    objectMode: objectMode || false
  };

  return through2(options, function (chunk, encoding, cb) {
    chunks.push(objectMode ? chunk : chunk.toString());
    cb(null, chunk);
  }, function (cb) {
    fn(chunks);
    cb();
  });
}
