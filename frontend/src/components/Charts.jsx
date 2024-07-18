import AreaChartComponent from "./AreaChartComponent";
import { useEffect } from "react";
import useTreningModel from "../hooks/useTrainingModelLR";
import { useState } from "react";

const Charts = () => {
  const { mLoding , evaluate, clean, randomData } = useTreningModel();
  const [predictedData, setPredictedData] = useState([]);
  const [loadingPredictions, setLoadingPredictions] = useState(false);

  useEffect(() => {
    if (mLoding) {
      try {
        const newPredictedData = randomData.map((item) => {
          console.log("item:", item);
          const evaluatedPrice = evaluate([
            [item.center_distance, item.metro_distance],
          ]);

          console.log(evaluatedPrice);

          if (evaluatedPrice) {
            return {
              ...item,
              price: evaluatedPrice,
            };
          } else {
            console.error("Evaluated price is undefined for item:", item);
            return item;
          }
        });

        console.log("predictedData:", newPredictedData);
        setPredictedData(newPredictedData);
        setLoadingPredictions(true);

        clean();

      } catch (error) {
        console.error("Error during evaluation:", error);
      }
    } else {
      console.log("No trained model available");
    }
  }, [mLoding]);

  return (
    <div className="p-4">
      <div className="flex flex-col justify-center items-center space-y-4">
        <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-4">
          <div className="w-full md:w-1/2">
            <GridItem title="Real Data">
              {mLoding && loadingPredictions ? (
                <AreaChartComponent chartData={randomData} />
              ) : (
                <p>Loading...</p>
              )}
            </GridItem>
          </div>
          <div className="w-full md:w-1/2">
            <p className="text-white">
              This is the description for the Real Data chart. It provides
              insights and explanations about the data being displayed.
            </p>
          </div>
        </div>
        <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-4">
          <div className="w-full md:w-1/2">
            <GridItem title="Predictions">
              {mLoding && loadingPredictions ? (
                <AreaChartComponent chartData={predictedData} />
              ) : (
                <p>Loading...</p>
              )}
            </GridItem>
          </div>
          <div className="w-full md:w-1/2">
            <p className="text-white">
              This is the description for the Real Data chart. It provides
              insights and explanations about the data being displayed.
            </p>
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
