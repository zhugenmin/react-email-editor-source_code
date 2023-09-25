import { useState, useContext } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "../../utils/classNames";

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
import useTranslation from "../../translation";
import useDataSource from "../../configs/useDataSource";

const LeftSideBar = (props) => {
  const { clearStyles } = props;
  const { setCurrentItem, setIsDragStart, blockList, setActionType } = useContext(GlobalContext);
  const [currentSideBarKey, setCurrentSideBarKey] = useState("blocks");
  const { t } = useTranslation();
  const { blockConfigsList } = useDataSource();

  const sidebarTabsList = [
    {
      name: t("blocks"),
      icon: faCubes,
      key: "blocks",
    },
    {
      name: t("photos"),
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
        className="side-bar-blocks"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.3 }}
        key="blocks"
      >
        <div className="side-bar-blocks-container">
          {blockConfigsList.map((item) => {
            return (
              <div
                className="side-bar-blocks-item"
                data-block_type="header"
                draggable="true"
                key={item.key}
                onDragEnd={dragEnd}
                onDragStart={dragStart(item)}
              >
                <div className="sidebar-block">
                  <FontAwesomeIcon icon={icons[item.key]} className="sidebar-block-icon" />
                  <div className="sidebar-block-text">{item.name}</div>
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

    const openPexels = () => {
      window.open("https://www.pexels.com");
    };

    return (
      <motion.div
        className="photo-container"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.3 }}
        key="photos"
      >
        <div className="margin-bottom-12">
          <Input.Search onSearch={searchPhotos} loading={photos.isLoading || photos.scrollLoading} />
          <div className="pexels-link" onClick={openPexels}>
            {t("powered_by_pexels")}
          </div>
        </div>
        <div className="photos-body">
          <div
            className="photos-container default-scrollbar"
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
                    className="photo-item"
                  >
                    <img src={image.src.large} alt={image.alt} className="width-full" />
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
                    className="photo-item"
                  >
                    <img src={image.src.large} alt={image.alt} className="width-full" />
                  </motion.div>
                );
              })}
            </div>
          </div>
          {photos.scrollLoading && <div className="scroll-loading-context">{t("loading")}</div>}
          {photos.isLoading && (
            <div className="loading-spinner">
              <Spin />
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="side-bar">
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
              className={classNames(currentSideBarKey === key ? "side-bar-tab-item-active" : "side-bar-tab-item", "side-bar-item-default")}
              key={key}
            >
              <FontAwesomeIcon icon={icon} className="text-18" />
              <div className="side-bar-icon-title">{name}</div>
            </div>
          );
        })}
      </div>
      <div className="side-bar-content">
        <AnimatePresence mode="wait">
          {currentSideBarKey === "blocks" && blocksElement()}
          {currentSideBarKey === "photos" && photosElement()}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default LeftSideBar;
