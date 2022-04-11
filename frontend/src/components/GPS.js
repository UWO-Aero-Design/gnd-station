import styled from 'styled-components';
const GpsWrap = styled.div `
text-align: center;
display:grid;
justify-content: center;
`

const GPS = ({fix,lon,lat,speed,satellites,altitude,time,date})=>(
    <GpsWrap>
        <span> fix = {fix}</span>
        <span> lon = {lon}</span>
        <span> lat = {lat}</span>
        <span> speed = {speed}</span>
        <span>satellites = {satellites}</span>
        <span>altitude = {altitude}</span>
        <span>time = {time}</span>
        <span>date = {date}</span>
    </GpsWrap>
);

export default GPS;