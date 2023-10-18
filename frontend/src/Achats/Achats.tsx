import './Achats.scss';

import { useState, useEffect } from 'react'
import axios from '../Interceptor'
import { useNavigate, useParams } from "react-router-dom";
import Loading from '../Loading/Loading';


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

const Achats = () => {
    const { id } = useParams()
    interface QueryParams {
        typeDachat: number | null;
        DA: string | null;
        BC: string | null;
        BL: string | null;
        situation_d_achat: number | null;
        typeDarticle: string | null;
        reste: boolean;
        isComplet: boolean;
    }
    const [achats, setAchats] = useState<any[]>([])

    const [typeDarticles, setTypeArticle] = useState([]);
    const [typeDachat, setTypeDachat] = useState([]);
    const [situationDachat, setSituationDachat] = useState([]);
    const [isFilter, setFilter] = useState<boolean>(false)


    let navigate = useNavigate();

    const [queryParams, setQueryParams] = useState<QueryParams>({
        typeDachat: null,
        DA: null,
        BC: null,
        BL: null,
        situation_d_achat: id ? id : null,
        typeDarticle: null,
        reste: false,
        isComplet: false
    });
    const [fileData, setFileData] = useState<any>(null);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const nonNullParams = {};
                Object.keys(queryParams).forEach((key) => {
                    if (queryParams[key] !== null) {
                        nonNullParams[key] = queryParams[key];
                    }
                });

                const commandsResponse = await axios.get('/achats/get/commandes/', {
                    params: nonNullParams,
                });

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
                setAchats(commandsResponse.data.reverse());

                const typeArticleResponse = await axios.get('/achats/get/types_article');
                setTypeArticle(typeArticleResponse.data);

                const typeDachatResponse = await axios.get('/achats/get/types_achats');
                setTypeDachat(typeDachatResponse.data);

                const situationResponse = await axios.get('/achats/get/situations_article');
                setSituationDachat(situationResponse.data);
            } catch (error) {
                console.error('Error:', error);
            }
            setLoading(true);
        };

        fetchData();
    }, []);

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
                return "Contrat Cadre";
            case 2:
                return "Achat Direct"
            case 3:
                return "Achat d'offre"
            case 4:
                return "Achat en ligne"
        }
    }
    const [isFilterTypeAchat, setFilterAchat] = useState<boolean>(false);
    const [isFilterTypeArt, setFilterArt] = useState<boolean>(false);
    const [isFiltersit, setFilterSit] = useState<boolean>(false);
    const [isLoading, setLoading] = useState(false)
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
                                        reste: false,
                                        isComplet: false
                                    })
                                    setFilter(false)
                                }} style={{ cursor: 'pointer' }}><ExitSvg /></div>
                            </div>
                            <div className="row">
                                <div className="inputCommande" >
                                    <div className="inputText" onClick={() => {
                                        setFilterAchat((state: boolean) => !state)
                                        if (isFilterTypeArt)
                                            setFilterArt(false)
                                        if (isFiltersit)
                                            setFilterSit(false)
                                    }} style={{ background: 'linear-gradient(180deg, #BABABA 0%, rgba(74, 74, 74, 0.00) 99.99%, rgba(255, 255, 255, 0.00) 100%)', border: "0.06rem solid #B43316" }}>
                                        <input type="text" placeholder="Type D’achat" style={{ cursor: "pointer", caretColor: 'transparent' }} readOnly={true} value={queryParams.typeDachat ? TypeDachat(queryParams.typeDachat) : "Type d'achat"} />
                                    </div>
                                    {
                                        isFilterTypeAchat &&
                                        <div className="typeFilter">
                                            <div className="contType">
                                                {
                                                    typeDachat.length > 0 ?
                                                        typeDachat.map((e: any) => (
                                                            <div key={`${e.id}-typede--y`} onClick={() => {
                                                                setQueryParams((state: any) => ({
                                                                    ...state,
                                                                    typeDachat: e.id
                                                                }))
                                                                setFilterAchat(false);
                                                            }} className="typeCont">
                                                                {e.type}
                                                            </div>
                                                        ))
                                                        :
                                                        <div style={{ cursor: "initial" }} className="typeCont">
                                                            No Type Found
                                                        </div>
                                                }
                                            </div>

                                        </div>
                                    }
                                </div>
                                <div className="inputCommande" >
                                    <div className="inputText" style={{ background: "#F1F1F1", border: "0.06rem solid #B43316" }}>
                                        <input type="text" onChange={(e: any) => {
                                            const value = e.target.value;
                                            setQueryParams((state: any) => ({
                                                ...state,
                                                DA: value
                                            }))
                                        }} placeholder="Entrez code DA" />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="inputCommande" >
                                    <div className="inputText" onClick={() => {
                                        setFilterArt((state: boolean) => !state)
                                        if (isFilterTypeAchat)
                                            setFilterAchat(false)
                                        if (isFiltersit)
                                            setFilterSit(false)
                                    }} style={{ background: 'linear-gradient(180deg, #BABABA 0%, rgba(74, 74, 74, 0.00) 99.99%, rgba(255, 255, 255, 0.00) 100%)', border: "0.06rem solid #B43316" }}>
                                        <input type="text" placeholder="Type de Désignation" style={{ cursor: "pointer", caretColor: 'transparent' }} readOnly={true} value={queryParams.typeDarticle ? queryParams.typeDarticle : "Type de Désignation"} />
                                    </div>
                                    {
                                        isFilterTypeArt &&
                                        <div className="typeFilter">
                                            <div className="contType">
                                                {
                                                    typeDarticles.length > 0 ?
                                                        typeDarticles.map((e: any, index: number) => (
                                                            <div key={`${id}-type-${e.type}`} onClick={() => {
                                                                setQueryParams((state: any) => ({
                                                                    ...state,
                                                                    typeDarticle: e.type
                                                                }))
                                                                setFilterArt(false);
                                                            }} className="typeCont">
                                                                {e.type}
                                                            </div>
                                                        ))
                                                        :
                                                        <div style={{ cursor: "initial" }} className="typeCont">
                                                            No Type Found
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
                            <div className="row">
                                <div className="checkboxs" style={{ width: '100%' }}>
                                    <input onChange={() => {
                                        setQueryParams((state: any) => ({
                                            ...state,
                                            reste: !state.reste
                                        }))
                                    }} type="checkbox" name="commande livré partielement" id="" checked={queryParams.reste} />
                                    <h4>commande livré partiellement</h4>
                                </div>
                            </div>
                            <div className="row">
                                <div className="checkboxs" style={{ width: '100%' }}>
                                    <input onChange={() => {
                                        setQueryParams((state: any) => ({
                                            ...state,
                                            isComplet: !state.isComplet
                                        }))
                                    }} type="checkbox" name="Not Complet" id="" checked={!queryParams.isComplet} />
                                    <h4>DA terminé</h4>
                                </div>
                            </div>
                            <div style={{ flexDirection: 'row-reverse' }} className="row">
                                <button onClick={async () => {
                                    const nonNullParams: QueryParams | any = {};
                                    Object.keys(queryParams).forEach((key) => {
                                        if (queryParams[key as keyof QueryParams] !== null) {
                                            nonNullParams[key as keyof QueryParams] = queryParams[key as keyof QueryParams];
                                        }
                                    });
                                    try {
                                        const Commandes = await axios.get('/achats/get/commandes/', {
                                            params: nonNullParams,
                                        });
                                        setAchats(Commandes.data.reverse())
                                        setFilter(false)
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
                                        setAchats(commandsResponse.data.reverse());

                                        const typeArticleResponse = await axios.get('/achats/get/types_article');
                                        setTypeArticle(typeArticleResponse.data);

                                        const typeDachatResponse = await axios.get('/achats/get/types_achats');
                                        setTypeDachat(typeDachatResponse.data);

                                        const situationResponse = await axios.get('/achats/get/situations_article');
                                        setSituationDachat(situationResponse.data);
                                    }
                                    catch (error) {
                                        console.error('Error:', error);
                                    }
                                }}>Submit</button>
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
                                    <p style={{ width: '25%' }}>Désignation</p>
                                    <p style={{ width: '17%' }}>Date de la commande</p>
                                    <p style={{ width: '13%' }}>DA</p>
                                    <p style={{ width: '15%' }}>Etat d’order</p>
                                </div>
                                <div className="achatsCL">
                                    {
                                        achats.map((e: any, i: number) => (
                                            <div onClick={() => {
                                                navigate(`/achat/${e.id}`)
                                            }} style={{ cursor: 'pointer' }} key={'achat-' + i} className="rowAchats">
                                                <p style={{ width: '14.5%' }}>{e.demandeur}</p>
                                                <p style={{ width: '14.3%' }}>{e.entité}</p>
                                                <p style={{ width: '23.6%' }}>{e.article__designation}</p>
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
                                        ))
                                    }
                                </div>

                            </>
                            : <h1 style={{ fontSize: '1.5rem' }}>No achats</h1>
                    }
                </div>
            </div>
    )
}
export default Achats