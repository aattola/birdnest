import server from './server'

process.on('unhandledRejection', (err) => {
  console.error(err)
  process.exit(1)
})

const port = +server.config.API_PORT
const host = server.config.API_HOST
await server.listen({ host, port })
