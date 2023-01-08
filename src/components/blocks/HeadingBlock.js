import { connect } from "react-redux";
import clsx from "clsx";
import RichText from "../tools/RichText";
import { useRef } from "react";

const HeadingBlock = (props) => {
  const { block, currentItem, index, blockList, setBlockList, isDragStart, previewMode } = props;
  const isEdit = currentItem && currentItem.index === index;
  const headingBlock = useRef(null);
  const styles =
    previewMode === "desktop" ? block.config.styles.desktop : { ...block.config.styles.desktop, ...block.config.styles.mobile, fontWeight: "Bold" };

  const setTextContent = (event) => {
    const indexArray = index.split("-");
    let newBlockList = blockList;
    newBlockList[indexArray[0]].config.data[indexArray[1]].data[indexArray[2]].config.text = headingBlock.current.innerHTML;
    setBlockList(newBlockList);
  };

  return (
    <div className="relative">
      {isEdit && headingBlock && !isDragStart && (
        <RichText textBlock={headingBlock} index={index} blockList={blockList} setBlockList={setBlockList} styles={styles} />
      )}
      <div
        className={clsx({ "text-block": isEdit })}
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
        }}
        onBlur={setTextContent}
        style={styles}
        contentEditable={isEdit}
        suppressContentEditableWarning
        ref={headingBlock}
        dangerouslySetInnerHTML={{ __html: block.config.text }}
      ></div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  previewMode: state.AuthOptions.previewMode,
});

export default connect(mapStateToProps)(HeadingBlock);
