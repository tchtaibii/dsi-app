import './Profile.scss';
import { myData } from '../atoms'; // Import the atom defined earlier
import { useRecoilValue } from 'recoil'
import { useEffect, useState } from 'react';
import DefaultPhoto from '../assets/profile.png'
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../Interceptor'
import Loading from '../Loading/Loading';





// const PhoneSvg = () => (
//     <svg style={{
//         width: "1.0625rem",
//         height: "1.0625rem"
//     }} xmlns="http://www.w3.org/2000/svg" width={17} height={17} viewBox="0 0 17 17" fill="none">
//         <path d="M3.41889 7.35722C4.77889 10.03 6.97 12.2117 9.64278 13.5811L11.7206 11.5033C11.9756 11.2483 12.3533 11.1633 12.6839 11.2767C13.7417 11.6261 14.8844 11.815 16.0556 11.815C16.575 11.815 17 12.24 17 12.7594V16.0556C17 16.575 16.575 17 16.0556 17C7.18722 17 0 9.81278 0 0.944444C0 0.425 0.425 0 0.944444 0H4.25C4.76944 0 5.19444 0.425 5.19444 0.944444C5.19444 2.125 5.38333 3.25833 5.73278 4.31611C5.83667 4.64667 5.76111 5.015 5.49667 5.27944L3.41889 7.35722Z" fill="#434343" />
//     </svg>

// )

const EmailSvg = () => (
    <svg style={{ width: '1.313rem', height: '1.063rem' }} width={21} height={17} viewBox="0 0 21 17" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M18.9 0H2.1C0.945 0 0.0105 0.945 0.0105 2.1L0 14.7C0 15.855 0.945 16.8 2.1 16.8H18.9C20.055 16.8 21 15.855 21 14.7V2.1C21 0.945 20.055 0 18.9 0ZM18.9 4.2L10.5 9.45L2.1 4.2V2.1L10.5 7.35L18.9 2.1V4.2Z" fill="#F1F1F1" />
    </svg>

)


const PersonSvg = () => (
    <svg style={{
        width: "1.05rem",
        height: "1.05rem"
    }} width="{17}" height="{17}" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8.4 8.4C10.7205 8.4 12.6 6.5205 12.6 4.2C12.6 1.8795 10.7205 0 8.4 0C6.0795 0 4.2 1.8795 4.2 4.2C4.2 6.5205 6.0795 8.4 8.4 8.4ZM8.4 10.5C5.5965 10.5 0 11.907 0 14.7V16.8H16.8V14.7C16.8 11.907 11.2035 10.5 8.4 10.5Z" fill="#F1F1F1" />
    </svg>

)
const Profile = () => {
    const { id } = useParams()
    const data = useRecoilValue(myData);
    const [isLoading, setLoading] = useState(false)
    const [Data, setData] = useState<any | null>(null)

    const EditDate = (str: any) => {
        const date = new Date(str);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        const formattedDate = `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
        return formattedDate;
    }
    const [dataApi, setApiData] = useState<null | any>(null)

    useEffect(() => {
        const fetchData = async () => {
            const apiId = id ? id : data.id
            if (id) {
                await axios.get(`/auth/get_profile/${id}`).then((rsp: any) => {
                    setApiData(rsp.data)
                }).catch((error: any) => console.log(error))
            }
            await axios.get(`/stock/user_stock_affectations/${apiId}`).then((rsp: any) => {
                setData(rsp.data.stocks)
                console.log(rsp.data.stocks)
            }).catch((error: any) => console.log(error))
        }
        fetchData()
        setLoading(true)
    }, [])
    const navigate = useNavigate()

    const Proffession = (x: any) => {
        if (x.is_achat_manager && x.agent_affectation)
            return "Achat Manager & Agent d'afféctation"
        else if (x.is_achat_manager)
            return "Achat Manager"
        else if (x.is_reception && x.agent_affectation)
            return "Receprionist & Agent d'afféctation"
        else if (x.is_reception)
            return "Receprionist"
        else if (x.agent_affectation)
            return "Agent d'afféctation"
        else if (x.is_superuser)
            return "Admin"
    }

    return (
        !isLoading ? <Loading /> :
            <div className='ContentMain'>
                <div style={{ justifyContent: "space-between", alignItems: 'center' }} className="header">
                    <h1 style={{ textTransform: 'capitalize' }}>{`Profile`}</h1>
                </div>
                <div className="main">
                    <div className="mainmain">
                        <div className="cardProfile">
                            <img src={data.avatar ? data.avatar : DefaultPhoto} className="profilePhoto" />
                            <div className='infoText'>
                                <h1 style={{ textTransform: 'capitalize', textAlign : 'center' }}>{`${((id && dataApi) ? dataApi.first_name : data.first_name)} ${((id && dataApi) ? dataApi.last_name : data.last_name)}`}</h1>
                                <div className="emailP">
                                    <EmailSvg />
                                    {((id && dataApi) ? dataApi.email : data.email)}
                                </div>
                                <div className="emailP">
                                    <PersonSvg />
                                    {Proffession(((id && dataApi) ? dataApi : data))}
                                </div>
                            </div>
                        </div>

                    </div>
                    {
                        ((id && dataApi) ? dataApi.agent_affectation :
                            data.agent_affectation) &&
                        <>
                            <h1 style={{ fontSize: '1.2rem', marginBottom: '-1rem' }}>{'Produit Affecté'}</h1>
                            <table className="blueTable">
                                <thead>
                                    <tr>
                                        <th>{'Nom & Prenom'}</th>
                                        <th>{'Fonction'}</th>
                                        <th>{'Entité'}</th>
                                        <th>{'Service Tag'}</th>
                                        <th>{"Date d'affectation"}</th>
                                        <th>{'Mark'}</th>
                                        <th>{'Modéle'}</th>
                                        <th>{'Type'}</th>
                                        <th>{'Etat'}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        (Data && Data.length > 0) ?
                                            Data.map((e: any) => (
                                                < tr key={`affecté-${e.stock_id}`} onClick={() => {
                                                    navigate(`/produit/${e.stock_id}`)
                                                }}>
                                                    <td>{e.NomPrenom ? e.NomPrenom : '---'}</td>
                                                    <td>{e.Fonction ? e.Fonction : '---'}</td>
                                                    <td>{e.entité ? e.entité : '---'}</td>
                                                    <td>{e.serviceTag ? e.serviceTag : '---'}</td>
                                                    <td>{e.DateDaffectation ? EditDate(e.DateDaffectation) : '---'}</td>
                                                    <td>{e.mark ? e.mark : '---'}</td>
                                                    <td>{e.modele ? e.modele : '---'}</td>
                                                    <td>{e.type}</td>
                                                    <td>{e.etat ? e.etat : '---'}</td>
                                                </tr>
                                            ))
                                            : (
                                                <tr>
                                                    <td colSpan={9}>Aucun Produit Affécté</td>
                                                </tr>
                                            )
                                    }
                                </tbody>
                            </table>
                        </>
                    }



                </div>

            </div>
    )
}
export default Profile