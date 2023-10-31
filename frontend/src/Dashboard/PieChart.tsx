import React, {useEffect} from "react";
import { Chart } from "react-google-charts";


export const options = {
    // title : "Demande d'achat",
    legend: "true",
    pieSliceText: "label",
    slices: {
        1: { color: "#BD391B" },
        0: { color: "#008C76" },
    },
    backgroundColor: 'transparent',
};

function PieChart({ data }) {
    useEffect(() => {
        console.log(data)
    },[])
    const dataP = [
        ["Situation", "Achats"],
        ["Livré", data.livre],
        ["Non livré", data.non_livre],

    ];
    return (
        <div style={{transform: 'translateX(5rem)', width: '100%', marginTop: '-5rem', height: '100%', display: 'flex', alignItems: 'center' }}>
            <Chart
                chartType="PieChart"
                data={dataP}
                options={options}
                width={"105%"}
                height={"120%"}
            />
        </div>

    );
}

export default PieChart;