import { useMemo, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUnderline } from "@fortawesome/free-solid-svg-icons";
import useSection from "../../utils/useSection";
import classNames from "../../utils/classNames";
import { GlobalContext } from "../../reducers";

const Underline = ({ modifyText, setTextContent }) => {
  const { selectionRange } = useContext(GlobalContext);
  const { getSelectionNode } = useSection();

  const node = useMemo(() => {
    if (selectionRange) {
      return getSelectionNode(selectionRange.commonAncestorContainer, "u");
    } else {
      return null;
    }
  }, [selectionRange]);

  return (
    <button
      className={classNames("rich-text-tools-button ", node && "rich-text-tools-button-active")}
      title="下划线"
      onClick={() => {
        modifyText("underline", false, null);
        setTextContent();
      }}
    >
      <FontAwesomeIcon icon={faUnderline} className="rich-text-tools-button-icon" />
    </button>
  );
};

export default Underline;
