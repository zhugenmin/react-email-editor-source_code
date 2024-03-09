import { Fragment, useContext } from "react";
import { GlobalContext } from "../../reducers";
import classNames from "../../utils/classNames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowsAlt, faTrash } from "@fortawesome/free-solid-svg-icons";
import { deepClone } from "../../utils/helpers";
import BlockItems from "../BlockItems";
import useTranslation from "../../translation";

const Column = (props) => {
  const { block, blockIndex, clearStyles } = props;
  const { t } = useTranslation();
  const { previewMode, blockList, currentItem, setBlockList, setCurrentItem, setIsDragStart, isDragStart, bodySettings, setActionType } =
    useContext(GlobalContext);

  let columnStyles = previewMode === "desktop" ? block.styles.desktop : { ...block.styles.desktop, ...block.styles.mobile };
  const { contentBackground, ...newStyles } = columnStyles;

  const deleteBlock = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const newBlockList = deepClone(blockList);
    newBlockList.splice(blockIndex, 1);
    setBlockList(newBlockList, "delete");
    setCurrentItem(null);
  };

  const deleteBlockItem = (index) => (event) => {
    event.preventDefault();
    event.stopPropagation();
    const newBlockList = deepClone(blockList);
    const indexArr = index.split("-");
    const blockIndex = indexArr[0];
    const contentIndex = indexArr[1];
    const itemIndex = indexArr[2];
    const item = newBlockList[blockIndex].children[contentIndex].children;
    item.splice(itemIndex, 1);
    if (item.length === 0) {
      item.push({
        name: t("drag_block_here"),
        key: "empty",
        width: "100%",
        styles: {
          desktop: {
            backgroundColor: "transparent",
            paddingTop: 0,
            paddingLeft: 0,
            paddingRight: 0,
            paddingBottom: 0,
          },
          mobile: {},
        },
      });
    }
    setBlockList(newBlockList, "delete");
    setCurrentItem(null);
  };

  const dragStart = () => {
    setIsDragStart(true);
    setCurrentItem({ ...currentItem, type: "move" });
    setActionType("move");
  };

  const dragEnd = (event) => {
    event.preventDefault();
    event.stopPropagation();
    // 父元素的onDrop和onDragOver事件有30ms的延迟，所以这里延迟确保blockList和currentItem更新后50ms清除样式
    setTimeout(() => {
      event.target.style.border = "";
      event.target.children[0] && event.target.children[0].classList.remove("sidebar-block-move");
      setIsDragStart(false);
      clearStyles();
    }, 50);
  };

  const blockItemElement = (item, index) => {
    const nextIndex = index
      .split("-")
      .map((item, itemIndex) => {
        if (itemIndex === 2) {
          return Number(item) + 1;
        } else {
          return item;
        }
      })
      .join("-");
    return (
      <>
        {item.key === "empty" ? (
          <div className="block-empty-content p-4 h-32 relative width-full">
            {isDragStart && currentItem && currentItem.data.key !== "column" && (
              <div className="block-empty-content-tools" onDragOver={preventDefault} data-index={index} data-type="empty-block-item">
                {t("drag_block_here")}
              </div>
            )}
            {item.name}
          </div>
        ) : (
          <>
            <div className="relative block-content-drag-label-content" data-index={index} data-type="block-item">
              <div className="absolute block-move-top">
                <span className="block-tools-drag_here">{t("drag_block_here")}</span>
              </div>
            </div>
            <div className="block-item">
              <div className={classNames("relative", currentItem && currentItem.index === index && "block-item-focus")}>
                <div
                  className="block-item-tools"
                  onDragOver={preventDefault}
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    setCurrentItem({ data: item, type: "edit", index });
                    setActionType("edit");
                  }}
                >
                  {isDragStart && currentItem && currentItem.data.key !== "column" && (
                    <>
                      <div
                        className="block-move-content-top"
                        data-name="dragTools"
                        data-position="top"
                        data-index={index}
                        data-type="block-item-move"
                      ></div>
                      <div
                        className="block-move-content-bottom"
                        data-name="dragTools"
                        data-position="bottom"
                        data-index={nextIndex}
                        data-type="block-item-move"
                      ></div>
                    </>
                  )}
                  <span className="absolute block-item-delete" onClick={deleteBlockItem(index)}>
                    <FontAwesomeIcon icon={faTrash} />
                  </span>
                  <span
                    className="absolute block-item-move current-move-block-arrows"
                    draggable="true"
                    onDragEnd={dragEnd}
                    data-index={index}
                    onDragStart={dragStart}
                  >
                    <FontAwesomeIcon icon={faArrowsAlt} />
                  </span>
                </div>
                <BlockItems blockItem={item} index={index} />
              </div>
            </div>
          </>
        )}
      </>
    );
  };

  const preventDefault = (event) => {
    event.preventDefault();
  };

  return (
    <>
      <div className="relative block-drag-label-content" data-index={blockIndex} data-position="top">
        <div className="absolute block-move-top">
          <span className="block-tools-drag_here">{t("drag_block_here")}</span>
        </div>
        <div
          className={classNames(
            "relative block",
            currentItem && currentItem.index === blockIndex && "block-focus",
            previewMode === "mobile" && "mobile-block-focus"
          )}
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            setCurrentItem({ data: block, type: "edit", index: blockIndex });
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

          <div className="width-full height-full absolute" onDragOver={preventDefault}>
            {isDragStart && currentItem.data.key === "column" && (
              <>
                <div
                  className="block-move-content-top"
                  data-name="dragTools"
                  data-type="drag-over-column"
                  data-position="top"
                  data-index={blockIndex}
                ></div>
                <div
                  className="block-move-content-bottom"
                  data-name="dragTools"
                  data-type="drag-over-column"
                  data-position="bottom"
                  data-index={blockIndex + 1}
                ></div>
              </>
            )}
          </div>
          <div className="column margin-auto" style={{ ...newStyles, maxWidth: "100%" }}>
            <div className="block-content" style={{ background: contentBackground, width: bodySettings.contentWidth }} data-index={blockIndex}>
              {block.children.map((content, index) => {
                let contentStyles = previewMode === "desktop" ? content.styles.desktop : { ...content.styles.desktop, ...content.styles.mobile };
                return (
                  <Fragment key={index}>
                    <div
                      id={`block-content-${blockIndex}-${index}`}
                      style={{ ...contentStyles, width: previewMode === "mobile" ? "100%" : content.width }}
                    >
                      {content.children.map((item, itemIndex) => {
                        const blockItemIndex = `${blockIndex}-${index}-${itemIndex}`;
                        const isLastKid = itemIndex === content.children.length - 1 && item.key !== "empty";
                        return (
                          <Fragment key={itemIndex}>
                            {blockItemElement(item, blockItemIndex)}
                            {isLastKid && (
                              <div className="relative block-content-drag-label-content" data-index={`${blockIndex}-${index}-${itemIndex + 1}`}>
                                <div className="absolute block-move-bottom">
                                  <span className="block-tools-drag_here">{t("drag_block_here")}</span>
                                </div>
                              </div>
                            )}
                          </Fragment>
                        );
                      })}
                    </div>
                  </Fragment>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Column;
