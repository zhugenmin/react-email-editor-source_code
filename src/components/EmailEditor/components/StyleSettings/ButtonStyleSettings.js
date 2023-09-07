import { useContext } from "react";
import { GlobalContext } from "../../reducers";
import classNames from "../../utils/classNames";
import { InputNumber, Select, Switch, Slider, Input } from "antd";

import ColorPicker from "../ColorPicker";
import PaddingSettings from "./PaddingSettings";
import useLayout from "../../utils/useStyleLayout";
import { deepClone } from "../../utils/helpers";

const ButtonStyleSettings = () => {
  const { currentItem, previewMode } = useContext(GlobalContext);
  const { findStyleItem, cardItemElement, colorChange, paddingChange, inputChange, updateItemStyles } = useLayout();

  const buttonActionElement = () => {
    const { linkURL } = currentItem.data;
    const linkChange = (event) => {
      const newValue = event.target.value;
      const newCurrentItem = deepClone(currentItem);
      newCurrentItem.data.linkURL = newValue;
      updateItemStyles(newCurrentItem.data);
    };

    return (
      <div>
        <div className="my-8 text-lg text-gray-700 border-y -mx-8 px-8 py-4 bg-slate-100">点击按钮触发</div>
        {cardItemElement("按钮类型", <div className="text-center text-sky-500 border-sky-500 border px-2 py-1 rounded-lg font-semibold">超链接</div>)}
        <div className="text-slate-400 font-semibold">超链接URL</div>
        <div className="mt-2">
          <Input addonBefore="https://" value={linkURL} onChange={linkChange} />
        </div>
      </div>
    );
  };

  const PaddingStylesElement = () => {
    const updateContentStylesPadding = (padding) => {
      const newData = deepClone(currentItem.data);
      newData.contentStyles[previewMode] = {
        ...newData.contentStyles[previewMode],
        ...padding,
      };
      updateItemStyles(newData);
    };

    return (
      <>
        <div className="my-8 text-lg text-gray-700 border-y -mx-8 px-8 py-4 bg-slate-100"> 内边距设置</div>
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

  const textStylesElement = () => {
    const width = findStyleItem(currentItem.data.styles, "width");
    const color = findStyleItem(currentItem.data.styles, "color");
    const fontFamily = findStyleItem(currentItem.data.styles, "fontFamily");
    const fontSize = findStyleItem(currentItem.data.styles, "fontSize");
    const lineHeight = findStyleItem(currentItem.data.styles, "lineHeight");
    const backgroundColor = findStyleItem(currentItem.data.styles, "backgroundColor");
    const fontFamilyList = ["sans-serif", "Arial", "仿宋", "黑体", "Verdana", "Times New Roman", "Garamond", "Georgia", "Courier New", "cursive"];

    return (
      <>
        <div className="my-8 text-lg text-gray-700 border-y -mx-8 px-8 py-4 bg-slate-100">按钮样式</div>
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
        {cardItemElement("字体颜色", <ColorPicker color={color} setColor={colorChange("color")} />)}
        {cardItemElement("按钮颜色", <ColorPicker color={backgroundColor} setColor={colorChange("backgroundColor")} />)}
        {cardItemElement(
          "字体大小",
          <Select className="w-32" value={fontFamily} onChange={inputChange("fontFamily")}>
            {fontFamilyList.map((item) => (
              <Select.Option key={item} value={item}>
                {item}
              </Select.Option>
            ))}
          </Select>
        )}
        {cardItemElement("字体大小", <InputNumber min={0} className="w-32" addonAfter="px" value={fontSize} onChange={inputChange("fontSize")} />)}
        {cardItemElement(
          "行高",
          <InputNumber
            className="w-32"
            addonAfter="%"
            min={0}
            value={Number(lineHeight.replace("%", ""))}
            onChange={(value) => inputChange("lineHeight")(value + "%")}
          />
        )}
        <div className="text-slate-400 font-semibold">按钮内边距</div>
        <PaddingSettings
          padding={{
            paddingTop: findStyleItem(currentItem.data.styles, "paddingTop"),
            paddingRight: findStyleItem(currentItem.data.styles, "paddingRight"),
            paddingLeft: findStyleItem(currentItem.data.styles, "paddingLeft"),
            paddingBottom: findStyleItem(currentItem.data.styles, "paddingBottom"),
          }}
          setPadding={paddingChange}
        />
      </>
    );
  };
  return (
    <div className="my-10">
      {buttonActionElement()}
      {textStylesElement()}
      {PaddingStylesElement()}
    </div>
  );
};

export default ButtonStyleSettings;
