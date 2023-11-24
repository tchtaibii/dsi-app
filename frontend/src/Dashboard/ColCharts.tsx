import { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import axios from "../../node_modules/axios/index";

const ApexChart = ({ Series }) => {
    const series = [
        {
            name: "Types",
            data: Series
        }
    ]
    const options = {
        chart: {
            type: 'bar',
            height: '4rem',
        },
        xaxis: {
            type: 'category',
            group: {
                style: {
                    fontSize: '0.6rem',
                    fontWeight: 700,
                },
            },
        },
        title: {
            text: 'Les plus articles demandé',
        },
    }

    return <Chart options={options} series={series} width='340%' height='100%' type="bar" />;
};
export default ApexChart;