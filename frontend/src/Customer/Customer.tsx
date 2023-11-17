import './Customer.scss';
import { useEffect, useState } from 'react';
import DefaultPhoto from '../assets/profile.png'
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../Interceptor'
import Loading from '../Loading/Loading';

const Customer = () => {
    const [isLoading, setLoading] = useState(false)
    const [Data, setData] = useState<any[]>([])

    const navigate = useNavigate()
    useEffect(() => {
        const fetchData = async () => {
            await axios.get('/auth/all/').then((rsp: any) => setData(rsp.data)).catch((error: any) => console.log(error))
        }
        fetchData()
        setLoading(true)
    }, [])
    return (
        !isLoading ? <Loading /> :
            <div className='ContentMain'>
                <div style={{ justifyContent: "space-between", alignItems: 'center' }} className="header">
                    <h1>Customers</h1>
                </div>
                <div style={{ flexDirection: 'row', flexWrap: 'wrap', gap: '0.5rem' }} className="main">
                    {
                        Data && Data.map((e: any) => (
                            <div style={{ cursor: 'pointer' }} onClick={() => {
                                navigate(`/profile/${e.id}`)
                            }} className="cardProfile">
                                <img className='cardAvatar' src={e.avatar ? e.avatar : DefaultPhoto} />
                                <h1>{`${e.first_name + ' ' + e.last_name}`}</h1>
                            </div>
                        ))
                    }

                </div>
            </div>
    )
}
export default Customer