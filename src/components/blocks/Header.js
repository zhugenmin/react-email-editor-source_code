import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExport, faDesktop, faMobileAlt, faUndo, faRedo, faEye, faTabletAlt } from "@fortawesome/free-solid-svg-icons";
import clsx from "clsx";
import { connect } from "react-redux";
import { setPreviewMode } from "../../redux/reducerCollection/AuthOptions";
import { Modal } from "antd";
import dataToHtml from "../../utils/dataToHTML";
import { deepClone } from "../../utils/helpers";

const Header = (props) => {
  const { previewMode, setPreviewMode, blockList, setBlockList, blockListAction, bodySettings } = props;
  const [blockListHistory, setBlockListHistory] = useState({
    histories: [],
    index: 0,
  });
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [modalPreview, setModalPreview] = useState(previewMode);
  const { histories, index } = blockListHistory;
  useEffect(() => {
    //第一次渲染不添加

    if (blockListAction === "firstRender") {
      setBlockListHistory({ histories: [deepClone(blockList)], index: 0 });
    }
    if (blockListAction === "modify") {
      setBlockListHistory({
        histories: [...histories.slice(0, index + 1), ...[deepClone(blockList)]],
        index: index + 1,
      });
    }
  }, [blockList]);

  const closeModal = () => {
    setIsPreviewModalOpen(false);
  };

  const exportHTML = () => {
    const html = dataToHtml({ bodySettings, blockList });
    const blob = new Blob([html], { type: "text/html" });
    const blobUrl = URL.createObjectURL(blob);
    // window.open(blobUrl, "_blank");
    let link = document.createElement("a");
    link.download = "email.html";
    link.style.display = "none";
    link.href = blobUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <div className="h-20 border flex items-center justify-between px-10 bg-slate-800">
        <div className="w-1/3">
          <FontAwesomeIcon
            icon={faEye}
            onClick={() => setIsPreviewModalOpen(true)}
            className={clsx("mr-8 text-2xl cursor-pointer hover:text-white", {
              "text-white": isPreviewModalOpen === "desktop",
              "text-gray-400": isPreviewModalOpen !== "desktop",
            })}
          />
        </div>
        <div className="w-1/3 text-center">
          <FontAwesomeIcon
            onClick={() => setPreviewMode("desktop")}
            icon={faDesktop}
            className={clsx("mr-8 text-2xl cursor-pointer hover:text-white", {
              "text-white": previewMode === "desktop",
              "text-gray-400": previewMode !== "desktop",
            })}
          />
          <FontAwesomeIcon
            icon={faMobileAlt}
            onClick={() => setPreviewMode("mobile")}
            className={clsx("mr-8 text-2xl cursor-pointer hover:text-white", {
              "text-white": previewMode === "mobile",
              "text-gray-400": previewMode !== "mobile",
            })}
          />
        </div>
        <div className="w-1/3 text-right">
          <FontAwesomeIcon
            onClick={() => {
              if (histories[index - 1]) {
                setBlockListHistory({ ...blockListHistory, index: index - 1 });
                setBlockList(deepClone(histories[index - 1]), "prev");
              }
            }}
            icon={faUndo}
            className={clsx("mr-8 text-2xl cursor-pointer", {
              "text-white hover:text-white": histories[index - 1],
              "text-gray-400": !histories[index - 1],
            })}
          />
          <FontAwesomeIcon
            onClick={() => {
              if (histories[index + 1]) {
                setBlockListHistory({ ...blockListHistory, index: index + 1, isFirstRender: true });
                setBlockList(deepClone(histories[index + 1]), "next");
              }
            }}
            icon={faRedo}
            className={clsx("mr-8 text-2xl cursor-pointer", {
              "text-white hover:text-white": histories[index + 1],
              "text-gray-400": !histories[index + 1],
            })}
          />
          <button className="text-white bg-blue-600 p-3 px-6 rounded-md font-semibold hover:bg-blue-500" onClick={exportHTML}>
            <FontAwesomeIcon icon={faFileExport} />
            导出html
          </button>
        </div>
      </div>
      <Modal
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
                className={clsx("mr-8 text-2xl cursor-pointer hover:text-blue-400", {
                  "text-blue-500": modalPreview === "desktop",
                  "text-gray-400": modalPreview !== "desktop",
                })}
              />
              <FontAwesomeIcon
                onClick={() => setModalPreview("tablet")}
                icon={faTabletAlt}
                className={clsx("mr-8 text-2xl cursor-pointer hover:text-blue-400", {
                  "text-blue-500": modalPreview === "tablet",
                  "text-gray-400": modalPreview !== "tablet",
                })}
              />
              <FontAwesomeIcon
                icon={faMobileAlt}
                onClick={() => {
                  setModalPreview("mobile");
                  setPreviewMode("mobile");
                }}
                className={clsx("mr-8 text-2xl cursor-pointer hover:text-blue-400", {
                  "text-blue-500": modalPreview === "mobile",
                  "text-gray-400": modalPreview !== "mobile",
                })}
              />
            </div>
            <div className="w-1/3 text-center"></div>
          </div>
        }
        open={isPreviewModalOpen}
        zIndex={1100}
        closable={false}
        onCancel={closeModal}
        footer={false}
        width="95vw"
      >
        <div
          className="h-[70vh] border rounded-lg transition-all mx-auto"
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
      </Modal>
    </>
  );
};

const mapStateToProps = (state) => ({
  previewMode: state.AuthOptions.previewMode,
  blockListAction: state.AuthOptions.blockListAction,
});

const mapDispatchToProps = (dispatch) => ({
  setPreviewMode: (previewMode) => dispatch(setPreviewMode(previewMode)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);
