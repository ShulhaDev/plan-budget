import styled,{keyframes} from 'styled-components'

const fadeAnimation = keyframes`
	0% {opacity: 1}
	100% {opacity: 0}
`;

export default styled.div`
	animation-name: ${fadeAnimation};
	animation-duration: 4s;
	background-color: ${props => props.color};
	padding: 6px;
	border-radius: 4px;
	color: white;
	width: fit-content;
	position: absolute;
	top: -35px;
	left: 50%;


`