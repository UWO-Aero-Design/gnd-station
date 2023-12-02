import React from 'react'
import {Telemetry} from './Telemetry/Telemetry'
import { FPV } from './FPV'


export const Main = () => {
  return (
    <main>
        <FPV />
        <Telemetry />
    </main>
  )
}
