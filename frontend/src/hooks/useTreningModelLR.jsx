import { useEffect } from "react";
import { useState } from "react";
import useGetHousing from "./useGetHousing";
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

async function trainModel(model, inputsNorm, outputs) {
  const learningRate = 0.01;
  model.compile({
    optimizer: tf.train.sgd(learningRate),
    loss: "meanSquaredError",
  });

  let result = await model.fit(inputsNorm, outputs, {
    validationSplit: 0.15,
    shuffle: true,
    batchSize: 64,
    epochs: 100,
  });

  console.log(
    "Avg error loss: " +
      Math.sqrt(result.history.loss[result.history.loss.length - 1])
  );
  console.log(
    "Avg validation error loss: " +
      Math.sqrt(result.history.val_loss[result.history.val_loss.length - 1])
  );

  outputs.dispose();
  inputsNorm.dispose();

  return model;
}

const useTreningModelLR = () => {
  const { loading, housingData } = useGetHousing();
  const [mLoding, setMLoading] = useState(false);
  const [trainedModel, setTrainedModel] = useState(null);
  const [normalizeInputs, setNormalizeInputs] = useState(null);

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

    console.log("Inputs tensor");
    inputsTensor.print();
    console.log("Outputs tensor");
    outputsTensor.print();

    setNormalizeInputs(normalize(inputsTensor));
    console.log("Normalized inputs");
    outputsTensor.print();

    inputsTensor.dispose();

    const model = tf.sequential();
    model.add(tf.layers.dense({ units: 1, inputShape: [2] }));

    model.summary();

    if (normalizeInputs) {
      trainModel(model, normalizeInputs.NORMALIZED, outputsTensor)
        .then((trainedModel) => {
          setTrainedModel(trainedModel);
          console.log(housingData);

          setMLoading(true);
        })
        .catch(console.error);
    }
  }, [housingData]);

  return { mLoding, trainedModel, normalizeInputs };
};

export default useTreningModelLR;
