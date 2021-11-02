import styled from 'styled-components'

const Column = styled.div`
	display: flex;
	flex-flow: column nowrap;
    overflow-y: unset;
	align-items: flex-start;
	& > div{
		margin: .5rem .5rem;
	}
`

export default Column