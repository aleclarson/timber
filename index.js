
var plugins = require('./plugins')
var enabled = []

var defaultLevel = process.env.NODE_ENV === 'production' ? 'error' : 'debug'
var levels = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
}

var loggers = {
  error: console.error,
  warn: console.warn,
  info: console.log,
  debug: console.log,
}

function timber(message) {
  timber.info(message)
}

(function() {
  var plugins = wrapPlugins(enabled)
  Object.keys(levels).forEach(function(level) {
    timber[level] = function(message) {
      loggers[level].call(this, plugins.call(this, level, message) || message)
    }
  })
})()

timber.set = function(methods) {
  if (typeof methods === 'function') {
    var router = methods
    return Object.keys(levels).forEach(function(level) {
      loggers[level] = function(message) {
        router.call(this, level, message)
      }
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
  var plugins = enabled.length ? wrapPlugins(enabled.slice()) : Function.prototype

  function router(level, message) {
    loggers[level].call(this, plugins.apply(this, arguments) || message)
  }

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
        log[key] = router.bind(log, key)
      } else {
        log[key] = Function.prototype
      }
    }
  }

  return log
}

timber.enable = function(id, value) {
  if (typeof id !== 'string') {
    var values = id
    for (id in values) {
      enablePlugin(id, values[id])
    }
  } else {
    enablePlugin(id, value)
  }
}

function enablePlugin(id, value) {
  var plugin = plugins[id]
  if (!plugin) {
    throw Error('Unknown timber plugin: ' + id)
  }
  enabled.push(plugin.call(timber, value))
}

function wrapPlugins(plugins) {
  return function(level, message) {
    for (var i = 0; i < plugins.length; i++) {
      var result = plugins[i].call(this, level, message)
      if (result) message = result
    }
    return message
  }
}

module.exports = timber
