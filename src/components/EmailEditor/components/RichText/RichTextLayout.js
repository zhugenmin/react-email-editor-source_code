import { useContext, useRef, useEffect } from "react";
import { GlobalContext } from "../../reducers";
import classNames from "../../utils/classNames";
import { deepClone } from "../../utils/helpers";
import RichText from "../RichText";

const RichTextLayout = ({ index, blockItem }) => {
  const { currentItem, previewMode, blockList, setBlockList, setCurrentItem, isDragStart } = useContext(GlobalContext);

  const richTextRef = useRef(null);

  const isEdit = currentItem && currentItem.index === index;
  const styles = previewMode === "desktop" ? blockItem.styles.desktop : { ...blockItem.styles.desktop, ...blockItem.styles.mobile };

  useEffect(() => {
    if (isEdit) {
      richTextRef.current.focus();
    }
  }, []);

  const setTextContent = (event) => {
    const indexArray = index.split("-");
    let newBlockList = deepClone(blockList);
    let newCurrentItem = deepClone(currentItem);
    newCurrentItem.data.text = event.target.innerHTML;
    newBlockList[indexArray[0]].children[indexArray[1]].children[indexArray[2]].text = event.target.innerHTML;
    setBlockList(newBlockList);
    setCurrentItem({ ...newCurrentItem });
  };

  const preventDefault = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <div className="relative">
      {isEdit && blockItem && !isDragStart && <RichText textBlock={richTextRef} index={index} styles={styles} />}
      <div
        className={classNames(isEdit && "text-block", "text-content_editable")}
        onClick={preventDefault}
        onInput={setTextContent}
        style={styles}
        contentEditable={isEdit}
        suppressContentEditableWarning
        ref={richTextRef}
        dangerouslySetInnerHTML={{ __html: blockItem.text }}
      ></div>
    </div>
  );
};

export default RichTextLayout;
