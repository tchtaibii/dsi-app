import { useEffect, useState } from 'react';
import './Produits.scss';
import axios from '../Interceptor'
import { useNavigate, useParams } from "react-router-dom";
import Loading from '../Loading/Loading';

const Product = ({ SearchT }) => {
    const [isLoading, setLoading] = useState(false)
    const [data, setData] = useState([])
    const [paginator, setPAginator] = useState({
        has_next: false,
        next_page_number: 1,
        has_previous: false,
        previous_page_number: null
    })
    const fetchDataB = async (str, page = 1) => {
        setLoading(true)
        await axios.get(`/stock/filter_stocks/${str}`, { params: { page: page } }).then((rsp: any) => {

            setData(rsp.data.results)
            setPAginator({
                has_next: rsp.data.has_next,
                next_page_number: rsp.data.next_page_number,
                has_previous: rsp.data.has_previous,
                previous_page_number: rsp.data.previous_page_number
            })
        }).catch((error) => console.log(error))
        setLoading(false)
    }
    useEffect(() => {
        setPAginator({
            has_next: true,
            next_page_number: 1,
            has_previous: false,
            previous_page_number: null
        })
        fetchDataB(SearchT, 1);
    }, [SearchT]);
    let navigate = useNavigate();
    return (

        isLoading ? <Loading />
            :
            <div className='ContentMain'>
                <div className="header">
                    <h1>{SearchT.length > 0 ? `Resultat avec '${SearchT}'` : 'All Produits'}</h1>
                </div>
                <div style={{ gap: "1.44rem" }} className="main">
                    {
                        // SearchT.length > 0 &&
                        <>
                            <table className="blueTable">
                                <thead>
                                    <tr>
                                        <th>{'BC'}</th>
                                        <th>{'Nom & Prenom'}</th>
                                        <th>{'Fonction'}</th>
                                        <th>{'Entité'}</th>
                                        <th>{"Date d'arivage"}</th>
                                        <th>{'Service Tag'}</th>
                                        <th>{'Mark'}</th>
                                        <th>{'Modéle'}</th>
                                        <th>{'Type'}</th>
                                        <th>{'Fournisseur'}</th>
                                        <th>{'Etat'}</th>
                                        <th>{"Date d'affectation"}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        data.length > 0 ?
                                            data.map((e) => (
                                                < tr onClick={() => {
                                                    navigate(`/produit/${e.id}`)
                                                }}>
                                                    <td>{e.BC}</td>
                                                    <td>{e.NomPrenom ? e.NomPrenom : '---'}</td>
                                                    <td>{e.Fonction ? e.Fonction : '---'}</td>
                                                    <td>{e.entité ? e.entité : '---'}</td>
                                                    <td>{e.DateArrivage ? e.DateArrivage : '---'}</td>
                                                    <td>{e.serviceTag ? e.serviceTag : '---'}</td>
                                                    <td>{e.mark ? e.mark : '---'}</td>
                                                    <td>{e.modele ? e.modele : '---'}</td>
                                                    <td>{e.type}</td>
                                                    <td>{e.fourniseur ? e.fourniseur : '---'}</td>
                                                    <td>{e.etat ? e.etat : '---'}</td>
                                                    <td>{e.DateDaffectation ? e.DateDaffectation : '---'}</td>
                                                </tr>
                                            ))
                                            :
                                            'No Product found'
                                    }
                                </tbody>
                            </table>
                            <div className="paginator">
                                <button onClick={() => {
                                    fetchDataB(SearchT, paginator.next_page_number)
                                }} disabled={!paginator.has_next}>{"Suivant >>"}</button>
                                <button onClick={() => {
                                    fetchDataB(SearchT, paginator.previous_page_number)
                                }} disabled={!paginator.has_previous}>{"<< Précédent"}</button>
                            </div>
                        </>
                    }

                </div>

            </div >
    )
}
export default Product