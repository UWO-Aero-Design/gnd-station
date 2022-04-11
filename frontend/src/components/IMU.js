import styled from 'styled-components';
const TiltWrap = styled.div `
text-align: center;
display:grid;
justify-content: center;
`

const IMU = ({ax,ay,az,gx,gy,gz,mx,my,mz,yaw,pitch,roll})=>(
    <TiltWrap>
        <span> ax : {ax}</span>
        <span> ay : {ay}</span>
        <span> az : {az}</span>
        <span> gx : {gx}</span>
        <span> gy : {gy}</span>
        <span> gz : {gz}</span>
        <span> mx : {mx}</span>
        <span> my : {my}</span>
        <span> mz : {mz}</span>
        <span> yaw : {yaw}</span>
        <span> pitch: {pitch}</span>
        <span> roll : {roll}</span>
    </TiltWrap>
);

export default IMU;