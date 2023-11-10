import './BcStock.scss';

import { useState, useEffect } from 'react'
import axios from '../Interceptor'
import { useNavigate, useParams } from "react-router-dom";
import Loading from '../Loading/Loading';
import Error from '../Error';


const EditSvg = () => (
    <svg style={{ width: "2.563rem" }} width={41} height={41} viewBox="0 0 41 41" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20.5" cy="20.5" r="20.5" fill="#BD391B" />
        <path d="M11 26.0422V30H14.9578L26.6306 18.3272L22.6728 14.3694L11 26.0422ZM29.6913 15.2665C30.1029 14.8549 30.1029 14.19 29.6913 13.7784L27.2216 11.3087C26.81 10.8971 26.1451 10.8971 25.7335 11.3087L23.8021 13.2401L27.7599 17.1979L29.6913 15.2665Z" fill="#F1F1F1" />
    </svg>

)
interface dataEdit {
    mark: null | string,
    modele: null | string,
}
const Edits = ({ id, setEdits }) => {
    const [statusCode, setStatuss] = useState({
        color: "#AF4C4C",
        status: "Failed",
        text: "Wrong Inputs",
        is: false
    })
    const [data, setData] = useState<dataEdit>({
        mark: null,
        modele: null,
    })
    const fetchDataB = async () => {
        await axios.get(`/stock/service_tags/${id}`).then((rsp: any) => setData(rsp.data))
    };
    useEffect(() => {
        fetchDataB();

        // console.log(stock)
    }, []);

    const [file, setFile] = useState(null);
    const handleFileChange = (event: any) => {
        const file = event.target.files[0]
        setFile(file);
    };
    const handleButtonClick = async () => {
        try {
            const formData = new FormData();

            // Append other data to formData
            formData.append('modele', data.modele);
            formData.append('mark', data.mark);
            console.log(data.modele)


            // Append the file if it exists
            console.log(file)
            if (file) {
                formData.append('excel_file', file);
            } else {
                formData.append('excel_file', null); // Sending null if no file is selected
            }

            // Send the formData using axios
            await axios.post(`/stock/stock_and_stocks/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            window.location.reload();
        } catch (error) {
            console.error('Error:', error);
            setStatuss({
                color: "#AF4C4C",
                status: "Failed!",
                text: "Wrong Inputs",
                is: true
            });
        }
    };

    return (
        <>
            {
                statusCode.is &&
                <Error statusCode={statusCode} setStatus={setStatuss} />

            }
            <div className="edits">
                <div className="edit">
                    <div className="rows">
                        <div className="row">
                            <div className="inputCommande" >
                                <div className="inputText" style={{ background: "#F1F1F1", border: "0.06rem solid #B43316" }}>
                                    <input onChange={(e: any) => {
                                        const value = e.target.value
                                        setData((state: any) => ({ ...state, mark: value }))
                                    }} value={data.mark} type="text" placeholder="Entrez La Mark..." />
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="inputCommande" >
                                <div className="inputText" style={{ background: "#F1F1F1", border: "0.06rem solid #B43316" }}>
                                    <input onChange={(e: any) => {
                                        const value = e.target.value
                                        setData((state: any) => ({ ...state, modele: value }))
                                    }} value={data.modele} type="text" placeholder="Entrez Le Modéle..." />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="rows">
                        <div className="row ServiceT">
                            {`${data.count} Produit sans Service Tag`}
                            <input onChange={handleFileChange} type="file" name="" id="" />
                        </div>
                    </div>
                    <div className="rows">
                        <div style={{ flexDirection: 'row-reverse', justifyContent: 'initial', gap: '1rem', width: '100%' }} className="row">
                            <button onClick={async () => {
                                handleButtonClick();

                            }}>Save</button>
                            <button onClick={() => {
                                setEdits(false)
                            }}>Cancel</button>
                        </div>
                    </div>

                </div>
            </div>
        </>
    )
}

const AChatU = ({ e, i }) => {
    let navigate = useNavigate();
    return (
        e &&
        <div style={{ cursor: 'pointer' }} key={'achat-' + i} className="rowAchats">
            <div className="roww" onClick={() => {
                // navigate(`/stocks/${bc}/${e.id}`)
            }} >
                <p style={{ width: '17.2%', paddingRight: '1.4rem' }}>{e.serviceTag ? e.serviceTag : '----'}</p>
                <p style={{ width: '16.8%' }}>{e.entité}</p>
                <p style={{ width: '25%' }}>{e.NomPrenom ? e.NomPrenom : "----"}</p>
                <p style={{ width: '20.5%' }}>{e.Fonction ? e.Fonction : '----'}</p>
                <p style={{ width: '11%' }}>{e.etat}</p>
                <p style={{ width: 'fit-content' }}>{e.situation ? e.situation : '---'}</p>
            </div>
        </div>


    )
}

const AchatCl = ({ achats }) => {
    return (
        <div className="achatCf">
            {
                achats.map((e: any, i: number) => (
                    <AChatU key={`${i}-achatss`} e={e} i={i} />
                ))
            }
        </div>

    )
}

const Bcstock = () => {
    const { id, bc } = useParams()
    const [isLoading, setLoading] = useState(false)
    const [isEdits, setEdits] = useState(false)
    const [data, setData] = useState<any>(null)
    const fetchDataB = async () => {
        await axios.get(`/stock/get_stocks_details/${id}`).then((rsp: any) => setData(rsp.data))
        // await axios.get(`/stock/stock_bc/${id}`).then((rsp: any) => setStock(rsp.data));
    };
    useEffect(() => {
        setLoading(false)
        fetchDataB();

    }, []);
    useEffect(() => {
        setLoading(true)
    }, [data])
    return (
        !isLoading ? <Loading /> :
            <>
                <div className='ContentMain'>
                    {
                        isEdits &&
                        <Edits setEdits={setEdits} id={id} />
                    }
                    <div className="header">
                        {
                            data &&
                            <h1>{`${bc} -> ${data.type.length > 0 ? data.type : '---'} -> ${data.mark.length > 0 ? data.mark : '---'} -> ${data.modele.length > 0 ? data.modele : '---'}`}</h1>
                        }
                        <div className="header2" style={{ flexDirection: 'row' }}>
                            <div onClick={() => {
                                setEdits(true)
                            }}>
                                <EditSvg />
                            </div>
                        </div>
                    </div>
                    <div style={{ gap: "1.44rem" }} className="main">
                        {
                            data && data.stocks.length > 0 &&
                            <>
                                <div className="headerMain">
                                    <p style={{ width: '18%' }}>Service Tag</p>
                                    <p style={{ width: '18%' }}>Entité</p>
                                    <p style={{ width: '27%' }}>Nom Prenom</p>
                                    <p style={{ width: '22%' }}>Fonction</p>
                                    <p style={{ width: '11%' }}>Etat</p>
                                    <p style={{ width: 'fit-content' }}>Situation</p>
                                </div>
                                <div className="achatsCL">
                                    <AchatCl achats={data.stocks} />
                                </div>

                            </>
                        }

                    </div>
                </div>
            </>
    )
}
export default Bcstock