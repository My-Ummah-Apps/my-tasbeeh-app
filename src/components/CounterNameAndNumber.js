const CounterNameAndNumber = ({
  counterName,
  activeCounterNumber,
  activeCounterName,
}) => {
  return (
    <div className="dhikr-type-wrap">
      <h1 className="active-counter-name">{activeCounterName}</h1>
      <h1 className="active-counter-number">{activeCounterNumber}</h1>
    </div>
  );
};

export default CounterNameAndNumber;
