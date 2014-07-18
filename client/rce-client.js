var rce = (function () {

  var halted = false;
  var server;

  // http://perfectionkills.com/global-eval-what-are-the-options/#windowexecscript
  var globalEval = (function() {
    var isIndirectEvalGlobal = (function(original, Object) {
      try {
        // Does `Object` resolve to a local variable, or to a global, built-in `Object`,
        // reference to which we passed as a first argument?
        return (1,eval)('Object') === original;
      }
      catch(err) {
        // if indirect eval errors out (as allowed per ES3), then just bail out with `false`
        return false;
      }
    })(Object, 123);

    if (isIndirectEvalGlobal) {

      // if indirect eval executes code globally, use it
      return function(expression) {
        return (1,eval)(expression);
      };
    }
    else if (typeof window.execScript !== 'undefined') {

      // if `window.execScript exists`, use it
      return function(expression) {
        return window.execScript(expression);
      };
    }

    // otherwise, globalEval is `undefined` since nothing is returned
  })();

  function checkForCommand () {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', server, true);
    xhr.onreadystatechange = function () {
      var status = xhr.status;
      var result;
      if (xhr.readyState === 4) {
        if (status === 200) {
          var command = JSON.parse(xhr.responseText);
          console.log('RCE received', command.text);
          try {
            result = globalEval(command.text);
          } catch (ex) {
            result = ex.message;
          }

          postResult(command, result);
        } else if (!halted) {
          setTimeout(checkForCommand, 2000);
        }
      }
    };

    xhr.send();
  }

  function postResult (command, result) {
    console.log('RCE posting result', command.text, '=', result);
    var xhr = new XMLHttpRequest();
    xhr.open('POST', server, true);
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        checkForCommand();
      }
    };
    xhr.send(JSON.stringify({
      command: command,
      result: result
    }));
  }

  return {
    start: function (commandServer) {
      server = commandServer;
      console.log('RCE started');
      halted = false;
      checkForCommand();
    },
    stop: function () {
      halted = true;
    }
  };

}());

rce.start('http://127.0.0.1:8000/');