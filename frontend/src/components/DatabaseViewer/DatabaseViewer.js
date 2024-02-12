import React, { useEffect, useState } from 'react'
import axios from "axios";

function DatabaseViewer() {

  const [data, setData] = useState([]);
  const [telemetry, setTelemetry] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTelemetry, setCurrentTelemetry] = useState();
  const [index, setIndex] = useState(0);

  const getData = async () => {
    const response = await axios.get("http://localhost:5000/record");
    setData(response.data.recordings);
    console.log(response.data.recordings)
  }

  useEffect(() => {
    if (isPlaying) {
      console.log(telemetry);
      if (index < telemetry.length) {
        const interval = setInterval(() => {
          setCurrentTelemetry(telemetry[index])
          setIndex(index + 1);
        }, 1000);
        return () => clearInterval(interval);
      }
    }
  }, [isPlaying, telemetry, index]);

  const handleChange = (e) => {
    console.log(e.target.value)
    console.log(data)
    for (let i = 0; i < data.length; i++) {
      if (data[i].name === e.target.value) {
        setTelemetry(data[i].telemetry)
        break
      }
    }
  }

  return (
    <div className="container-fluid text-center">
      <div className="row p-5">
        <div className="col-6">
          <div className="card bg-light text-dark">
            <div className="card-body">
              <h5 className="card-title">FPV Goes Here</h5>
              <p className="card-text align-text-bottom">FPV View Goes here</p>
            </div>
          </div>
        </div>
        <div className="col-3">
          <div className="card bg-light text-dark">
            <div className="p-4">
              <h1 className="card-title align-top">Telemetry </h1>
              <div className="row py-4">
                <button className="btn btn-success col-4" onClick={() => setIsPlaying(true)}>Play</button>
                <button className="btn btn-danger col-4" onClick={() => setIsPlaying(false)}>Pause</button>
                <button className="btn btn-info col-4" onClick={() => setIndex(0)}>Reset</button>
              </div>

              <h5 className={isPlaying ? "text-success" : "text-dark"}>{currentTelemetry ? (`Alt ${currentTelemetry.gps.altitude}`) : "Play Telemetry"}</h5>
              <h5 className={isPlaying ? "text-success" : "text-dark"}>{currentTelemetry ? (`Drop Heightcd ${currentTelemetry.imu.ay}`) : ""}</h5>
              {/* <h5 className={isPlaying ? "text-success" : "text-dark"}>{currentTelemetry ? (`IMU az ${currentTelemetry.imu.az}`) : ""}</h5> */}
            </div>
            <div style={{ height: '55vh', overflowY: 'auto' }}>
              <div className="overflow-scroll h-100 py-3">
                {telemetry.length > 0 ? telemetry.map((dataItem) => (
                  <button className={telemetry.indexOf(dataItem) === index ? "btn text-primary" : "btn text-dark"} key={dataItem.id} style={{ height: "50px" }} onClick={() => setIndex(telemetry.indexOf(dataItem))}>{dataItem.imu.ax}</button>
                )) : <p>Select a recording</p>}
              </div>
            </div>
          </div>
        </div>
        <div className="col-3">
          <div className="card bg-light text-dark">
            <div className="card-body">
              <button className="btn btn-primary mb-1" onClick={getData}>Load Data</button>
              <div>
              <h4 className='m-2'>Select a Recording</h4>
                <form>
                  <select className="form-select form-select-lg m-4 p-2" onChange={handleChange}>
                    {data.length > 0 ? data.map((item) => (
                      <option className="p-2" key={item.id} value={item.name}>{item.name.replace("GMT+0000 (Coordinated Universal Time)", "")}</option>
                    )) : <option value={""} disabled selected>No data</option>}
                  </select>
                </form>

                {/* {data.length > 0 ? data.map((item) => (
                  <button className="m-2 p-1 btn btn-primary" key={item.id} onClick={() => setTelemetry(item.telemetry)}>{item.name}</button>
                )) : <div>No data</div>} */}
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DatabaseViewer