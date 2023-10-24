import './AddCommande.scss';
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from '../Interceptor'
import Error from '../Error'
import InputNumber from './NumberButton'

interface Article {
    code?: string,
    designation?: string,
    type?: string,
    prix_estimatif?: number
    quantité: number
}

interface Commandes {
    demandeur: string,
    entité: string,
    ligne_bugetaire: string,
    DateDeCommande: string,
    typeDachat: number,
    achats: Article[]
}

const ArticleFields = ({ achat, typeDachat, title, number, setAchats }) => {

    function capitalize(str: string) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    return (
        <div className="ArticleField">
            <h1>{title}</h1>
            <div className="inputsCommande">
                {
                    typeDachat === 1
                        ?
                        <>
                            <div className="inputCommande">
                                <div className="label">Code d'article *</div>
                                <div className="inputText">
                                    <input onChange={(e: any) => {
                                        const newD = e.target.value;
                                        setAchats((state) =>
                                            state.map((item, index) => {
                                                if (index === number - 1) {
                                                    return {
                                                        ...item,
                                                        code: newD,
                                                    };
                                                }
                                                return item;
                                            })
                                        );
                                    }} placeholder="Entrez le Code d’article" type="text" name="Code d'article" id="" />
                                </div>
                            </div>
                            <div className="inputCommande">
                                <div className="label">Quantité *</div>
                                <div className="inputText">
                                    <input onChange={(e: any) => {
                                        const newD = e.target.value;
                                        setAchats((state) =>
                                            state.map((item, index) => {
                                                if (index === number - 1) {
                                                    return {
                                                        ...item,
                                                        quantité: newD,
                                                    };
                                                }
                                                return item;
                                            })
                                        );
                                    }} placeholder="Ex: 5" type="number" name="Quantité" id="" />
                                </div>
                            </div>
                        </>

                        :
                        <>
                            <div className="inputCommande">
                                <div className="label">Designation *</div>
                                <div className="inputText">
                                    <input onChange={(e: any) => {
                                        const newD = e.target.value;
                                        setAchats((state) =>
                                            state.map((item, index) => {
                                                if (index === number - 1) {
                                                    return {
                                                        ...item,
                                                        designation: newD,
                                                    };
                                                }
                                                return item;
                                            })
                                        );
                                    }} placeholder="Ex: Dell Mobile Precision..." type="text" name="designation" id="" />
                                </div>
                            </div>
                            <div className="inputCommande">
                                <div className="label">Prix Estimatif</div>
                                <div className="inputText">
                                    <input onChange={(e: any) => {
                                        const newD = e.target.value;
                                        setAchats((state: Article) =>
                                            state.map((item, index) => {
                                                if (index === number - 1) {
                                                    return {
                                                        ...item,
                                                        prix_estimatif: newD,
                                                    };
                                                }
                                                return item;
                                            })
                                        );
                                    }} placeholder="Ex: 5000" type="number" name="Prix Estimatif" id="" />
                                </div>
                            </div>
                        </>
                }
            </div>
            {
                typeDachat !== 1 &&
                <>
                    < div className="inputsCommande">
                        <div className="inputCommande">
                            <div className="label">Type d'article *</div>
                            <div className="inputText">
                                <input onChange={(e: any) => {
                                    const newD = e.target.value;
                                    setAchats((state: Article[]) =>
                                        state.map((item: Article, index) => {
                                            if (index === number - 1) {
                                                return {
                                                    ...item,
                                                    type: newD,
                                                };
                                            }
                                            return item;
                                        })
                                    );
                                }} placeholder="Ex: Laptop" type="text" name="Type d'article" id="" />
                            </div>
                        </div>
                        <div className="inputCommande">
                            <div className="label">Quantité *</div>
                            <div className="inputText">
                                <input onChange={(e: any) => {
                                    const newD = e.target.value;
                                    setAchats((state: Article[]) =>
                                        state.map((item: Article, index) => {
                                            if (index === number - 1) {
                                                return {
                                                    ...item,
                                                    quantité: newD,
                                                };
                                            }
                                            return item;
                                        })
                                    );
                                }} placeholder="Ex: 5" type="number" name="Quantité" id="" />
                            </div>
                        </div>
                    </div>
                </>
            }
        </div>
    )
}

