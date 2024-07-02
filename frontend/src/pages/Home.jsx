import Sliders from "../components/Sliders";
import Charts from "../components/Charts";
import useGetHousing from "../hooks/useGetHousing";
import { useEffect } from "react";
import * as tf from "@tensorflow/tfjs";

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

function evaluate(inputs, model) {
  tf.tidy(() => {
    let newInput = normalize(
      tf.tensor2d([[1000, 100]]),
      inputs.MIN_VALUES,
      inputs.MAX_VALUES
    );
    let output = model.predict(newInput.NORMALIZED);
    output.print();
  });

  console.log("Model disposed: " + tf.memory().numTensors);
}

async function trainModel(model, inputs, outputs) {
  const lerningRate = 0.01;
  model.compile({
    optimizer: tf.train.sgd(lerningRate),
    loss: "meanSquaredError",
  });

  let result = await model.fit(inputs, outputs, {
    validationSplit: 0.2,
    shuffle: true,
    epochs: 10,
  });

  console.log(
    "Avg error loss: " +
      Math.sqrt(result.history.loss[result.history.loss.length - 1])
  );
  console.log(
    "Avg validation error loss: " +
      Math.sqrt(result.history.val_loss[result.history.val_loss.length - 1])
  );

  evaluate(inputs, model);

  outputs.dispose();
  inputs.dispose();
  model.dispose();
}

const Home = () => {

  const { loading, housingData } = useGetHousing();
  console.log(housingData);

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
  
    trainModel(model, normalizeInputs.NORMALIZED, outputsTensor).catch(console.error);
  
  }, [housingData]);

  return (
    <div className="flex flex-col items-center justify-center min-w-96 mx-auto">
      <div className="h-full w-full bg-gray-400 rounded-md bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-40 ">
        <h1 className="text-3xl font-semibold text-center text-gray-300 mb-4 mt-4">
          Home Price Calculator
        </h1>
        <div className="flex justify-center space-x-4">
          <Charts />
          <Sliders />
        </div>
      </div>
    </div>
  );
};

export default Home;
