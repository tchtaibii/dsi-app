import React from "react";
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
    const dataP = [
        ["Situation", "Achats"],
        ["Livré", data.livre],
        ["Non livré", data.non_livre],

    ];
    return (
        <div style={{ width: '100%', height: '100%', transform: 'translate(-11rem, -5.9rem)' }}>
            <Chart
                chartType="PieChart"
                data={dataP}
                options={options}
                width={"115%"}
                height={"120%"}
            />
        </div>

    );
}

export default PieChart;