import './Affecté.scss';

import { useState, useEffect } from 'react'
import axios from '../Interceptor'
import { useNavigate, useParams } from "react-router-dom";
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
    return (
        <div style={{ cursor: 'pointer' }} key={'achat-' + i} className="rowAchatss">
            <div className="roww" onClick={() => {
                navigate(`/BC/${e.id}`)
            }} >
                <p style={{ width: '33.3%' }}>{e.BC}</p>
                <p style={{ width: '33.3%' }}>{e.entité}</p>
                <p style={{ width: 'fit-content' }}>{e.fourniseur}</p>
            </div>
            {
                showMore &&
                <div className="achatArr">
                    <div className="headerMain" style={{ paddingRight: "0rem" }}>
                        <p style={{ width: '45%', color: '#BD391B' }}>Designation</p>
                        <p style={{ width: '20%', color: '#BD391B' }}>Type</p>
                        <p style={{ width: '15%', color: '#BD391B' }}>Quantité</p>
                        <p style={{ width: '15%', color: '#BD391B' }}>Affecté</p>
                    </div>
                    <div className="achatZ">

                        {
                            e.stocks && e.stocks.map((ele: any) => {
                                return (
                                    <div className="achatSD">

                                        <p style={{ width: '45%' }}>{ele.designation}</p>
                                        <p style={{ width: '20%' }}>{ele.type}</p>
                                        <p style={{ width: '15%' }}>{ele.quantité}</p>
                                        <p style={{ width: '13%' }}>{ele.affecté}</p>
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

const AchatCl = ({ achats, TypeDachat }) => {
    return (
        <div className="achatCff">
            {
                achats.map((e: any, i: number) => (
                    <AChatU key={`${i}-stocks`} e={e} i={i} />
                ))
            }
        </div>

    )
}

const Achats = () => {
    const [isLoading, setLoading] = useState(false)
    const [Stock1, setStock1] = useState([])
    const [Stock2, setStock2] = useState([])
    const fetchDataB = async () => {
        await axios.get('/stock/all_inStock/').then((rsp: any) => {
            const halfLength = Math.ceil(rsp.data.length / 2);
            const firstHalf = rsp.data.slice(0, halfLength);
            const secondHalf = rsp.data.slice(halfLength);
            setStock1(firstHalf)
            setStock2(secondHalf)
        }
        )
    };
    useEffect(() => {
        fetchDataB();
        setLoading(true)
    }, []);

    return (
        !isLoading ? <Loading /> :
            <div className='ContentMain'>
                <div className="header">
                    <h1>Stocks</h1>
                </div>
                <div style={{ gap: "1.44rem" }} className="main">
                    {
                        Stock1.length > 0 ?
                            <>
                                <div className="headerMain">
                                    <p style={{ width: '16.66%' }}>BC</p>
                                    <p style={{ width: '16.66%' }}>Entité</p>
                                    <p style={{ width: '20%' }}>Fournisseur</p>
                                    {
                                        Stock1.length > 1 &&
                                        <>
                                            <p style={{ width: '17.5%' }}>BC</p>
                                            <p style={{ width: '16.66%' }}>Entité</p>
                                            <p style={{ width: 'fit-content' }}>Fournisseur</p>
                                        </>
                                    }


                                </div>
                                <div style={{ flexDirection: 'row' }} className="achatsCLL">
                                    <AchatCl achats={Stock1} />
                                    <AchatCl achats={Stock2} />
                                </div>

                            </>
                            : <h1 style={{ fontSize: '1.5rem' }}>No Stock</h1>
                    }
                </div>
            </div >
    )
}
export default Achats