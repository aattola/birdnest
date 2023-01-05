import { FastifyPluginAsync } from 'fastify'
import { getDrones, getViolatingDrones } from '../processors/drones'

const routes: FastifyPluginAsync = async (server) => {
  server.get('/', async function () {
    const { report } = await getDrones()

    const violating = getViolatingDrones(report.capture.drone)
    return { violating }
  })

  setInterval(async () => {
    const { report } = await getDrones()
    const violating = getViolatingDrones(report.capture.drone)
    server.io.emit('violating', violating)
  }, 1000)
}
export default routes
