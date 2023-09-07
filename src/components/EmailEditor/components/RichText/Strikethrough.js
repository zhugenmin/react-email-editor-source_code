import { useMemo, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStrikethrough } from "@fortawesome/free-solid-svg-icons";
import useSection from "../../utils/useSection";
import classNames from "../../utils/classNames";
import { GlobalContext } from "../../reducers";

const Strikethrough = ({ modifyText, setTextContent }) => {
  const { selectionRange } = useContext(GlobalContext);
  const { getSelectionNode } = useSection();

  const node = useMemo(() => {
    if (selectionRange) {
      return getSelectionNode(selectionRange.commonAncestorContainer, "strike");
    } else {
      return null;
    }
  }, [selectionRange]);

  return (
    <button
      className={classNames("rich-text-tools-button ", node && "rich-text-tools-button-active")}
      title="删除线"
      onClick={() => {
        modifyText("strikethrough", false, null);
        setTextContent();
      }}
    >
      <FontAwesomeIcon icon={faStrikethrough} className="rich-text-tools-button-icon" />
    </button>
  );
};

export default Strikethrough;
