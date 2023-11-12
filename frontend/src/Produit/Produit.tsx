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
    useEffect(() => {
        const fetchData = async () => {
            await axios.get(`/stock/get_product/${id}`).then((rsp: any) => {
                setData(rsp.data)
                console.log(rsp.data)
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
                                <h1 style={{ color: "#B43316", textTransform: 'capitalize' }}>{`${Data.serviceTag ? Data.serviceTag : '----'}`}</h1>
                                <div className="btnAchats">
                                    <div onClick={() => {

                                        // navigate(`/commandes/${id}`)
                                    }} className="Edits"><Edits /></div>
                                    <div onClick={() => {
                                        // setDelete(true)
                                    }} className="Edits"><DeleteSvg /></div>
                                </div>
                            </div>
                            <div className="main">
                                <table style={{ borderCollapse: "none", borderSpacing: "0" }} className="TableAchat">
                                    <tbody>
                                        <tr>
                                            <td className="keyTd">BC</td>
                                            <td className="ValueTd">{Data.BC}</td>
                                        </tr>
                                        <tr>
                                            <td className="keyTd">Nom et Prenom</td>
                                            <td className="ValueTd">{Data.NomPrenom}</td>
                                        </tr>
                                        <tr>
                                            <td className="keyTd">Entité</td>
                                            <td className="ValueTd">{Data.entité}</td>
                                        </tr>
                                        <tr>
                                            <td className="keyTd">Fonction</td>
                                            <td className="ValueTd">{Data.Fonction}</td>
                                        </tr>
                                        <tr>
                                            <td className="keyTd">Date d'arrivage</td>
                                            <td className="ValueTd">{Data.DateArrivage}</td>
                                        </tr>
                                        <tr>
                                            <td className="keyTd">Service Tag</td>
                                            <td className="ValueTd">{Data.serviceTag}</td>
                                        </tr>
                                        <tr>
                                            <td className="keyTd">Mark</td>
                                            <td className="ValueTd">{Data.mark}</td>
                                        </tr>
                                        <tr>
                                            <td className="keyTd">Modéle</td>
                                            <td className="ValueTd">{Data.modele}</td>
                                        </tr>
                                        <tr>
                                            <td className="keyTd">Type</td>
                                            <td className="ValueTd">{Data.type}</td>
                                        </tr>
                                        <tr>
                                            <td className="keyTd">Date BC</td>
                                            <td className="ValueTd">{Data.DateDaffectation ? Data.DateDaffectation : "-----"}</td>
                                        </tr>
                                        <tr>
                                            <td className="keyTd">Etat</td>
                                            <td className="ValueTd">{Data.etat}</td>
                                        </tr>
                                        <tr>
                                            <td className="keyTd">Situation</td>
                                            <td className="ValueTd">{Data.situation}</td>
                                        </tr>
                                        <tr>
                                            <td className="keyTd">Affecté par</td>
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