import AreaChartComponent from "./AreaChartComponent";
import React, { useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import { useState } from "react";

import useTreningModelLR from "../hooks/useTreningModelLR";

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


const chartData = [
  { center_distance: 731.68, metro_distance: 134.0, price: 0 },
  { center_distance: 277.55, metro_distance: 82.44, price: 0 },
  { center_distance: 310.34, metro_distance: 107.31, price: 0 },
  { center_distance: 1389.61, metro_distance: 47.65, price: 0 },
  { center_distance: 408.67, metro_distance: 24.14, price: 0 },
  { center_distance: 1907.95, metro_distance: 85.12, price: 0 },
  { center_distance: 289.31, metro_distance: 8.83, price: 0 },
  { center_distance: 245.07, metro_distance: 2.41, price: 0 },
  { center_distance: 1102.67, metro_distance: 140.54, price: 0 },
  { center_distance: 887.33, metro_distance: 81.26, price: 0 },
  { center_distance: 376.82, metro_distance: 117.06, price: 0 },
  { center_distance: 178.73, metro_distance: 91.43, price: 0 },
  { center_distance: 1614.97, metro_distance: 185.46, price: 0 },
  { center_distance: 318.6, metro_distance: 34.67, price: 0 },
  { center_distance: 1298.58, metro_distance: 500.0, price: 0 },
  { center_distance: 1510.5, metro_distance: 89.15, price: 0 },
  { center_distance: 1609.97, metro_distance: 103.66, price: 0 },
  { center_distance: 1345.44, metro_distance: 155.92, price: 0 },
  { center_distance: 1052.24, metro_distance: 217.37, price: 0 },
  { center_distance: 1651.69, metro_distance: 185.7, price: 0 },
];

const realData = [
  { center_distance: 731.68, metro_distance: 134.0, price: 94765.57550727027 },
  { center_distance: 277.55, metro_distance: 82.44, price: 99230.71482474083 },
  { center_distance: 310.34, metro_distance: 107.31, price: 93520.4035627115 },
  { center_distance: 1389.61, metro_distance: 47.65, price: 93741.43012794084 },
  { center_distance: 408.67, metro_distance: 24.14, price: 96953.99838858192 },
  { center_distance: 1907.95, metro_distance: 85.12, price: 89657.76191397355 },
  { center_distance: 289.31, metro_distance: 8.83, price: 95457.50194692575 },
  { center_distance: 245.07, metro_distance: 2.41, price: 97002.54792059772 },
  {
    center_distance: 1102.67,
    metro_distance: 140.54,
    price: 100052.18755473389,
  },
  { center_distance: 887.33, metro_distance: 81.26, price: 99801.87784099602 },
  {
    center_distance: 376.82,
    metro_distance: 117.06,
    price: 100809.71685802024,
  },
  { center_distance: 178.73, metro_distance: 91.43, price: 103767.71076567088 },
  {
    center_distance: 1614.97,
    metro_distance: 185.46,
    price: 100451.47977763572,
  },
  { center_distance: 318.6, metro_distance: 34.67, price: 96059.22906048484 },
  { center_distance: 1298.58, metro_distance: 500.0, price: 90602.08943779887 },
  { center_distance: 1510.5, metro_distance: 89.15, price: 89038.33828533307 },
  { center_distance: 1609.97, metro_distance: 103.66, price: 89148.5271633628 },
  {
    center_distance: 1345.44,
    metro_distance: 155.92,
    price: 91487.64307867015,
  },
  {
    center_distance: 1052.24,
    metro_distance: 217.37,
    price: 92116.02987525276,
  },
  { center_distance: 1651.69, metro_distance: 185.7, price: 99187.09077010464 },
];

function evaluate(inputs, model, dataArr) {
  const arr = [];
  tf.tidy(() => {
    let tensorInput = tf.tensor2d(dataArr, [dataArr.length, dataArr[0].length]);

    // Debugging: Print the tensor input before normalization
    console.log("Tensor input before normalization");
    tensorInput.print();

    // Normalize the input data
    let newInput = normalize(
      tensorInput,
      inputs.MIN_VALUES,
      inputs.MAX_VALUES
    );

    // Debugging: Print min and max values used for normalization
    console.log("Min values:", inputs.MIN_VALUES.arraySync());
    console.log("Max values:", inputs.MAX_VALUES.arraySync());

    // Debugging: Print normalized inputs
    console.log("Normalized inputs");
    newInput.NORMALIZED.print();

    // Predict using the model
    let output = model.predict(newInput.NORMALIZED);

    // Debugging: Print model output
    console.log("Model output");
    output.print();

    arr.push(output.dataSync());
  });

  inputs.MIN_VALUES.dispose();
  inputs.MAX_VALUES.dispose();
  model.dispose();

  console.log("Model disposed: " + tf.memory().numTensors);
  console.log(tf.memory().numTensors);

  return arr;
}

const Charts = () => {
  const { mLoding, trainedModel, normalizeInputs } = useTreningModelLR();

  useEffect(() => {
    console.log("Trained model....");
    console.log(normalizeInputs);
    if (trainedModel) {
      let dataPoints = [];
      chartData.forEach((data) => {
        dataPoints.push([data.center_distance, data.metro_distance]);
      });
      console.log("-----------------------------------");
      console.log(dataPoints);
      let pricePredictions = evaluate(
        normalizeInputs,
        trainedModel,
        dataPoints
      );

      chartData.forEach((data, index) => {
        data.price = pricePredictions[0][index];
      });

      console.log(chartData);
    }
  }, [trainedModel]);

  return (
    <div>
      <div>
        <GridItem title="Real Data">
          {mLoding ? (
            <AreaChartComponent chartData={realData} />
          ) : (
            <p>Loading...</p>
          )}
        </GridItem>
        <GridItem title="ML">
          {mLoding ? (
            <AreaChartComponent chartData={chartData} />
          ) : (
            <p>Loading...</p>
          )}
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
