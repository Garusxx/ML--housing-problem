import AreaChartComponent from "./AreaChartComponent";

const Charts = () => {
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
