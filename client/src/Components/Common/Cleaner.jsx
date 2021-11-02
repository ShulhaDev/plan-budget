import React from 'react'
import Btn from './Btn'

const Cleaner = ({action}) => <Btn title={"Очистить"} type="button" onClick={() => action()}>✖</Btn>
export default Cleaner