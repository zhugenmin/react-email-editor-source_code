import { useMemo, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBold } from "@fortawesome/free-solid-svg-icons";
import useSection from "../../utils/useSection";
import classNames from "../../utils/classNames";

import { GlobalContext } from "../../reducers";
const Bold = ({ modifyText, setTextContent }) => {
  const { selectionRange, blockList } = useContext(GlobalContext);
  const { getSelectionNode } = useSection();

  const node = useMemo(() => {
    if (selectionRange) {
      return getSelectionNode(selectionRange.commonAncestorContainer, "b");
    } else {
      return null;
    }
  }, [selectionRange, blockList]);

  return (
    <button
      className={classNames("rich-text-tools-button ", node && "rich-text-tools-button-active")}
      title="加粗"
      onClick={() => {
        modifyText("bold", false, null);
        setTextContent();
      }}
    >
      <FontAwesomeIcon icon={faBold} className="rich-text-tools-button-icon" />
    </button>
  );
};

export default Bold;
