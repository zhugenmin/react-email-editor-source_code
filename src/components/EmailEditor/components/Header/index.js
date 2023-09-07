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
  console.log("histories", histories, blockList);
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
      <div className="flex items-center justify-between px-10 bg-white border py-4">
        <div className="w-1/3">
          <FontAwesomeIcon
            icon={faEye}
            onClick={openModal}
            className={classNames(
              "mr-8 text-xl cursor-pointer hover:text-black",
              isPreviewModalOpen === "desktop" && "text-black",
              isPreviewModalOpen !== "desktop" && "text-gray-500"
            )}
          />
          <FontAwesomeIcon
            onClick={() => setPreviewMode("desktop")}
            icon={faDesktop}
            className={classNames(
              "mr-8 text-xl cursor-pointer hover:text-black",
              previewMode === "desktop" && "text-black",
              previewMode !== "desktop" && "text-gray-500"
            )}
          />
          <FontAwesomeIcon
            icon={faMobileAlt}
            onClick={() => setPreviewMode("mobile")}
            className={classNames(
              "mr-8 text-xl cursor-pointer hover:text-black",
              previewMode === "mobile" && "text-black",
              previewMode !== "mobile" && "text-gray-500"
            )}
          />
        </div>
        <div className="w-1/3 text-center"></div>
        <div className="w-1/3 text-right">
          <FontAwesomeIcon
            onClick={prevHistory}
            icon={faUndo}
            className={classNames(
              "mr-8 text-xl",
              histories[index - 1] && "text-black hover:text-black cursor-pointer",
              !histories[index - 1] && "text-gray-500 cursor-not-allowed"
            )}
          />
          <FontAwesomeIcon
            onClick={nextHistory}
            icon={faRedo}
            className={classNames(
              "text-xl",
              histories[index + 1] && "text-black hover:text-black cursor-pointer",
              !histories[index + 1] && "text-gray-500 cursor-not-allowed"
            )}
          />
        </div>
      </div>

      <Drawer
        title={
          <div className="flex justify-between">
            <div className="w-1/3 text-center"></div>
            <div className="w-1/3 text-center">
              <FontAwesomeIcon
                onClick={() => {
                  setModalPreview("desktop");
                  setPreviewMode("desktop");
                }}
                icon={faDesktop}
                className={classNames(
                  "mr-8 text-2xl cursor-pointer hover:text-black",
                  modalPreview === "desktop" && "text-black",
                  modalPreview !== "desktop" && "text-gray-500"
                )}
              />
              <FontAwesomeIcon
                icon={faTabletAlt}
                onClick={() => {
                  setModalPreview("tablet");
                }}
                className={classNames(
                  "mr-8 text-2xl cursor-pointer hover:text-black",
                  modalPreview === "tablet" && "text-black",
                  modalPreview !== "tablet" && "text-gray-500"
                )}
              />
              <FontAwesomeIcon
                icon={faMobileAlt}
                onClick={() => {
                  setModalPreview("mobile");
                  setPreviewMode("mobile");
                }}
                className={classNames(
                  "mr-8 text-2xl cursor-pointer hover:text-black",
                  modalPreview === "mobile" && "text-black",
                  modalPreview !== "mobile" && "text-gray-500"
                )}
              />
            </div>
            <div className="w-1/3 text-right">
              <div
                onClick={closeModal}
                className="inline-flex justify-center items-center rounded-full bg-gray-500 hover:bg-gray-600 cursor-pointer text-white p-1 h-8 w-8"
              >
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
          className="border rounded-lg transition-all mx-auto h-full"
          style={{
            width: (modalPreview === "desktop" && "100%") || (modalPreview === "tablet" && 768) || (modalPreview === "mobile" && 364),
          }}
        >
          <div className="bg-gray-100 flex border-b p-4">
            <div className="h-4 w-4 rounded-full bg-red-600 mr-2"></div>
            <div className="h-4 w-4 rounded-full bg-yellow-400 mr-2"></div>
            <div className="h-4 w-4 rounded-full bg-green-600 mr-2"></div>
          </div>
          <div className="w-full h-[calc(100%-40px)]">
            <iframe
              src={"data:text/html," + encodeURIComponent(dataToHtml({ bodySettings, blockList }))}
              title="preview"
              scrolling="no"
              className="w-full h-full"
            ></iframe>
          </div>
        </div>
      </Drawer>
    </>
  );
};

export default Header;
