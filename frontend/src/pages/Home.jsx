import Charts from "../components/Charts";

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-w-96 mx-auto">
      <div className="h-full w-full bg-gray-500 rounded-md bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-50 flex flex-col justify-center items-center">
        <h1 className="text-5xl font-semibold text-center text-gray-300 mb-4 mt-4">
          ProphetPrice
        </h1>
        <div className="flex justify-center items-center">
          <Charts />
        </div>
      </div>
    </div>
  );
};

export default Home;
