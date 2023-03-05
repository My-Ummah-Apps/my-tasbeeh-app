const CounterNameAndNumber = ({
  counterName,
  activeCounterNumber,
  activeCounterName,
}) => {
  return (
    <div className="dhikr-type-wrap">
      <h1>{activeCounterName}</h1>
      <h1>{activeCounterNumber}</h1>
    </div>
  );
};

export default CounterNameAndNumber;
