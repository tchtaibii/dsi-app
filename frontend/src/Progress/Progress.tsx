import './Progress.scss';

import { useState, useEffect } from 'react'
import axios from '../Interceptor'
import { useNavigate, useParams } from "react-router-dom";

const ValidateSvg = () => (
    <svg style={{
        width: "5.34744rem",
        height: "5.27344rem"
    }} width={86} height={85} viewBox="0 0 86 85" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="42.7795" cy="42.1875" rx="42.7795" ry="42.1875" fill="#008C76" />
        <path d="M33.7768 52.7591L22.0576 41.2021L18.0669 45.1098L33.7768 60.6023L67.501 27.3448L63.5384 23.437L33.7768 52.7591Z" fill="#2A2D3E" />
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
        <ellipse cx="42.8078" cy="42.1875" rx="42.7795" ry="42.1875" fill="#A2CFFE" fillOpacity="0.5" />
    </svg>

)

const Achats = () => {

    const navigate = useNavigate()
    const { id } = useParams();

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
            color: "rgba(162, 207, 254, 0.50)",
            line: "rgba(162, 207, 254, 0.50)"
        },
        BL: {
            img: PendingSvg,
            status: 'Pending',
            color: "rgba(162, 207, 254, 0.50)",
            line: "rgba(162, 207, 254, 0.50)"
        },
        OB: {
            img: PendingSvg,
            status: 'Pending',
            color: "rgba(162, 207, 254, 0.50",
            line: "rgba(162, 207, 254, 0.50)"
        },
    });

    const statusFunc = (obj: any) => {
        if (obj.Complete === true) {
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
            return;
        }
        else if (obj.BL !== null) {
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
        }
        else if (obj.BC !== null) {
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
                    color: "rgba(162, 207, 254, 0.50)",
                    line: "rgba(162, 207, 254, 0.50)"
                }
            })
        }
        else if (obj.DA !== null) {
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
                    color: "rgba(162, 207, 254, 0.50)",
                    line: "rgba(162, 207, 254, 0.50)"
                },
                OB: {
                    img: PendingSvg,
                    status: 'Pending',
                    color: "rgba(162, 207, 254, 0.50)",
                    line: "rgba(162, 207, 254, 0.50)"
                }
            })
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
                    color: "rgba(162, 207, 254, 0.50)",
                    line: "rgba(162, 207, 254, 0.50)"
                },
                BL: {
                    img: PendingSvg,
                    status: 'Pending',
                    color: "rgba(162, 207, 254, 0.50)",
                    line: "rgba(162, 207, 254, 0.50)"
                },
                OB: {
                    img: PendingSvg,
                    status: 'Pending',
                    color: "rgba(162, 207, 254, 0.50)",
                    line: "rgba(162, 207, 254, 0.50)"
                }
            })
        }

    }

    useEffect(() => {
        
    })

    return (
        <div className='ContentMain'>
            <div className="header">
                <h1>Progress</h1>
            </div>
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
                            <h1>Bande de commande</h1>
                            <h2 className='status' style={{ color: statusAchat.BC.color }}>{statusAchat.BC.status}</h2>
                        </div>
                        <div className="prog">
                            <div className="view">
                                <statusAchat.BL.img />
                                <div style={{ background: statusAchat.BL.line, }} className="lineV"></div>
                            </div>
                            <h1>Bande de livraison</h1>
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
                </div>
            </div>
        </div>
    )
}
export default Achats