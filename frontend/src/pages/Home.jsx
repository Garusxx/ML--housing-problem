import Sliders from "../components/Sliders";
import Charts from "../components/Charts";

const Home = () => {
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
