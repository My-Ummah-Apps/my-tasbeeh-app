import { MdOutlineChevronRight } from "react-icons/md";

const SettingIndividual = ({
  id,
  headingText,
  subText,
  indvidualStyles,
  onClick,
}: {
  id?: string;
  headingText: string;
  subText: string;
  indvidualStyles?: string;
  onClick?: () => void;
}) => {
  return (
    <section
      id={id || ""}
      // style={{ borderTopRightRadius: indvidualStyles }}
      className={`flex items-center justify-between mx-auto p-3 ${indvidualStyles}`}
      onClick={onClick}
    >
      <div className="">
        <p className="pt-[0.3rem] pb-[0.1rem] text-lg">{headingText}</p>
        <p className="pt-[0.3rem]  pb-[0.1rem] text-[0.8rem] font-light">
          {subText}
        </p>
      </div>
      <MdOutlineChevronRight className="chevron text-[#b5b5b5]" />
    </section>
  );
};

export default SettingIndividual;
