import './Produit.scss';

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
        width: '2.155rem',
        height: '2.155rem'
    }} width={35} height={35} viewBox="0 0  " fill="none" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
        <circle cx="17.24" cy="17.24" r="17.24" fill="#BD391B" />
        <rect x={6} y={6} width="21.55" height="21.55" fill="url(#pattern0)" />
        <defs>
            <pattern id="pattern0" patternContentUnits="objectBoundingBox" width={1} height={1}>
                <use xlinkHref="#image0_292_24" transform="scale(0.0104167)" />
            </pattern>
            <image id="image0_292_24" width={96} height={96} xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAAACXBIWXMAAAsTAAALEwEAmpwYAAADBUlEQVR4nO2az2oUQRDG5+QpuuhrRFDQVzI+gkdz25NBRMH4LObsgC0K4oPEXAOfDI6yTHamu6q7uubP94Pctmurvl9v907YpiGEEEIIIYSQmYMI3v2tHlAABWwabO0TEBuYTEMBzlCAMxTgDAU4QwHOUIAzFOAMnwsqwwczZyjAGQpwhgKcoQBnKMAZCnCGApyhgHxaAHvt4rULaPs/y/q7fs5zTYE1CwgAHnYBAfhiVX8w6ytpkbUKCIfhGEi4E75WwhoFhGPhFJQwGr5Ggmn4fTM1af+dySO97DLvhMn6g/dKupiLhj3SSC1CbGdmfhKS6ktFFwk50kwNQmo4Sgkm4XdkhZvYkJZ94iBt6rGgDEpy7IiPOFWowkE1vE7cqUGy84/0Vqy+9n7R9i4ZUhV+QkghJ/yS9XMu99z+U5pThz8RUigRfon6ud+sSs0w1WAq54mDtsIzWXp+m575cxWwn1GgO2H9LBprEvv4BuBRwffcDcKxrr94AcVCwng41vUXLyA7JMTDsa4vRtuLpGkpqpCQHo51fRGNNcq+RCFBHo51/WTUwQqa15IUEvThWNdPoljQEwPkMBkS8sOxrh/FLPiDIXI5GhLKhWNdf/EC7oSE8uFY11+8gP8hwS4c6/qLF1DrZybVwl+igNVBAc5QgDMU4AwFOEMBGxBw4z3kjLmuIeCX95Qz5mcNAW+9p5wxb2oIeAzg1nvSGdJlcmouoJfwwXvaGfKuSvi9gHsArrwnnhGfu0yqCTiQ8H7jx9Ftt/Orhz8QcQrgovsGsJGvqDf9rBfVznwP8Pf3nFM8O3jtk8hrf/hOszAAPI8E+jVHGIkL+BQJ88WRNWeRNZcMPm33nwD4HTmD74+su46se0AJcQEvIzv548Tay8jaMwqICwjasxzA08ja7xRQ+PIdwss4AxQ4QngZ68M/KXGJ8jJ2uHyH8DJWgIIPUryMHS7fIbyMBcDg+3vJI23VwOgJlpfxDHYq+GScFFKw+i9mtzZSO2hrE0IIIYQQQgghhBDSCPkDcIdJu0o/inwAAAAASUVORK5CYII=" />
        </defs>
    </svg>


)



const Produit = () => {
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
    const navigate = useNavigate()
    const [isLoading, setLoading] = useState(false)
    const [deleteTab, setDelete] = useState(false);

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
            }).catch((error: any) => console.log(error))
        }
        fetchData();
        setLoading(true);
    }, [])

    useEffect(() => {
        const fetchData = async () => {
            await axios.get('/stock/get_situation_stock/').then((rsp: any) => {
                setSituation(rsp.data)
                console.log(rsp.data)
            }).catch((error: any) => console.log(error))
        }
        if (isAffect)
            fetchData()
    }, [isAffect])
    return (


        !isLoading ? <Loading /> :
            <div className='ContentMain'>
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
                                    axios.post(`/stock/affected_produit/${id}`, queryParams).then((rsp) => {
                                        window.location.reload();
                                    }).catch((error) => console.log(error))
                                }}>Submit</button>
                                <button onClick={() => {
                                    setAffect(false);
                                }}>Cancel</button>
                            </div>
                        </div>
                    </div>
                }
                {
                    Data !== null ?
                        <>
                            <div style={{ justifyContent: "space-between", alignItems: 'center' }} className="header">
                                <h1 style={{ color: "#B43316", textTransform: 'capitalize' }}>{`${Data.serviceTag ? Data.serviceTag : '----'}`}</h1>
                                <div className="btnAchats">
                                    <button onClick={() => {
                                        setAffect(true);
                                    }}>{'Affecté ->'}</button>
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