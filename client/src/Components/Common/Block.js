import styled from "styled-components"

const Block = styled.div.attrs({className: "flying_pane"})`
	background-color: ${props => props.header ? 'rgba(40,255,40,.1)' : 'darkslategray'};
	text-align: ${props => props.header ? 'center' : 'default'};
	width: ${props => props.right ? '6rem' : 'auto'};
	margin: .1rem .5rem;
	padding: .3rem;
	${props => props.header && 'box-shadow: 2px 2px 7px -2px rgba(40, 255, 40, .6);'}
	flex: ${props => props.right ? '1 1' : '8 1'};
	text-align: ${props => props.right ? 'right' : 'default'};
	
`

export default Block