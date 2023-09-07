import { useContext } from "react";
import { GlobalContext } from "../../reducers";
import classNames from "../../utils/classNames";
import { Switch, Slider, Input } from "antd";
import { deepClone } from "../../utils/helpers";
import PaddingSettings from "./PaddingSettings";
import useLayout from "../../utils/useStyleLayout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAlignCenter, faAlignLeft, faAlignRight, faAlignJustify } from "@fortawesome/free-solid-svg-icons";

const ImageStyleSettings = () => {
  const { currentItem, previewMode } = useContext(GlobalContext);
  const { findStyleItem, cardItemElement, inputChange, updateItemStyles } = useLayout();

  const actionSettings = () => {
    const { linkURL } = currentItem.data;

    const linkChange = (event) => {
      const newValue = event.target.value;
      const newCurrentItem = deepClone(currentItem);
      currentItem.data.linkURL = newValue;

      updateItemStyles(newCurrentItem.data);
    };

    return (
      <>
        <div className="my-8 text-lg text-gray-700 border-y -mx-8 px-8 py-4 bg-slate-100">点击图片触发</div>
        {cardItemElement("按钮类型", <div className="text-center text-sky-500 border-sky-500 border px-2 py-1 rounded-lg font-semibold">超链接</div>)}
        <div className="text-slate-400 font-semibold">超链接URL</div>
        <div className="mt-2">
          <Input addonBefore="https://" value={linkURL} onChange={linkChange} />
        </div>
      </>
    );
  };

  const imageSettings = () => {
    const { src, alt } = currentItem.data;

    const linkChange = (key) => (event) => {
      const newCurrentItem = deepClone(currentItem);
      newCurrentItem.data[key] = event.target.value;
      updateItemStyles(newCurrentItem.data);
    };

    return (
      <>
        <div className="my-8 text-lg text-gray-700 border-y -mx-8 px-8 py-4 bg-slate-100">图片链接</div>
        <div className="text-slate-400 font-semibold">图片URL</div>
        <div className="my-2">
          <Input value={src} onChange={linkChange("src")} />
        </div>
        <div className="text-slate-400 font-semibold">图片alt</div>
        <div className="my-2">
          <Input value={alt} onChange={linkChange("alt")} />
        </div>
      </>
    );
  };

  const updateContentStylesPadding = (padding) => {
    const newData = deepClone(currentItem.data);
    newData.contentStyles[previewMode] = {
      ...newData.contentStyles[previewMode],
      ...padding,
    };
    updateItemStyles(newData);
  };

  const updateContentTextAlign = (textAlign) => {
    const newData = deepClone(currentItem.data);
    newData.contentStyles[previewMode] = {
      ...newData.contentStyles[previewMode],
      textAlign,
    };
    updateItemStyles(newData);
  };

  const imageStyleSettings = () => {
    const width = findStyleItem(currentItem.data.styles, "width");
    const textAlign = findStyleItem(currentItem.data.contentStyles, "textAlign");
    return (
      <>
        <div className="my-8 text-lg text-gray-700 border-y -mx-8 px-8 py-4 bg-slate-100">图片样式设置</div>
        {cardItemElement(
          "宽度自适应",
          <Switch
            checked={width === "auto"}
            className={classNames(width === "auto" ? "bg-sky-500" : "bg-gray-400")}
            onChange={() => {
              const value = width === "auto" ? "100%" : "auto";
              inputChange("width")(value);
            }}
          />
        )}
        {width !== "auto" && <Slider value={Number(width.replace("%", ""))} onChange={(value) => inputChange("width")(value + "%")} />}
        {cardItemElement(
          "对齐方式",
          <div className="flex justify-center items-center">
            {[
              { icon: faAlignLeft, value: "left" },
              { icon: faAlignCenter, value: "center" },
              { icon: faAlignRight, value: "right" },
              { icon: faAlignJustify, value: "justify" },
            ].map(({ icon, value }) => {
              return (
                <div
                  key={value}
                  className={classNames(
                    textAlign === value ? "border-gray-500 text-gray-500" : "border-gray-200 text-gray-200 hover:border-gray-500 hover:text-gray-500",
                    "rounded-md w-10 h-10 border text-center ml-2 cursor-pointer transition-all font-bold select-none"
                  )}
                  onClick={() => updateContentTextAlign(value)}
                >
                  <FontAwesomeIcon icon={icon} className="h-10 w-10" />
                </div>
              );
            })}
          </div>
        )}
        <div className="text-slate-400 font-semibold"> 内边距设置</div>
        <PaddingSettings
          padding={{
            paddingTop: findStyleItem(currentItem.data.contentStyles, "paddingTop"),
            paddingRight: findStyleItem(currentItem.data.contentStyles, "paddingRight"),
            paddingLeft: findStyleItem(currentItem.data.contentStyles, "paddingLeft"),
            paddingBottom: findStyleItem(currentItem.data.contentStyles, "paddingBottom"),
          }}
          setPadding={updateContentStylesPadding}
        />
      </>
    );
  };
  return (
    <div className="my-10">
      {actionSettings()}
      {imageSettings()}
      {imageStyleSettings()}
    </div>
  );
};

export default ImageStyleSettings;
