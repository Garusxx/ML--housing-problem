import * as tf from "@tensorflow/tfjs";
import { useState } from "react";

("use client");
import { useEffect } from "react";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const AreaChartComponent = (props) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const sortedData = [...props.chartData].sort((a, b) => a.price - b.price);
    setData(sortedData);
  }, [props.chartData]);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart width={600} height={400} data={data}>s
        <YAxis />
        <XAxis dataKey="price" />
        <CartesianGrid strokeDasharray="3 3" />
        <Legend />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="center_distance"
          stroke="#8884d8"
          fill="#8884d8"
          stackId="1"
        />
        <Area
          type="monotone"
          dataKey="metro_distance"
          stroke="#a52a2a"
          fill="#a52a2a"
          stackId="1"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 p-4 border border-gray-600">
        <p className="label">{`${payload[0].name} : ${parseFloat(
          payload[0].value
        )}`}</p>
        <p className="label">{`${payload[1].name} : ${parseFloat(
          payload[1].value
        )}`}</p>
        <p className="label">{`${"price"} : ${parseFloat(label)}`}</p>
      </div>
    );
  }
};

export default AreaChartComponent;
