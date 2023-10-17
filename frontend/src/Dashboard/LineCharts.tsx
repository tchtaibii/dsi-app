import { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { useNavigate } from 'react-router-dom'

const ApexChart = ({ data }) => {
    const [lineData, setData] = useState([])
    useEffect(() => {
        setData(() => (
            data.map((e: any) => (
                e.weeks_count
            ))
        ))
        console.log(data)
    }, [data])
    const navigate = useNavigate()

    const options = {
        xaxis: {
            categories: ["Slight delay", "Delayed", "Overdue"]
        },
        colors: ['#F44336', '#FFFF', '#FFFF'],
        chart: {
            events: {
                markerClick: function (event, chartContext, { seriesIndex, dataPointIndex, config }) {
                    const id = data[dataPointIndex].achat_id
                    console.log(data[dataPointIndex])
                    navigate(`/achat/${id}`)
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