const CounterNameAndNumber = ({
  counterName,
  activeCounterNumber,
  activeCounterName,
  localSavedCountersArray,
}) => {
  let currentBackgroundColor;
  let currentCounterTarget;
  localSavedCountersArray.map((counterItem) => {
    if (counterItem.isActive == true) {
      currentBackgroundColor = counterItem.color;
      currentCounterTarget = counterItem.target;
      activeCounterName = counterItem.counter;
      activeCounterNumber = counterItem.count;
    }
  });
  // console.log(currentBackgroundColor);
  const styles = {
    "--value": activeCounterNumber,
    background: `radial-gradient(
      closest-side,
      white 80%,
      transparent 0 99.9%,
      transparent 0
    ),
    conic-gradient(${currentBackgroundColor} calc(var(--pgPercentage) * ${
      100 / currentCounterTarget
    }%), var(--bg) 0)`,

    fontSize: "calc(var(--size) / 5)",
    color: "var(--fg)",
  };

  return (
    <div
      className="dhikr-type-wrap"
      style={{ backgroundColor: currentBackgroundColor }}
    >
      <h1 className="active-counter-name">{activeCounterName}</h1>

      <div className="progress-bar-wrap">
        <div role="progressbar" style={styles}></div>
        <p className="target-text">Target: {currentCounterTarget}</p>
      </div>

      {/* <h1 className="active-counter-number">{activeCounterNumber}</h1> */}
    </div>
  );
};

export default CounterNameAndNumber;

{
  /* <svg
        xmlns="http://www.w3.org/2000/svg"
        version="1.1"
        width="160px"
        height="160px"
      >
        <defs>
          <linearGradient id="GradientColor">
            <stop offset="0%" stopColor="#e91e63" />
            <stop offset="100%" stopColor="#673ab7" />
          </linearGradient>
        </defs>
        <circle cx="80" cy="80" r="70" strokeLinecap="round" />
      </svg> */
}
