// Generated by CoffeeScript 1.7.1
(function() {
  var $;

  $ = jQuery;

  $.fn.extend({
    typetype: function(text, callback, keypress) {
      var charDelay, deferreds, elem, errorProb, interval, recoverMistakeInterval;
      charDelay = 100;
      errorProb = 0.05;
      interval = function(index) {
        var lastchar, nextchar;
        lastchar = text[index - 1];
        nextchar = text[index];
        return Math.random() * charDelay * (function() {
          switch (lastchar) {
            case nextchar:
              return 1.6;
            case '.':
            case '!':
              return 16;
            case ',':
            case ';':
              return 8;
            case ' ':
              return 3;
            case lastchar === '\n' && nextchar !== '\n':
              return 10;
            default:
              return 2;
          }
        })();
      };
      recoverMistakeInterval = 2 * charDelay;
      deferreds = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = this.length; _i < _len; _i++) {
          elem = this[_i];
          _results.push((function(elem) {
            var appendString, backspace, continueTo, deferred, delChar, makeMistake, tag, typeChar;
            tag = elem.tagName.toLowerCase();
            if (tag === 'input' || tag === 'textarea') {
              typeChar = function(c) {
                return elem.value += c;
              };
              delChar = function() {
                return elem.value = elem.value.substr(0, elem.value.length - 1);
              };
            } else {
              typeChar = function(c) {
                return elem.innerHTML += c;
              };
              backspace = function() {
                return elem.innerHTML = elem.innerHTML.substr(0, elem.innerHTML.length - 1);
              };
            }
            makeMistake = function(index) {
              return appendString("XYZ", function() {
                return backspace(3, function() {
                  return continueTo(index + 1);
                });
              });
            };
            appendString = function(toInsert, continuation) {
              if (toInsert.length > 0) {
                typeChar(toInsert[0]);
                return setTimeout(function() {
                  return appendString(toInsert.substr(1), continuation);
                }, charDelay);
              } else {
                return continuation();
              }
            };
            backspace = function(num, continuation) {
              if (num > 0) {
                delChar();
                return setTimeout((function() {
                  return backspace(num - 1, continuation);
                }), charDelay);
              } else {
                return continuation();
              }
            };
            deferred = $.Deferred();
            continueTo = function(index) {
              typeChar(text[index - 1]);
              if (keypress != null) {
                keypress.call(elem, index);
              }
              if (index < text.length) {
                if (Math.random() < errorProb) {
                  setTimeout((function() {
                    return makeMistake(index);
                  }), interval(index));
                } else {
                  setTimeout((function() {
                    return continueTo(index + 1);
                  }), interval(index));
                }
              } else {
                deferred.resolve();
              }
            };
            continueTo(1);
            return deferred.done(function() {
              return callback != null ? callback.call(elem) : void 0;
            });
          })(elem));
        }
        return _results;
      }).call(this);
      return $.when.apply($, deferreds);
    }
  });

}).call(this);
