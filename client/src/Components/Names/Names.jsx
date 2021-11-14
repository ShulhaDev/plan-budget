import React from "react";
import OptionsManager from "../OptionsManager/OptionsManager";
import withAuth from "../../HOCs/withAuth";

const Names = () => {
    return <div className ="manager">
		<div className="fitting" style={{width: "80%",margin: "0 auto"}}>
			<OptionsManager category = {"Категории товаров/услуг"}  id={'groups'} />
			<OptionsManager category = {"Товары/услуги"}  groups ={true} id={'items'} />
			<OptionsManager category = {"Магазины/места"} id={'stores'} />
		</div>
    </div>
}

export default withAuth(Names)