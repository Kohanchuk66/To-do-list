import React, { useEffect, useState } from "react";
import {
  Area,
  XAxis,
  YAxis,
  Tooltip,
  AreaChart,
  ResponsiveContainer,
  Line,
  CartesianGrid,
  LineChart,
  Legend,
  ReferenceLine,
  ReferenceArea,
  Scatter,
  ZAxis,
  Bar,
  Label,
  ReferenceDot,
} from "recharts";

const data = [
    {
        name: "data1",
        uv: 12,
        pv: 123,
        amt: 2000
    },
    {
        name: "data2",
        uv: 14,
        pv: 524,
        amt: 2100
    },
    {
        name: "data3",
        uv: 53,
        pv: 542,
        amt: 2200
    }
]

function Chart({curentChartData, setCurentPayload,chartMaxValue,chartName}) {
    return (
            <LineChart
              data={data}
              width={500}
              height={300}
            >
                <XAxis dataKey="name"/>
                <YAxis/>
                <CartesianGrid stroke="#eee" strokeDasharray="5 5"/>
                <Line type="monotone" dataKey="uv" stroke="#8884d8"/>
                <Line type="monotone" dataKey="pv" stroke="#82ca9d"/>
                <Line type="monotone" dataKey="amt" stroke="#82ca9d"/>
            </LineChart>
      );
}

export default Chart;