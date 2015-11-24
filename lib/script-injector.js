var trumpet = require('trumpet')
  , duplexer = require('duplexer2')
  , through = require('through2');

function scriptInjector (script) {
  var tr1 = trumpet()
    , needToAddScript = true;

  script = script ? '<script type=\"text/javascript\">\n;(' + script + ')()\n<\/script>\n'
                  : ';(' + "function () { console.log('You didn\'t provide a script to inject') }" + ')()';

  var headTag = tr1.createStream('head');

  headTag // Inject the new script after <head>
    .pipe(through(
      function (data, enc, cb) {
        if (needToAddScript) {
          this.push(script);
          needToAddScript = false;
        }
        this.push(data);
        cb();
      }))
    .pipe(headTag);

  return duplexer(tr1, tr1);
}

module.exports = scriptInjector;
