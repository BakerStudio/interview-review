const express = require('express');
const app = express();
const morgan = require('morgan');
app.use(morgan('common'))
app.use(express.static('public'));

// this function starts our server and returns a Promise.
// In our test code, we need a way of asynchronously starting
// our server, since we'll be dealing with promises there.
function runServer() {
    const port = process.env.PORT || 8080
    return new Promise((resolve, reject) => {
        server = app.listen(port, () => {
            console.log(`App is listening on port ${port}`)
            resolve(server)
                }).on('error', err => {
                reject(err)
            })
    })
}

// like `runServer`, this function also needs to return a promise.
// `server.close` does not return a promise on its own, so we manually
// create one.
function closeServer() {
  return new Promise((resolve, reject) => {
    console.log('Closing server')
    server.close(err => {
      if (err) {
        reject(err)
        // so we don't also call `resolve()`
        return
      }
      resolve()
    })
  })
}

// if server.js is called directly (aka, with `node server.js`), this block
// runs. but we also export the runServer command so other code (for instance, test code) can start the server as needed.
if (require.main === module) {
    runServer().catch(err => console.error(err))
}

module.exports = {
    app,
    runServer,
    closeServer
}
