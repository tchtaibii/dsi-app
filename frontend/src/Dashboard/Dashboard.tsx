import { useEffect, useState } from 'react';
import axios from '../Interceptor';
import './Dashboard.scss';
import { useNavigate } from 'react-router-dom'
import ChartPie from './PieChart'
import LinePie from './LineCharts'
import ColCharts from './ColCharts'
import Loading from '../Loading/Loading';

const Nouveau = () => (
    <svg style={{
        width: "2.375rem",
        height: "2.2595rem"
    }} xmlns="http://www.w3.org/2000/svg" width={38} height={37} viewBox="0 0 38 37" fill="none">
        <path d="M38 18.0673L33.7855 13.2655L34.3727 6.90909L28.1373 5.49273L24.8727 0L19 2.52182L13.1273 0L9.86273 5.49273L3.62727 6.89182L4.21455 13.2482L0 18.0673L4.21455 22.8691L3.62727 29.2427L9.86273 30.6591L13.1273 36.1518L19 33.6127L24.8727 36.1346L28.1373 30.6418L34.3727 29.2255L33.7855 22.8691L38 18.0673ZM20.7273 26.7036H17.2727V23.2491H20.7273V26.7036ZM20.7273 19.7946H17.2727V9.43091H20.7273V19.7946Z" fill="#BB3B3B" />
    </svg>

)

const Ect = () => (
    <svg style={{
        width: "2.10938rem",
        height: "2.70313rem"
    }} xmlns="http://www.w3.org/2000/svg" width={34} height={44} viewBox="0 0 34 44" fill="none">
        <path fillRule="evenodd" clipRule="evenodd" d="M13.9151 0.314906C13.2841 -0.10576 12.4618 -0.1049 11.8317 0.317085C11.2016 0.73907 10.8877 1.49908 11.0364 2.24272L11.6041 5.08134C4.91095 6.94648 0 13.0874 0 20.3752C0 24.7806 1.79686 28.7697 4.69303 31.6438C5.42807 32.3732 6.61524 32.3686 7.34466 31.6336C8.07408 30.8986 8.06953 29.7114 7.3345 28.982C5.11872 26.7831 3.75 23.7408 3.75 20.3752C3.75 14.9076 7.36909 10.2852 12.3424 8.77289L13.0364 12.2427C13.1851 12.9864 13.7672 13.5672 14.5111 13.7144C15.2551 13.8615 16.0144 13.5461 16.4351 12.9151L20.4351 6.91506C21.0095 6.05345 20.7767 4.88932 19.9151 4.31491L13.9151 0.314906ZM29.057 11.0443C28.3219 10.3149 27.1348 10.3194 26.4053 11.0545C25.6759 11.7895 25.6805 12.9767 26.4155 13.7061C28.6313 15.9049 30 18.9473 30 22.3128C30 27.8193 26.3294 32.4684 21.3015 33.9469L20.7136 31.0073C20.5649 30.2636 19.9828 29.6828 19.2389 29.5356C18.4949 29.3885 17.7356 29.7039 17.3149 30.3349L13.3149 36.3349C12.7405 37.1966 12.9733 38.3607 13.8349 38.9351L19.8349 42.9351C20.4659 43.3558 21.2882 43.3549 21.9183 42.9329C22.5484 42.5109 22.8623 41.7509 22.7136 41.0073L22.0393 37.636C28.7869 35.8066 33.75 29.6393 33.75 22.3128C33.75 17.9075 31.9531 13.9184 29.057 11.0443Z" fill="#FF7A00" />
    </svg>

)

const Ecl = () => (
    <svg style={{
        width: "2.42575rem",
        height: "2.39219rem"
    }} xmlns="http://www.w3.org/2000/svg" width={39} height={39} viewBox="0 0 39 39" fill="none">
        <path fillRule="evenodd" clipRule="evenodd" d="M10.5612 4.25653L2.15251 8.46088L19.4332 17.8213L27.8419 13.6169L10.5612 4.25653ZM0 10.4935V28.4062C0 28.9389 0.300941 29.4258 0.777356 29.664L17.9998 38.2753V20.2434L0 10.4935ZM20.8123 38.2755L38.0351 29.664C38.5116 29.4258 38.8125 28.9389 38.8125 28.4062V11.2761L31.8123 14.7762V20.4065C31.8123 21.1831 31.1827 21.8127 30.406 21.8127C29.6294 21.8127 28.9998 21.1831 28.9998 20.4065V16.1825L20.8123 20.2762V38.2755ZM37.407 8.83438L20.0351 0.148462C19.6392 -0.0494872 19.1733 -0.0494872 18.7774 0.148462L13.6319 2.7212L30.9126 12.0816L37.407 8.83438Z" fill="#F3C627" />
    </svg>

)

const Lp = () => (
    <svg style={{
        width: "2.0625rem",
        height: "2.0625rem"
    }} xmlns="http://www.w3.org/2000/svg" width={33} height={33} viewBox="0 0 33 33" fill="none">
        <path d="M32.175 4.07L29.6267 0.99C29.1133 0.385 28.3617 0 27.5 0H5.5C4.63833 0 3.88667 0.385 3.39167 1.00833L0.843333 4.07C0.311667 4.71167 0 5.51833 0 6.41667V29.3333C0 31.35 1.63167 33 3.66667 33H29.3333C31.35 33 33 31.35 33 29.3333V6.41667C33 5.51833 32.6883 4.71167 32.175 4.07ZM16.5 11.9167L26.5833 22H20.1667V25.6667H12.8333V22H6.41667L16.5 11.9167ZM3.88667 3.66667L5.39 1.83333H27.39L29.095 3.66667H3.88667Z" fill="#489CFF" />
    </svg>


)

