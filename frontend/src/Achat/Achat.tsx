import './Achat.scss';

import { useState, useEffect } from 'react'
import axios from '../Interceptor'
import { useParams } from 'react-router-dom';

const Edits = () => (
    <svg style={{
        width: '2rem',
        height: '2rem'
    }} width={32} height={32} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx={16} cy={16} r={16} fill="#2A2D3E" />
        <path d="M9 19.8754V23H12.1246L21.34 13.7846L18.2154 10.66L9 19.8754ZM23.7563 11.3683C24.0812 11.0433 24.0812 10.5184 23.7563 10.1934L21.8066 8.24372C21.4816 7.91876 20.9567 7.91876 20.6317 8.24372L19.1069 9.7685L22.2315 12.8931L23.7563 11.3683Z" fill="#B43316" />
    </svg>


)

const Achat = () => {

    let { id } = useParams();
    const TypeDachat = (sda: number) => {
        switch (sda) {
            case 1:
                return "Contrat Cadre";
            case 2:
                return "Achat Direct"
            case 3:
                return "Achat d'offre"
            case 4:
                return "Achat en ligne"
        }
    }
    const Situation = (sda: number) => {
        switch (sda) {
            case 1:
                return "Non livré";
            case 2:
                return "Non validé"
            case 3:
                return "livré"
            case 4:
                return "Livraison en cours "
            case 5:
                return "Livraison partielle"
        }
    }

    const [Data, setData] = useState<any | null>(null)

    useEffect(() => {
        const fetchData = async () => {
            await axios.get(`/achats/get/achat/${id}`).then((rsp: any) => setData(rsp.data))
        }
        fetchData();
    }, [])

    return (
        <div className='ContentMain'>
            {
                Data !== null ?
                    <>

                        <div style={{ justifyContent: "flex-start", gap: '1rem', alignItems: 'center' }} className="header">
                            <h1 style={{ color: "#B43316", textTransform: 'capitalize' }}>{`${Data.demandeur} --> ${Data.article.type}`}</h1>
                            <div onClick={() => {

                            }} className="Edits"><Edits /></div>
                        </div>
                        <div className="main">
                            <table style={{ borderCollapse: "none", borderSpacing: "0" }} className="TableAchat">
                                <tbody>
                                    <tr>
                                        <td className="keyTd">Demandeur</td>
                                        <td className="ValueTd">{Data.demandeur}</td>
                                    </tr>
                                    <tr>
                                        <td className="keyTd">Entité</td>
                                        <td className="ValueTd">{Data.entité}</td>
                                    </tr>
                                    <tr>
                                        <td className="keyTd">Type</td>
                                        <td className="ValueTd">{Data.article.type}</td>
                                    </tr>
                                    {
                                        Data.typeDachat === 1 &&
                                        <tr>
                                            <td className="keyTd">Code d'article</td>
                                            <td className="ValueTd">{Data.article.code}</td>
                                        </tr>
                                    }
                                    <tr>
                                        <td className="keyTd">Désignation</td>
                                        <td className="ValueTd">{Data.article.designation}</td>
                                    </tr>
                                    <tr>
                                        <td className="keyTd">Quantité</td>
                                        <td className="ValueTd">{Data.quantité}</td>
                                    </tr>
                                    <tr>
                                        <td className="keyTd">Ligne budgétaire</td>
                                        <td className="ValueTd">{Data.ligne_bugetaire}</td>
                                    </tr>
                                    {
                                        Data.typeDachat !== 1 &&
                                        <tr>
                                            <td className="keyTd">Prix estimatif</td>
                                            <td className="ValueTd">{Data.prix_estimatif ? Data.prix_estimatif : '-----'}</td>
                                        </tr>
                                    }

                                    <tr>
                                        <td className="keyTd">Date de la commande</td>
                                        <td className="ValueTd">{Data.DateDeCommande}</td>
                                    </tr>
                                    <tr>
                                        <td className="keyTd">DA</td>
                                        <td className="ValueTd">{Data.DA ? Data.DA : "-----"}</td>
                                    </tr>
                                    <tr>
                                        <td className="keyTd">Date DA</td>
                                        <td className="ValueTd">{Data.DateDA ? Data.DateDA : "-----"}</td>
                                    </tr>
                                    <tr>
                                        <td className="keyTd">BC</td>
                                        <td className="ValueTd">{Data.BC ? Data.BC : "-----"}</td>
                                    </tr>
                                    <tr>
                                        <td className="keyTd">Date BC</td>
                                        <td className="ValueTd">{Data.DateBC ? Data.DateBC : "-----"}</td>
                                    </tr>
                                    <tr>
                                        <td className="keyTd">{(Data.typeDachat === 1 ? "Contrat" : "Founisseur")}</td>
                                        <td className="ValueTd">{(Data.typeDachat === 1 ? (Data.article.contrat.name ? Data.article.contrat.name : "-----") : (Data.article.fourniseur ? Data.article.fourniseur : "-----"))}</td>
                                    </tr>
                                    <tr>
                                        <td className="keyTd">Type d'achat</td>
                                        <td className="ValueTd">{TypeDachat(Data.typeDachat)}</td>
                                    </tr>
                                    <tr>
                                        <td className="keyTd">Situation d'achat</td>
                                        <td className="ValueTd">{Situation(Data.situation_d_achat)}</td>
                                    </tr>
                                    <tr>
                                        <td className="keyTd">Observation</td>
                                        <td className="ValueTd">{Data.observation ? Data.observation : "-----"}</td>
                                    </tr>
                                    <tr>
                                        <td className="keyTd">BL</td>
                                        <td className="ValueTd">{Data.BL ? Data.BL : "-----"}</td>
                                    </tr>
                                    <tr>
                                        <td className="keyTd">Date BL</td>
                                        <td className="ValueTd">{Data.DateBL ? Data.DateBL : "-----"}</td>
                                    </tr>
                                    <tr>
                                        <td className="keyTd lastTd">Reste</td>
                                        <td className="ValueTd lastTd">{Data.reste ? Data.reste : "-----"}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </>
                    : <h1 style={{ fontSize: '1.5rem' }}>Achat Not Found</h1>
            }
        </div>
    )
}
export default Achat