/* eslint-disable no-console */
const path = require('path')
const express = require('express')
const consola = require('consola')
const mongoose = require('mongoose')
const { Nuxt, Builder } = require('nuxt')
const app = express()
const bodyParser = require('body-parser')
const config = require('../nuxt.config.js')
const stuffRoutes = require('./routes/stuff')
const userRoutes = require('./routes/user')

// Import and Set Nuxt.js options
config.dev = process.env.NODE_ENV !== 'production'

async function start() {
  // Init Nuxt.js
  const nuxt = new Nuxt(config)

  const { host, port } = nuxt.options.server

  await nuxt.ready()
  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  }

  mongoose
    .connect(
      'mongodb+srv://neni:88fAHEm9gteF69Lw@productsdevcluster-u3co4.mongodb.net/test?retryWrites=true&w=majority',
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: true
      }
    )
    .then(() => {
      console.log('connected to mongodb atlas')
    })
    .catch((error) => {
      console.log('unable to connect to mongodb atlas')
      console.error(error)
    })

  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
    )
    res.setHeader(
      'Access-Control-Allow-Methods',
      'GET, POST, PUT, DELETE, PATCH, OPTIONS'
    )
    next()
  })

  app.use(bodyParser.json())

  app.use('/images', express.static(path.join(__dirname, 'images')))

  app.use('/api/stuff', stuffRoutes)
  app.use('/api/auth', userRoutes)

  // Give nuxt middleware to express
  app.use(nuxt.render)

  // Listen the server
  app.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}
start()
