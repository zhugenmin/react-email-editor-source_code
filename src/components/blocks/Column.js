import clsx from "clsx";
import { Fragment } from "react";
import { connect } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faArrowsAlt } from "@fortawesome/free-solid-svg-icons";
import TextBlock from "./TextBlock";
import HeadingBlock from "./HeadingBlock";
import ButtonBlock from "./ButtonBlock";
import DividerBlock from "./DividerBlock";
import ImageBlock from "./ImageBlock";

const Column = (props) => {
  const {
    blockIndex,
    blockList,
    setBlockList,
    block,
    currentItem,
    setCurrentItem,
    swapBlockList,
    appendBlockList,
    clearLabelStyles,
    clearContentLabelStyles,
    isDragStart,
    setIsDragStart,
    bodySettings,
    previewMode,
  } = props;
  let columnStyles = previewMode === "desktop" ? block.styles.desktop : { ...block.styles.desktop, ...block.styles.mobile };
  const { contentBackground, ...newStyles } = columnStyles;
  const deleteBlock = (event) => {
    event.stopPropagation();
    event.preventDefault();
    setBlockList(blockList.filter((item, idx) => idx !== blockIndex));
    setCurrentItem(null);
  };

  const deleteContentBlockList = (blockIndex, index, itemIndex) => {
    let newBlockList = JSON.parse(JSON.stringify(blockList));
    let newData = newBlockList[blockIndex].config.data[index].data.filter((item, idx) => {
      return idx !== itemIndex;
    });

    if (!newData.length) {
      newBlockList[blockIndex].config.data[index] = {
        name: "No content here. drag content here",
        width: newBlockList[blockIndex].config.data[index].width,
        styles: newBlockList[blockIndex].config.data[index].styles,
        key: "empty",
      };
    } else {
      newBlockList[blockIndex].config.data[index].data = newData;
    }
    return newBlockList;
  };

  const deleteContentBlock = (index, itemIndex) => (event) => {
    event.stopPropagation();
    event.preventDefault();
    setBlockList(deleteContentBlockList(blockIndex, index, itemIndex));
    setCurrentItem(null);
  };

  const dropElement = (event) => {
    event.stopPropagation();
    event.preventDefault();
    const dropDom = event.target;
    if (dropDom.dataset.name === "dragTools") {
      const { index } = dropDom.dataset;
      if (currentItem !== null) {
        if (Number(index) > blockList.length || currentItem.type === "moveBlock") {
          setBlockList(appendBlockList(index));
        } else {
          setBlockList(swapBlockList(currentItem.index, index));
        }
      }
    }
    dragEnd();
  };

  const dropBlockContent = (event) => {
    event.stopPropagation();
    event.preventDefault();
    const dropDom = event.target;
    if (dropDom.dataset.name === "dragTools") {
      const indexArray = dropDom.dataset.index.split("-");
      let newBlockList = JSON.parse(JSON.stringify(blockList));
      const newBlockListConfig = newBlockList[indexArray[0]].config.data[indexArray[1]].data;

      if (currentItem.type === "add") {
        newBlockListConfig.splice(indexArray[2], 0, currentItem.data);
      } else {
        const currentIndexArray = currentItem.index.split("-");
        const currentItemConfig = newBlockList[currentIndexArray[0]].config.data[currentIndexArray[1]].data;
        //indexArray与currentIndexArray不相同时，则说明block移动到了另外一个content当中
        if (indexArray[0] !== currentIndexArray[0] || indexArray[1] !== currentIndexArray[1]) {
          newBlockListConfig.splice(indexArray[2], 0, currentItem.data);
          currentItemConfig.splice(currentIndexArray[2], 1);
          if (!currentItemConfig.length) {
            newBlockList[currentIndexArray[0]].config.data[currentIndexArray[1]] = {
              name: "No content here. drag content here",
              width: newBlockList[currentIndexArray[0]].config.data[currentIndexArray[1]].width,
              styles: newBlockList[currentIndexArray[0]].config.data[currentIndexArray[1]].styles,
              key: "empty",
            };
          }
        } else {
          const newIndex = Number(indexArray[2]);
          const oldIndex = Number(currentIndexArray[2]);
          if (newIndex !== oldIndex) {
            currentItemConfig.splice(newIndex, 0, currentItem.data);
            if (newIndex < oldIndex) {
              currentItemConfig.splice(oldIndex + 1, 1);
            } else {
              currentItemConfig.splice(oldIndex, 1);
            }
          }
        }
      }
      setBlockList([...newBlockList]);
      dragEnd();
    }
  };
  const dragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
    clearContentLabelStyles();
    let { index } = event.target.dataset;
    const dragLabelElements = document.getElementsByClassName("block-drag-label-content");
    Array.from(dragLabelElements).forEach((item) => {
      if (Number(item.dataset.index) === Number(index)) {
        item.children[0].style.visibility = "visible";
      } else {
        item.children[0].style.visibility = "hidden";
      }
    });
  };

  const dragOverEmptyContent = (event) => {
    event.preventDefault();
    event.stopPropagation();
    clearLabelStyles();
    clearContentLabelStyles();
    event.target.style.opacity = 1;
  };

  const dragOverBlockContent = (event) => {
    event.preventDefault();
    event.stopPropagation();
    clearLabelStyles();
    let { index } = event.target.dataset;
    const dragLabelElements = document.getElementsByClassName("block-content-drag-label-content");
    Array.from(dragLabelElements).forEach((item) => {
      if (item.dataset.index === index) {
        item.children[0].style.visibility = "visible";
      } else {
        item.children[0].style.visibility = "hidden";
      }
    });
  };

  const dragLeaveEmptyContent = (event) => {
    event.preventDefault();
    event.stopPropagation();
    event.target.style.opacity = 0;
  };

  const dropEmptyContent = (index) => (event) => {
    event.preventDefault();
    event.stopPropagation();
    let newBlockList = JSON.parse(JSON.stringify(blockList));
    if (currentItem.type === "moveBlock") {
      const indexArray = currentItem.index.split("-");
      newBlockList = deleteContentBlockList(Number(indexArray[0]), Number(indexArray[1]), Number(indexArray[2]));
    }
    newBlockList[blockIndex].config.data[index] = {
      name: "content",
      key: "content",
      width: newBlockList[blockIndex].config.data[index].width,
      styles: newBlockList[blockIndex].config.data[index].styles,
      data: [{ ...currentItem.data }],
    };
    dragEnd();
    setBlockList(newBlockList);
  };

  const dragStart = () => {
    setIsDragStart(true);
  };

  const dragEnd = () => {
    clearLabelStyles();
    clearContentLabelStyles();
    setCurrentItem(null);
    setIsDragStart(false);
  };

  const renderBlockDom = (block, index, itemIndex) => {
    const newIndex = `${blockIndex}-${index}-${itemIndex}`;
    const nextNewIndex = `${blockIndex}-${index}-${itemIndex + 1}`;
    return (
      <Fragment key={itemIndex}>
        <div className="relative block-content-drag-label-content" data-index={newIndex}>
          <div className="absolute block-move-top">
            <span className="block-tools-drag_here">拖放到此处</span>
          </div>
        </div>
        <div className="block-item">
          <div
            className={clsx("relative", {
              "block-item-focus": currentItem && currentItem.type === "moveBlock" && currentItem.index === newIndex,
            })}
          >
            <div
              className="block-item-tools"
              onDragOver={dragOverBlockContent}
              onDrop={dropBlockContent}
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                setCurrentItem({ data: block, type: "moveBlock", index: newIndex });
              }}
            >
              {isDragStart && currentItem && currentItem.data.key !== "column" && (
                <>
                  <div className="block-move-content-top" data-name="dragTools" data-position="top" data-index={newIndex}></div>
                  <div className="block-move-content-bottom" data-name="dragTools" data-position="bottom" data-index={nextNewIndex}></div>
                </>
              )}
              <span className="absolute block-item-delete" onClick={deleteContentBlock(index, itemIndex)}>
                <FontAwesomeIcon icon={faTrash} />
              </span>
              <span
                className="absolute block-item-move current-move-block-arrows"
                draggable="true"
                onDragEnd={dragEnd}
                data-index={blockIndex}
                onDragStart={dragStart}
              >
                <FontAwesomeIcon icon={faArrowsAlt} />
              </span>
            </div>
            {block.key === "text" && (
              <TextBlock
                block={block}
                currentItem={currentItem}
                isDragStart={isDragStart}
                index={newIndex}
                blockList={blockList}
                setBlockList={setBlockList}
              />
            )}
            {block.key === "heading" && (
              <HeadingBlock
                block={block}
                currentItem={currentItem}
                isDragStart={isDragStart}
                index={newIndex}
                blockList={blockList}
                setBlockList={setBlockList}
              />
            )}
            {block.key === "button" && (
              <ButtonBlock
                block={block}
                currentItem={currentItem}
                isDragStart={isDragStart}
                index={newIndex}
                blockList={blockList}
                setBlockList={setBlockList}
              />
            )}
            {block.key === "divider" && <DividerBlock block={block} blockList={blockList} />}
            {block.key === "image" && <ImageBlock block={block} blockList={blockList} />}
          </div>
        </div>
      </Fragment>
    );
  };

  return (
    <>
      <div className="relative block-drag-label-content" data-index={blockIndex}>
        <div className="absolute block-move-top">
          <span className="block-tools-drag_here">拖放到此处</span>
        </div>
      </div>
      <div
        className={clsx("relative block", {
          "block-focus": currentItem && currentItem.type === "move" && currentItem.index === blockIndex,
          "mobile-block-focus": previewMode === "mobile",
        })}
        tabIndex="-1"
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          setCurrentItem({ data: block, type: "move", index: blockIndex });
        }}
      >
        <div className="hover-visible">
          <span className="absolute block-delete" onClick={deleteBlock}>
            <FontAwesomeIcon icon={faTrash} />
          </span>
          <span
            className="absolute block-move current-move-block-arrows"
            draggable="true"
            onDragEnd={dragEnd}
            data-index={blockIndex}
            onDragStart={dragStart}
          >
            <FontAwesomeIcon icon={faArrowsAlt} />
          </span>
        </div>
        <div className="w-full h-full absolute" onDragOver={dragOver} onDrop={dropElement}>
          {isDragStart && (
            <>
              <div className="block-move-content-top" data-name="dragTools" data-position="top" data-index={blockIndex}></div>
              <div className="block-move-content-bottom" data-name="dragTools" data-position="bottom" data-index={blockIndex + 1}></div>
            </>
          )}
        </div>

        <div className="column" style={{ ...newStyles }}>
          <div
            className="text-blue-500 h-full flex mx-auto flex-wrap"
            style={{ maxWidth: bodySettings.contentWidth, background: contentBackground }}
            data-index={blockIndex}
          >
            {block.config.data.length &&
              block.config.data.map((item, index) => {
                let blockStyles = previewMode === "desktop" ? item.styles.desktop : { ...item.styles.desktop, ...item.styles.mobile };

                return (
                  <Fragment key={index}>
                    {item.key === "content" && (
                      <div
                        id={`block-content-${blockIndex}-${index}`}
                        style={{ ...blockStyles, width: previewMode === "mobile" ? "100%" : item.width }}
                      >
                        {item.data.map((item, itemIndex) => {
                          return renderBlockDom(item, index, itemIndex);
                        })}
                        <div className="relative block-content-drag-label-content" data-index={`${blockIndex}-${index}-${item.data.length}`}>
                          <div className="absolute block-move-bottom">
                            <span className="block-tools-drag_here">拖放到此处</span>
                          </div>
                        </div>
                      </div>
                    )}
                    {item.key === "empty" && (
                      <div
                        className="block-empty-content p-4 h-32 relative"
                        style={{ ...blockStyles, width: previewMode === "mobile" ? "100%" : item.width }}
                      >
                        {isDragStart && currentItem && currentItem.data.key !== "column" && (
                          <div
                            className="block-empty-content-tools"
                            onDragOver={dragOverEmptyContent}
                            onDragLeave={dragLeaveEmptyContent}
                            onDrop={dropEmptyContent(index)}
                          >
                            拖放到此处
                          </div>
                        )}
                        {item.name}
                      </div>
                    )}
                  </Fragment>
                );
              })}
          </div>
        </div>
      </div>
    </>
  );
};
const mapStateToProps = (state) => ({
  previewMode: state.AuthOptions.previewMode,
});

export default connect(mapStateToProps)(Column);
