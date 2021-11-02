import React from 'react'
import styled from "styled-components";
import styles from './MonthSelector.module.scss'
import HlSpan from "../HlSpan";

const colors = {
    winter: 'rgb(240,240,255)',
    spring: 'lime',
    summer: 'yellow',
    autumn: 'orange'
}

const Secondary = styled.div`
  color: ${ props => !props.empty? 'darkcyan' : 'black'};
  border-bottom: ${ props => !props.empty ? `1px solid ${props.color}` :''};
`

const MonthSelector = ({values,current,select,filled}) => {
    const content = values.map((val, i) => {
        const color =  [11,0,1].includes(i)
            ? colors.winter
            : [2,3,4].includes(i)
                ? colors.spring
                : [5,6,7].includes(i)
                    ? colors.summer
                    : colors.autumn
        return current === i
            ? <HlSpan key={i} color={color}>{val}</HlSpan>
            : <Secondary key={i}
                         tabIndex={i+1}
                         onClick={() => select(i)}
                         empty={!filled.includes(i)}
                         color={color}>
                {val}</Secondary>
    });
    return (
        <div className={styles.items}>
            {content}
        </div>
    );
}

export {MonthSelector};