import './Achats.scss';

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

const ValidateSvg = () => (
    <svg style={{ width: '2.875rem', height: '2.875rem' }} width={46} height={46} viewBox="0 0 46 46" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx={23} cy="22.6817" rx={23} ry="22.6817" fill="#008C76" />
        <path d="M18.1596 28.3658L11.8589 22.1523L9.71338 24.2533L18.1596 32.5826L36.2912 14.702L34.1607 12.6011L18.1596 28.3658Z" fill="#F1F1F1" />
    </svg>

)

const TikTak = () => (
    <svg style={{
        width: "2.8125rem",
        height: "2.8125rem"
    }} width={45} height={45} viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="22.5" cy="22.5" r="22.5" fill="#B43316" />
        <path d="M22.9825 5.5C13.3225 5.5 5.5 13.34 5.5 23C5.5 32.66 13.3225 40.5 22.9825 40.5C32.66 40.5 40.5 32.66 40.5 23C40.5 13.34 32.66 5.5 22.9825 5.5ZM23 37C15.265 37 9 30.735 9 23C9 15.265 15.265 9 23 9C30.735 9 37 15.265 37 23C37 30.735 30.735 37 23 37Z" fill="#F1F1F1" />
        <path d="M23.875 14.25H21.25V24.75L30.4375 30.2625L31.75 28.11L23.875 23.4375V14.25Z" fill="#F1F1F1" />
    </svg>

)

const FilterSvg = () => (
    <svg style={{
        width: "0.875rem",
        height: "1.0625rem",
    }} width={14} height={17} viewBox="0 0 14 17" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd" d="M8.15657 8.72857L14 0H0L5.84436 8.72761V17L8.15657 15.6056V8.72857Z" fill="#ffff" />
    </svg>

)

const ExitSvg = () => (
    <svg style={{
        width: "1.9375rem",
        height: "1.9375rem"
    }} xmlns="http://www.w3.org/2000/svg" width={31} height={31} viewBox="0 0 31 31" fill="none">
        <path d="M31 3.12214L27.8779 0L15.5 12.3779L3.12214 0L0 3.12214L12.3779 15.5L0 27.8779L3.12214 31L15.5 18.6221L27.8779 31L31 27.8779L18.6221 15.5L31 3.12214Z" fill="#B43316" />
    </svg>

)
const DownloadSvg = () => (
    <svg style={{
        width: "1.1875rem",
        height: "1.44194rem"
    }} width={19} height={24} viewBox="0 0 19 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M19 8.14285H13.5714V0H5.42857V8.14285H0L9.5 17.6429L19 8.14285ZM0 20.3571V23.0714H19V20.3571H0Z" fill="white" />
    </svg>

)

const Situation = (sda: number) => {
    switch (sda) {
        case 1:
            return "Nouveau";
        case 2:
            return "EC de traitement"
        case 3:
            return "EC de livraison"
        case 4:
            return "Livré"
        case 5:
            return "Livraison partielle"
    }
}
const TypeDachat = (sda: number) => {
    switch (sda) {
        case 1:
            return "Accord Cadre";
        case 2:
            return "Achat Direct"
        case 3:
            return "Achat d'offre"
        case 4:
            return "Achat en ligne"
        case 5:
            return "Convention Partenari"
    }
}

