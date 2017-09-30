
var defaultLevel = process.env.NODE_ENV === 'production' ? 'error' : 'debug'
var levels = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
}

var loggers = {
  error: console.error,
  warn: function(message) {
    console.log('[warn] ' + message)
  },
  info: console.log,
  debug: function(message) {
    console.log('[debug] ' + format.call(this, message))
  },
}

function format(value) {
  if (typeof value === 'string') {
    return value
  }
  var string = this.format(value)
  if (~string.indexOf('\n')) {
    return '\n  ' + string.split('\n').join('\n  ')
  }
  return string
}

var timber = function(message) {
  loggers.info(message)
}

Object.keys(levels).forEach(function(key) {
  timber[key] = function() {
    loggers[key].call(this, arguments[0])
  }
})

timber.format = JSON.stringify

timber.set = function(methods) {
  if (typeof methods === 'function') {
    var master = methods
    return Object.keys(levels).forEach(function(key) {
      loggers[key] = master.bind(null, key)
    })
  }
  for (var key in methods) {
    if (levels.hasOwnProperty(key)) {
      loggers[key] = methods[key]
    } else {
      throw Error('Invalid log level: ' + key)
    }
  }
}

timber.create = function(maxLevel) {
  function log(message) {
    log.info(message)
  }

  if (maxLevel === null) {
    log.level = null
    for (var key in levels) {
      log[key] = Function.prototype
    }
  } else {
    log.level = maxLevel || defaultLevel
    maxLevel = levels[log.level]
    for (var key in levels) {
      if (levels[key] <= maxLevel) {
        log[key] = loggers[key]
      } else {
        log[key] = Function.prototype
      }
    }
  }

  log.format = timber.format
  return log
}

module.exports = timber
