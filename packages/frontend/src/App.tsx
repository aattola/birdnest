import React, { useEffect, useState } from 'react'
import io from 'socket.io-client'
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion'
import { intlFormatDistance } from 'date-fns'

import './App.css'
import type { DroneViolation } from '@backend/types/drones'

const socket = io('http://localhost:3000')

function App() {
  const [count, setCount] = useState(0)
  const [violations, setViolations] = useState<DroneViolation[]>([])

  useEffect(() => {
    socket.on('violating', (data) => {
      console.log(data)
      setViolations(data.violations)
    })

    return () => {
      socket.off('violating')
    }
  })

  return (
    <div className="App">
      <h1>Monadikuikka</h1>
      <LayoutGroup>
        <AnimatePresence>
          <div className="card">
            {violations.map((violation) => (
              <motion.div
                key={violation.serialNumber}
                className="violator"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <h2>
                  {violation.pilot?.firstName} {violation.pilot?.lastName}
                </h2>
                <p style={{ marginTop: 5 }}>
                  Closest distance: {Math.round(violation.distance)} meters
                </p>
                <p>
                  {intlFormatDistance(new Date(violation.timestamp), new Date(), { locale: 'en' })}
                </p>
                <p>Pilot email: {violation.pilot?.email}</p>
                <p>Pilot phone number: {violation.pilot?.phoneNumber}</p>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      </LayoutGroup>
    </div>
  )
}

export default App
