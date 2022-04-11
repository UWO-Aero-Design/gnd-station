import styled from 'styled-components';
const BatteryWrap = styled.div `
text-align: center;
display:grid;
justify-content: center;
`

const Battery = ({voltage, current}) =>(
    <BatteryWrap>
        <span> voltage = {voltage}</span>
        <span> current = {current}</span>
    </BatteryWrap>
);

export default Battery;