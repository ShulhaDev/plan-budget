import styled, {keyframes} from 'styled-components'

const pctg = (dur,ss) => {
	const res = Math.floor(100 * (dur-ss)/dur) 
	return res;
}

const appearFn = dur => keyframes`
	0%,${pctg(dur,1)}% { 
		transform: scale(.1);
		color: transparent;
		opacity: 0;
		text-shadow: none;
		border-radius: 6rem;
	}
	${pctg(dur,0.7)}% {
		transform: scaleY(1);
		border-radius: 2rem;
		color: transparent;
		text-shadow: none;
	}
	${pctg(dur,0.5)}% {
		color: transparent;
		text-shadow: none;
	}	
`

const Panel = styled.div.attrs({
	className: "r5"
})`
	background-color: darkcyan;
	padding: .5rem .5rem 1rem .5rem;
	margin: .3rem;
	font-size: 1rem;
	font-family: inherit;
	height: fit-content;
	text-shadow: 2px 2px 3px black;
	color: white;
	animation-name: ${appearFn(1)};
	animation-duration: 1s;
	text-align: ${props => props.centered ? 'center' : 'initial'};
	box-shadow: 5px 6px 10px -2px #3f3c3c,  -3px -3px 4px 0 inset rgba(10,10,10,0.75),  3px 3px 4px 0 inset rgba(240,240,255,0.4);
	& * {
		animation-name: ${appearFn(1.3)};
		animation-duration: 1.3s;
	}
`

export default Panel