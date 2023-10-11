import React from 'react'

function TestFlight() {
    
  return (
      <div className="container-xl text-center">
        <div className="row">
          <div className="col-8">
            <div className="card bg-light text-dark">
              <div className="card-body">
                <h5 className="card-title">FPV Goes Here</h5>
                <p className="card-text align-text-bottom">FPV View Goes here</p>
              </div>
            </div>
          </div>
          <div className="col-4">
            <div className="card bg-light text-dark">
              <div className="card-body">
                <h5 className="card-title align-top">Telemetry </h5>
                <p className="card-text">Telemetry goes here</p>
              </div>
            </div>
          </div>
        </div>
      </div>
  )
}

export default TestFlight