const AChatU = ({ TypeDachat, e, i }) => {
    const [showMore, setMore] = useState(false)
    let navigate = useNavigate();
    useEffect(() => {
        console.log(e)
    }, [e])
    return (
        <div style={{ cursor: 'pointer' }} key={'achat-' + i} className="rowAchats">
            <div className="roww" onClick={() => {
                navigate(`/achat/${e.id}`)
            }} >
                <p style={{ width: '14.5%' }}>{e.demandeur}</p>
                <p style={{ width: '14.3%' }}>{e.entité}</p>
                <p style={{ width: '23.6%' }}>{TypeDachat(e.typeDachat)}</p>
                <p style={{ width: '16.3%' }}>{e.DateDeCommande}</p>
                <p style={{ width: '12%' }}>{e.DA ? e.DA : "------"}</p>
                <div style={{ width: '15%' }} className="etatCont">
                    <div style={{
                        backgroundColor: ((e.situation_d_achat === 1 || e.situation_d_achat === 2) ? "rgba(180, 51, 22, 0.50)"
                            : e.situation_d_achat === 4 ? "rgba(67, 168, 32, 0.32)"
                                : "rgb(234 214 9 / 32%)")
                    }} className="etat">
                        <div style={{
                            width: "0.7rem",
                            height: "0.7rem",
                            backgroundColor: ((e.situation_d_achat === 1 || e.situation_d_achat === 2) ? "#B43316" : e.situation_d_achat === 4 ? "#00B212" : "rgb(196 182 48)"),
                            borderRadius: "50%"
                        }} className="pointEtat"></div>
                        <p style={{ color: ((e.situation_d_achat === 1 || e.situation_d_achat === 2) ? "#B43316" : e.situation_d_achat === 4 ? "#00B212" : "rgb(196 182 48)") }}>{Situation(e.situation_d_achat)}</p>
                    </div>
                </div>

                <div className="btnAchat">
                    {/* <InfoSvg /> */}
                    {!e.isComplet ? <TikTak /> : <ValidateSvg />}
                </div>
            </div>
            {
                showMore &&
                <div className="achatArr">
                    <div className="headerMain" style={{ paddingRight: "0rem" }}>
                        <p style={{ width: '45%', color: '#BD391B' }}>Designation</p>
                        <p style={{ width: '10%', color: '#BD391B' }}>Type</p>
                        <p style={{ width: '14%', color: '#BD391B' }}>{e.typeDachat === 1 ? "Code d’article" : "Prix Estimatif"}</p>
                        <p style={{ width: '18%', color: '#BD391B' }}>{e.typeDachat === 1 ? "Contrat" : "Fournisseur"}</p>
                        <p style={{ width: '8%', color: '#BD391B' }}>Quantité</p>
                        <p style={{ width: 'fit-content', color: '#BD391B' }}>Reste</p>
                    </div>
                    <div className="achatZ">

                        {
                            e.achat && e.achat.map((ele: any) => {
                                return (
                                    <div className="achatSD">

                                        <p style={{ width: '45%' }}>{ele.article.designation}</p>
                                        <p style={{ width: '10%' }}>{ele.article.type}</p>
                                        <p style={{ width: '14%' }}>{e.typeDachat === 1 ? ele.article.code : ele.article.prix_estimatif}</p>
                                        <p style={{ width: '19%' }}>{e.typeDachat === 1 ? ele.article.contrat.name : e.fourniseur}</p>
                                        <p style={{ width: '8%' }}>{ele.quantité}</p>
                                        <p style={{ width: 'fit-content' }}>{ele.reste}</p>
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
        <div className="achatCf">
            {
                achats.map((e: any, i: number) => (
                    <AChatU key={`${i}-achatss`} e={e} i={i} TypeDachat={TypeDachat} />
                ))
            }
        </div>

    )
}

const Achats = ({ SearchT }) => {
    const { id } = useParams()
    interface QueryParams {
        typeDachat: number | null;
        DA: string | null;
        BC: string | null;
        BL: string | null;
        situation_d_achat: number | null;
        typeDarticle: string | null;
        apple: boolean;
        consommable: boolean;
        isComplet: boolean;
        search: string;
    }
    const [achats, setAchats] = useState<any[]>([])

    const [typeDachat, setTypeDachat] = useState([]);
    const [situationDachat, setSituationDachat] = useState([]);
    const [isFilter, setFilter] = useState<boolean>(false)

    useEffect(() => {
        fetchDataB();
    }, [SearchT]);



    const [queryParams, setQueryParams] = useState<QueryParams>({
        typeDachat: null,
        DA: null,
        BC: null,
        BL: null,
        situation_d_achat: id ? id : null,
        typeDarticle: null,
        isComplet: false,
        apple: false,
        consommable: false,
        search: SearchT
    });
    useEffect(() => {
        const fetchData = async () => {
            try {
                const nonNullParams = {};
                Object.keys(queryParams).forEach((key) => {
                    if (queryParams[key] !== null) {
                        nonNullParams[key] = queryParams[key];
                    }
                });
                if (SearchT.length > 0) {
                    await axios.get('/achats/search/', {
                        params:
                            { search: SearchT }
                    }).then((rsp: any) => {
                        setAchats(rsp.data.reverse());
                        console.log(rsp.data);
                    });
                }
                else {
                    const commandsResponse = await axios.get('/achats/get/commandes/', {
                        params: nonNullParams,
                    });
                    setAchats(commandsResponse.data.reverse());
                }
                const fileResponse = await axios.get('/achats/excelExport/', {
                    params: nonNullParams,
                    responseType: 'blob', // Important for handling binary data
                });

                const disposition = fileResponse.headers['content-disposition'];
                const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(disposition);
                const filename = matches ? matches[1].replace(/['"]/g, '') : '';

                const blob = new Blob([fileResponse.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                const url = window.URL.createObjectURL(blob);
                setFileData({ data: url, name: filename });
                const typeDachatResponse = await axios.get('/achats/get/types_achats');
                setTypeDachat(typeDachatResponse.data);

                const situationResponse = await axios.get('/achats/get/situations_article');
                setSituationDachat(situationResponse.data);
            } catch (error) {
                console.error('Error:', error);
            }
            setLoading(true);
        }
        fetchData()
    }, [queryParams])
    const [isFilterTypeAchat, setFilterAchat] = useState<boolean>(false);
    const [isFilterTypeArt, setFilterArt] = useState<boolean>(false);
    const [isFiltersit, setFilterSit] = useState<boolean>(false);
    const [isLoading, setLoading] = useState(false)
    const fetchDataB = async () => {
        setQueryParams((state: any) => ({ ...state, search: SearchT }))
    };
    const [fileData, setFileData] = useState<any>(null);
    useEffect(() => {
        fetchDataB();
    }, []);

    return (
        !isLoading ? <Loading /> :
            <div className='ContentMain'>
                {
                    isFilter &&
                    <div className="filter">
                        <div className="filterBox">
                            <div className="header">
                                <h1>Filter</h1>
                                <div onClick={() => {
                                    setQueryParams({
                                        typeDachat: null,
                                        DA: null,
                                        BC: null,
                                        BL: null,
                                        situation_d_achat: null,
                                        typeDarticle: null,
                                        isComplet: false,
                                        apple: false,
                                        consommable: false,
                                        search: SearchT
                                    })
                                    setFilter(false)
                                }} style={{ cursor: 'pointer' }}><ExitSvg /></div>
                            </div>
                            Bande de commande
ex: 4500020380
                            <div className="row">
                                <div className="inputCommande" >
                                    <div className="inputText" onClick={() => {
                                        setFilterSit((state: boolean) => !state)
                                        if (isFilterTypeAchat)
                                            setFilterAchat(false)
                                        if (isFilterTypeArt)
                                            setFilterArt(false)
                                    }} style={{ background: 'linear-gradient(180deg, #BABABA 0%, rgba(74, 74, 74, 0.00) 99.99%, rgba(255, 255, 255, 0.00) 100%)', border: "0.06rem solid #B43316" }}>
                                        <input type="text" placeholder="Situation d'achat" style={{ cursor: "pointer", caretColor: 'transparent' }} readOnly={true} value={queryParams.situation_d_achat ? Situation(queryParams.situation_d_achat) : "Situation d'achat"} />
                                    </div>
                                    {
                                        isFiltersit &&
                                        <div className="typeFilter">
                                            <div className="contType">
                                                {
                                                    situationDachat.length > 0 ?
                                                        situationDachat.map((e: any) => (
                                                            <div key={`${e.id}-situation`} onClick={() => {
                                                                setQueryParams((state: any) => ({
                                                                    ...state,
                                                                    situation_d_achat: e.id
                                                                }))
                                                                setFilterSit(false);
                                                            }} className="typeCont">
                                                                {e.situation}
                                                            </div>
                                                        ))
                                                        :
                                                        <div style={{ cursor: "initial" }} className="typeCont">
                                                            No Situation Found
                                                        </div>
                                                }
                                            </div>
                                        </div>
                                    }
                                </div>
                                <div className="inputCommande" >
                                    <div className="inputText" style={{ background: "transparent", border: "0.06rem solid #B43316" }}>
                                        <input type="text" onChange={(e: any) => {
                                            const value = e.target.value;
                                            setQueryParams((state: any) => ({
                                                ...state,
                                                BC: value
                                            }))
                                        }} placeholder="Entrez code BC" />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="checkboxs" style={{ marginTop: '0', width: '50%' }}>
                                    <input onChange={() => {
                                        setQueryParams((state: any) => ({
                                            ...state,
                                            apple: !state.apple
                                        }))
                                    }} type="checkbox" name="apple" id="" checked={queryParams.apple} />
                                    <h4>Apple</h4>
                                </div>
                                <div className="inputCommande" >
                                    <div className="inputText" style={{ background: "#F1F1F1", border: "0.06rem solid #B43316" }}>
                                        <input type="text" onChange={(e: any) => {
                                            const value = e.target.value;
                                            setQueryParams((state: any) => ({
                                                ...state,
                                                BL: value
                                            }))
                                        }} placeholder="Entrez code BL" />
                                    </div>
                                </div>
                            </div>
                            <div className="checkboxs" style={{ marginTop: '-1rem', width: '50%' }}>
                                <input onChange={() => {
                                    setQueryParams((state: any) => ({
                                        ...state,
                                        isComplet: !state.isComplet
                                    }))
                                }} type="checkbox" name="Not Complet" id="" checked={!queryParams.isComplet} />
                                <h4>DA terminé</h4>
                            </div>
                            <div className="checkboxs" style={{ marginTop: '0', width: '50%' }}>
                                <input onChange={() => {
                                    setQueryParams((state: any) => ({
                                        ...state,
                                        consommable: !state.consommable
                                    }))
                                }} type="checkbox" name="consommable" id="" checked={queryParams.consommable} />
                                <h4>Consommable</h4>
                            </div>

                            <div style={{ flexDirection: 'row-reverse', justifyContent: 'initial', gap: '1rem' }} className="row">
                                <button onClick={async () => {
                                    fetchDataB();
                                    setFilter(false)
                                }}>Submit</button>
                                <button onClick={() => {
                                    window.location.reload();
                                }}>Clear</button>
                            </div>
                        </div>
                    </div>
                }
                <div className="header">
                    <h1>Achats</h1>
                    <div className="header2" style={{ flexDirection: 'row' }}>
                        <button onClick={() => {
                            setFilter(true)
                        }} style={{ width: "6.625rem", borderRadius: "1rem", backgroundColor: "#BD391B", display: 'flex', gap: "0.3rem", color: "#ffff", fontSize: '1rem' }}>
                            <FilterSvg />
                            filter</button>
                        <button onClick={() => {
                            const link = document.createElement('a');
                            link.href = fileData.data;
                            link.setAttribute('download', fileData.name);
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                        }} style={{ width: "11.625rem", borderRadius: "1rem", backgroundColor: "#BD391B", display: 'flex', gap: "0.3rem", color: "#ffff", fontSize: '1rem' }}>
                            <DownloadSvg />
                            Donwload Exel</button>
                    </div>
                </div>
                <div style={{ gap: "1.44rem" }} className="main">
                    {
                        achats.length > 0 ?
                            <>
                                <div className="headerMain">
                                    <p style={{ width: '15%' }}>Demandeur</p>
                                    <p style={{ width: '15%' }}>Entité</p>
                                    <p style={{ width: '25%' }}>Type d'achat</p>
                                    <p style={{ width: '17%' }}>Date de la commande</p>
                                    <p style={{ width: '13%' }}>DA</p>
                                    <p style={{ width: '15%' }}>Etat d’order</p>
                                </div>
                                <div className="achatsCL">
                                    <AchatCl TypeDachat={TypeDachat} achats={achats} />
                                </div>

                            </>
                            : <h1 style={{ fontSize: '1.5rem' }}>No achats</h1>
                    }
                </div>
            </div>
    )
}
export default Achats