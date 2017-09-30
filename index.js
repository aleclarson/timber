
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
    console.log('[debug] ' + message)
  },
}

exports.set = function(methods) {
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

exports.create = function(maxLevel) {
  function log(message) {
    log.info(message)
  }

  if (maxLevel === null) {
    for (var key in levels) {
      log[key] = Function.prototype
    }
  } else {
    maxLevel = levels[maxLevel || defaultLevel]
    for (var key in levels) {
      if (levels[key] <= maxLevel) {
        log[key] = loggers[key]
      } else {
        log[key] = Function.prototype
      }
    }
  }

  return log
}
