import './Achat.scss';

import { useState, useEffect } from 'react'
import axios from '../Interceptor'
import { useParams, useNavigate } from 'react-router-dom';
import Loading from '../Loading/Loading';
import { useRecoilValue } from 'recoil';
import { myData } from '../atoms'


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
    }} width={35} height={35} viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
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



const Achat = () => {
    const [fileData, setfileData] = useState<any>({ data: null, name: null })

    const convertDaysToMonthWeeksDays = (days:any) => {
        const months = Math.floor(days / 30);
        const weeks = Math.floor((days % 30) / 7);
        const remainingDays = days - months * 30 - weeks * 7;
        if (days < 0)
            return ('There is an error in your dates')
        if (days === 0)
            return ('1 jour')
        let result = '';
        if (months > 0) {
            result += `${months} mois `;
        }
        if (weeks > 0) {
            result += `${weeks} semaine `;
        }
        if (remainingDays > 0) {
            result += `${remainingDays} jour`;
            if (remainingDays > 1) {
                result += 's';
            }
        }
        return result.trim();
    };

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
            case 5:
                return "Convention Partenari"
        }
    }
    const Situation = (sda: number) => {
        switch (sda) {
            case 1:
                return "Nouveau";
            case 2:
                return "En cours de traitement"
            case 3:
                return "Non Livré"
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
    const my = useRecoilValue(myData)
    useEffect(() => {
        if (Data) {
            const fetchData = async () => {
                const fileResponse = await axios.get(`/achats/get/PV/${id}`, {
                    responseType: 'blob',
                });
                var filename;
                const timestamp = new Date().toISOString().replace(/[-:.]/g, "");
                // Append the timestamp to the filename
                filename = `${timestamp}`;
                const disposition = fileResponse.headers['content-disposition'];
                if (disposition && disposition.indexOf('attachment') !== -1) {
                    const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
                    const matches = filenameRegex.exec(disposition);
                    if (matches != null && matches[1]) {
                        filename = matches[1].replace(/['"]/g, '');
                    }
                }
                const blob = new Blob([fileResponse.data], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
                const url = window.URL.createObjectURL(blob);
                setfileData({ data: url, name: filename });
                setfileData({ data: url, name: filename });
            }
            if (Data.DateBL)
                fetchData()
        }
    }, [Data])
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
                                {
                                    my.is_achat_manager &&
                                    <div className="btnAchats">
                                        <div onClick={() => {

                                            navigate(`/commandes/${id}`)
                                        }} className="Edits"><Edits /></div>
                                        <div onClick={() => {
                                            setDelete(true)
                                        }} className="Edits"><DeleteSvg /></div>
                                    </div>
                                }

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
                                            <td className="keyTd">Fournisseur</td>
                                            <td className="ValueTd">{Data.typeDachat != 1 ? Data.fourniseur : ((Data.achat && Data.achat.lenght) ? Data.achat[0].article.contrat : '----')}</td>
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
                                        <tr>
                                            <td className="keyTd">{'Temps de Validation' + (Data.DateDA ? ' ✔' : '')}</td>
                                            <td className="ValueTd">{Data.TV !== null ? convertDaysToMonthWeeksDays(Data.TV) : '----'}</td>
                                        </tr>
                                        <tr>
                                            <td className="keyTd">{'Temps de Traitement' + (Data.DateBC ? ' ✔' : '')}</td>
                                            <td className="ValueTd">{Data.TT !== null ? convertDaysToMonthWeeksDays(Data.TT) : '----'}</td>
                                        </tr>
                                        <tr>
                                            <td className="keyTd">{'Temps de Livraison' + (Data.DateBL ? ' ✔' : '')}</td>
                                            <td className="ValueTd">{Data.TL !== null ? convertDaysToMonthWeeksDays(Data.TL) : '----'}</td>
                                        </tr>
                                        {
                                            Data.DateBL &&
                                            <tr>
                                                <td className="keyTd">{'Temps de Livraison' + (Data.DateBL ? ' ✔' : '')}</td>
                                                <td className="ValueTd">
                                                    <button onClick={() => {
                                                        const downloadData = () => {
                                                            if (fileData.name) {
                                                                const link = document.createElement('a');
                                                                link.href = fileData.data ? fileData.data : '#';
                                                                link.setAttribute('download', fileData.name ? fileData.name : 'Pv');
                                                                document.body.appendChild(link);
                                                                link.click();
                                                                document.body.removeChild(link);
                                                                return;
                                                            }
                                                        }
                                                        downloadData();
                                                    }}>Donwload PV</button>
                                                </td>
                                            </tr>
                                        }
                                    </tbody>
                                </table>
                                <div className="achatArr">
                                    <div className="headerMain" style={{ paddingRight: "0rem" }}>
                                        <p style={{ width: '45%', color: '#BD391B' }}>Designation</p>
                                        <p style={{ width: '10%', color: '#BD391B' }}>Type</p>
                                        <p style={{ width: '14%', color: '#BD391B' }}>{Data.typeDachat === 1 ? "Code d’article" : "Prix Estimatif"}</p>
                                        <p style={{ width: '18%', color: '#BD391B' }}>{Data.typeDachat === 1 ? "Contrat" : "Fournisseur"}</p>
                                        <p style={{ width: '8%', color: '#BD391B' }}>Quantité</p>
                                        <p style={{ width: 'fit-content', color: '#BD391B' }}>Reste</p>

                                    </div>
                                    <div className="achatZ">

                                        {
                                            Data.achat && Data.achat.map((ele: any, n:number) => {
                                                return (
                                                    <div key={n + '-Achat'} className="achatSD">

                                                        <p style={{ width: '45%' }}>{ele.article.designation}</p>
                                                        <p style={{ width: '10%' }}>{ele.article.type}</p>
                                                        <p style={{ width: '14%' }}>{Data.typeDachat === 1 ? ele.article.code : ele.article.prix_estimatif}</p>
                                                        <p style={{ width: '19%' }}>{Data.typeDachat === 1 ? ele.article.contrat.name : Data.fourniseur}</p>
                                                        <p style={{ width: '8%' }}>{ele.quantité}</p>
                                                        <p style={{ width: 'fit-content' }}>{ele.reste}</p>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                            </div>
                        </>
                        : <h1 style={{ fontSize: '1.5rem' }}>Achat Not Found</h1>
                }
            </div>


    )
}
export default Achat