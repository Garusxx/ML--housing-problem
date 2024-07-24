import AreaChartComponent from "./AreaChartComponent";
import { useEffect } from "react";
import useTreningModel from "../hooks/useTrainingModelLR";
import { useState, useRef } from "react";

const Charts = () => {
  const { mLoding, evaluate, clean, randomData } = useTreningModel();
  const [predictedData, setPredictedData] = useState([]);
  const [loadingPredictions, setLoadingPredictions] = useState(false);
  const [predictedValue, setPredictedValue] = useState(0);
  const [isFormValid, setIsFormValid] = useState(false);

  const ceterDistanceInputRef = useRef(null);
  const metroDistanceInputRef = useRef(null);

  const validateForm = () => {
    const centerDistance = ceterDistanceInputRef.current.value;
    const metroDistance = metroDistanceInputRef.current.value;

    if (centerDistance && metroDistance) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  };

  const validateAndSetInputValue = (event) => {
    let value = parseInt(event.target.value, 10);

    if (value < 0) {
      value = 0;
    } else if (value > 3000) {
      value = 3000;
    }

    event.target.value = value;

    validateForm();
  };

  const predictPrice = () => {
    const centerDistance = parseFloat(ceterDistanceInputRef.current.value);
    const metroDistance = parseFloat(metroDistanceInputRef.current.value);

    if (mLoding) {
      if (centerDistance === null || metroDistance === null) {
        console.log("Please enter valid values");
      } else {
        const inputValues = [[centerDistance, metroDistance]];
        setPredictedValue(evaluate(inputValues));
      }
    } else {
      console.log("No trained model");
    }
  };

  useEffect(() => {
    if (mLoding) {
      try {
        const newPredictedData = randomData.map((item) => {
          const evaluatedPrice = evaluate([
            [item.center_distance, item.metro_distance],
          ]);

          if (evaluatedPrice) {
            return {
              ...item,
              price: evaluatedPrice.toFixed(2),
            };
          } else {
            console.error("Evaluated price is undefined for item:", item);
            return item;
          }
        });

        console.log("predictedData:", newPredictedData);
        setPredictedData(newPredictedData);
        setLoadingPredictions(true);
      } catch (error) {
        console.error("Error during evaluation:", error);
      }
    } else {
      console.log("No trained model available");
    }
  }, [mLoding]);

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="col-span-1 md:col-span-1">
          <GridItem title="Actual Housing Data">
            {mLoding && loadingPredictions ? (
              <AreaChartComponent chartData={randomData} />
            ) : (
              <span className="loading loading-spinner text-secondary"></span>
            )}
          </GridItem>
        </div>
        <div className="flex flex-col items-center justify-center">
          <h2 className="text-center text-3xl font-bold w-full text-white">
            Description:
          </h2>
          <p className="text-white text-xl text-center">
            This chart displays actual housing data points, illustrating the
            relationship between various factors such as distance from the city
            center and metro accessibility. Use this chart to understand
            historical trends and current market conditions. Below, you can
            input custom values to estimate property prices based on proximity
            to city and metro locations, allowing for personalized insights into
            potential housing investments. This application leverages machine
            learning algorithms powered by TensorFlow to provide accurate and
            data-driven property price predictions.
          </p>
        </div>
        <div className="col-span-1 md:col-span-1">
          <GridItem title="Predicted Housing Prices">
            {mLoding && loadingPredictions ? (
              <AreaChartComponent chartData={predictedData} />
            ) : (
              <span className="loading loading-spinner text-secondary"></span>
            )}
          </GridItem>
        </div>
        <div className="col-span-1 md:col-span-1 flex flex-col items-center">
          <h2 className="text-center text-3xl font-bold w-full text-white">
            Estimate Property Value
          </h2>
          <div className="w-full flex justify-between items-center mt-4">
            <div className="w-1/2 flex flex-col items-center">
              <div className="w-full max-w-xs">
                <label className="form-control w-full">
                  <div className="label">
                    <span className="label-text">Center Distance</span>
                  </div>
                  <input
                    type="number"
                    placeholder="Center Distance"
                    required
                    className="input input-bordered w-full"
                    ref={ceterDistanceInputRef}
                    onChange={validateAndSetInputValue}
                  />
                </label>
              </div>
              <div className="w-full max-w-xs mt-4">
                <label className="form-control w-full">
                  <div className="label">
                    <span className="label-text">Metro Distance</span>
                  </div>
                  <input
                    type="number"
                    placeholder="Metro Distance"
                    required
                    className="input input-bordered w-full"
                    ref={metroDistanceInputRef}
                    onChange={validateAndSetInputValue}
                  />
                </label>
              </div>
              <button
                className="btn btn-neutral mt-4"
                onClick={predictPrice}
                disabled={!isFormValid}
              >
                Predict
              </button>
            </div>
            <div className="w-1/2 flex flex-col items-center justify-center bg-gray-900 p-4 rounded text-xl text-white">
              <p>Price deduction:</p>
              <p> ${predictedValue.toFixed(2)}</p>
            </div>
          </div>
        </div>
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
