import { Fragment, useContext, useEffect } from "react";
import { GlobalContext } from "../../reducers";
import Column from "../Column";
import { throttle } from "../../utils/helpers";
import Header from "../Header";

const Preview = (props) => {
  const { clearStyles } = props;
  const { previewMode, bodySettings, blockList, setSelectionRange } = useContext(GlobalContext);

  useEffect(() => {
    const onSelectionChange = throttle(() => {
      try {
        const section = window.getSelection();
        if (section) {
          // section node !== document
          const range = section.getRangeAt(0);
          setSelectionRange(range);
        }
      } catch (error) {
        console.warn(error);
      }
    }, 100);

    document.addEventListener("selectionchange", onSelectionChange);

    return () => {
      document.removeEventListener("selectionchange", onSelectionChange);
    };
  }, []);

  const preventDefault = (event) => {
    event.preventDefault();
  };

  return (
    <div className="flex-1 flex flex-col">
      <Header />
      <div className="py-8 px-6 default-scrollbar" id="preview">
        <div
          className="min-h-full mx-auto transition-all border"
          style={{
            width: previewMode === "desktop" ? "100%" : 364,
            ...bodySettings.styles,
          }}
        >
          <div className="m-auto" style={{ maxWidth: "100%", width: "100%" }}>
            {blockList.length ? (
              <>
                {blockList.map((block, index) => {
                  return (
                    <Fragment key={index}>
                      <Column block={block} blockIndex={index} clearStyles={clearStyles} />
                    </Fragment>
                  );
                })}
                <div className="relative block-drag-label-content" data-index={blockList.length} data-position="bottom">
                  <div className="absolute block-move-bottom">
                    <span className="block-tools-drag_here">拖放到此处</span>
                  </div>
                </div>
              </>
            ) : (
              <div
                data-name="dragEmpty"
                className="start-to-add m-auto"
                style={{ width: bodySettings.contentWidth, maxWidth: "100%" }}
                data-type="empty-block"
                onDragOver={preventDefault}
              >
                请添加块
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Preview;
