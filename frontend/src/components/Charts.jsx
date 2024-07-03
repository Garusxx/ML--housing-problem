import AreaChartComponent from "./AreaChartComponent";
import React, { useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import useGetHousing from "../hooks/useGetHousing";

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

function evaluate(inputs, model, dataArr) {
  const arr = [];
  tf.tidy(() => {
    let newInput = normalize(
      tf.tensor2d(dataArr, [dataArr.length, dataArr[0].length]),
      inputs.MIN_VALUES,
      inputs.MAX_VALUES
    );
    let output = model.predict(newInput.NORMALIZED);
    arr.push(output.dataSync());
    output.print();
  });

  console.log("Model disposed: " + tf.memory().numTensors);

  return arr;
}

async function trainModel(model, inputsNorm, outputs) {
  const learningRate = 0.01;
  model.compile({
    optimizer: tf.train.sgd(learningRate),
    loss: "meanSquaredError",
  });

  let result = await model.fit(inputsNorm, outputs, {
    validationSplit: 0.2,
    shuffle: true,
    batchSize: 64,
    epochs: 20,
  });

  console.log(
    "Avg error loss: " +
      Math.sqrt(result.history.loss[result.history.loss.length - 1])
  );
  console.log(
    "Avg validation error loss: " +
      Math.sqrt(result.history.val_loss[result.history.val_loss.length - 1])
  );

  // Nie usuwaj modelu
  outputs.dispose();
  inputsNorm.dispose();

  // Zwróć model
  return model;
}

const Charts = () => {
  const { loading, housingData } = useGetHousing();

  useEffect(() => {
    if (!housingData || housingData.length === 0) {
      console.log("No housing data available");
      return;
    }

    const inputs = housingData.map((data) => [
      data.center_distance,
      data.metro_distance,
    ]);

    if (inputs.length === 0 || inputs[0].length === 0) {
      console.log("Inputs are not in the correct format");
      return;
    }

    const outputs = housingData.map((data) => data.price);

    tf.util.shuffleCombo(inputs, outputs);

    const inputsTensor = tf.tensor2d(inputs, [inputs.length, inputs[0].length]);
    const outputsTensor = tf.tensor1d(outputs);

    const normalizeInputs = normalize(inputsTensor);
    console.log("Normalize value");
    normalizeInputs.NORMALIZED.print();

    console.log("Min value");
    normalizeInputs.MIN_VALUES.print();

    console.log("Max value");
    normalizeInputs.MAX_VALUES.print();

    inputsTensor.dispose();

    const model = tf.sequential();
    model.add(tf.layers.dense({ units: 1, inputShape: [2] }));

    model.summary();

    trainModel(model, normalizeInputs.NORMALIZED, outputsTensor)
      .then((trainedModel) => {
        let dataPoints = [];
        chartData.forEach((data) => {
          dataPoints.push([data.center_distance, data.metro_distance]);
        });
        let pricePredictions = evaluate(
          normalizeInputs.NORMALIZED,
          trainedModel,
          dataPoints
        );

        chartData.forEach((data, index) => {
          data.price = pricePredictions[0][index];
        });

        console.log(chartData);
      })
      .catch(console.error);
  }, [housingData]);
  return (
    <div>
      <div>
        <GridItem title="Area Chart">
          <AreaChartComponent />
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
