import './Progress.scss';

import { useState, useEffect } from 'react'
import axios from '../Interceptor'
import { useNavigate, useParams } from "react-router-dom";
import Loading from '../Loading/Loading';
import Error from '../Error'

const ValidateSvg = () => (
    <svg style={{
        width: "5.34744rem",
        height: "5.27344rem"
    }} width={86} height={85} viewBox="0 0 86 85" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="42.7795" cy="42.1875" rx="42.7795" ry="42.1875" fill="#008C76" />
        <path d="M33.7768 52.7591L22.0576 41.2021L18.0669 45.1098L33.7768 60.6023L67.501 27.3448L63.5384 23.437L33.7768 52.7591Z" fill="#F1F1F1" />
    </svg>
)

const ProgressSvg = () => (
    <svg style={{
        width: "5.34744rem",
        height: "5.27344rem"
    }} width={86} height={85} viewBox="0 0 86 85" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="42.9978" cy="42.1875" rx="32.7976" ry="32.3438" fill="#0468C8" />
        <path d="M84.3711 42.1875C84.3711 64.692 65.8662 82.9688 42.9978 82.9688C20.1294 82.9688 1.62451 64.692 1.62451 42.1875C1.62451 19.683 20.1294 1.40625 42.9978 1.40625C65.8662 1.40625 84.3711 19.683 84.3711 42.1875Z" stroke="#0468C8" strokeWidth="2.8125" />
    </svg>

)

const PendingSvg = () => (
    <svg style={{
        width: "5.34744rem",
        height: "5.27344rem"
    }} width={86} height={85} viewBox="0 0 86 85" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="42.8078" cy="42.1875" rx="42.7795" ry="42.1875" fill="#A2CFFE">
        </ellipse>
    </svg>

)


const UploadSvg = () => (
    <svg style={{
        width: "1.4375rem",
        height: "1.74556rem"
    }} width={23} height={28} viewBox="0 0 23 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6.57143 21.3571H16.4286V11.5H23L11.5 0L0 11.5H6.57143V21.3571ZM0 24.6428H23V27.9286H0V24.6428Z" fill="#F1F1F1" />
    </svg>

)

interface AChat {
    Designation: string;
    demandeur: string;
    reste: number;
}

