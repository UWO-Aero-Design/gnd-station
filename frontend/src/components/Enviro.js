import styled from 'styled-components';
const EnviroWrap = styled.div `
text-align: center;
display:grid;
justify-content: center;
`

const Enviro = ({altitude, temperature,pressure}) =>(
    <EnviroWrap>
        <span> altitude = {altitude}</span>
        <span> temperature = {temperature}</span>
        <span> pressure : {pressure}</span>
        
    </EnviroWrap>
);

export default Enviro;