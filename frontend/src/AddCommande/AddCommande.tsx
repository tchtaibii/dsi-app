import './AddCommande.scss';
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from '../Interceptor'


interface Article {
    code?: string,
    designation?: string,
    type?: string,
    fourniseur?: string,
    prix_estimatif?: number
}

interface Commandes {
    demandeur: string,
    entité: string,
    ligne_bugetaire: string,
    quantité: number,
    DateDeCommande: string,
    typeDachat: number,
    article: Article
}

function AddCommande() {

    const [statusCode, setStatus] = useState({
        color: "#AF4C4C",
        status: "Failed",
        text: "Wrong Inputs",
        is: false
    })
    const [typeDachat, setType] = useState<number>(1);
    const [submit, setSubmit] = useState<boolean>(true);

    const [achat, setAchat] = useState<Commandes>({
        demandeur: "",
        entité: "",
        ligne_bugetaire: "",
        quantité: 0,
        DateDeCommande: "00-00-00",
        typeDachat: 1,
        article: {
        }
    })
    useEffect(() => {
        if (typeDachat >= 1 && typeDachat <= 4 && achat.demandeur.length > 0 && achat.entité.length > 0 && achat.ligne_bugetaire.length > 0 && achat.quantité > 0 && achat.article) {
            if (typeDachat === 1 && achat.article.code && achat.article.code.length > 0) {
                setSubmit(false);
            }
            else if (achat.article.designation &&
                achat.article.designation.length > 0
                && achat.article.type
                && achat.article.type.length > 0
                && achat.article.fourniseur &&
                achat.article.fourniseur.length > 0
            ) {
                console.log('heelooe')
                setSubmit(false);
            }
            else
                setSubmit(true)
        }
        else
            setSubmit(true)
        console.log('tipouwa', achat)
    }, [achat, typeDachat, achat.article])

    const handleSubmit = async () => {
        setAchat((state: any) => ({
            ...state,
            typeDachat
        }))
        await axios.post('/achats/add/', achat).then((rsp: any) => {
            console.log(rsp)
            setStatus({
                color: "#4CAF50",
                status: "Success!",
                text: "Your order is added successfully.",
                is: true
            })
        }).catch((rsp: any) => {
            setStatus({
                color: "#AF4C4C",
                status: "Failed!",
                text: "Wrong Inputs",
                is: true
            })
            console.log(rsp)
        })
    }
    useEffect(() => {
        setAchat((state: any) => ({
            ...state,
            typeDachat
        }))
    }, [typeDachat])
    useEffect(() => {
        if (statusCode.is) {
            const timer = setTimeout(() => {
                setStatus((state) => ({
                    ...state,
                    is: false
                }))
            }, 5000)
            return () => clearTimeout(timer);
        }
    }, [statusCode])

    function capitalize(str: string) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    return (
        <div className='ContentMain'>
            {
                statusCode.is &&
                <div style={{ backgroundColor: statusCode.color }} className="statusBar">
                    <h1>{statusCode.status}</h1>
                    <p>{statusCode.text}</p>
                    <div onClick={() => {
                        setStatus((state) => ({
                            ...state,
                            is: false
                        }))
                    }} className="exitB">
                        <svg style={{ width: "1rem", height: "1rem", cursor: "pointer" }} width={"1.5rem"} height={"1.5rem"} viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M19 1.91357L17.0864 0L9.5 7.58643L1.91357 0L0 1.91357L7.58643 9.5L0 17.0864L1.91357 19L9.5 11.4136L17.0864 19L19 17.0864L11.4136 9.5L19 1.91357Z" fill="white" />
                        </svg>
                    </div>
                </div>
            }
            <div className="header">
                <h1>Add Command</h1>
                <div className="header2">
                    <button disabled={submit} onClick={handleSubmit}>Submit</button>
                    <Link to='/'><button className="btn-sec">Cancel</button></Link>
                </div>
            </div>
            <div className="main">
                <div className="inputsCommande">
                    <div className="inputCommande typeDachat">
                        <div className="label">Type d'achat *</div>
                        <div className="colcheks">
                            <div className="rowchecks">
                                <div className="checkboxs">
                                    <input onChange={() => {
                                        setType(1)
                                        console.log(typeDachat)
                                    }} type="checkbox" name="Contrat Cadre" id="" checked={typeDachat === 1} />
                                    <h4>Contrat cadre</h4>
                                </div>
                                <div className="checkboxs">
                                    <input onChange={() => {
                                        setType(3)
                                        console.log(typeDachat)
                                    }} type="checkbox" checked={typeDachat === 3} name="Achat d’offre" id="" />
                                    <h4>Achat d’offre</h4>
                                </div>
                            </div>
                            <div className="rowchecks">
                                <div className="checkboxs">
                                    <input type="checkbox" onChange={() => {
                                        setType(2)
                                        console.log(typeDachat)
                                    }} checked={typeDachat === 2} name="Achat Direct" id="" />
                                    <h4>Achat Direct</h4>
                                </div>
                                <div className="checkboxs">
                                    <input type="checkbox" onChange={() => {
                                        setType(4)
                                        console.log(typeDachat)
                                    }} checked={typeDachat === 4} name="Achat d’offre" id="" />
                                    <h4>Achat en ligne</h4>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="inputCommande">
                        <div className="label">Demandeur *</div>
                        <div className="inputText">
                            <input onChange={(e: any) => {
                                const newD = e.target.value;
                                setAchat((state: any) => ({
                                    ...state,
                                    demandeur: newD
                                }))
                            }} placeholder="ex: John" type="text" name="Demandeur" id="" />
                        </div>
                    </div>
                </div>
                <div className="inputsCommande">
                    <div className="inputCommande">
                        <div className="label">Entité *</div>
                        <div className="inputText">
                            <input onChange={(e: any) => {
                                const newD = e.target.value;
                                setAchat((state: any) => ({
                                    ...state,
                                    entité: newD
                                }))
                            }} placeholder="Ex: IT" type="text" name="Entité" id="" />
                        </div>
                    </div>
                    <div className="inputCommande">
                        <div className="label">Ligne budgétaire *</div>
                        <div className="inputText">
                            <input onChange={(e: any) => {
                                const newD = e.target.value;
                                setAchat((state: any) => ({
                                    ...state,
                                    ligne_bugetaire: newD
                                }))
                            }} placeholder="Ex: 136-MI-IT" type="text" name="Ligne budgétaire*" id="" />
                        </div>
                    </div>
                </div>
                <div className="inputsCommande">
                    <div className="inputCommande">
                        <div className="label">Date de la commande *</div>
                        <div className="inputText">
                            <input onChange={(e: any) => {
                                const newD = e.target.value;
                                setAchat((state: any) => ({
                                    ...state,
                                    DateDeCommande: newD
                                }))
                            }} placeholder="YY-MM-DD" type="date" name="Entité" id="" />
                        </div>
                    </div>
                    <div className="inputCommande">
                        <div className="label">Quantité *</div>
                        <div className="inputText">
                            <input onChange={(e: any) => {
                                const newD = e.target.value;
                                setAchat((state: any) => ({
                                    ...state,
                                    quantité: parseInt(newD)
                                }))
                            }} placeholder="Ex: 5" type="number" name="Quantité" id="" />
                        </div>
                    </div>
                </div>
                <div className="inputsCommande">
                    {
                        typeDachat === 1
                            ?
                            <div className="inputCommande">
                                <div className="label">Code d'article *</div>
                                <div className="inputText">
                                    <input onChange={(e: any) => {
                                        const newD = e.target.value;
                                        setAchat((state: any) => ({
                                            ...state,
                                            article: {
                                                ...state.article,
                                                code: newD
                                            }
                                        }))
                                    }} placeholder="Entrez le Code d’article" type="text" name="Code d'article" id="" />
                                </div>
                            </div> :
                            <>
                                <div className="inputCommande">
                                    <div className="label">Designation *</div>
                                    <div className="inputText">
                                        <input onChange={(e: any) => {
                                            const newD = e.target.value;
                                            setAchat((state: any) => ({
                                                ...state,
                                                article: {
                                                    ...state.article, // Copy the old article properties
                                                    designation: newD// Update only the 'type' property
                                                }
                                            }))
                                        }} placeholder="Ex: Dell Mobile Precision..." type="text" name="designation" id="" />
                                    </div>
                                </div>
                                <div className="inputCommande">
                                    <div className="label">Prix Estimatif</div>
                                    <div className="inputText">
                                        <input onChange={(e: any) => {
                                            const newD = e.target.value;
                                            setAchat((state: any) => ({
                                                ...state,
                                                article: {
                                                    ...state.article,
                                                    prix_estimatif: newD
                                                }
                                            }))
                                        }} placeholder="Ex: 5000" type="number" name="Prix Estimatif" id="" />
                                    </div>
                                </div>
                            </>
                    }
                </div>
                {
                    typeDachat !== 1 &&
                    < div className="inputsCommande">
                        <div className="inputCommande">
                            <div className="label">Type d'article *</div>
                            <div className="inputText">
                                <input onChange={(e: any) => {
                                    const newD = e.target.value;
                                    setAchat((state: any) => ({
                                        ...state,
                                        article: {
                                            ...state.article,
                                            type: capitalize(newD)
                                        }
                                    }))
                                }} placeholder="Ex: Laptop" type="text" name="Type d'article" id="" />
                            </div>
                        </div>
                        <div className="inputCommande">
                            <div className="label">Fournisseur</div>
                            <div className="inputText">
                                <input onChange={(e: any) => {
                                    const newD = e.target.value;
                                    setAchat((state: any) => ({
                                        ...state,
                                        article: {
                                            ...state.article, // Copy the old article properties
                                            fourniseur: newD // Update only the 'type' property
                                        }
                                    }))
                                }} placeholder="Ex: AROCOM" type="text" name="Fournisseur" id="" />
                            </div>
                        </div>
                    </div>
                }
            </div>
        </div >
    )
}

export default AddCommande
