import React from "react";
import styled from "styled-components";
const TelemetryStatusWrap = styled.div `
text-align: center;
display:grid;
justify-content: center;
`

const TelemetryStatus = ({telemetry}) =>(
    <TelemetryStatusWrap>
        <span>Signal Strength {telemetry === undefined ? 0 : telemetry.rssi}</span>
        <span>Battery Voltage {telemetry === undefined ? 0 : telemetry.battery.voltage}</span>
        <span>Battery Percent {telemetry === undefined ? 0 : telemetry.battery.current}</span>
        <span>GPS Status (fix){telemetry === undefined ? 0 : telemetry.gps.satellites}</span>
        <span>Telemetry {telemetry === undefined ? 0 : telemetry.status}</span>
        <span>Temperature {telemetry === undefined ? 0 : telemetry.battery.voltage}</span>
    </TelemetryStatusWrap>
);

export default TelemetryStatus;