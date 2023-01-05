import NodeCache from 'node-cache'
import { FastifyPluginAsync } from 'fastify'
import { getDrones, getViolatingDrones } from '../processors/drones'
import { getPilotsForViolations } from '../processors/pilots'
import { Drone, DroneViolation } from '../types/drones'

const cache = new NodeCache({ stdTTL: 60 * 10 })

async function getViolations(drones: Drone[]) {
  const violating = getViolatingDrones(drones)
  const violations = await getPilotsForViolations(violating)

  return violations
}

const routes: FastifyPluginAsync = async (server) => {
  server.get('/violating', async function () {
    const dronesReport = await getDrones()

    const violations = await getViolations(dronesReport.report.capture.drone)

    return { violations }
  })

  console.log('Running')

  setInterval(async () => {
    const sockets = await server.io.fetchSockets()
    if (sockets.length <= 0) return

    const dronesReport = await getDrones()
    const violations = await getViolations(dronesReport.report.capture.drone)

    violations.forEach((violation) => {
      const cachedViolation = cache.get<DroneViolation>(violation.serialNumber)
      if (cachedViolation) {
        // check if curr violation is closer
        if (cachedViolation.distance > violation.distance) {
          // new violation is closer so set it in cache
          cache.set(violation.serialNumber, violation)
        }

        return
      }

      // if not already cached set to cache
      cache.set(violation.serialNumber, violation)
    })

    const { data } = cache
    const keys = Object.keys(data)

    const violationsToSend = keys.map((key) => data[key].v)

    server.io.emit('violating', {
      drones: dronesReport.report.capture.drone,
      violations: violationsToSend,
    })
  }, 1000)
}
export default routes
