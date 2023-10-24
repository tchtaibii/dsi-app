import './Achat.scss';

import { useState, useEffect } from 'react'
import axios from '../Interceptor'
import { useParams, useNavigate } from 'react-router-dom';
import Loading from '../Loading/Loading';


const DeleteSvg = () => (
    <svg style={{
        width: "2.125rem",
        height: "2.125rem"
    }} width={34} height={34} viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx={17} cy={17} r={17} fill="#BD391B" />
        <path d="M11.8571 22.8039C11.8571 23.7529 12.6286 24.5294 13.5714 24.5294H20.4286C21.3714 24.5294 22.1429 23.7529 22.1429 22.8039V12.451H11.8571V22.8039ZM23 9.86275H20L19.1429 9H14.8571L14 9.86275H11V11.5882H23V9.86275Z" fill="white" />
    </svg>


)
const Edits = () => (
    <svg style={{
        width: '2rem',
        height: '2rem'
    }} width={32} height={32} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx={16} cy={16} r={16} fill="#BD391B" />
        <path d="M9 19.8754V23H12.1246L21.34 13.7846L18.2154 10.66L9 19.8754ZM23.7563 11.3683C24.0812 11.0433 24.0812 10.5184 23.7563 10.1934L21.8066 8.24372C21.4816 7.91876 20.9567 7.91876 20.6317 8.24372L19.1069 9.7685L22.2315 12.8931L23.7563 11.3683Z" fill="white" />
    </svg>

)

const Achat = () => {

    let { id } = useParams();
    const TypeDachat = (sda: number) => {
        switch (sda) {
            case 1:
                return "Accord Cadre";
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
                return "Nouveau";
            case 2:
                return "En cours de traitement"
            case 3:
                return "En cours de livraison"
            case 4:
                return "Livré"
            case 5:
                return "Livraison partielle"
        }
    }

    const [Data, setData] = useState<any | null>(null)

    useEffect(() => {
        const fetchData = async () => {
            await axios.get(`/achats/get/achat/${id}`).then((rsp: any) => {
                setData(rsp.data)
            })
        }
        fetchData();
        setLoading(true);
    }, [])

    const navigate = useNavigate()
    const [isLoading, setLoading] = useState(false)
    const [deleteTab, setDelete] = useState(false);

    return (


        !isLoading ? <Loading /> :
            <div className='ContentMain'>
                {
                    deleteTab &&
                    <div className="filter">
                        <div style={{ width: '30rem' }} className="filterBox">
                            <div style={{ width: '100%', justifyContent: 'center' }} className="header">
                                <h1>Supprimer cette achats?</h1>
                            </div>

                            <div style={{ flexDirection: 'row-reverse', justifyContent: 'center', gap: '1rem' }} className="row">
                                <button style={{ background: 'green' }} onClick={async () => {
                                    setLoading(false);
                                    await axios.delete(`/achats/deleteAchats/${id}`).then((rsp) => setLoading(true))
                                    navigate(`/`)
                                }}>Delete</button>
                                <button onClick={() => {
                                    setDelete(false)
                                }}>Cancel</button>
                            </div>
                        </div>
                    </div>
                }
                {
                    Data !== null ?
                        <>
                            <div style={{ justifyContent: "space-between", alignItems: 'center' }} className="header">
                                <h1 style={{ color: "#B43316", textTransform: 'capitalize' }}>{`${Data.demandeur}`}</h1>
                                <div className="btnAchats">
                                    <div onClick={() => {

                                        navigate(`/commandes/${id}`)
                                    }} className="Edits"><Edits /></div>
                                    <div onClick={() => {
                                        setDelete(true)
                                    }} className="Edits"><DeleteSvg /></div>
                                </div>
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
                                            <td className="keyTd">Ligne budgétaire</td>
                                            <td className="ValueTd">{Data.ligne_bugetaire}</td>
                                        </tr>
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
                                            <td className="keyTd">BC Document</td>
                                            <td className="ValueTd">
                                                {
                                                    Data.BC_File && Data.BC ? <button onClick={async () => {
                                                        await axios.get(`/achats/download_file/${Data.BC}`)
                                                    }}>Download</button> : "-----"
                                                }

                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="keyTd">Type d'achat</td>
                                            <td className="ValueTd">{TypeDachat(Data.typeDachat)}</td>
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
                                            <td className="keyTd">BL Document</td>
                                            <td className="ValueTd">
                                                {
                                                    Data.BL_File && Data.BL ? <button onClick={async () => {
                                                        await axios.get(`/achats/download_file/${Data.BL}`)
                                                    }}>Download</button> : "-----"
                                                }

                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="keyTd">Situation d'achat</td>
                                            <td className="ValueTd">{Situation(Data.situation_d_achat)}</td>
                                        </tr>
                                        <tr>
                                            <td className="keyTd">Observation</td>
                                            <td className="ValueTd">{Data.observation ? Data.observation : "-----"}</td>
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