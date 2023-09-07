import { useMemo, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faListUl } from "@fortawesome/free-solid-svg-icons";
import useSection from "../../utils/useSection";
import classNames from "../../utils/classNames";
import { GlobalContext } from "../../reducers";

const InsertUnorderedList = ({ modifyText, setTextContent }) => {
  const { selectionRange, blockList } = useContext(GlobalContext);
  const { getSelectionNode } = useSection();

  const node = useMemo(() => {
    if (selectionRange) {
      return getSelectionNode(selectionRange.commonAncestorContainer, "ul");
    } else {
      return null;
    }
  }, [selectionRange, blockList]);

  return (
    <button
      className={classNames("rich-text-tools-button ", node && "rich-text-tools-button-active")}
      title="无序列表"
      onClick={() => {
        modifyText("insertUnorderedList", false, null);
        setTextContent();
      }}
    >
      <FontAwesomeIcon icon={faListUl} className="rich-text-tools-button-icon" />
    </button>
  );
};

export default InsertUnorderedList;
