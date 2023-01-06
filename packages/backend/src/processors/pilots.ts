import axios from 'axios'

import NodeCache from 'node-cache'
import { Pilot, PilotResponse } from '../types/pilots'
import { DroneViolation } from '../types/drones'

// 12 hour cache
const cache = new NodeCache({ stdTTL: 60 * 60 * 12 })

// gets pilot and caches it for 12 hours
export async function getPilot(serialNumber: string): Promise<Pilot> {
  const pilot = cache.get<Pilot>(serialNumber)
  if (pilot) return pilot

  const resp = await axios.get<PilotResponse>(
    `https://assignments.reaktor.com/birdnest/pilots/${serialNumber}`
  )
  if (resp.status !== 200) throw new Error(resp.statusText)

  console.log('Pilot', resp.headers['x-ratelimit-remaining'])

  cache.set(serialNumber, resp.data)
  return resp.data
}

export async function getPilotsForViolations(
  violations: DroneViolation[]
): Promise<DroneViolation[]> {
  const pilots = await Promise.all(
    violations.map(async (violation) => {
      const pilot = await getPilot(violation.serialNumber)
      return { ...violation, pilot, timestamp: Date.now() }
    })
  )

  return pilots
}
