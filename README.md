
# timber v1.2.0

```js
var timber = require('timber')

var log = timber.create('debug')

log('some info')
log.info('some info')
log.debug('some debug info')
log.warn('some warning')
log.error('some error')

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

// Enable one or more plugins
timber.enable('errors')
timber.enable({
  tags: {
    debug: '[debug] ',
    warn: '[warn] ',
  },
  indent: 1,
})
```

### Built-in plugins
- `errors` Pretty prints an error object passed to `log.error`, pass a function for custom formatting
- `tags` Prepends a string to each line of any message with the appropriate log level, must pass an object
- `ln` Adds the `timber.ln(count)` method for reliable line spacing
- `format` Adds the `timber.format(value)` method for pretty printing any value type, pass a function for custom formatting (defaults to JSON.stringify)
- `indent` Adds the `timber.depth` property for line indentation

You can add custom plugins by importing `timber/plugins` and adding your own function that returns a `function(level, message) {}` which returns a modified message or undefined.
