import { useState, Fragment } from "react";
import { Drawer, Input, Popover, InputNumber, Spin } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ChromePicker } from "react-color";
import { motion } from "framer-motion";
import { faColumns, faMinusSquare, faHeading, faFont, faGripLines, faImages, faCubes, faMailBulk, faImage } from "@fortawesome/free-solid-svg-icons";

import Column from "../../components/blocks/Column";
import StyleSettings from "../../components/settings/StyleSettings";
import clsx from "clsx";
import { connect } from "react-redux";
import blockConfigsList from "../../utils/blockConfigsList";
import { defaultStyles } from "../../utils/defaultColumnsSettings";
import fetchPhotos from "../../utils/pexels";
import Header from "../../components/blocks/Header";
import { setBlockList } from "../../redux/reducerCollection/AuthOptions";
import { deepClone } from "../../utils/helpers";

// TODO:
// 1.拷贝功能
// 2.图片block可以选择pexels的图片
// 3.图片上传
// 4.Social Link制作
// 5.columns 添加可上传背景图片
// 6.spacer block

function Dashboard(props) {
  const { previewMode, blockList, setBlockList } = props;
  const [currentItem, setCurrentItem] = useState(null);
  const [isDragStart, setIsDragStart] = useState(false);
  const [currentSideBarKey, setCurrentSideBarKey] = useState("blocks");
  const [popoverConfig, setPopoverConfig] = useState({ open: false, type: null });
  const [photos, setPhotos] = useState({
    list: null,
    pagination: 1,
    query: "",
    isLoading: true,
    scrollLoading: false,
  });
  const [bodySettings, setBodySettings] = useState({
    preHeader: "",
    contentWidth: 600,
    styles: {
      backgroundColor: "#ccc",
      color: "#000",
      fontFamily: "Arial",
    },
  });

  const icons = {
    column: faColumns,
    text: faFont,
    heading: faHeading,
    button: faMinusSquare,
    divider: faGripLines,
    image: faImage,
  };

  const sidebarTabsList = [
    {
      name: "模块",
      icon: faCubes,
      key: "blocks",
    },
    {
      name: "主题",
      icon: faMailBulk,
      key: "theme",
    },
    {
      name: "图片",
      icon: faImages,
      key: "photos",
    },
  ];

  const blockTitle = () => {
    let title = "Block";
    const type = currentItem?.data.key;
    switch (type) {
      case "text":
        title = "文本";
        break;
      case "column":
        title = "列";
        break;
      case "heading":
        title = "标题";
        break;
      case "button":
        title = "按钮";
        break;
      case "divider":
        title = "分割线";
        break;
      case "image":
        title = "图片";
        break;
      default:
        break;
    }
    return title;
  };

  const clearLabelStyles = () => {
    const dragLabelElements = document.getElementsByClassName("block-drag-label-content");
    Array.from(dragLabelElements).forEach((item) => {
      item.children[0].style.visibility = "hidden";
    });
  };

  const clearContentLabelStyles = () => {
    const dragContentLabelElements = document.getElementsByClassName("block-content-drag-label-content");
    Array.from(dragContentLabelElements).forEach((item) => {
      item.children[0].style.visibility = "hidden";
    });
  };

  const AddBlock = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (!currentItem) {
      return;
    }
    if (currentItem.index > blockList.length) {
      let newCurrentItem = currentItem;
      if (newCurrentItem.data.key !== "column") {
        newCurrentItem.data = {
          name: "列",
          key: "column",
          styles: { ...defaultStyles },
          config: {
            columns: 1,
            type: "full",
            data: [
              {
                name: "content",
                key: "content",
                width: "100%",
                styles: { ...defaultStyles },
                data: [{ ...newCurrentItem.data }],
              },
            ],
          },
        };
      }
      setBlockList(blockList.concat(newCurrentItem.data));
    } else {
      setBlockList(swapBlockList(currentItem.index, blockList.length + 1));
    }
    setCurrentItem(null);
  };

  const appendBlockList = (index) => {
    const newBlockList = deepClone(blockList);
    let newCurrentItem = currentItem;

    if (newCurrentItem.type === "moveBlock") {
      let indexArray = newCurrentItem.index.split("-");

      let newData = newBlockList[indexArray[0]].config.data[indexArray[1]].data.slice(indexArray[2] + 1, indexArray[2] + 2);
      if (!newData.length) {
        newData = {
          name: "No content here. drag content here",
          width: newBlockList[indexArray[0]].config.data[indexArray[1]].width,
          styles: newBlockList[indexArray[0]].config.data[indexArray[1]].styles,
          key: "empty",
        };
        newBlockList[indexArray[0]].config.data[indexArray[1]] = newData;
      } else {
        newBlockList[indexArray[0]].config.data[indexArray[1]].data = newData;
      }
    }

    if (newCurrentItem.data.key !== "column") {
      newCurrentItem.data = {
        name: "列",
        key: "column",
        styles: { ...defaultStyles },
        config: {
          columns: 1,
          type: "full",
          data: [
            {
              name: "content",
              key: "content",
              width: "100%",
              styles: { ...defaultStyles },
              data: [{ ...newCurrentItem.data }],
            },
          ],
        },
      };
    }

    newBlockList.splice(index, 0, newCurrentItem.data);
    return newBlockList;
  };

  const swapBlockList = (index1, index2) => {
    const newBlockList = deepClone(blockList);
    let newCurrentItem = currentItem;
    if (newCurrentItem.data.key !== "column") {
      newCurrentItem.data = {
        name: "列",
        key: "column",
        styles: { ...defaultStyles },
        config: {
          columns: 1,
          type: "full",
          data: [
            {
              name: "content",
              key: "content",
              width: "100%",
              styles: { ...defaultStyles },
              data: [{ ...newCurrentItem.data }],
            },
          ],
        },
      };
    }
    if (Number(index1) === Number(index2)) {
      return blockList;
    }
    newBlockList.splice(index2, 0, newCurrentItem.data);
    if (currentItem.type === "move") {
      if (index1 > index2) {
        newBlockList.splice(index1 + 1, 1);
      } else {
        newBlockList.splice(index1, 1);
      }
    }

    return newBlockList;
  };

  const preventDefault = (event) => {
    event.preventDefault();
    if (event.target.dataset.name === "dragEmpty") {
      event.target.style.border = "1px dashed #2faade";
    }
  };

  const clearStyle = (event) => {
    event.target.style.border = "none";
  };

  const setDefaultCurrentItem = () => {
    setCurrentItem(null);
    setIsDragStart(false);
    clearLabelStyles();
    clearContentLabelStyles();
  };

  const dragEnd = (event) => {
    event.target.style.border = "";
    event.target.children[0] && event.target.children[0].classList.remove("sidebar-block-move");
    setDefaultCurrentItem();
  };

  const dragStart = (item) => (event) => {
    setCurrentItem({ data: deepClone(item), type: "add", index: blockList.length + 1 });
    setIsDragStart(true);
    event.target.style.border = "1px dashed #ccc";
    event.target.children[0] && event.target.children[0].classList.add("sidebar-block-move");
  };

  const searchPhotos = (value) => {
    setPhotos({ ...photos, list: [], isLoading: true });
    fetchPhotos(1, "40", value).then((response) => setPhotos({ ...photos, list: response.photos, isLoading: false, query: value, pagination: 1 }));
  };

  const renderCardDom = (title, dom) => {
    return (
      <div className="flex items-center justify-between mb-4">
        <div className="text-slate-400 font-semibold">{title}</div>
        <div>{dom}</div>
      </div>
    );
  };

  const popoverConfigChange = (key) => (open) => {
    if (open) {
      setPopoverConfig({ open, type: key });
    } else {
      setPopoverConfig({ open, type: null });
    }
  };

  const renderColorPicker = (title, key) => {
    const color = bodySettings.styles[key];
    return renderCardDom(
      title,
      <Popover
        zIndex={1070}
        content={
          <div className="select-none">
            <ChromePicker
              color={color}
              style={{ boxShadow: "none" }}
              onChange={(color) =>
                setBodySettings({
                  ...bodySettings,
                  styles: {
                    ...bodySettings.styles,
                    [key]: color.hex,
                  },
                })
              }
            />
          </div>
        }
        trigger="click"
        open={popoverConfig.open && popoverConfig.type === key}
        onOpenChange={popoverConfigChange(key)}
      >
        <button className="rounded-lg border h-10 w-10" style={{ background: color }}></button>
      </Popover>
    );
  };

  const renderBlocks = () => {
    return (
      <div className="flex-1 h-full overflow-hidden">
        <motion.div initial={{ opacity: 0, y: 1000 }} animate={{ opacity: 1, y: 0 }} className="p-4 flex flex-wrap content-start">
          {blockConfigsList.map((item) => {
            return (
              <div
                className="relative w-1/3 h-32 mb-4"
                data-block_type="header"
                draggable="true"
                key={item.key}
                onDragEnd={dragEnd}
                onDragStart={dragStart(item)}
              >
                <div className="sidebar-block h-full bg-white flex items-center justify-center rounded-2xl mx-1.5 flex-col">
                  <FontAwesomeIcon icon={icons[item.key]} className="text-3xl mb-3" />
                  <div className="text-lg">{item.name}</div>
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>
    );
  };

  const renderTheme = () => {
    return (
      <div className="p-6 flex-1 overflow-hidden">
        <motion.div initial={{ opacity: 0, y: 1000 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-xl font-semibold mb-10">邮件主题设置</div>
          <div>{renderColorPicker("字体颜色", "color")}</div>
          <div>{renderColorPicker("邮件背景颜色", "backgroundColor")}</div>
          <div>
            {renderCardDom(
              "行高",
              <InputNumber
                className="w-32"
                addonAfter="px"
                min={0}
                max={900}
                value={Number(bodySettings.contentWidth)}
                onChange={(value) => setBodySettings({ ...bodySettings, contentWidth: value })}
              />
            )}
          </div>
          <div>
            <div className="text-slate-400 font-semibold">标题文本</div>
            <Input
              className="mt-4"
              value={bodySettings.preHeader}
              onChange={(event) => setBodySettings({ ...bodySettings, preHeader: event.target.value })}
            />
            <div className="text-gray-400 text-sm mt-2">标题是从收件箱查看电子邮件时跟随在主题行之后的简短摘要文本。</div>
          </div>
        </motion.div>
      </div>
    );
  };

  const renderPhotos = () => {
    const imageBlock = blockConfigsList.find(({ key }) => key === "image");
    let leftHeight = 0;
    let rightHeight = 0;
    if (!photos.list) {
      fetchPhotos(photos.pagination, "40", photos.query).then((response) =>
        setPhotos({ ...photos, list: response.photos, isLoading: false, scrollLoading: false })
      );
    } else {
      if (photos.list.length > 1) {
        leftHeight = Math.floor((141 / Number(photos.list[0].width)) * photos.list[0].height) + 6;
        rightHeight = Math.floor((141 / Number(photos.list[1].width)) * photos.list[1].height) + 6;
      }
    }

    return (
      <div className="flex-1 h-full p-6 overflow-hidden">
        <motion.div className="h-full" initial={{ opacity: 0, y: 1000 }} animate={{ opacity: 1, y: 0 }}>
          <div className="mb-4">
            <Input.Search onSearch={searchPhotos} loading={photos.isLoading || photos.scrollLoading} />
            <a href="https://www.pexels.com" rel="noreferrer" target="_blank" className="text-slate-400 text-sm hover:text-slate-400">
              由Pexels提供技术支持
            </a>
          </div>
          <div
            className="photos-container relative h-[calc(100%-58px)] overflow-auto"
            style={{ overflowAnchor: "none" }}
            onScroll={(event) => {
              let scrollBottom = event.target.scrollHeight - event.target.offsetHeight - event.target.scrollTop;
              if (scrollBottom < 20 && !photos.scrollLoading) {
                setPhotos({ ...photos, scrollLoading: true });
                setTimeout(() => {
                  fetchPhotos(photos.pagination + 1, "40", photos.query).then((response) => {
                    event.target.scrollTop = event.target.scrollTop - 50;
                    setPhotos({
                      ...photos,
                      pagination: photos.pagination + 1,
                      list: photos.list.concat(response.photos),
                      scrollLoading: false,
                      isLoading: false,
                    });
                  });
                }, 1000);
              }
            }}
          >
            {photos.list &&
              photos.list.map((image, index) => {
                let left = 0;
                let top = 0;
                if (index === 1) {
                  left = 146.5;
                } else if (index > 1) {
                  const { width, height } = image;
                  const imageHeight = Math.floor((141 / Number(width)) * height);
                  if (leftHeight > rightHeight) {
                    left = 146.5;
                    top = rightHeight;
                    rightHeight += imageHeight + 6;
                  } else {
                    top = leftHeight;
                    leftHeight += imageHeight + 6;
                  }
                }
                return (
                  <motion.div
                    animate={{ left, top }}
                    transition={{ delay: 0 }}
                    key={index}
                    draggable
                    onDragEnd={dragEnd}
                    onDragStart={dragStart({ ...imageBlock, config: { ...imageBlock.config, src: image.src.large, alt: image.alt } })}
                    style={{ left: left - image.width, top: top - image.height }}
                    className="absolute w-[49%] transition-all photo-item cursor-grab"
                  >
                    <div>
                      <img src={image.src.large} alt={image.alt} className="w-full" />
                    </div>
                  </motion.div>
                );
              })}
            {photos.scrollLoading && (
              <div className="absolute w-full text-center text-slate-400" style={{ top: leftHeight > rightHeight ? leftHeight : rightHeight }}>
                加载中...
              </div>
            )}
            {photos.isLoading && (
              <div className="flex-1 flex h-full justify-center items-center">
                <Spin />
              </div>
            )}
          </div>
        </motion.div>
      </div>
    );
  };

  const renderSideBar = () => {
    return (
      <div className="h-full side-bar flex">
        <div className="side-bar-tabs">
          {sidebarTabsList.map((item) => {
            const { key, icon, name } = item;
            return (
              <div
                onClick={() => {
                  if (key !== currentSideBarKey) {
                    setCurrentSideBarKey(key);
                    setPhotos({ list: null, pagination: 1, isLoading: true, scrollLoading: false, query: "" });
                  }
                }}
                className={clsx("px-6 py-4 cursor-pointer text-center select-none transition-all", {
                  "side-bar-tab-item-active": currentSideBarKey === key,
                  "side-bar-tab-item": currentSideBarKey !== key,
                })}
                key={key}
              >
                <FontAwesomeIcon icon={icon} className="text-2xl" />
                <div className="mt-1 font-semibold">{name}</div>
              </div>
            );
          })}
        </div>
        {currentSideBarKey === "blocks" && renderBlocks()}
        {currentSideBarKey === "theme" && renderTheme()}
        {currentSideBarKey === "photos" && renderPhotos()}
      </div>
    );
  };

  return (
    <div className="h-full min-w-[1080px] overflow-x-auto">
      <Header blockList={blockList} setBlockList={setBlockList} bodySettings={bodySettings} />
      <div className="h-[calc(100%-_60px)] Dashboard flex justify-between">
        {renderSideBar()}
        <div className="h-full py-8 px-6" id="preview">
          <div
            className="min-h-full mx-auto border border-dashed transition-all"
            onClick={setDefaultCurrentItem}
            style={{
              width: previewMode === "desktop" ? "100%" : 364,
              ...bodySettings.styles,
            }}
          >
            {blockList.length ? (
              <>
                {blockList.map((block, index) => {
                  return (
                    <Fragment key={index}>
                      <Column
                        block={block}
                        blockIndex={index}
                        currentItem={currentItem}
                        setCurrentItem={setCurrentItem}
                        setBlockList={setBlockList}
                        blockList={blockList}
                        swapBlockList={swapBlockList}
                        appendBlockList={appendBlockList}
                        clearLabelStyles={clearLabelStyles}
                        clearContentLabelStyles={clearContentLabelStyles}
                        isDragStart={isDragStart}
                        setIsDragStart={setIsDragStart}
                        bodySettings={bodySettings}
                      />
                    </Fragment>
                  );
                })}
                <div className="relative block-drag-label-content" data-index={blockList.length}>
                  <div className="absolute block-move-bottom">
                    <span className="block-tools-drag_here">拖放到此处</span>
                  </div>
                </div>
              </>
            ) : (
              <div data-name="dragEmpty" className="start-to-add" onDragOver={preventDefault} onDrop={AddBlock} onDragLeave={clearStyle}>
                请添加块
              </div>
            )}
          </div>
        </div>
        <Drawer
          title={blockTitle()}
          placement="left"
          mask={false}
          width={400}
          drawerStyle={{ padding: 0 }}
          open={Boolean(!isDragStart && currentItem)}
          onClose={() => setCurrentItem(null)}
        >
          {currentItem && <StyleSettings currentItem={currentItem} setCurrentItem={setCurrentItem} />}
        </Drawer>
      </div>
    </div>
  );
}
const mapStateToProps = (state) => ({
  previewMode: state.AuthOptions.previewMode,
  blockList: state.AuthOptions.blockList,
});

const mapDispatchToProps = (dispatch) => ({
  setBlockList: (blockList, action) => dispatch(setBlockList(blockList, action)),
});
export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
