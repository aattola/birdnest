import { XMLParser } from 'fast-xml-parser'
import axios from 'axios'
import NodeCache from 'node-cache'
import { Drone, DronesReport, DroneViolation } from '../types/drones'
import { isLegal } from './checkLegal'

const parser = new XMLParser()
// 10 minute cache
const cache = new NodeCache({ stdTTL: 60 * 10 })

export async function getDrones(): Promise<DronesReport> {
  const resp = await axios.get('https://assignments.reaktor.com/birdnest/drones')
  if (resp.status !== 200) throw new Error('Failed to get drones')

  console.log(resp.headers['x-ratelimit-remaining'])

  return parser.parse(resp.data)
}

export function getViolatingDrones(drones: Drone[]): DroneViolation[] | [] {
  const violatingDrones: DroneViolation[] = []

  drones.forEach((drone) => {
    const droneLegal = isLegal(drone)

    if (!droneLegal.legal) {
      const newDrone: DroneViolation = {
        ...drone,
        distance: droneLegal.distance,
        timestamp: Date.now(),
      }

      return violatingDrones.push(newDrone)
    }

    return null
  })

  return violatingDrones
}

export function getClosestViolation(violations: DroneViolation[]) {
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

  return keys.map((key) => data[key].v).reverse()
}