const Achats = () => {

    const navigate = useNavigate()
    const { id } = useParams();
    const [article, setarticle] = useState<null | AChat>(null)
    const [statusAchat, setStatus] = useState({
        DA: {
            img: ProgressSvg,
            status: 'In progress',
            color: "#0468C8",
            line: "linear-gradient(90deg, #0468C8 50%, #6780A0 50%)"
        },
        BC: {
            img: PendingSvg,
            status: 'Pending',
            color: "#A2CFFE",
            line: "#A2CFFE"
        },
        BL: {
            img: PendingSvg,
            status: 'Pending',
            color: "#A2CFFE",
            line: "#A2CFFE"
        },
        OB: {
            img: PendingSvg,
            status: 'Pending',
            color: "#A2CFFE",
            line: "#A2CFFE"
        },
    });
    const [postData, setDataPost] = useState({
        code: null,
        date: null,
        is_: null,
        reste: 0
    })

    useEffect(() => {
        console.log(postData)
    }, [postData])
    const statusFunc = (obj: any) => {
        setarticle({ Designation: obj.Designation, demandeur: obj.demandeur, reste: obj.reste });
        if (obj.isComplet === true) {
            setStatus({
                DA: {
                    img: ValidateSvg,
                    status: 'Completed',
                    color: "#008C76",
                    line: "#008C76"
                },
                BC: {
                    img: ValidateSvg,
                    status: 'Completed',
                    color: "#008C76",
                    line: "#008C76"
                },
                BL: {
                    img: ValidateSvg,
                    status: 'Completed',
                    color: "#008C76",
                    line: "#008C76"
                },
                OB: {
                    img: ValidateSvg,
                    status: 'Completed',
                    color: "#008C76",
                    line: "#008C76"
                },
            })
            setDataPost((state: any) => ({
                ...state,
                is_: 'DONE'
            }))
            return;
        }
        else if (obj.BL !== null && obj.BL.length > 0) {
            setStatus({
                DA: {
                    img: ValidateSvg,
                    status: 'Completed',
                    color: "#008C76",
                    line: "#008C76"
                },
                BC: {
                    img: ValidateSvg,
                    status: 'Completed',
                    color: "#008C76",
                    line: "#008C76"
                },
                BL: {
                    img: ValidateSvg,
                    status: 'Completed',
                    color: "#008C76",
                    line: "#008C76"
                },
                OB: {
                    img: ProgressSvg,
                    status: 'In Progress',
                    color: "#0468C8",
                    line: "linear-gradient(90deg, #0468C8 50%, #6780A0 50%)"
                },
            })
            setDataPost((state: any) => ({
                ...state,
                is_: 'OB'
            }))
        }
        else if (obj.BC !== null && obj.BC.length > 0) {
            setStatus({
                DA: {
                    img: ValidateSvg,
                    status: 'Completed',
                    color: "#008C76",
                    line: "#008C76"
                },
                BC: {
                    img: ValidateSvg,
                    status: 'Completed',
                    color: "#008C76",
                    line: "#008C76"
                },
                BL: {
                    img: ProgressSvg,
                    status: 'In Progress',
                    color: "#0468C8",
                    line: "linear-gradient(90deg, #0468C8 50%, #6780A0 50%)"
                },
                OB: {
                    img: PendingSvg,
                    status: 'Pending',
                    color: "#A2CFFE",
                    line: "#A2CFFE"
                }
            })
            setDataPost((state: any) => ({
                ...state,
                is_: 'BL'
            }))
        }
        else if (obj.DA !== null && obj.DA.length > 0) {
            setStatus({
                DA: {
                    img: ValidateSvg,
                    status: 'Completed',
                    color: "#008C76",
                    line: "#008C76"
                },
                BC: {
                    img: ProgressSvg,
                    status: 'In Progress',
                    color: "#0468C8",
                    line: "linear-gradient(90deg, #0468C8 50%, #6780A0 50%)"
                },
                BL: {
                    img: PendingSvg,
                    status: 'Pending',
                    color: "#A2CFFE",
                    line: "#A2CFFE"
                },
                OB: {
                    img: PendingSvg,
                    status: 'Pending',
                    color: "#A2CFFE",
                    line: "#A2CFFE"
                }
            })
            setDataPost((state: any) => ({
                ...state,
                is_: 'BC'
            }))
        }
        else {
            setStatus({
                DA: {
                    img: ProgressSvg,
                    status: 'In Progress',
                    color: "#0468C8",
                    line: "linear-gradient(90deg, #0468C8 50%, #6780A0 50%)"
                },
                BC: {
                    img: PendingSvg,
                    status: 'Pending',
                    color: "#A2CFFE",
                    line: "#A2CFFE"
                },
                BL: {
                    img: PendingSvg,
                    status: 'Pending',
                    color: "#A2CFFE",
                    line: "#A2CFFE"
                },
                OB: {
                    img: PendingSvg,
                    status: 'Pending',
                    color: "#A2CFFE",
                    line: "#A2CFFE"
                }
            })
            setDataPost((state: any) => ({
                ...state,
                is_: 'DA'
            }))
        }

    }

    useEffect(() => {
        const fetchData = async () => {
            await axios.get(`/achats/getprogrss/${id}`).then((rsp: any) => {
                statusFunc(rsp.data)
                console.log(rsp.data)
            }).catch((rsp: any) => console.log(rsp));
            setLoading(true)
        }
        fetchData();
    }, [])
    useEffect(() => {
        console.log('article', article)
    }, [article])

    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileChange = (e: any) => {
        const file = e.target.files[0];
        setSelectedFile(file);
    };

    const handleButtonClick = async () => {
        if (postData.is_ !== 'DA' && postData.is_ !== 'OB' && selectedFile) {
            const reader = new FileReader();
            reader.onload = async (event: any) => {
                const base64String = event.target.result;
                const MAX_FILE_SIZE = 10485760;
                if (base64String.size > MAX_FILE_SIZE) {
                    // Handle file size exceeding the limit
                    console.error('File size exceeds the limit');
                    return;
                }
                await axios.post(`/achats/progress/${id}`, {
                    file: base64String, // Include the base64String in the request
                    code: postData.code, // Include other variables as needed
                    date: postData.date,
                    is_: postData.is_,
                    reste: postData.reste
                    // Include other variables as needed
                }).then((response: any) => {
                    window.location.reload()
                }).catch((error: any) => {
                    setStatuss({
                        color: "#AF4C4C",
                        status: "Failed!",
                        text: "Wrong Inputs",
                        is: true
                    })
                });
            };
            reader.readAsDataURL(selectedFile);
        }
        else if (postData.is_ === 'DA' || postData.is_ === 'OB') {
            if (postData.is_ === 'DA') {

                await axios.post(`/achats/progress/${id}`, {
                    code: postData.code, // Include other variables as needed
                    date: postData.date,
                    is_: postData.is_,
                }).then((response: any) => {
                    window.location.reload()
                })
                    .catch((error: any) => {
                        setStatuss({
                            color: "#AF4C4C",
                            status: "Failed!",
                            text: "Wrong Inputs",
                            is: true
                        })
                    });
            }
            else {
                await axios.post(`/achats/progress/${id}`, {
                    code: postData.code, // Include other variables as needed
                    reste: postData.reste,
                    is_: postData.is_,
                }).then((response: any) => {
                    window.location.reload()
                }).catch((error: any) => {
                    setStatuss({
                        color: "#AF4C4C",
                        status: "Failed!",
                        text: "Wrong Inputs",
                        is: true
                    })
                    console.log('8585')
                });
            }
        }
        else {
            setStatuss({
                color: "#AF4C4C",
                status: "Failed!",
                text: "Wrong Inputs",
                is: true
            })
        }
    };
    const [statusCode, setStatuss] = useState({
        color: "#AF4C4C",
        status: "Failed",
        text: "Wrong Inputs",
        is: false
    })
    useEffect(() => {
        if (statusCode.is) {
            const timer = setTimeout(() => {
                setStatuss((state) => ({
                    ...state,
                    is: false
                }))
            }, 5000)
            return () => clearTimeout(timer);
        }
    }, [statusCode])
    const [isLoading, setLoading] = useState(false)


    return (
        !isLoading ? <Loading /> :
            <div className='ContentMain'>
                {
                    statusCode.is &&
                    <Error statusCode={statusCode} setStatus={setStatuss} />
                }
                <div className="header">
                    <h1>{article ? `${article.demandeur} --> ${article.Designation}` : 'No Achat Found'}</h1>
                </div>
                {
                    article &&
                    <div style={{ gap: "1.44rem", paddingInline: "11.75rem" }} className="main">
                        <div className="inMain">
                            <div className="progress">
                                <div className="prog">
                                    <div className="view">
                                        <statusAchat.DA.img />
                                        <div style={{ background: statusAchat.DA.line, }} className="lineV"></div>
                                    </div>
                                    <h1>Demande d’achat</h1>
                                    <h2 className='status' style={{ color: statusAchat.DA.color }}>{statusAchat.DA.status}</h2>
                                </div>
                                <div className="prog">
                                    <div className="view">
                                        <statusAchat.BC.img />
                                        <div style={{ background: statusAchat.BC.line, }} className="lineV"></div>
                                    </div>
                                    <h1>Bon de commande</h1>
                                    <h2 className='status' style={{ color: statusAchat.BC.color }}>{statusAchat.BC.status}</h2>
                                </div>
                                <div className="prog">
                                    <div className="view">
                                        <statusAchat.BL.img />
                                        <div style={{ background: statusAchat.BL.line, }} className="lineV"></div>
                                    </div>
                                    <h1>Bon de livraison</h1>
                                    <h2 className='status' style={{ color: statusAchat.BL.color }}>{statusAchat.BL.status}</h2>
                                </div>
                                <div className="prog">
                                    <div className="view">
                                        <statusAchat.OB.img />
                                    </div>
                                    <h1>Observation</h1>
                                    <h2 className='status' style={{ color: statusAchat.OB.color }}>{statusAchat.OB.status}</h2>
                                </div>
                            </div>
                            {
                                postData.is_ !== 'DONE'
                                    ?
                                    <div className="inputsProg">
                                        {
                                            postData.is_ !== 'OB'
                                                ?
                                                <>
                                                    <div className="inputCommande" style={{ width: "40rem" }}>
                                                        <div className="label">{postData.is_ + '*'}</div>
                                                        <div className="inputText">
                                                            <input onChange={(e: any) => {
                                                                const newD = e.target.value;
                                                                setDataPost((state: any) => ({
                                                                    ...state,
                                                                    code: newD
                                                                }))
                                                            }} placeholder="ex: 10020319" type="text" name="Demandeur" id="" />
                                                        </div>
                                                    </div>
                                                    <div className="inputCommande" style={{ width: "40rem" }}>
                                                        <div className="label">{`Date ${postData.is_
                                                            } *`}</div>
                                                        <div className="inputText">
                                                            <input onChange={(e: any) => {
                                                                const newD = e.target.value;
                                                                setDataPost((state: any) => ({
                                                                    ...state,
                                                                    date: newD
                                                                }))
                                                            }} placeholder="ex: 10020319" type="date" name="Demandeur" id="" />
                                                        </div>
                                                    </div>
                                                    {
                                                        postData && postData.is_ === 'BL' &&
                                                        <div className="inputCommande" style={{ width: "40rem" }}>
                                                            <div className="label">{`Reste *`}</div>
                                                            <div className="inputText">
                                                                <input onChange={(e: any) => {
                                                                    const newD = e.target.value;
                                                                    setDataPost((state: any) => ({
                                                                        ...state,
                                                                        reste: newD
                                                                    }))
                                                                }} placeholder="ex: 5" type="number" name="Reste" id="" />
                                                            </div>
                                                        </div>
                                                    }
                                                    {
                                                        postData && (postData.is_ === 'BC' || postData.is_ === 'BL') &&
                                                        <div className="FileChange">
                                                            <button onClick={() => document.getElementById('file-upload').click()}>
                                                                <UploadSvg />
                                                                Upload file
                                                            </button>
                                                            <label htmlFor="file-upload" className="custom-file-label">
                                                                {selectedFile ? selectedFile.name : ''}
                                                            </label>
                                                            <input
                                                                type="file"
                                                                id="file-upload"
                                                                className="hidden"
                                                                onChange={handleFileChange}
                                                                accept="application/pdf"
                                                            />
                                                        </div>
                                                    }
                                                </>
                                                :
                                                <>
                                                    <div className="inputCommande" style={{ width: "40rem" }}>
                                                        <div className="label">{'Observation' + '*'}</div>
                                                        <div className="inputText textArea">
                                                            <textarea onChange={(e: any) => {
                                                                const newD = e.target.value;
                                                                setDataPost((state: any) => ({
                                                                    ...state,
                                                                    code: newD
                                                                }))
                                                            }} placeholder='No more than 100 characters' maxLength="100" name="" id=""></textarea>
                                                        </div>
                                                    </div>
                                                    {
                                                        article.reste > 0 &&
                                                        <div className="inputCommande" style={{ width: "40rem" }}>
                                                            <div className="label">{`Reste *`}</div>
                                                            <div className="inputText">
                                                                <input onChange={(e: any) => {
                                                                    const newD = e.target.value;
                                                                    setDataPost((state: any) => ({
                                                                        ...state,
                                                                        reste: newD
                                                                    }))
                                                                }} placeholder="ex: 5" type="number" name="Reste" id="" />
                                                            </div>
                                                        </div>
                                                    }
                                                </>
                                        }
                                        <div className="submitStep">
                                            {
                                                postData.is_ !== 'OB' && <div className='sendMail'>Envoyer un email</div>
                                            }
                                            <button onClick={async () => {
                                                if (postData) {
                                                    if (postData.is_ === 'DA' && (postData.code === null || postData.code.length === 0) && (postData.date === null || postData.date.length === 0)) {
                                                        setStatuss({
                                                            color: "#AF4C4C",
                                                            status: "Failed!",
                                                            text: "Wrong Inputs",
                                                            is: true
                                                        })
                                                        return;
                                                    }
                                                    if ((postData.is_ === 'BC' || postData.is_ === 'BL') && (postData.code === null || postData.code.length === 0) && (postData.date === null || postData.date.length === 0) && selectedFile === null) {
                                                        setStatuss({
                                                            color: "#AF4C4C",
                                                            status: "Failed!",
                                                            text: "Wrong Inputs",
                                                            is: true
                                                        })
                                                        return;
                                                    }
                                                    handleButtonClick();

                                                }
                                            }}
                                                className='Next'>{postData.is_ !== 'OB' ? "Suivant" : "Submit"}</button>
                                        </div>
                                    </div>
                                    :
                                    <></>
                            }
                        </div>
                    </div>
                }
            </div>
    )
}
export default Achats