import { connect } from "react-redux";
import clsx from "clsx";
import RichText from "../tools/RichText";
import { useRef } from "react";

const TextBlock = (props) => {
  const { block, currentItem, index, blockList, setBlockList, isDragStart, previewMode } = props;
  const isEdit = currentItem && currentItem.index === index;
  const styles = previewMode === "desktop" ? block.config.styles.desktop : { ...block.config.styles.desktop, ...block.config.styles.mobile };
  const textBlock = useRef(null);
  const setTextContent = (event) => {
    const indexArray = index.split("-");
    let newBlockList = blockList;
    newBlockList[indexArray[0]].config.data[indexArray[1]].data[indexArray[2]].config.text = textBlock.current.innerHTML;
    setBlockList(newBlockList);
  };

  // let selection = document.getSelection();
  // // 取得表示选区的范围
  // let range = selection.getRangeAt(0);
  // let span = document.createElement('span');
  // span.style.backgroundColor = 'yellow';
  // // 给选中文本添加背景为黄色的<span>标签
  // range.surroundContents(span);
  // console.log(range)

  // TODO: 选中文本时检测文本的样式，给相应的样式按钮高亮处理
  // onMouseDown={(event) => {
  //   document.onmousemove = () => {
  //     let selection = window.getSelection(),
  //       range = selection.getRangeAt(0),
  //       aimEle = range.commonAncestorContainer;
  //     if (aimEle.nodeType === 3) {
  //       aimEle = aimEle.parentNode;
  //     }
  //     console.log(aimEle, range.startContainer);
  //   };
  // }}
  // onMouseUp={() => {
  //   document.onmousemove = null;
  // }}

  return (
    <div className="relative">
      {isEdit && textBlock && !isDragStart && (
        <RichText textBlock={textBlock} index={index} blockList={blockList} setBlockList={setBlockList} styles={styles} />
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
        ref={textBlock}
        dangerouslySetInnerHTML={{ __html: block.config.text }}
      ></div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  previewMode: state.AuthOptions.previewMode,
});

export default connect(mapStateToProps)(TextBlock);
