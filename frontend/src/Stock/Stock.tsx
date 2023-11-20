import './Stock.scss';
import { useEffect, useState } from 'react';
import axios from '../Interceptor';
import { useParams, useNavigate } from 'react-router-dom';
import Loading from '../Loading/Loading';
import { useRecoilValue } from 'recoil';
import { myData } from '../atoms'



const MoreArrowSvg = () => (
    <svg style={{
        width: "1.0rem"
    }} width={22} height={24} viewBox="0 0 22 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M22 16.7272V10.1816L11 17.4545L7.55787e-05 10.1816V16.7272L11 24.0001L22 16.7272Z" fill="#BD391B" />
        <path d="M22 6.54559V0L11 7.27288L7.55787e-05 0V6.54559L11 13.8185L22 6.54559Z" fill="#BD391B" />
    </svg>

)
const Search = () => (
    <svg style={{ width: "1.5rem", cursor: 'pointer' }} xmlns="http://www.w3.org/2000/svg" width={31} height={31} viewBox="0 0 31 31" fill="none">
        <path d="M22.3427 18.9167H20.9889L20.5091 18.4554C22.1885 16.5079 23.1996 13.9796 23.1996 11.2292C23.1996 5.09625 18.2128 0.125 12.0606 0.125C5.90847 0.125 0.921631 5.09625 0.921631 11.2292C0.921631 17.3621 5.90847 22.3333 12.0606 22.3333C14.8196 22.3333 17.3559 21.3254 19.3095 19.6513L19.7722 20.1296V21.4792L28.3407 30.0038L30.8941 27.4583L22.3427 18.9167ZM12.0606 18.9167C7.79352 18.9167 4.34901 15.4829 4.34901 11.2292C4.34901 6.97542 7.79352 3.54167 12.0606 3.54167C16.3277 3.54167 19.7722 6.97542 19.7722 11.2292C19.7722 15.4829 16.3277 18.9167 12.0606 18.9167Z" fill="#52535C" />
    </svg>

)


