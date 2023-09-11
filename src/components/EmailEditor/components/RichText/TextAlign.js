import { useMemo, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAlignLeft, faAlignCenter, faAlignRight } from "@fortawesome/free-solid-svg-icons";
import useSection from "../../utils/useSection";
import classNames from "../../utils/classNames";
import { GlobalContext } from "../../reducers";

const TextAlign = ({ modifyText, setTextContent }) => {
  const { selectionRange, blockList } = useContext(GlobalContext);
  const { getSectionStyle } = useSection();

  const textAlign = useMemo(() => {
    if (selectionRange) {
      return getSectionStyle(selectionRange.commonAncestorContainer, "textAlign");
    } else {
      return null;
    }
  }, [selectionRange, blockList]);

  return (
    <>
      <button
        className={classNames("rich-text-tools-button ", textAlign === "left" && "rich-text-tools-button-active")}
        title="居左"
        onClick={() => {
          modifyText("justifyLeft", false, null);
          setTextContent();
        }}
      >
        <FontAwesomeIcon icon={faAlignLeft} className="rich-text-tools-button-icon" />
      </button>
      <button
        className={classNames("rich-text-tools-button ", textAlign === "center" && "rich-text-tools-button-active")}
        title="居中"
        onClick={() => {
          modifyText("justifyCenter", false, null);
          setTextContent();
        }}
      >
        <FontAwesomeIcon icon={faAlignCenter} className="rich-text-tools-button-icon" />
      </button>
      <button
        className={classNames("rich-text-tools-button ", textAlign === "right" && "rich-text-tools-button-active")}
        title="居右"
        onClick={() => {
          modifyText("justifyRight", false, null);
          setTextContent();
        }}
      >
        <FontAwesomeIcon icon={faAlignRight} className="rich-text-tools-button-icon" />
      </button>
    </>
  );
};

export default TextAlign;
