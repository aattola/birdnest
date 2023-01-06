import { FastifyPluginAsync } from 'fastify'
import { getClosestViolation, getDrones, getViolatingDrones } from '../processors/drones'
import { getPilotsForViolations } from '../processors/pilots'
import { Drone } from '../types/drones'

function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

let timeout = 2000

async function getViolations(drones: Drone[]) {
  const violating = getViolatingDrones(drones)
  let violations = await getPilotsForViolations(violating).catch((err) => {
    console.log('getPilotForViolations error')
    return null
  })

  if (!violations) {
    await sleep(500)
    violations = await getPilotsForViolations(violating).catch((err) => {
      console.log('getPilotForViolations error again something broke badly', err)
      return null
    })
  }

  if (!violations) {
    console.log('Returned empty array')
    return []
  }

  return getClosestViolation(violations)
}

const routes: FastifyPluginAsync = async (server) => {
  // server.get('/violating', async function () {
  //   const dronesReport = await getDrones()
  //
  //   const violations = await getViolations(dronesReport.report.capture.drone)
  //
  //   return { violations }
  // })

  console.log('Running')

  setInterval(async () => {
    const sockets = await server.io.fetchSockets()
    if (sockets.length <= 0) return

    console.log('interval?')

    const dronesReport = await getDrones().catch((err) => {
      console.error('Get drone virhe')
      // Exponential(like) backoff for getting drones
      timeout *= 2

      return null
    })

    if (!dronesReport) return
    dronesReport.report.deviceInformation.updateIntervalMs = timeout

    const violations = await getViolations(dronesReport.report.capture.drone)

    server.io.emit('violating', {
      drones: dronesReport.report.capture.drone,
      violations,
    })
  }, timeout)
}
export default routes
