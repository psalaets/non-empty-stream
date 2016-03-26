# non-empty-stream

Passthrough stream that emits error if no data goes through it.

## Usage

```js
var nonEmptyStream = require('non-empty-stream');

source
  .pipe(nonEmptyStream())
  .on('error', function (error) {
    console.error(error);
  })
  .pipe(...);
```

## API

### nonEmptyStream(options)

Creates a passthrough stream that will emit an error if it is ended without any data passing through it.

`options` - Optional object containing options accepted by [through2](https://www.npmjs.com/package/through2);

### nonEmptyStream.obj(options)

Shortcut for `nonEmptyStream({objectMode: true})`.

## Install

`npm install non-empty-stream`

## license

MIT
