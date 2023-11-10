import './BC.scss';

import { useState, useEffect } from 'react'
import axios from '../Interceptor'
import { useNavigate, useParams } from "react-router-dom";
import Loading from '../Loading/Loading';





const GoSvg = () => (
    <svg style={{
        width: '1.5rem'
    }} width={24} height={22} viewBox="0 0 24 22" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16.7267 0.00195312H10.1812L17.454 11.0019L10.1812 22.0019H16.7267L23.9996 11.0019L16.7267 0.00195312Z" fill="#BD391B" />
        <path d="M6.5451 0.00195312H-0.000488281L7.27239 11.0019L-0.000488281 22.0019H6.5451L13.818 11.0019L6.5451 0.00195312Z" fill="#BD391B" />
    </svg>

)

const AChatU = ({ e, i, bc }) => {
    let navigate = useNavigate();
    useEffect(() => {
        console.log(e)
    }, [e])
    return (
        <div style={{ cursor: 'pointer' }} key={'achat-' + i} className="rowAchats">
            <div className="roww" onClick={() => {
                navigate(`/stocks/${bc}/${e.id}`)
            }} >
                <p style={{ width: '25%', paddingRight: '1.4rem' }}>{e.designation}</p>
                <p style={{ width: '12%' }}>{e.mark.length > 0 ? e.mark : "----"}</p>
                <p style={{ width: '20%' }}>{e.modele.length > 0 ? e.modele : "----"}</p>
                <p style={{ width: '15%' }}>{e.type_id}</p>
                <p style={{ width: '10%' }}>{e.quantité}</p>
                <p style={{ width: '12%' }}>{e.affecté}</p>
                <div className="btnAchat">
                    <GoSvg />
                </div>
            </div>
        </div>
    )
}

const AchatCl = ({ achats, bc }) => {
    return (
        <div className="achatCf">
            {
                achats.map((e: any, i: number) => (
                    <AChatU bc={bc} key={`${i}-achatss`} e={e} i={i} />
                ))
            }
        </div>

    )
}

interface bcType {
    BC: string,
    "fournisseur": string | null,
    "entité": string,
    stocks: any[]
};

const Achats = () => {
    const { id } = useParams()
    const [stock, setStock] = useState<bcType | null>(null)

    const [isLoading, setLoading] = useState(false)
    const fetchDataB = async () => {
        await axios.get(`/stock/stock_bc/${id}`).then((rsp: any) => setStock(rsp.data));
    };
    useEffect(() => {
        fetchDataB();
        console.log(stock)
        setLoading(true)
    }, []);

    return (
        !isLoading ? <Loading /> :
            <>
                {
                    stock &&
                    <div className='ContentMain'>
                        <div className="header">
                            <h1>{`${stock.fournisseur} -> ${stock.BC} -> ${stock.entité}`}</h1>
                        </div>
                        <div style={{ gap: "1.44rem" }} className="main">
                            {
                                stock.stocks.length > 0 ?
                                    <>
                                        <div className="headerMain">
                                            <p style={{ width: '26.3%' }}>Designation</p>
                                            <p style={{ width: '12.3%' }}>Mark</p>
                                            <p style={{ width: '20.3%' }}>Modéle</p>
                                            <p style={{ width: '15%' }}>Type</p>
                                            <p style={{ width: '10%' }}>Quantité</p>
                                            <p>Affecté</p>
                                        </div>
                                        <div className="achatsCL">
                                            <AchatCl bc={stock.BC} achats={stock.stocks} />
                                        </div>

                                    </>
                                    : <h1 style={{ fontSize: '1.5rem' }}>BC incorrect</h1>
                            }
                        </div>
                    </div>

                }
            </>
    )
}
export default Achats