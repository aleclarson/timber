
// Support passing error objects to the logger
exports.errors = function(formatter) {
  if (!formatter) {
    formatter = function(error) {
      return error.stack
    }
  }
  return function(level, message) {
    if (level === 'error' && typeof message !== 'string') {
      return formatter(message)
    }
  }
}

// Tags a message with a leading string
exports.tags = function(tags) {
  return function(level, message) {
    var tag = tags[level]
    if (tag) return tag + message
  }
}

// Adds the `ln` function for reliable line spacing
exports.ln = function() {
  var emptyCount = 0
  this.ln = function(count) {
    if (!count) {
      count = 1
    }
    count -= emptyCount
    if (count > 0) {
      while (count-- > 0) {
        this.info('')
      }
    }
  }
  var spacesRE = / +$/g
  return function(level, message) {
    message = message.replace(spacesRE, '')
    if (!message) {
      emptyCount += 1
    } else if (message.slice(-1) === '\n') {
      emptyCount = 1
    } else {
      emptyCount = 0
    }
  }
}

// Adds the `format` function for formatting values
exports.format = function(formatter) {
  var timber = this
  timber.format = formatter || JSON.stringify
  function format(value, formatter) {
    if (typeof value === 'string') {
      return value
    }
    var string = formatter(value)
    if (~string.indexOf('\n')) {
      return '\n  ' + string.split('\n').join('\n  ')
    }
    return string
  }
  return function(level, message) {
    if (level === 'debug') {
      return format(message, this.format || timber.format)
    }
  }
}

// Adds a `depth` property for controlling line indentation
exports.indent = function(depth) {
  var timber = this
  timber.depth = depth

  var linesRE = /[^\n]+\n?/g
  function indent(depth, message) {
    var array = new Array(depth)
    if (~message.lastIndexOf('\n')) {
      array = array.concat(message.match(linesRE))
    } else {
      array.push(message)
    }
    return array.join('  ')
  }

  return function(level, message) {
    var depth = timber.depth || this.depth || 0
    if (depth > 0) return indent(depth, message)
  }
}
