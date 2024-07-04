import AreaChartComponent from "./AreaChartComponent";
import React, { useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import useGetHousing from "../hooks/useGetHousing";
import { useState } from "react";

import useTreningModelLR from "../hooks/useTreningModelLR";

const chartData = [
  { center_distance: 1286.68, metro_distance: 204.0, price: 0 },
  { center_distance: 1855.25, metro_distance: 186.98, price: 0 },
  { center_distance: 692.09, metro_distance: 111.22, price: 0 },
  { center_distance: 1399.49, metro_distance: 237.99, price: 0 },
  { center_distance: 2000.0, metro_distance: 450.0, price: 0 },
  { center_distance: 200.2, metro_distance: 10.0, price: 0 },
  { center_distance: 1300.44, metro_distance: 250.0, price: 0 },
  { center_distance: 600.33, metro_distance: 190.0, price: 0 },
  { center_distance: 1200.21, metro_distance: 220.0, price: 0 },
  { center_distance: 20.3, metro_distance: 180.0, price: 0 },
];

function normalize(tensor, min, max) {
  return tf.tidy(() => {
    const MIN_VALUES = min || tf.min(tensor, 0);
    const MAX_VALUES = max || tf.max(tensor, 0);

    const TENSOR_SB_MIN_VALUE = tf.sub(tensor, MIN_VALUES);
    const RANGE_SIZE = tf.sub(MAX_VALUES, MIN_VALUES);
    const NORMALIZED = tf.div(TENSOR_SB_MIN_VALUE, RANGE_SIZE);

    return { NORMALIZED, MIN_VALUES, MAX_VALUES };
  });
}

async function evaluate(inputs, model, dataArr) {
  return tf.tidy(() => {
    const newInput = normalize(
      tf.tensor2d(dataArr, [dataArr.length, dataArr[0].length]),
      inputs.MIN_VALUES,
      inputs.MAX_VALUES
    );
    const output = model.predict(newInput.NORMALIZED);
    const arr = output.dataSync();
    output.print();
    console.log("Model disposed: " + tf.memory().numTensors);
    return arr;
  });
}

const Charts = () => {
  const { mLoding, trainedModel, normalizeInputs } = useTreningModelLR();
  const [updatedChartData, setUpdatedChartData] = useState(chartData);

  useEffect(() => {
    (async () => {
      console.log(trainedModel);
      if (trainedModel) {
        let dataPoints = chartData.map((data) => [
          data.center_distance,
          data.metro_distance,
        ]);

        try {
          const pricePredictions = await evaluate(
            normalizeInputs.NORMALIZED,
            trainedModel,
            dataPoints
          );
          const newChartData = chartData.map((data, index) => ({
            ...data,
            price: pricePredictions[index], 
          }));
          setUpdatedChartData(newChartData); 
          console.log(newChartData);
        } catch (error) {
          console.error(error);
        }
      }
    })();
  }, [trainedModel]);

  return (
    <div>
      <div>
        <GridItem title="Area Chart">
        {mLoding ? <AreaChartComponent chartData={updatedChartData} /> : <p>Loading...</p>}
        </GridItem>
      </div>
    </div>
  );
};

export default Charts;

function GridItem({ title, children }) {
  return (
    <div className="flex flex-col items-center justify-center p-4 border border-slate-900 bg-slate-900/50 rounded-xl h-[300px] w-[700px] ml-4">
      <h3 className="text-2xl font-semibold text-white mb-4">{title}</h3>
      {children}
    </div>
  );
}
