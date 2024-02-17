const { ApolloServer } = require('@apollo/server')
const {
  ApolloServerPluginDrainHttpServer,
} = require('@apollo/server/plugin/drainHttpServer')
const { expressMiddleware } = require('@apollo/server/express4')
const { makeExecutableSchema } = require('@graphql-tools/schema')
const http = require('http')
const express = require('express')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const User = require('./models/user')
const { WebSocketServer } = require('ws')
const { useServer } = require('graphql-ws/lib/use/ws')
require('dotenv').config()
const resolvers = require('./resolvers.cjs')
const typeDefs = require('./schema.cjs')
const emailRouter = require('./mailRoutes.js')

const config = require('./utils/config')

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    // eslint-disable-next-line no-console
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.log('error connecting to MongoDB: ', error.message)
  })

const start = async () => {
  const app = express()
  const httpServer = http.createServer(app)

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/',
  })

  const schema = makeExecutableSchema({ typeDefs, resolvers })
  const serverCleanup = useServer({ schema }, wsServer)

  const server = new ApolloServer({
    schema,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose()
            },
          }
        },
      },
    ],
  })
  await server.start()
  app.get('/health', (_req, res) => {
    res.send('ok')
  })
  app.use(
    '/gql',
    cors(),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        const auth = req ? req.headers.authorization : null
        if (auth && auth.startsWith('Bearer ')) {
          const decodedToken = jwt.verify(auth.substring(7), process.env.JWT_SECRET)
          const currentUser = await User.findById(decodedToken.id)
          return { currentUser }
        }
      },
    })
  )
  app.use('/email', emailRouter)
  app.use('/', express.static(config.BUILD))
  app.get('*', (_req, res) => {
    res.sendFile(__dirname + `/${config.BUILD}/index.html`)
  })
  const PORT = process.env.PORT || 4000
  httpServer.listen(PORT, () =>
    // eslint-disable-next-line no-console
    console.log(`Server is now running on port ${PORT}`)
  )
}
start()
