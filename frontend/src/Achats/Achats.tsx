import './Achats.scss';

import { useState, useEffect } from 'react'
import axios from '../Interceptor'
import { useNavigate } from "react-router-dom";


const InfoSvg = () => (
    <svg style={{
        width: "2.8125rem",
        height: "2.8125rem"
    }} width={45} height={45} viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M22.5 0C10.08 0 0 10.08 0 22.5C0 34.92 10.08 45 22.5 45C34.92 45 45 34.92 45 22.5C45 10.08 34.92 0 22.5 0ZM24.75 33.75H20.25V20.25H24.75V33.75ZM24.75 15.75H20.25V11.25H24.75V15.75Z" fill="#434559" />
    </svg>

)

const TikTak = () => (
    <svg style={{
        width: "2.8125rem",
        height: "2.8125rem"
    }} width={45} height={45} viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="22.5" cy="22.5" r="22.5" fill="#B43316" />
        <path d="M22.9825 5.5C13.3225 5.5 5.5 13.34 5.5 23C5.5 32.66 13.3225 40.5 22.9825 40.5C32.66 40.5 40.5 32.66 40.5 23C40.5 13.34 32.66 5.5 22.9825 5.5ZM23 37C15.265 37 9 30.735 9 23C9 15.265 15.265 9 23 9C30.735 9 37 15.265 37 23C37 30.735 30.735 37 23 37Z" fill="#2A2D3E" />
        <path d="M23.875 14.25H21.25V24.75L30.4375 30.2625L31.75 28.11L23.875 23.4375V14.25Z" fill="#2A2D3E" />
    </svg>

)

const FilterSvg = () => (
    <svg style={{
        width: "0.875rem",
        height: "1.0625rem",
    }} width={14} height={17} viewBox="0 0 14 17" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd" d="M8.15657 8.72857L14 0H0L5.84436 8.72761V17L8.15657 15.6056V8.72857Z" fill="#BABABA" />
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

const Achats = () => {

    interface QueryParams {
        typeDachat: number | null;
        DA: string | null;
        BC: string | null;
        BL: string | null;
        situation_d_achat: number | null;
        typeDarticle: string | null;
        reste: boolean;
        isLivre : boolean;
    }
    const [achats, setAchats] = useState<any[]>([])

    const [typeDarticles, setTypeArticle] = useState([]);
    const [typeDachat, setTypeDachat] = useState([]);
    const [situationDachat, setSituationDachat] = useState([]);

    let navigate = useNavigate();

    const [queryParams, setQueryParams] = useState<QueryParams>({
        typeDachat: null,
        DA: null,
        BC: null,
        BL: null,
        situation_d_achat: null,
        typeDarticle: null,
        reste: false,
        isLivre : false
    });

    useEffect(() => {
        const fetchData = async () => {
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
                setAchats(Commandes.data.reverse());
                const typeart = await axios.get('/achats/get/types_article');
                setTypeArticle(typeart.data);
                const typedach = await axios.get('/achats/get/types_achats');
                setTypeDachat(typedach.data);
                const situation = await axios.get('/achats/get/situations_article');
                setSituationDachat(situation.data);
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchData();
    }, []);

    const Situation = (sda: number) => {
        switch (sda) {
            case 1:
                return "Non livré";
            case 2:
                return "Non validé"
            case 3:
                return "livré"
            case 4:
                return "Livraison en cours "
            case 5:
                return "Livraison partielle"
        }
    }
    return (
        <div className='ContentMain'>
            <div className="filter">
                <div className="filterBox">
                    <div className="header">
                        <h1>Filter</h1>
                        <div style={{ cursor: 'pointer' }}><ExitSvg /></div>
                    </div>
                    <div className="row">
                        <div className="inputCommande" >
                            <div className="inputText" style={{ background: "#212332", border: "0.06rem solid #B43316" }}>
                                <input type="text" placeholder="Type D’achat" />
                            </div>
                        </div>
                        <div className="inputCommande" >
                            <div className="inputText" style={{ background: "#212332", border: "0.06rem solid #B43316" }}>
                                <input type="text" placeholder="Entrez code DA" />
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="inputCommande" >
                            <div className="inputText" style={{ background: "#212332", border: "0.06rem solid #B43316" }}>
                                <input type="text" placeholder="Type de Désignation" />
                            </div>
                        </div>
                        <div className="inputCommande" >
                            <div className="inputText" style={{ background: "#212332", border: "0.06rem solid #B43316" }}>
                                <input type="text" placeholder="Entrez code BC" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="header">
                <h1>Add Command</h1>
                <div className="header2">
                    <button style={{ width: "6.625rem", borderRadius: "1rem", backgroundColor: "#2A2D3E", border: "0.06rem solid #BABABA", display: 'flex', gap: "0.3rem", color: "#BABABA", fontSize: '1rem' }}>
                        <FilterSvg />
                        filter</button>
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
                                <p style={{ width: '16%' }}>Date de la commande</p>
                                <p style={{ width: '9%' }}>DA</p>
                                <p style={{ width: '10%' }}>Etat d’order</p>
                            </div>

                            {
                                achats.map((e: any, i: number) => (
                                    <div onClick={() => {
                                        navigate(`/achat/${e.id}`)
                                    }} style={{ cursor: 'pointer' }} id={'achat-' + i} className="rowAchats">
                                        <p style={{ width: '14.5%' }}>{e.demandeur}</p>
                                        <p style={{ width: '14.3%' }}>{e.entité}</p>
                                        <p style={{ width: '23.6%' }}>{e.article__designation}</p>
                                        <p style={{ width: '15.3%' }}>{e.DateDeCommande}</p>
                                        <p style={{ width: '8%' }}>{e.DA ? e.DA : "------"}</p>
                                        <div style={{ width: '16%' }} className="etatCont">
                                            <div style={{
                                                backgroundColor: ((e.situation_d_achat === 1 || e.situation_d_achat === 2) ? "rgba(180, 51, 22, 0.50)"
                                                    : e.situation_d_achat === 3 ? "rgba(67, 168, 32, 0.32)"
                                                        : "rgba(255, 245, 0, 0.32)")
                                            }} className="etat">
                                                <div style={{
                                                    width: "0.7rem",
                                                    height: "0.7rem",
                                                    backgroundColor: ((e.situation_d_achat === 1 || e.situation_d_achat === 2) ? "#B43316" : e.situation_d_achat === 3 ? "#00B212" : "#FFE600"),
                                                    borderRadius: "50%"
                                                }} className="pointEtat"></div>
                                                <p style={{ color: ((e.situation_d_achat === 1 || e.situation_d_achat === 2) ? "#B43316" : e.situation_d_achat === 3 ? "#00B212" : "#FFE600") }}>{Situation(e.situation_d_achat)}</p>
                                            </div>
                                        </div>

                                        <div className="btnAchat">
                                            <InfoSvg />
                                            <TikTak />
                                        </div>
                                    </div>
                                ))
                            }
                        </>
                        : <h1 style={{ fontSize: '1.5rem' }}>No achats</h1>
                }
            </div>
        </div>
    )
}
export default Achats