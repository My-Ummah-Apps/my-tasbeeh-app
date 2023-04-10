const CounterNameAndNumber = ({
  counterNameFontSize,
  activeCounterName,
  activeCounterNumber,
  activeCounterBackgroundColor,
  activeCounterTarget,
  localSavedCountersArray,
  setActiveCounterName,
  setActiveCounterNumber,
}) => {
  let currentName;
  let currentNumber;
  let currentBackgroundColor;
  let currentCounterTarget;
  localSavedCountersArray.map((counterItem) => {
    if (counterItem.isActive == true) {
      currentBackgroundColor = counterItem.color;
      currentCounterTarget = counterItem.target;
      currentName = counterItem.counter;
      currentNumber = counterItem.count;
      console.log(counterItem);
      // setActiveCounterName(counterItem.counter);
      // setActiveCounterNumber(counterItem.count);
    }
  });
  console.log(activeCounterBackgroundColor);
  const styles = {
    "--value": currentNumber,
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

  const inputField = document.querySelector("#text-input");
  const textElement = document.querySelector("#displayed-text");

  const maxSize = 72;
  const minSize = 12;
  const maxLength = 100;

  // inputField.addEventListener("input", () => {
  //   const currentLength = inputField.value.length;
  //   const fontSize =
  //     maxSize - (currentLength * (maxSize - minSize)) / maxLength;
  //   textElement.style.fontSize = `${fontSize}px`;
  // });

  return (
    <div
      className="dhikr-type-wrap"
      style={{ backgroundColor: currentBackgroundColor }}
    >
      <h1
        className="active-counter-name"
        style={{ fontSize: counterNameFontSize }}
      >
        {currentName}
      </h1>

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
