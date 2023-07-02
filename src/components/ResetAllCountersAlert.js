const ResetAllCounters = ({ resetAllCounters, handleCloseModal3 }) => {
  return (
    <div className="reset-all-alert-box-wrap">
      <div className="reset-all-alert-box-text">
        <p>This will reset all Adhkar, are you sure?</p>
      </div>

      <div className="pop-up-box-buttons-wrap reset-all-counters-alert-box-options-wrap">
        <div
          onClick={() => {
            resetAllCounters();
            handleCloseModal3();
          }}
          className="reset-all-counters-alert-box-options-wrap-yes-btn"
          style={{ backgroundColor: "red" }}
        >
          Reset
        </div>
      </div>
    </div>
  );
};

export default ResetAllCounters;
