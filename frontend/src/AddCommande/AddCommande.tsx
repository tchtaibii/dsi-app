import './AddCommande.scss';
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";


interface Article {
    code?: string,
    destination?: string,
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
        if (typeDachat >= 1 && typeDachat <= 4 && achat.demandeur.length > 0 && achat.entité.length > 0 && achat.ligne_bugetaire.length > 0 && achat.quantité > 0) {
            if (typeDachat === 1 && achat.article.code && achat.article.code.length > 0) {
                setSubmit(false);
            }
            else if (achat.article.destination && achat.article.destination.length > 0 && achat.article.type && achat.article.type.length > 0
                && achat.article.fourniseur && achat.article.fourniseur.length > 0 && achat.article.prix_estimatif && achat.article.prix_estimatif > 0) {
                setSubmit(false);
            }
            else
                setSubmit(true)
        }
        else
            setSubmit(true)
    }, [achat, typeDachat])

    return (
        <div className='ContentMain'>
            <div className="header">
                {/* title */}
                <h1>Add Command</h1>
                <div className="header2">
                    <button disabled={submit} onClick={() => {

                    }}>Submit</button>
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
                                    quantité: newD
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
                                                    destination: newD
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
                                                    prix_estimatif: newD
                                                }
                                            }))
                                        }} placeholder="Ex: 5000" type="number" name="Type d'article" id="" />
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
                                            type: newD
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
                                            fourniseur: newD
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
