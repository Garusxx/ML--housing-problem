const Slider = () => {
  return (
    <div>
      <div className="flex justify-between">
        <div className="w-full ml-2 mr-2 ">
          <div>
            <label className="label p-2">m3</label>
            <input
              type="range"
              min={0}
              max="100"
              value="40"
              className="range range-accent"
            />
          </div>

          <div>
            <label className="label p-2">m3</label>
            <input
              type="range"
              min={0}
              max="100"
              value="40"
              className="range range-accent"
            />
          </div>

          <div>
            <label className="label p-2">m3</label>
            <input
              type="range"
              min={0}
              max="100"
              value="40"
              className="range range-accent"
            />
          </div>
        </div>

        <div className="mb-2 mr-2">
          <div className="stats stats-vertical shadow">
            <div className="stat">
              <div className="stat-title">Downloads</div>
              <div className="stat-value">31K</div>
            </div>

            <div className="stat">
              <div className="stat-title">New Users</div>
              <div className="stat-value">4,200</div>
            </div>

            <div className="stat">
              <div className="stat-title">New Registers</div>
              <div className="stat-value">1,200</div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center mb-2">
        <button className="btn btn-accent">Accent</button>
      </div>
    </div>
  );
};

export default Slider;
