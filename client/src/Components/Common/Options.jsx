import React from 'react'

const Options = ({list=[],id}) => <datalist id={id}>{list.map(item => <option key={item.id} value={item.name}/>)}</datalist>

export default Options