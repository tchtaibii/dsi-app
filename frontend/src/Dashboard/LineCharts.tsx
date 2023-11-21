import { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { useNavigate } from 'react-router-dom'

const ApexChart = ({ data, color }) => {
    const [lineData, setData] = useState([])
    const [CategoData, setCatego] = useState([])
    useEffect(() => {
        setData(() => (
            data && data.map((e: any) => (
                e.weeks_count
            ))
        ))
        setCatego(() => (
            data && data.map((e: any) => (
                e.achat_DA
            ))
        ))
    }, [data])
    const navigate = useNavigate()

    const options = {
        xaxis: {
            categories: CategoData,
            label: {
                // rotate: 45,
                rotateAlways: true
            }
        },
        colors: [color, '#FFFF', '#FFFF'],
        chart: {
            events: {
                markerClick: function (event, chartContext, { seriesIndex, dataPointIndex, config }) {
                    if (data) {
                        const id = data[dataPointIndex].achat_id
                        navigate(`/achat/${id}`)
                    }
                }
            },
        }
    };
    const series = [
        {
            name: "Weeks",
            data: lineData
        }
    ];

    return (
        <div style={{ width: '48rem', height: '95%' }}>
            <Chart options={options} height="100%" series={series} type="area" />
        </div >
    );
};
export default ApexChart;