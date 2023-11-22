import './Article.scss';
import { useEffect, useState } from 'react';
import axios from '../Interceptor';
import { useParams, useNavigate } from 'react-router-dom';
import Loading from '../Loading/Loading';
import { useRecoilValue } from 'recoil';
import { myData } from '../atoms'


const Search = () => (
    <svg style={{ width: "1.5rem", cursor: 'pointer' }} xmlns="http://www.w3.org/2000/svg" width={31} height={31} viewBox="0 0 31 31" fill="none">
        <path d="M22.3427 18.9167H20.9889L20.5091 18.4554C22.1885 16.5079 23.1996 13.9796 23.1996 11.2292C23.1996 5.09625 18.2128 0.125 12.0606 0.125C5.90847 0.125 0.921631 5.09625 0.921631 11.2292C0.921631 17.3621 5.90847 22.3333 12.0606 22.3333C14.8196 22.3333 17.3559 21.3254 19.3095 19.6513L19.7722 20.1296V21.4792L28.3407 30.0038L30.8941 27.4583L22.3427 18.9167ZM12.0606 18.9167C7.79352 18.9167 4.34901 15.4829 4.34901 11.2292C4.34901 6.97542 7.79352 3.54167 12.0606 3.54167C16.3277 3.54167 19.7722 6.97542 19.7722 11.2292C19.7722 15.4829 16.3277 18.9167 12.0606 18.9167Z" fill="#52535C" />
    </svg>

)


const AChatU = ({ e, i }) => {
    let navigate = useNavigate();

    return (
        <div style={{ cursor: 'pointer' }} key={'achat-' + i} className="rowAchats">
            <div style={{ height: '7.211rem', width: '102.625rem', justifyContent: 'flex-start', paddingRight: '0rem', flexGrow : '1' }} className="roww">
                <p style={{ width: '15%' }}>{e.code}</p>
                <p style={{ width: '60%' }}>{e.designation}</p>
                <p style={{ width: 'fit-content' }}>{e.type}</p>
            </div>
        </div >
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

const Article = () => {
    const my = useRecoilValue(myData)
    let navigate = useNavigate();
    const { id } = useParams()
    const [Data, setData] = useState([])
    const [backUp, setBackUp] = useState([])
    useEffect(() => {
        const fetchData = async () => {
            if (!id)
                await axios.get('/achats/contart_all/').then((rsp: any) => setData(rsp.data)).catch((error) => console.log(error))
            else
                await axios.get(`/achats/article_contart/${id}`).then((rsp: any) => {
                    console.log(rsp.data)
                    setData(rsp.data)
                }).catch((error) => console.log(error))
        }
        setLoading(false)

        fetchData();
        setLoading(true)
    }, [id])

    useEffect(() => {
        setBackUp(Data)
    }, [Data])
    const [isLoading, setLoading] = useState(false)

    return (
        <div className='ContentMain'>
            <div className="header">
                <h1>{((id && Data) ? Data.name : (Data.length > 0 ? "Article" : "Non Contart Trouvé"))}</h1>
                {
                    id
                    &&
                    <div style={{ border: '0.06rem solid #bd391b', width: '20rem' }} className="search">
                        <input onKeyPress={() => { }} onClick={() => { }} onChange={(e: any) => {
                            const value = e.target.value;
                            if ((my.is_achat_manager || my.is_superuser) || my.is_reception) {
                                if (value === '' || value === null)
                                    setBackUp(Data.map((e) => e))
                                else
                                    setBackUp(Data.filter((e) => e.type === value || e.type.includes(value.toUpperCase()) || e.code === value || e.code.includes(value.toUpperCase()) || e.designation.toUpperCase().includes(value.toUpperCase())));
                            }

                        }} type="text" placeholder='Search...' />
                        <div onClick={() => { }}>
                            <Search />
                        </div>
                    </div>
                }

            </div>
            {
                <>
                    {
                        !isLoading ? <Loading /> :
                            <div className="main">
                                {
                                    !id ?
                                        <>
                                            <div className="headerStock">
                                                {
                                                    backUp.length >= 1 &&
                                                    <div className="s1h">
                                                        <p style={{ width: '100%' }}>Contart</p>
                                                    </div>
                                                }
                                                {
                                                    backUp.length > 1 &&
                                                    <div style={{ paddingLeft: '1.5rem' }} className="s1h">
                                                        <p style={{ width: '100%' }}>Contart</p>
                                                    </div>
                                                }
                                            </div>
                                            <div className="stocks">
                                                {
                                                    backUp.length > 0 &&
                                                    backUp.map((e: any) => {
                                                        return (
                                                            <div onClick={() => {
                                                                navigate(`/article/${e.id}`)
                                                                // window.location.reload();
                                                            }} className="stock">
                                                                <p style={{ width: '68%' }}>{e.name}</p>
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
                                                        <p style={{ width: '15%' }}>Code d'article</p>
                                                        <p style={{ width: '59.9%' }}>Désignation</p>
                                                        <p style={{ width: 'fit-content' }}>Type</p>
                                                    </div>
                                                    <div className="achatsCL">
                                                        <AchatCl data={backUp} />
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
export default Article