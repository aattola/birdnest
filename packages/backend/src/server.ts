import fastify from 'fastify'
import ws from 'fastify-socket.io'
import cors from '@fastify/cors'
import config from './plugins/config'
import routes from './routes'

const server = fastify({
  ajv: {
    customOptions: {
      removeAdditional: 'all',
      coerceTypes: true,
      useDefaults: true,
    },
  },
  logger: {
    level: process.env.LOG_LEVEL,
  },
})

const corsOptions = {
  origin: [
    'http://localhost:5173',
    'https://monadikuikka-backend.jeffe.co/',
    'https://birdnest-production.up.railway.app/',
  ],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
}

await server.register(cors, corsOptions)
await server.register(config)
await server.register(routes)
await server.register(ws, {
  cors: corsOptions,
})
await server.ready()

export default server
