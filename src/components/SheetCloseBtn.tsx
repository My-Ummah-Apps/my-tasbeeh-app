interface SheetCloseBtnProps {
  closeModalState: React.Dispatch<React.SetStateAction<boolean>>;
}

const SheetCloseBtn = ({ closeModalState }: SheetCloseBtnProps) => {
  return (
    <button
      className="sheet-changelog-dismiss-btn"
      //   onClick={closeModalState(true)}
    >
      Close
    </button>
  );
};

export default SheetCloseBtn;
