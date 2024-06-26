import * as tf from "@tensorflow/tfjs";

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

const dummyData = [
  {
    bedroom_count: 1,
    net_sqm: 26.18409786440993,
    center_distance: 1286.68,
    metro_distance: 204.0038172983832,
    floor: 22,
    age: 67,
    price: 96004.80455671564,
  },
  {
    bedroom_count: 1,
    net_sqm: 34.86690091132422,
    center_distance: 1855.25,
    metro_distance: 186.9803604183612,
    floor: 8,
    age: 30,
    price: 92473.7225680616,
  },
  {
    bedroom_count: 1,
    net_sqm: 36.980708990751,
    center_distance: 692.09,
    metro_distance: 111.22499920528696,
    floor: 24,
    age: 24,
    price: 98112.5199416717,
  },
  {
    bedroom_count: 1,
    net_sqm: 17.445723141767346,
    center_distance: 1399.49,
    metro_distance: 237.9987599600729,
    floor: 1,
    age: 66,
    price: 92118.32687438914,
  },
];

function normalizacji(tensor, min, max) {
  return tf.tidy(() => {
    const MIN_VALUES = min || tf.min(tensor, 0);
    const MAX_VALUES = max || tf.max(tensor, 0);

    const TENSOR_SB_MIN_VALUE = tf.sub(tensor, MIN_VALUES);
    const RANGE_SIZE = tf.sub(MAX_VALUES, MIN_VALUES);
    const NORMALIZED = tf.div(TENSOR_SB_MIN_VALUE, RANGE_SIZE);

    return { NORMALIZED, MIN_VALUES, MAX_VALUES };
  });
}

const AreaChartComponent = () => {
  dummyData.sort((a, b) => a.price - b.price);

  useEffect(() => {
    const inputs = dummyData.map((data) => [
      data.center_distance,
      data.metro_distance,
    ]);

    const outputs = dummyData.map((data) => data.price);


    tf.util.shuffleCombo(inputs, outputs);

    const inputsTensor = tf.tensor2d(inputs);
    const outputsTensor = tf.tensor1d(outputs);

    const RESUKTS = normalizacji(inputsTensor);
    console.log("Normalize value")
    RESUKTS.NORMALIZED.print();

    console.log("Min value")
    RESUKTS.MIN_VALUES.print();

    console.log("Max value")
    RESUKTS.MAX_VALUES.print();

    inputsTensor.dispose();


    dummyData.sort((a, b) => a.price - b.price);
  }, []);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart width={600} height={400} data={dummyData}>
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
        ).toFixed(2)}`}</p>
        <p className="label">{`${payload[1].name} : ${parseFloat(
          payload[1].value
        ).toFixed(2)}`}</p>
        <p className="label">{`${"price"} : ${parseFloat(label).toFixed(
          2
        )}`}</p>
      </div>
    );
  }
};

export default AreaChartComponent;
