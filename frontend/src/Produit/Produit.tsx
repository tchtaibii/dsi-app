import './Produit.scss';

import { useState, useEffect } from 'react'
import axios from '../Interceptor'
import { useParams, useNavigate } from 'react-router-dom';
import Loading from '../Loading/Loading';
import Error from '../Error';
import { useRecoilValue } from 'recoil';
import { myData } from '../atoms'


const Produit = () => {
    const my = useRecoilValue(myData)
    const [Data, setData] = useState<any | null>(null)
    const { id } = useParams()
    const [isSituation, setIsst] = useState<boolean>(false)
    const [SituationStock, setSituation] = useState<any>(null)
    interface Querry {
        nom: string | null;
        entité: string | null;
        fonction: string | null;
        date: string | null;
        situation: number | null;
    }
    const [statusCode, setStatuss] = useState({
        color: "#AF4C4C",
        status: "Failed",
        text: "Wrong Inputs",
        is: false
    })
    const [isLoading, setLoading] = useState(false)
    const [queryParams, setQuery] = useState<Querry>({
        nom: null,
        entité: null,
        fonction: null,
        date: null,
        situation: null
    })
    const Situation = (sda: number) => {
        switch (sda) {
            case 1:
                return "NV";
            case 2:
                return "RN"
            case 3:
                return "DT"
            case 4:
                return "ENT"
            case 5:
                return "DP"
            case 6:
                return "Présentation"
            case 7:
                return "ST"
            default:
                return 'Situation..'
        }
    }

    const [isAffect, setAffect] = useState(false)
    useEffect(() => {
        const fetchData = async () => {
            await axios.get(`/stock/get_product/${id}`).then((rsp: any) => {
                setQuery((state: Querry) => ({ ...state, entité: rsp.data.entité }))
                setData(rsp.data)
                if (rsp.data.DateDaffectation) {
                    const date = new Date(rsp.data.DateDaffectation);
                    const year = date.getFullYear();
                    const month = String(date.getMonth() + 1).padStart(2, '0');
                    const day = String(date.getDate()).padStart(2, '0');
                    const hours = String(date.getHours()).padStart(2, '0');
                    const minutes = String(date.getMinutes()).padStart(2, '0');
                    const seconds = String(date.getSeconds()).padStart(2, '0');
                    const formattedDate = `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
                    setData((state: any) => ({ ...state, DateDaffectation: formattedDate }))
                }
            }).catch((error: any) => console.log(error))
        }
        fetchData();
        setLoading(true);
    }, [])

    useEffect(() => {
        const fetchData = async () => {
            await axios.get('/stock/get_situation_stock/').then((rsp: any) => {
                setSituation(rsp.data)
            }).catch((error: any) => console.log(error))
        }
        if (isAffect)
            fetchData()
    }, [isAffect])
    return (
        !isLoading ? <Loading /> :
            <div className='ContentMain'>
                <>
                    {
                        statusCode.is &&
                        <Error statusCode={statusCode} setStatus={setStatuss} />
                    }
                    {
                        isAffect &&
                        <div className="filter">
                            <div className="filterBox">
                                <div className="header">
                                    <h1>Affecté</h1>
                                    <div onClick={() => {
                                    }} style={{ cursor: 'pointer' }}>
                                        {/* <ExitSvg /> */}
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="inputCommande" >
                                        <div className="inputText" style={{ background: "transparent", border: "0.06rem solid #B43316" }} value={queryParams.nom ? queryParams.nom : null}>
                                            <input type="text" onChange={(e: any) => {
                                                const value = e.target.value;
                                                setQuery((state: Querry) => ({ ...state, nom: value }))
                                            }} placeholder="Nom & Prénom" />
                                        </div>
                                    </div>
                                    <div className="inputCommande" >
                                        <div className="inputText" style={{ background: "transparent", border: "0.06rem solid #B43316" }} value={queryParams.entité ? queryParams.entité : null}>
                                            <input type="text" onChange={(e: any) => {
                                                const value = e.target.value;
                                                setQuery((state: Querry) => ({ ...state, entité: value }))
                                            }} placeholder="Entité" />
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="inputCommande" >
                                        <div className="inputText" style={{ background: "transparent", border: "0.06rem solid #B43316" }} value={queryParams.fonction ? queryParams.fonction : null}>
                                            <input type="text" onChange={(e: any) => {
                                                const value = e.target.value;
                                                setQuery((state: Querry) => ({ ...state, fonction: value }))
                                            }} placeholder="Fonction" />
                                        </div>
                                    </div>
                                    <div className="inputCommande" >
                                        <div className="inputText" style={{ background: "transparent", border: "0.06rem solid #B43316" }} value={queryParams.date ? queryParams.date : null}>
                                            <input type="date" onChange={(e: any) => {
                                                const value = e.target.value;
                                                setQuery((state: Querry) => ({ ...state, date: value }))
                                            }} placeholder="Date d'affectation" />
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="inputCommande" >
                                        <div className="inputText" onClick={() => {
                                            setIsst((state: boolean) => !state)
                                        }} style={{ background: 'linear-gradient(180deg, #BABABA 0%, rgba(74, 74, 74, 0.00) 99.99%, rgba(255, 255, 255, 0.00) 100%)', border: "0.06rem solid #B43316" }}>
                                            <input type="text" placeholder="Situation" style={{ cursor: "pointer", caretColor: 'transparent' }} readOnly={true} value={queryParams.situation ? Situation(queryParams.situation) : "Situation"} />
                                        </div>
                                        {
                                            isSituation &&
                                            <div className="typeFilter">
                                                <div className="contType">
                                                    {
                                                        (SituationStock && SituationStock.length > 0) ?
                                                            SituationStock.map((e: any) => (
                                                                <div key={`${e.id}-typede--y`} onClick={() => {
                                                                    setQuery((state: Querry) => ({ ...state, situation: e.id }))
                                                                    setIsst(false)
                                                                }} className="typeCont">
                                                                    {e.situation}
                                                                </div>
                                                            ))
                                                            :
                                                            <div style={{ cursor: "initial" }} className="typeCont">
                                                                No Situation Found
                                                            </div>
                                                    }
                                                </div>

                                            </div>
                                        }
                                    </div>
                                </div>
                                <div style={{ flexDirection: 'row-reverse', justifyContent: 'initial', gap: '1rem' }} className="row">
                                    <button onClick={async () => {
                                        if (queryParams.nom && queryParams.entité && queryParams.fonction && queryParams.date && queryParams.situation) {
                                            axios.post(`/stock/affected_produit/${id}`, queryParams).then((rsp) => {
                                                window.location.reload();
                                            }).catch((error) => {
                                                setStatuss({
                                                    color: "#AF4C4C",
                                                    status: "Failed!",
                                                    text: "Wrong Inputs",
                                                    is: true
                                                });
                                            })
                                        }
                                        else {
                                            setStatuss({
                                                color: "#AF4C4C",
                                                status: "Failed!",
                                                text: "Wrong Inputs",
                                                is: true
                                            });
                                        }

                                    }}>Submit</button>
                                    <button onClick={() => {
                                        setAffect(false);
                                    }}>Cancel</button>
                                </div>
                            </div>
                        </div>
                    }
                </>
                {
                    Data !== null ?
                        <>
                            <div style={{ justifyContent: "space-between", alignItems: 'center' }} className="header">
                                <h1 style={{ color: "#B43316", textTransform: 'capitalize' }}>{`${Data.serviceTag ? Data.serviceTag : '----'}`}</h1>
                                <div className="btnAchats">
                                    {
                                        my.agent_affectation &&
                                        Data.etat === 'Stock' &&
                                        <button onClick={() => {
                                            setAffect(true);
                                        }}>{'Affecté ->'}</button>
                                    }

                                </div>
                            </div>
                            <div className="main">
                                <table style={{ borderCollapse: "none", borderSpacing: "0" }} className="TableAchat">
                                    <tbody>
                                        <tr>
                                            <td className="keyTd">BC</td>
                                            <td className="ValueTd">{Data.BC ? Data.BC : '----'}</td>
                                        </tr>
                                        <tr>
                                            <td className="keyTd">Nom et Prenom</td>
                                            <td className="ValueTd">{Data.NomPrenom ? Data.NomPrenom : '----'}</td>
                                        </tr>
                                        <tr>
                                            <td className="keyTd">Entité</td>
                                            <td className="ValueTd">{Data.entité ? Data.entité : '----'}</td>
                                        </tr>
                                        <tr>
                                            <td className="keyTd">Fonction</td>
                                            <td className="ValueTd">{Data.Fonction ? Data.Fonction : '----'}</td>
                                        </tr>
                                        <tr>
                                            <td className="keyTd">Date d'arrivage</td>
                                            <td className="ValueTd">{Data.DateArrivage ? Data.DateArrivage : '----'}</td>
                                        </tr>
                                        <tr>
                                            <td className="keyTd">Service Tag</td>
                                            <td className="ValueTd">{Data.serviceTag ? Data.serviceTag : '----'}</td>
                                        </tr>
                                        <tr>
                                            <td className="keyTd">Mark</td>
                                            <td className="ValueTd">{Data.mark ? Data.mark : '----'}</td>
                                        </tr>
                                        <tr>
                                            <td className="keyTd">Modéle</td>
                                            <td className="ValueTd">{Data.modele ? Data.modele : '----'}</td>
                                        </tr>
                                        <tr>
                                            <td className="keyTd">Type</td>
                                            <td className="ValueTd">{Data.type ? Data.type : '----'}</td>
                                        </tr>
                                        <tr>
                                            <td className="keyTd">Fournisseur</td>
                                            <td className="ValueTd">{Data.fourniseur ? Data.fourniseur : '----'}</td>
                                        </tr>
                                        <tr>
                                            <td className="keyTd">Date d'affectation</td>
                                            <td className="ValueTd">{Data.DateDaffectation ? Data.DateDaffectation : "-----"}</td>
                                        </tr>
                                        <tr>
                                            <td className="keyTd">Etat</td>
                                            <td className="ValueTd">{Data.etat ? Data.etat : '----'}</td>
                                        </tr>
                                        <tr>
                                            <td className="keyTd">Situation</td>
                                            <td className="ValueTd">{Data.situation ? Situation(Data.situation) : '----'}</td>
                                        </tr>
                                        <tr>
                                            <td className="keyTd">Affécté par</td>
                                            <td className="ValueTd">{Data.affected_by ? Data.affected_by : "-----"}</td>
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
export default Produit