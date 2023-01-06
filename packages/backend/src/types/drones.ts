import { Pilot } from './pilots'

export interface DronesReport {
  report: Report
}

interface Report {
  deviceInformation: DeviceInformation
  capture: Capture
}

interface DeviceInformation {
  listenRange: number
  deviceStarted: string
  uptimeSeconds: number
  updateIntervalMs: number
}

interface Capture {
  drone: Drone[]
}

export interface Drone {
  serialNumber: string
  model: string
  manufacturer: string
  mac: string
  ipv4: string
  ipv6: string
  firmware: string
  positionY: number
  positionX: number
  altitude: number
}

export interface DroneViolation extends Drone {
  distance: number
  pilot?: Pilot
  timestamp: number
}
