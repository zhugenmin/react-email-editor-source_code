import { useState, useContext, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDesktop, faMobileAlt, faUndo, faRedo, faEye, faTabletAlt, faTimes } from "@fortawesome/free-solid-svg-icons";
import classNames from "../../utils/classNames";
// import { deepClone } from "../../utils/helpers";
import { GlobalContext } from "../../reducers";
import { Drawer } from "antd";
import dataToHtml from "../../utils/dataToHTML";
import { deepClone } from "../../utils/helpers";

const Header = () => {
  const { previewMode, setPreviewMode, bodySettings, blockList, actionType, setBlockList, setBodySettings } = useContext(GlobalContext);
  const [modalPreview, setModalPreview] = useState(previewMode);
  const [blockListHistory, setBlockListHistory] = useState({
    histories: [],
    index: 0,
  });
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const { histories, index } = blockListHistory;

  useEffect(() => {
    //第一次渲染不添加
    const newBlockList = deepClone(blockList);
    const newBodySettings = deepClone(bodySettings);
    if (actionType === "firstRender") {
      setBlockListHistory({
        histories: [
          {
            blockList: newBlockList,
            bodySettings: newBodySettings,
          },
        ],
        index: 0,
      });
    } else if (!actionType.includes("set_history")) {
      let newHistories = deepClone(histories);

      newHistories = newHistories.slice(0, index + 1);
      newHistories.push({
        blockList: newBlockList,
        bodySettings: newBodySettings,
      });

      setBlockListHistory({
        histories: newHistories,
        index: index + 1,
      });
    }
  }, [blockList, bodySettings]);

  const closeModal = () => {
    setIsPreviewModalOpen(false);
  };

  const openModal = () => {
    setIsPreviewModalOpen(true);
  };

  const prevHistory = () => {
    if (histories[index - 1]) {
      const newHistories = deepClone(histories[index - 1]);
      setBlockListHistory({ ...blockListHistory, index: index - 1 });
      setBlockList(newHistories.blockList, `set_history_${index - 1}`);
      setBodySettings(newHistories.bodySettings);
    }
  };

  const nextHistory = () => {
    if (histories[index + 1]) {
      const newHistories = deepClone(histories[index + 1]);
      setBlockListHistory({ ...blockListHistory, index: index + 1 });
      setBlockList(newHistories.blockList, `set_history_${index + 1}`);
      setBodySettings(newHistories.bodySettings);
    }
  };

  return (
    <>
      <div className="header">
        <div className="header-box">
          <FontAwesomeIcon
            icon={faEye}
            onClick={openModal}
            className={classNames(
              "header-icon-small",
              isPreviewModalOpen === "desktop" && "header-icon_active",
              isPreviewModalOpen !== "desktop" && "header-icon_disabled"
            )}
          />
          <FontAwesomeIcon
            onClick={() => setPreviewMode("desktop")}
            icon={faDesktop}
            className={classNames(
              "header-icon-small",
              previewMode === "desktop" && "header-icon_active",
              previewMode !== "desktop" && "header-icon_disabled"
            )}
          />
          <FontAwesomeIcon
            icon={faMobileAlt}
            onClick={() => setPreviewMode("mobile")}
            className={classNames(
              "header-icon-small",
              previewMode === "mobile" && "header-icon_active",
              previewMode !== "mobile" && "header-icon_disabled"
            )}
          />
        </div>
        <div className="header-box text-center"></div>
        <div className="header-box text-right">
          <FontAwesomeIcon
            onClick={prevHistory}
            icon={faUndo}
            className={classNames(
              "header-icon-history",
              histories[index - 1] && "header-icon-history_active",
              !histories[index - 1] && "header-icon-history_disabled"
            )}
          />
          <FontAwesomeIcon
            onClick={nextHistory}
            icon={faRedo}
            className={classNames(
              "header-icon-history",
              histories[index + 1] && "header-icon-history_active",
              !histories[index + 1] && "header-icon-history_disabled"
            )}
          />
        </div>
      </div>

      <Drawer
        title={
          <div className="flex justify-between">
            <div className="header-box text-center"></div>
            <div className="header-box text-center">
              <FontAwesomeIcon
                onClick={() => {
                  setModalPreview("desktop");
                  setPreviewMode("desktop");
                }}
                icon={faDesktop}
                className={classNames(
                  "header-icon",
                  modalPreview === "desktop" && "header-icon_active",
                  modalPreview !== "desktop" && "header-icon_disabled"
                )}
              />
              <FontAwesomeIcon
                icon={faTabletAlt}
                onClick={() => {
                  setModalPreview("tablet");
                }}
                className={classNames(
                  "header-icon",
                  modalPreview === "tablet" && "header-icon_active",
                  modalPreview !== "tablet" && "header-icon_disabled"
                )}
              />
              <FontAwesomeIcon
                icon={faMobileAlt}
                onClick={() => {
                  setModalPreview("mobile");
                  setPreviewMode("mobile");
                }}
                className={classNames(
                  "header-icon",
                  modalPreview === "mobile" && "header-icon_active",
                  modalPreview !== "mobile" && "header-icon_disabled"
                )}
              />
            </div>
            <div className="header-box text-right">
              <div onClick={closeModal} className="header-drawer-close">
                <FontAwesomeIcon icon={faTimes} className="text-sm" />
              </div>
            </div>
          </div>
        }
        open={isPreviewModalOpen}
        zIndex={1100}
        closable={false}
        onCancel={closeModal}
        footer={false}
        width="100vw"
        style={{
          top: 0,
          bottom: 0,
          padding: 0,
          height: "100%",
        }}
        cont
      >
        <div
          className="header-drawer-body"
          style={{
            width: (modalPreview === "desktop" && "100%") || (modalPreview === "tablet" && 768) || (modalPreview === "mobile" && 364),
          }}
        >
          <div className="header-drawer-head">
            <div className="header-drawer-head-item"></div>
            <div className="header-drawer-head-item"></div>
            <div className="header-drawer-head-item"></div>
          </div>
          <div className="header-drawer-content">
            <iframe
              src={"data:text/html," + encodeURIComponent(dataToHtml({ bodySettings, blockList }))}
              title="preview"
              scrolling="no"
              className="header-drawer-iframe"
            ></iframe>
          </div>
        </div>
      </Drawer>
    </>
  );
};

export default Header;
