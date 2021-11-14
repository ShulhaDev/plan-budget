import React,{useState,useEffect} from 'react'
import {useQuery} from "@apollo/client"
import {GET_DATES} from '../../Apollo/queries'
import styled from 'styled-components'
import {daysInMonth, left_zeroes, months, weekDays} from "../../utils/utils";
import Panel from "../Common/Panel"

const modes ={
   days: "days", months: "months", years: "years"
}

const List = styled.div.attrs({
    className: 'flying_pane'
})`
   display: flex;
   flex-flow: row wrap;
   justify-content: space-between;
   margin: .5rem .2rem 0 .2rem;
   color: inherit;
   width: 9.5rem;
   background-color: darkslategray;
   
   & > label:nth-of-type(8){
      padding-left: ${props => props.shift}rem !important;
   }
   &.days{
      font-size: 0.8em;
      justify-content: flex-start;
      & > label{
         margin: .2rem;
         width: 2rem;
         text-align: right;
         flex-basis: 0.92rem;
      }
   }
`

const Label = styled.label(props => ({
	margin: '5px',
	opacity: props.unused ? '.5' : '1',
	color: props.active ? 'khaki' : (props.color || 'inherit'),
	transform: 'scale(' + (props.active ? '1.06)' : '1)'),
	textShadow: props.active ? '3px 2px 3px black' : 'inherit',
	font: 'inherit'
}));



const date = new Date();
const years = '.'.repeat(9).split('')
              .map((_,i) => date.getFullYear() - i )

const Calendar = ({id_store,update,fetchDates}) => {
   const [mode,setMode] = useState(modes.days);
   const [year, setYear] = useState(date.getFullYear());
   const [day,setDay] = useState(date.getDate());
   const [month, setMonth] = useState(date.getMonth());
   const {data,refetch} = useQuery(GET_DATES, {variables: {filter: {id_store,year,month}}});
   const [daysUsed,setDaysUsed] = useState([]);
   
   const days =  [...weekDays.map((dd,i) => <Label key={'wd'+i} color={i > 4 ? 'pink' : 'inherit'}>{dd}</Label>) ,...'.'.repeat(daysInMonth(year,month))
                    .split('')
                    .map((_,i) => {
                        return <Label key={i} active={day === i + 1} unused = {!daysUsed.includes(i + 1) && day !== i+1} onClick={() => setDay(i+1)}>{i+1}</Label>
                     })]

   useEffect(() => { update && update([year,left_zeroes((month+1)+'',2),left_zeroes(day+'',2)].join('-'))},[update,year,month,day]);
   
   useEffect(()=> data?.res && setDaysUsed(data.res.map(dt => +dt.split('-')[2])),[data]);
   
   useEffect(()=> refetch(),[id_store,refetch,fetchDates]);
   
   return <Panel centered={true} className={"side"} style={{height: "fit-content"}}>
      {mode === modes.years
          ? <div> Выберите год:
             <List>
               {years.map(y => <Label active={y === year}
                                      key={y}
                                      onClick={() => {setMode(modes.days); setYear(y); }}>
                                 {y}
                               </Label>)
               }
            </List>
          </div>
          :  <Label onClick={() => setMode(modes.years)}>{year}</Label>
      }
      {mode === modes.months
          ? <div> Выберите месяц:
          <List> {months.map((mon,i) => <Label key={mon}
                                          active = {i === month}
                                          onClick={() => {setMonth(i); setMode(modes.days)} }>
                                      {mon}
                                    </Label>)}
          </List> </div>
          : <Label onClick={() => setMode(modes.months)}>{months[month]}</Label>
      }
      {mode === modes.days
          ? <List className={"days"} shift={(((new Date(year,month,1)).getDay() || 7)-1) * 1.32}>
             {days}
          </List>
         : null
      }

   </Panel>
}

export {months}
export default Calendar