const BoxDash = ({ title, color, icon, data }) => {
    const navigate = useNavigate()
    return (
        <div onClick={() => {
            var id = icon;
            if (id === 4)
                id = 5;
            navigate(`/achats/${id}`)
        }} className="dashBox" style={{ cursor: 'pointer', borderColor: color + '1)' }}>
            <div className="iconBox">
                <div style={{ background: color + '0.3)' }} className="icon">
                    {
                        icon === 1 ? <Nouveau /> : icon === 2 ? <Ect /> : icon === 3 ? <Ecl /> : <Lp />
                    }
                </div>
            </div>
            <h1 style={{ color: color + '1)' }}>{data <= 0 ? 0 : `+${data}`}</h1>
            <h2>{title}</h2>
        </div>
    )
}

const Dashboard = () => {

    const [boxData, setBoxData] = useState({
        n: 0,
        ect: 0,
        ecl: 1,
        lp: 0
    })
    const [pieData, setDataPie] = useState({
        livre: 0,
        non_livre: 0,
    })
    const [dataLine, setDataLine] = useState({
        TV: [],
        TT: [],
        TL: []
    })
    const [isLoading, setLoading] = useState(false)
    const [series, setSeries] = useState<any>([])

    useEffect(() => {
        const fetchData = async () => {
            await axios.get('/achats/situationDash/').then((rsp: any) => setBoxData(rsp.data))
            await axios.get('/achats/pieChart/').then((rsp: any) => setDataPie(rsp.data))
            await axios.get('/achats/linesChart/').then((rsp: any) => {
                setDataLine(rsp.data[0])
            })
            await axios.get('/achats/colChart/').then((rsp: any) => setSeries(rsp.data))
            setLoading(true);
        }
        fetchData();
    }, [])
    useEffect(() => {
        console.log(dataLine)
    }, [dataLine])
    const navigate = useNavigate()
    return (
        <>
            {
                !isLoading ? <Loading /> :
                    <div className='ContentMain'>
                        <div className="header">
                            <h1>Dashboard</h1>
                        </div>
                        <div className="main" style={{ paddingBottom: '7rem' }}>
                            <div className="dash-col">
                                <BoxDash title={"Nouveau"} data={boxData.n} color={"rgba(187, 59, 59,"} icon={1} />
                                <BoxDash title={"En cours de traitement"} data={boxData.ect} color={"rgba(255, 122, 0,"} icon={2} />
                                <BoxDash title={"En cours de livraison"} data={boxData.ecl} color={"rgba(243, 198, 39,"} icon={3} />
                                <BoxDash title={"Livraison partielle"} data={boxData.lp} color={"rgba(72, 156, 255,"} icon={4} />
                            </div>
                            <div className="col2">
                                <div className="pieChart">
                                    <h1>{((pieData.livre <= 0 && dataLine.TL.length === 0) ? "il n'y a aucune achats en retard (BL)" : "Livraison en retard (BL)")}</h1>
                                    {
                                        dataLine.TL.length > 0 &&
                                        <LinePie color={'#f3c627'} data={dataLine.TL} />
                                    }
                                </div>
                                <div className="pieChart">
                                    <h1>{((pieData.livre <= 0 && dataLine.TT.length === 0) ? "il n'y a aucune achats en retard (BC)" : "Traitement d'achat en retard (BC)")}</h1>
                                    {
                                        dataLine.TT.length > 0 &&
                                        <LinePie color={'#ff7a00'} data={dataLine.TT} />
                                    }
                                </div>
                            </div>
                            <div className="col2">

                                <div className="pieChart">
                                    <h1>{((pieData.livre <= 0 && dataLine.TV.length === 0) ? "il n'y a aucune achats en retard (DA)" : "Validation en retard (DA)")}</h1>
                                    {
                                        dataLine.TT.length > 0 &&

                                        <div className="validationRetard">
                                            <div className="VRheader">
                                                <p style={{ width: '22%' }}>Demandeur</p>
                                                <p style={{ width: '20%' }}>Entité</p>
                                                <p style={{ width: '26%' }}>Date de commande</p>
                                                <p style={{ width: '15%' }}>Type d'achat</p>
                                            </div>
                                            <div className="mainVRH">
                                                {
                                                    dataLine.TV && dataLine.TV.map((e: any, i: number) => {
                                                        return (
                                                            <div key={`${i}-retardV`} onClick={() => {
                                                                navigate(`/achat/${e.achat_id}`)
                                                            }} className="RetardValidationAchat">
                                                                <p style={{ width: '22.3%' }}>{e.demandeur}</p>
                                                                <p style={{ width: '20%' }}>{e.entité}</p>
                                                                <p style={{ width: '26.2%' }}>{e.DateDeCommande}</p>
                                                                <p style={{ width: '22.3%' }}>{e.typeDachat}</p>
                                                                <div className='weeksCircle'>{e.weeks_count}</div>
                                                                {/* <p>Type d'achat</p> */}
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </div>
                                        </div>
                                    }
                                </div>
                                <div className="pieChart">
                                    <h1>{((pieData.livre <= 0 && pieData.non_livre <= 0) ? "No achats Found" : "Demande d'achat")}</h1>
                                    <ChartPie data={pieData} />
                                </div>
                            </div>
                            <div className="col2" >
                                <div style={{ width: '100%' }} className="pieChart">
                                    <ColCharts Series={series} />
                                </div>
                            </div>
                        </div>
                    </div>
            }
        </>
    )
}
export default Dashboard