function AddCommande() {
    const [AChats, setAchats] = useState<Article[]>(
        [
            {
                code: "",
                designation: "",
                type: "",
                prix_estimatif: 0,
                quantité: 0
            }
        ])
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
        DateDeCommande: "00-00-00",
        typeDachat: 1,
        achats: []
    })
    useEffect(() => {
        setAchat((state: Commandes) => ({ ...state, achats: AChats }))
    }, [AChats])
    useEffect(() => {
        if (
            typeDachat >= 1 &&
            typeDachat <= 4 &&
            achat.demandeur.length > 0 &&
            achat.DateDeCommande.length > 0 &&
            achat.entité.length > 0 &&
            achat.ligne_bugetaire.length > 0 &&
            achat.achats.length > 0
        ) {

            let isSubmitRequired = false;
            if (typeDachat === 1) {

                AChats.forEach((e: Article) => {
                    if (
                        !(
                            e.code &&
                            e.code.length > 0 &&
                            e.quantité >= 1
                        )
                    ) {
                        isSubmitRequired = true;
                    }
                });
            } else {
                AChats.forEach((e: Article) => {
                    if (
                        !(
                            e.designation &&
                            e.designation.length > 0 &&
                            e.type &&
                            e.type.length > 0 &&
                            e.quantité >= 1
                        )
                    ) {
                        isSubmitRequired = true;
                    }
                });
            }
            setSubmit(isSubmitRequired);
        } else {
            setSubmit(true);
        }
    }, [achat, typeDachat]);


    const handleSubmit = async () => {
        setAchat((state: any) => ({
            ...state,
            typeDachat
        }))
        await axios.post('/achats/add/', achat).then((rsp: any) => {
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
        })
    }

    useEffect(() => {
        setAchat((state) => ({
            ...state,
            typeDachat
        }));
        if (children.length > 0) {
            setChildren((children) => {
                const newC = children.map((child) => {
                    return React.cloneElement(child, { typeDachat });
                });
                return newC;
            });
        }
    }, [typeDachat]);


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
    const [value, SetValue] = useState<number>(1)

    useEffect(() => {
        console.log(value, children.length)
        if (value > children.length) {
            const tmp = value - children.length
            for (let i = 0; i < tmp; i++) {
                const newId = children.length + 1;
                setAchats((state: Article[]) => [...state, {
                    code: "",
                    designation: "",
                    type: "",
                    prix_estimatif: 0,
                    quantité: 0
                }])
                setChildren([...children, <ArticleFields setAchats={setAchats} achat={achat} typeDachat={typeDachat} number={newId} key={`${newId}-Article`} title={`Article ${newId}`} />]);
            }
        }
        else {
            setChildren((prevChildren) => prevChildren.slice(0, value));
            setAchats((prevChildren) => prevChildren.slice(0, value));
        }
    }, [value])


    const [children, setChildren] = useState<any[]>([<ArticleFields setAchats={setAchats} number={1} achat={achat} typeDachat={typeDachat} key={`1-Article`} title={`Article 1`} />]);
    return (
        <div className='ContentMain'>
            {
                statusCode.is &&
                <Error statusCode={statusCode} setStatus={setStatus} />
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
                                    }} type="checkbox" name="Accord Cadre" id="" checked={typeDachat === 1} />
                                    <h4>Accord Cadre</h4>
                                </div>
                                <div className="checkboxs">
                                    <input onChange={() => {
                                        setType(3)
                                    }} type="checkbox" checked={typeDachat === 3} name="Achat d’offre" id="" />
                                    <h4>Achat d’offre</h4>
                                </div>
                            </div>
                            <div className="rowchecks">
                                <div className="checkboxs">
                                    <input type="checkbox" onChange={() => {
                                        setType(2)
                                    }} checked={typeDachat === 2} name="Achat Direct" id="" />
                                    <h4>Achat Direct</h4>
                                </div>
                                <div className="checkboxs">
                                    <input type="checkbox" onChange={() => {
                                        setType(4)
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
                    <div style={{ height: '100%' }} className="inputCommande">
                        <div className="inputArticles">
                            <InputNumber value={value} SetValue={SetValue} />
                        </div>
                    </div>
                </div>
                {
                    children.map((e) => e)
                }
            </div>
        </div >
    )
}

export default AddCommande
