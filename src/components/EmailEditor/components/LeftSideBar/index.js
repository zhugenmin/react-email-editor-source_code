import { useState, useContext } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "../../utils/classNames";
import blockConfigsList from "../../configs/blockConfigsList";
import {
  faColumns,
  faMinusSquare,
  faHeading,
  faFont,
  faGripLines,
  faImages,
  faCubes,
  faImage,
  faShareAltSquare,
} from "@fortawesome/free-solid-svg-icons";
import { GlobalContext } from "../../reducers";
import { Input, Spin } from "antd";
import { deepClone } from "../../utils/helpers";

import fetchPhotos from "../../utils/pexels";

const LeftSideBar = (props) => {
  const { clearStyles } = props;
  const { setCurrentItem, setIsDragStart, blockList, setActionType } = useContext(GlobalContext);
  const [currentSideBarKey, setCurrentSideBarKey] = useState("blocks");
  const sidebarTabsList = [
    {
      name: "模块",
      icon: faCubes,
      key: "blocks",
    },
    {
      name: "图片",
      icon: faImages,
      key: "photos",
    },
  ];
  const [photos, setPhotos] = useState({
    list: null,
    pagination: 1,
    query: "",
    isLoading: true,
    scrollLoading: false,
  });

  const icons = {
    column: faColumns,
    text: faFont,
    heading: faHeading,
    button: faMinusSquare,
    divider: faGripLines,
    image: faImage,
    social_link: faShareAltSquare,
  };

  const dragEnd = (event) => {
    event.target.style.border = "";
    event.target.children[0] && event.target.children[0].classList.remove("sidebar-block-move");
    setTimeout(() => {
      setIsDragStart(false);
      clearStyles();
    }, 50);
  };

  const dragStart = (item) => (event) => {
    setCurrentItem({ data: deepClone(item), type: "add", index: blockList.length + 1 });
    setIsDragStart(true);
    event.target.style.border = "1px dashed #ccc";
    event.target.children[0] && event.target.children[0].classList.add("sidebar-block-move");
    setActionType("add");
  };

  const blocksElement = () => {
    return (
      <motion.div
        className="flex-1 h-full overflow-hidden"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.3 }}
        key="blocks"
      >
        <div className="p-4 flex flex-wrap content-start">
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
        </div>
      </motion.div>
    );
  };

  const searchPhotos = (value) => {
    setPhotos({ ...photos, list: [], isLoading: true });
    fetchPhotos(1, "40", value).then((response) => setPhotos({ ...photos, list: response.photos, isLoading: false, query: value, pagination: 1 }));
  };

  const photosElement = () => {
    const imageBlock = blockConfigsList.find(({ key }) => key === "image");
    let leftHeight = 0;
    let rightHeight = 0;
    let leftPhotos = [];
    let rightPhotos = [];
    if (!photos.list) {
      fetchPhotos(photos.pagination, "20", photos.query).then((response) =>
        setPhotos({ ...photos, list: response.photos, isLoading: false, scrollLoading: false })
      );
    } else {
      photos.list.forEach((item) => {
        //  假设图片显示的宽度为200px,高度为自适应,则图片的高度为200/图片宽度*图片高度
        const { height, width } = item;
        const imageHeight = (200 / width) * height;
        if (leftHeight <= rightHeight) {
          leftPhotos.push(item);
          leftHeight += imageHeight;
        } else {
          rightPhotos.push(item);
          rightHeight += imageHeight;
        }
      });
    }

    return (
      <motion.div
        className="flex-1 h-full p-6 overflow-hidden"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.3 }}
        key="photos"
      >
        <div className="mb-4">
          <Input.Search onSearch={searchPhotos} loading={photos.isLoading || photos.scrollLoading} />
          <a href="https://www.pexels.com" rel="noreferrer" target="_blank" className="text-slate-400 text-sm hover:text-slate-400">
            由Pexels提供技术支持
          </a>
        </div>
        <div className="relative h-[calc(100%-58px)]">
          <div
            className="photos-container grid grid-cols-2 gap-2 overflow-auto h-full default-scrollbar pr-6"
            style={{ overflowAnchor: "none" }}
            onScroll={(event) => {
              let scrollBottom = event.target.scrollHeight - event.target.offsetHeight - event.target.scrollTop;
              if (scrollBottom < 20 && !photos.scrollLoading) {
                setPhotos({ ...photos, scrollLoading: true });
                setTimeout(async () => {
                  const response = await fetchPhotos(photos.pagination + 1, "20", photos.query);
                  event.target.scrollTop = event.target.scrollTop - 50;
                  setPhotos({
                    ...photos,
                    pagination: photos.pagination + 1,
                    list: photos.list.concat(response.photos),
                    scrollLoading: false,
                    isLoading: false,
                  });
                }, 1000);
              }
            }}
          >
            <div>
              {leftPhotos.map((image, index) => {
                return (
                  <motion.div
                    initial={{ y: -index * 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    key={index}
                    draggable
                    onDragEnd={dragEnd}
                    onDragStart={dragStart({ ...imageBlock, src: image.src.large, alt: image.alt })}
                    className="transition-all photo-item cursor-grab mb-2"
                  >
                    <img src={image.src.large} alt={image.alt} className="w-full" />
                  </motion.div>
                );
              })}
            </div>
            <div>
              {rightPhotos.map((image, index) => {
                return (
                  <motion.div
                    initial={{ y: -index * 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    key={index}
                    draggable
                    onDragEnd={dragEnd}
                    onDragStart={dragStart({ ...imageBlock, src: image.src.large, alt: image.alt })}
                    className="transition-all photo-item cursor-grab mb-2"
                  >
                    <img src={image.src.large} alt={image.alt} className="w-full" />
                  </motion.div>
                );
              })}
            </div>
          </div>
          {photos.scrollLoading && <div className="absolute -bottom-2 left-0 right-0 w-full text-center text-slate-400">加载中...</div>}
          {photos.isLoading && (
            <div className="absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center z-10">
              <Spin />
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="h-full side-bar flex border border-l-0 border-t-0 border-b-0 border-right">
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
              className={classNames(
                currentSideBarKey === key ? "side-bar-tab-item-active" : "side-bar-tab-item",
                "px-6 py-4 cursor-pointer text-center select-none transition-all"
              )}
              key={key}
            >
              <FontAwesomeIcon icon={icon} className="text-2xl" />
              <div className="mt-1 font-semibold">{name}</div>
            </div>
          );
        })}
      </div>
      <div className="overflow-hidden flex-1">
        <AnimatePresence mode="wait">
          {currentSideBarKey === "blocks" && blocksElement()}
          {currentSideBarKey === "photos" && photosElement()}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default LeftSideBar;
