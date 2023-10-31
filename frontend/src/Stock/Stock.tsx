import './Stock.scss';
import { useEffect, useState } from 'react';
import axios from '../Interceptor';
import { useParams, useNavigate } from 'react-router-dom';
import Loading from '../Loading/Loading';

const MoreArrowSvg = () => (
    <svg style={{
        width: "1.0rem"
    }} width={22} height={24} viewBox="0 0 22 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M22 16.7272V10.1816L11 17.4545L7.55787e-05 10.1816V16.7272L11 24.0001L22 16.7272Z" fill="#BD391B" />
        <path d="M22 6.54559V0L11 7.27288L7.55787e-05 0V6.54559L11 13.8185L22 6.54559Z" fill="#BD391B" />
    </svg>

)

const AChatU = ({ e, i }) => {
    const [showMore, setMore] = useState(false)
    let navigate = useNavigate();
    useEffect(() => {
        console.log(e)
    }, [e])
    return (
        <div style={{ cursor: 'pointer' }} key={'achat-' + i} className="rowAchats">
            <div style={{ height: '7.211rem', justifyContent: 'initial', paddingRight: '0rem' }} className="roww">
                <p style={{ width: '60%' }}>{e.designation}</p>
                <p style={{ width: '6.80rem', textAlign: 'center', marginRight: '6.5rem' }}>{e.quantité}</p>
                <p style={{ width: '3.1rem', maxWidth: '6rem', textAlign: 'center', marginRight: '7.2rem' }}>{e.valable}</p>
                <p style={{ width: '6.1rem', textAlign: 'center', marginRight: '5rem' }}>{e.reste}</p>
                <p style={{ width: '' }}>{'--'}</p>
            </div>
            {
                showMore &&
                <div className="achatArr">
                    <div className="headerMain" style={{ paddingRight: "0rem" }}>
                        <p style={{ width: '50%', color: '#BD391B' }}>Demandeur</p>
                        <p style={{ width: '20%', color: '#BD391B' }}>Entité</p>
                        <p style={{ width: '20%', color: '#BD391B' }}>DA</p>
                        <p style={{ width: '10%', color: '#BD391B' }}>Achat Status</p>
                    </div>
                    <div className="achatZ">

                        {
                            e.DA && e.DA.map((ele: any) => {
                                return (
                                    <div className="achatSD" onClick={() => {
                                        navigate(`/achat/${ele.id}`)
                                    }} >
                                        <p style={{ width: '50%' }}>{ele.demandeur}</p>
                                        <p style={{ width: '20%' }}>{ele.entité}</p>
                                        <p style={{ width: '20%' }}>{ele.DA}</p>
                                        <p style={{ width: '10%' }}>{ele.isComplet ? 'Livré' : 'Non Livré'}</p>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            }
            <div onClick={() => {
                setMore((state: any) => (!state))
            }} className="More">
                <MoreArrowSvg />
            </div>
        </div>
    )
}


const AchatCl = ({ data }) => {
    return (
        <div className="achatCf">
            {
                data.map((e: any, i: number) => (
                    <AChatU key={`${i}-article-des`} e={e} i={i} />
                ))
            }
        </div>

    )
}


const Stock = () => {
    let navigate = useNavigate();
    const { type } = useParams()
    const [Data, setData] = useState([])
    useEffect(() => {
        const fetchData = async () => {
            if (!type)
                await axios.get('/achats/stock_types/').then((rsp: any) => {
                    rsp.data.sort((a: any, b: any) => a.Demande - b.Demande);
                    setData(rsp.data.reverse())
                });
            else
                await axios.get(`/achats/stock_article/${type}`).then((rsp: any) => setData(rsp.data.reverse()));
        }
        setLoading(false)
        fetchData();
        setLoading(true)
    }, [type])
    const [isLoading, setLoading] = useState(false)

    return (
        <div className='ContentMain'>
            <div className="header">
                <h1>Stock</h1>
            </div>
            {
                !isLoading ? <Loading /> :
                    <div className="main">
                        {
                            !type ?
                                <>
                                    <div className="headerStock">
                                        <div className="s1h">
                                            <p style={{ width: '50%' }}>Type</p>
                                            <p>Demande</p>
                                            <p>Livré</p>
                                            <p>Affécté</p>
                                        </div>
                                        {
                                            Data.length > 1 &&
                                            <div style={{ paddingLeft: '1.5rem' }} className="s1h">
                                                <p style={{ width: '48%' }}>Type</p>
                                                <p style={{ position: 'relative', left: '-0.1rem' }}>Demande</p>
                                                <p style={{ position: 'relative', left: '-0.6rem' }}>Livré</p>
                                                <p style={{ position: 'relative', left: '-0.6rem' }}>Affécté</p>
                                            </div>
                                        }
                                    </div>
                                    <div className="stocks">
                                        {
                                            Data.length > 0 &&
                                            Data.map((e: any) => {
                                                return (
                                                    <div onClick={() => {
                                                        navigate(`/stock/${e.type}`)
                                                    }} className="stock">
                                                        <p style={{ width: '58%' }}>{e.type}</p>
                                                        <p style={{ width: '16.2%' }}>{e.Demande}</p>
                                                        <p style={{ width: '16%' }}>{e.Livré}</p>
                                                        <p>--</p>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                </>
                                :
                                <>
                                    <div style={{ paddingRight: 0, justifyContent: 'initial' }} className="headerMain">
                                        <p style={{ width: '60%' }}>Designation</p>
                                        <p style={{ width: '13%' }}>Demandes</p>
                                        <p style={{ width: '10%' }}>Livré</p>
                                        <p style={{ width: '10%' }}>Non Livré</p>
                                        <p style={{ width: 'fit-content' }}>Affecté</p>
                                    </div>
                                    <div className="achatsCL">
                                        <AchatCl data={Data} />
                                    </div>

                                </>

                        }
                    </div>
            }
        </div>
    )
}
export default Stock