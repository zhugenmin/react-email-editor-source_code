import { connect } from "react-redux";
import clsx from "clsx";
import RichText from "../tools/RichText";
import { useRef } from "react";

const ButtonBlock = (props) => {
  //TODO: border radius未制作
  const { block, currentItem, index, blockList, setBlockList, isDragStart, previewMode } = props;
  const styles = previewMode === "desktop" ? block.config.styles.desktop : { ...block.config.styles.desktop, ...block.config.styles.mobile };
  const contentStyles =
    previewMode === "desktop" ? block.config.contentStyles.desktop : { ...block.config.contentStyles.desktop, ...block.config.contentStyles.mobile };
  const isEdit = currentItem && currentItem.index === index;
  const textBlock = useRef(null);
  const setTextContent = (event) => {
    const indexArray = index.split("-");
    let newBlockList = blockList;
    newBlockList[indexArray[0]].config.data[indexArray[1]].data[indexArray[2]].config.text = textBlock.current.innerHTML;
    setBlockList(newBlockList);
  };

  return (
    <div className="relative">
      {isEdit && textBlock && !isDragStart && (
        <RichText textBlock={textBlock} index={index} blockList={blockList} setBlockList={setBlockList} styles={styles} />
      )}
      <div
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
        }}
        style={{ ...contentStyles }}
      >
        <div
          onBlur={setTextContent}
          className={clsx({ "text-block": isEdit })}
          style={{ ...styles }}
          contentEditable={isEdit}
          suppressContentEditableWarning
          ref={textBlock}
          dangerouslySetInnerHTML={{ __html: block.config.text }}
        ></div>
      </div>
    </div>
  );
};
const mapStateToProps = (state) => ({
  previewMode: state.AuthOptions.previewMode,
});

export default connect(mapStateToProps)(ButtonBlock);
