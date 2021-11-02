import Column from "./Column"
import Form from "./Form"
import Btn from "./Btn"
import InputFromList from "../InputFromList/InputFromList"

const Filter = ({caption='n/a', id, value,update,submit,options=[]}) => {
    return <Column>{caption}:<Form onSubmit={e => e.preventDefault() || submit(value)}>
										<InputFromList id={id}
                                            value={value}
                                            update={update}
                                            submit={submit}
                                            options={options}
										/>
                                        <Btn type={"submit"} title={'Применить фильтр'}>➧</Btn>
							 </Form>
    </Column>
}

export default Filter;