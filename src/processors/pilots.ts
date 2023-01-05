import axios from 'axios'

import NodeCache from 'node-cache'
import { Pilot, PilotResponse } from '../types/pilots'
import { DroneViolation } from '../types/drones'

// 5 Minute expiration check interval and max 5000 in cache
const cache = new NodeCache({ stdTTL: 60 * 5 })

// gets pilot and caches it for 5 minutes
export async function getPilot(serialNumber: string): Promise<Pilot> {
  const pilot = cache.get<Pilot>(serialNumber)
  if (pilot) return pilot

  const resp = await axios.get<PilotResponse>(
    `https://assignments.reaktor.com/birdnest/pilots/${serialNumber}`
  )
  if (resp.status !== 200) throw new Error('Failed to get pilot')

  cache.set(serialNumber, resp.data)
  return resp.data
}

export async function getPilotsForViolations(
  violations: DroneViolation[]
): Promise<DroneViolation[]> {
  const pilots = await Promise.all(
    violations.map(async (violation) => {
      const pilot = await getPilot(violation.serialNumber)
      return { ...violation, pilot }
    })
  )

  return pilots
}
