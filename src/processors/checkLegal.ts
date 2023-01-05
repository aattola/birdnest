import { Drone } from '../types/drones'
import { CONSTANTS } from '../util/constants'

const { x, y, radius } = CONSTANTS.nfz

function calculateDistance(drone: Drone): number {
  const { positionX, positionY } = drone

  const P = (x - positionX / 1000) ** 2
  const Q = (y - positionY / 1000) ** 2
  const R = Math.sqrt(P + Q)

  return R
}

export function isLegal(drone: Drone): { legal: boolean; distance: number } {
  const distance = calculateDistance(drone)
  return { legal: distance > radius, distance }
}
