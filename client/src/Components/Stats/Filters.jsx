import React, {useState} from "react";
import Panel from "../Common/Panel";
import Column from "../Common/Column";
import Filter from "../Common/Filter";
import Form from "../Common/Form";
import Spec from "../Common/Spec";
import Btn from "../Common/Btn";
import styled from "styled-components";


const Filters = ({data,apply}) => {
    const [item,setItem] = useState('');
    const [store,setStore] = useState('')
    const [group,setGroup] = useState('');
    const [special,setSpecial] = useState(null)

    const toggleSpecial = e => {
        const newSpec =  special === null ? true : special === false ? null : false;
        setSpecial(newSpec);
    }

    return <Panel >
        Фильтры
        <div style={{maxHeight: "100vh", overflowY: "scroll"}}>
            <Column>
                <Filter caption={'Товар/услуга'}
                        id={'items'}
                        value={item}
                        update={val => setItem(val)}
                        submit={() => setItem('') || (apply && apply('Т','items',item))}
                        options={data.items}
                />
                <Filter caption={'Магазин/место'}
                        id={'stores'}
                        value={store}
                        update={val => setStore(val)}
                        submit={() => setStore('') || (apply && apply('М','stores',store))}
                        options={data.stores}
                />
                <Filter caption={'Категория'}
                        id={'groups'}
                        value={group}
                        update={val => setGroup(val)}
                        submit={() => setGroup('') || (apply && apply('К','groups',group))}
                        options={data.groups}
                />
                <Form style={{display: "flex", justifyContent: "flex-end",width: "97%"}}
                      onSubmit={e => e.preventDefault() || (apply && apply("Акция","special",special))}>
                    <Spec state={special} onClick={toggleSpecial}>Акция </Spec>
                    <Btn type={"submit"}>➧</Btn>
                </Form>
            </Column>
        </div>
    </Panel>
}

const FilterLabel = styled.div.attrs({className: "flying_pane"})`
  width: fit-content;
  background-color: darkslategray;
  width: fit-content;
  margin-right: .5rem;
`

export {FilterLabel};

export default Filters;
