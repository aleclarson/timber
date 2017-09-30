
# timber v1.1.0

```js
var timber = require('timber')

var log = timber.create('debug')

log('some info')
log.info('some info')
log.debug('some debug info')
log.warn('some warning')
log.error(new Error('some error'))

// Only show errors
log = timber.create('error')

// Exclude info and debug logs
log = timber.create('warn')

// Exclude debug logs
log = timber.create('info')

// Only show errors in production, else show all logs
log = timber.create()

// Disable all logs
log = timber.create(null)

// Customize any or all methods
timber.set({
  error: function(error) {
    throw error
  }
})

// Bind all methods to a master function
timber.set(function(level, message) {
  console.log('[' + level '] ' + message)
})
```