const AChatU = ({ e, i, is_achat_manager }) => {
    const [showMore, setMore] = useState(false)
    let navigate = useNavigate();
    useEffect(() => {
        console.log(e)
    }, [e])
    return (
        <div style={{ cursor: 'pointer' }} key={'achat-' + i} className="rowAchats">
            <div style={{ height: '7.211rem', justifyContent: 'initial', paddingRight: '0rem' }} className="roww">
                <p style={{ width: '60%' }}>{e.designation}</p>
                <p style={{ width: '6.80rem', textAlign: 'center', marginRight: '6.5rem' }}>{is_achat_manager ? e.quantité : ''}</p>
                <p style={{ width: '3.1rem', maxWidth: '6rem', textAlign: 'center', marginRight: '7.2rem' }}>{is_achat_manager ? e.valable : e.quantité}</p>
                <p style={{ width: '6.1rem', textAlign: 'center', marginRight: '5rem' }}>{is_achat_manager ? e.reste : e.affecté}</p>
            </div>
            {
                is_achat_manager && showMore &&
                <div className="achatArr">
                    <div className="headerMain" style={{ paddingRight: "0rem" }}>
                        <p style={{ width: '30%', color: '#BD391B' }}>Demandeur</p>
                        <p style={{ width: '20%', color: '#BD391B' }}>Entité</p>
                        <p style={{ width: '20%', color: '#BD391B' }}>DA</p>
                        <p style={{ width: '20%', color: '#BD391B' }}>BC</p>
                        <p style={{ width: '10%', color: '#BD391B' }}>Achat Status</p>
                    </div>
                    <div className="achatZ">

                        {
                            e.DA && e.DA.map((ele: any) => {
                                return (
                                    <div className="achatSD" onClick={() => {
                                        navigate(`/achat/${ele.id}`)
                                    }} >
                                        <p style={{ width: '30%' }}>{ele.demandeur}</p>
                                        <p style={{ width: '20%' }}>{ele.entité}</p>
                                        <p style={{ width: '20%' }}>{ele.DA}</p>
                                        <p style={{ width: '20%' }}>{ele.BC}</p>
                                        <p style={{ width: '10%' }}>{ele.isComplet ? 'Livré' : 'Non Livré'}</p>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            }
            {
                is_achat_manager &&
                <div onClick={() => {
                    setMore((state: any) => (!state))
                }} className="More">
                    <MoreArrowSvg />
                </div>
            }

        </div>
    )
}


const AchatCl = ({ data, is_achat_manager }) => {
    return (
        <div className="achatCf">
            {
                data.map((e: any, i: number) => (
                    <AChatU is_achat_manager={is_achat_manager} key={`${i}-article-des`} e={e} i={i} />
                ))
            }
        </div>

    )
}

const Stock = () => {
    const my = useRecoilValue(myData)
    let navigate = useNavigate();
    const { type } = useParams()
    const [Data, setData] = useState([])
    const [backUp, setBackUp] = useState([])
    useEffect(() => {
        const fetchData = async () => {
            if (my.is_achat_manager || my.is_superuser) {
                if (!type)
                    await axios.get('/achats/stock_types/').then((rsp: any) => {
                        rsp.data.sort((a: any, b: any) => (my.is_reception ? (a.quantity - b.quantity) : (a.Demande - b.Demande)));
                        setData(rsp.data.reverse())
                    });
                else
                    await axios.get(`/achats/stock_article/${type}`).then((rsp: any) => setData(rsp.data.reverse()));
            }
            else if (my.is_reception) {
                if (!type)
                    await axios.get('/stock/types_in_stock/').then((rsp: any) => {
                        rsp.data.sort((a: any, b: any) => (my.is_reception ? (a.quantity - b.quantity) : (a.Demande - b.Demande)));
                        setData(rsp.data.reverse())
                    });
                else
                    await axios.get(`/stock/stocks_by_type/${type}`).then((rsp: any) => setData(rsp.data.reverse()));
            }

        }
        setLoading(false)

        fetchData();
        setLoading(true)
    }, [type])

    useEffect(() => {
        setBackUp(Data)
    }, [Data])
    const [isLoading, setLoading] = useState(false)

    return (
        <div className='ContentMain'>
            <div className="header">
                <h1>{(my.is_achat_manager || my.is_reception) && (type ? type : (Data.length > 0 ? "Stock" : "No type artcile with this name"))}</h1>
                <div style={{ border: '0.06rem solid #bd391b', width: '20rem' }} className="search">
                    <input onKeyPress={() => { }} onClick={() => { }} onChange={(e: any) => {
                        const value = e.target.value;
                        if (my.is_achat_manager || my.is_reception) {
                            if (value === '' || value === null)
                                setBackUp(Data.map((e) => e))
                            if (!type)
                                setBackUp(Data.filter((e) => e.type === value || e.type.includes(value) || e.type.toUpperCase().includes(value.toUpperCase())));
                            else
                                setBackUp(Data.filter((e) => e.designation === value || e.designation.includes(value) || e.designation.toUpperCase().includes(value.toUpperCase())));
                        }
                    }} type="text" placeholder='Search...' />
                    <div onClick={() => { }}>
                        <Search />
                    </div>
                </div>
            </div>
            {
                <>
                    {
                        !isLoading ? <Loading /> :
                            <div className="main">
                                {
                                    !type ?
                                        <>
                                            <div className="headerStock">
                                                {
                                                    backUp.length >= 1 &&
                                                    <div className="s1h">
                                                        <p style={{ width: '50%' }}>Type</p>
                                                        <p style={{ position: 'relative', left: '1rem' }}>{my.is_reception ? 'Stock' : 'Demande'}</p>
                                                        <p style={{ position: 'relative', left: '-0.7rem' }}>{my.is_reception ? 'Affecté' : 'Livré'}</p>
                                                    </div>
                                                }
                                                {
                                                    backUp.length > 1 &&
                                                    <div style={{ paddingLeft: '1.5rem' }} className="s1h">
                                                        <p style={{ width: '48%' }}>Type</p>
                                                        <p style={{ position: 'relative', left: '-0.1rem' }}>{my.is_reception ? 'Stock' : 'Demande'}</p>
                                                        <p style={{ position: 'relative', left: '-1.8rem' }}>{my.is_reception ? 'Affecté' : 'Livré'}</p>
                                                    </div>
                                                }
                                            </div>
                                            <div className="stocks">
                                                {
                                                    backUp.length > 0 &&
                                                    backUp.map((e: any) => {
                                                        return (
                                                            <div onClick={() => {
                                                                navigate(`/stock/${e.type}`)
                                                            }} className="stock">
                                                                <p style={{ width: '68%' }}>{e.type}</p>
                                                                <p style={{ width: '20%' }}>{my.is_reception ? e.quantity : e.Demande}</p>
                                                                <p style={{ width: 'fit-content' }}>{my.is_reception ? e.affecté : e.Livré}</p>
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </div>
                                        </>
                                        :
                                        <>
                                            {
                                                backUp.length > 0 &&
                                                <>
                                                    <div style={{ paddingRight: 0, justifyContent: 'initial' }} className="headerMain">
                                                        <p style={{ width: '60%' }}>Designation</p>
                                                        <p style={{ width: '13%' }}>{my.is_achat_manager ? 'Demandes' : ''}</p>
                                                        <p style={{ width: '10%' }}>{my.is_achat_manager ? 'Livré' : 'Stock'}</p>
                                                        <p style={{ width: '10%' }}>{my.is_achat_manager ? 'Non Livré' : 'Affecté'}</p>
                                                    </div>
                                                    <div className="achatsCL">
                                                        <AchatCl is_achat_manager={my.is_achat_manager} data={backUp} />
                                                    </div>
                                                </>
                                            }

                                        </>

                                }
                            </div>
                    }
                </>
            }
        </div>
    )
}
export default Stock