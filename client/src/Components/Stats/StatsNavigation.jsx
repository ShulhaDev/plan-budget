import styled from "styled-components";
import {useHistory, useLocation} from "react-router-dom";
import Panel from "../Common/Panel";
import Block from "../Common/Block";
import Column from "../Common/Column";
import React from "react";

const StatLink = styled.a`
	color: inherit;
	text-decoration: none;
	font: inherit;
	display: inline-block;
	flex: 1 1;
	transition: .1s;
	${props => props.active ? 'transform: translateX(.5rem); &:before { content: "➧ "}; color: khaki' : ''}
`

const StatsNavigation = ({links = []}) => {
    const history = useHistory();
    const location = useLocation();
    if(!links.length)
        return null;
    return <Panel>
        <Block header={true} style={{minWidth: "17rem"}}>
            Статистика
        </Block>
        <Block>
            <Column>
                {links.map(lnk => <div key={lnk.path}>
                    <StatLink href={"#"}
                              active = {location.pathname === lnk.path}
                              onClick={e => e.preventDefault() || history.push(lnk.path)}>{lnk.caption}</StatLink>
                </div>)}
            </Column>
        </Block>
    </Panel>
}

export default StatsNavigation;