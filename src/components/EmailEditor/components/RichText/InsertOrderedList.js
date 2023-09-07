import { useMemo, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faListOl } from "@fortawesome/free-solid-svg-icons";
import useSection from "../../utils/useSection";
import classNames from "../../utils/classNames";
import { GlobalContext } from "../../reducers";

const InsertOrderedList = ({ modifyText, setTextContent }) => {
  const { selectionRange, blockList } = useContext(GlobalContext);
  const { getSelectionNode } = useSection();

  const node = useMemo(() => {
    if (selectionRange) {
      return getSelectionNode(selectionRange.commonAncestorContainer, "ol");
    } else {
      return null;
    }
  }, [selectionRange, blockList]);

  return (
    <button
      className={classNames("rich-text-tools-button ", node && "rich-text-tools-button-active")}
      title="有序列表"
      onClick={() => {
        modifyText("insertOrderedList", false, null);
        setTextContent();
      }}
    >
      <FontAwesomeIcon icon={faListOl} className="rich-text-tools-button-icon" />
    </button>
  );
};

export default InsertOrderedList;
