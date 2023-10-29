import { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { useNavigate } from 'react-router-dom'

const ApexChart = ({ data, color }) => {
    const [lineData, setData] = useState([])
    const [CategoData, setCatego] = useState([])
    useEffect(() => {
        console.log(data)
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
            categories: CategoData.length === 0 ? null : CategoData
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
            }
        }
    };
    const series = [
        {
            name: "Weeks",
            data: lineData
        }
    ];

    return <Chart options={options} series={series} width='200%' type="area" />;
};
export default ApexChart;