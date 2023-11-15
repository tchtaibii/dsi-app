import './Register.scss';
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from '../Interceptor'
import Error from '../Error'


function Register() {
    const [statusCode, setStatus] = useState({
        color: "#AF4C4C",
        status: "Failed",
        text: "Wrong Inputs",
        is: false
    })
    interface dataType {

        "email": string | null,
        "first_name": string | null,
        "last_name": string | null,
        "is_superuser": boolean,
        "is_reception": boolean,
        "is_achat_manager": boolean,
        "agent_affectation": boolean

    }

    const [Data, setData] = useState<dataType>({
        "email": null,
        "first_name": null,
        "last_name": null,
        "is_superuser": false,
        "is_reception": false,
        "is_achat_manager": false,
        "agent_affectation": true
    })
    useEffect(() => {
        if (Data.email && Data.email.length > 0 && Data.first_name && Data.first_name.length > 0 && Data.last_name && Data.last_name.length > 0)
            setSubmit(false)
        else
            setSubmit(true);
    }, [Data])
    const [submit, setSubmit] = useState<boolean>(true);
    const handleSubmit = async () => {
        await axios.post('/auth/register/', Data).then((rsp: any) => {
            setStatus({
                color: "#4CAF50",
                status: "Success!",
                text: "Account created successfully. Please check your inbox (or spam) for further instructions.",
                is: true
            })
        }).catch((rsp: any) => {
            setStatus({
                color: "#AF4C4C",
                status: "Failed!",
                text: "Someting is Wrong!",
                is: true
            })
        })
    }
    return (
        <div className='ContentMain'>
            {
                statusCode.is &&
                <Error statusCode={statusCode} setStatus={setStatus} />
            }
            <div className="header">
                <h1>Sign-Up</h1>
                <div className="header2">
                    <button disabled={submit} onClick={handleSubmit}>Submit</button>
                    <Link to='/'><button className="btn-sec">Cancel</button></Link>
                </div>
            </div>
            <div className="main" style={{ flexDirection: 'column' }}>
                <div style={{ alignItems: 'center', flexDirection: 'column', gap: '1.5rem' }} className="inputsCommande">

                    <div className="inputCommande">
                        <div className="label">Email</div>
                        <div className="inputText">
                            <input onChange={(e: any) => {
                                const newD = e.target.value;
                                setData((state: any) => ({ ...state, email: newD }))
                            }} placeholder="ex: test@example.com" type="email" name="Email" id="" />
                        </div>
                    </div>
                    <div className="inputCommande">
                        <div className="label">Prénom</div>
                        <div className="inputText">
                            <input onChange={(e: any) => {
                                const newD = e.target.value;
                                setData((state: any) => ({ ...state, first_name: newD }))
                            }} placeholder="Ex: John" type="text" name="Prénom" id="" />
                        </div>
                    </div>
                    <div className="inputCommande">
                        <div className="label">Nom</div>
                        <div className="inputText">
                            <input onChange={(e: any) => {
                                const newD = e.target.value;
                                setData((state: any) => ({ ...state, last_name: newD }))
                            }} placeholder="Ex: Smith" type="text" name="Nom" id="" />
                        </div>
                    </div>
                    <div className="inputCommande typeDachat">
                        <div className="label">Session Type*</div>
                        <div className="colcheks">
                            <div className="rowchecks">
                                <div className="checkboxs">
                                    <input onChange={() => {
                                        setData((state: any) => ({ ...state, is_superuser: !state.is_superuser }))
                                    }} type="checkbox" name="Admin" id="" checked={Data.is_superuser} />
                                    <h4>Admin</h4>
                                </div>
                                <div className="checkboxs" style={{ width: 'fit-content' }}>
                                    <input type="checkbox" onChange={() => {
                                        setData((state: any) => ({ ...state, agent_affectation: !state.agent_affectation }))
                                    }} checked={Data.agent_affectation} name="Achat Direct" id="" />
                                    <h4>Agent d'affectation</h4>
                                </div>

                            </div>
                            <div className="rowchecks">
                                <div className="checkboxs">
                                    <input onChange={() => {
                                        setData((state: any) => ({ ...state, is_reception: !state.is_reception }))
                                    }} type="checkbox" checked={Data.is_reception} name="Receptionist" id="" />
                                    <h4>Recéptionist</h4>
                                </div>
                                <div className="checkboxs">
                                    <input type="checkbox" onChange={() => {
                                        setData((state: any) => ({ ...state, is_achat_manager: !state.is_achat_manager }))
                                    }} checked={Data.is_achat_manager} name="Achat Manager" id="" />
                                    <h4>Achat Manager</h4>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default Register
