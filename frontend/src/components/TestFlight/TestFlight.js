function TestFlight() {

    return (
        <div className="container-fluid text-center">
            <div className="row p-5">
                <div className="col-8">
                    <div className="card bg-light text-dark">
                        <div className="card-body">
                            <h5 className="card-title">FPV Goes Here</h5>
                            <p className="card-text align-text-bottom">FPV View Goes here</p>
                            <p className="card-text align-text-bottom">Time Goes here</p>
                        </div>
                    </div>
                </div>
                <div className="col-4">
                    <div className="card bg-light text-dark">
                        <div className="card-body">
                            <h5 className="card-title">Telemetry Goes Here</h5>
                            <p className="card-text align-text-bottom">
                                <h3 className='fw-bold'>Heading</h3>
                                <h3 className='fs-4'>Altitude</h3>
                                <h3 className='fs-4'>Speed</h3>
                                <h3 className='fs-3'>GPS</h3>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TestFlight