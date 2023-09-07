import { useMemo, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faItalic } from "@fortawesome/free-solid-svg-icons";
import useSection from "../../utils/useSection";
import classNames from "../../utils/classNames";
import { GlobalContext } from "../../reducers";

const Italic = ({ modifyText, setTextContent }) => {
  const { selectionRange } = useContext(GlobalContext);
  const { getSelectionNode } = useSection();

  const node = useMemo(() => {
    if (selectionRange) {
      return getSelectionNode(selectionRange.commonAncestorContainer, "i");
    } else {
      return null;
    }
  }, [selectionRange]);

  return (
    <button
      className={classNames("rich-text-tools-button ", node && "rich-text-tools-button-active")}
      title="斜体"
      onClick={() => {
        modifyText("italic", false, null);
        setTextContent();
      }}
    >
      <FontAwesomeIcon icon={faItalic} className="rich-text-tools-button-icon" />
    </button>
  );
};

export default Italic;
