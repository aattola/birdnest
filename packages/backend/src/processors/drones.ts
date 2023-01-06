import { XMLParser } from 'fast-xml-parser'
import axios from 'axios'
import { Drone, DronesReport, DroneViolation } from '../types/drones'
import { isLegal } from './checkLegal'

const parser = new XMLParser()

export async function getDrones(): Promise<DronesReport> {
  const resp = await axios.get('https://assignments.reaktor.com/birdnest/drones')
  if (resp.status !== 200) throw new Error('Failed to get drones')

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
      }

      return violatingDrones.push(newDrone)
    }

    return null
  })

  return violatingDrones
}
