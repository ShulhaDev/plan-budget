import styled from "styled-components";

const SpecI = styled.div`
	color: ${props => props.state ? 'lightcoral' : props.state === null ? 'transparent' : 'darkcyan'};
	display: inline-block;
	box-sizing: content-box;
	text-shadow: 1px 1px 1px rgba(0,0,0,.7);
	font: inherit;
	height: auto;
	vertical-align: middle;
	line-height: 1rem;
	margin: 0 auto;
	padding: .1rem .1rem .3rem .1rem;
	border: 1px solid ${props => props.state ? 'lightcoral' : props.state === null ? 'transparent' : 'darkcyan'} ;
	background-color: transparent;
	border-radius: .5rem;
	&.on{
		border: 1px solid lightcoral;
		color: lightcoral;
	}
`

const Spec = ({children,...props}) => <SpecI {...props}  title={props.state === null ? 'Не задано' : props.state ? 'Товары/услуги по акции' : 'Неакционные товары/услуги'}>{children}</SpecI>

export default Spec;