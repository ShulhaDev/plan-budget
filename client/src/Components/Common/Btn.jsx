import styled from 'styled-components'

export default styled.button`
	color: white;
	padding: 2px;
	border-radius: 5px;
	width: 1.3rem;
	height: 1.3rem;
	font: inherit;
	font-size: .8rem;
	line-height: .8rem;
	border: none;
    box-shadow: 2px 2px 5px 0 rgba(0,0,0,.6);
	text-shadow: 2px 1px 3px black;
	background-color: forestgreen;
	margin-left: 2px;
    cursor: pointer;
	&:active{
		text-shadow: 1px 1px 1px rgba(0,0,0,.6);
        box-shadow: 1px 1px 1px 0 rgba(0,0,0,.6);
		transform: translateX(1px) scale(.98);
        
	}
`