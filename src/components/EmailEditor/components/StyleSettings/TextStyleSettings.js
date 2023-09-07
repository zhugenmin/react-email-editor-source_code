import { useContext } from "react";
import { GlobalContext } from "../../reducers";
import classNames from "../../utils/classNames";
import { InputNumber, Select } from "antd";

import ColorPicker from "../ColorPicker";
import PaddingSettings from "./PaddingSettings";
import useLayout from "../../utils/useStyleLayout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAlignCenter, faAlignLeft, faAlignRight, faAlignJustify } from "@fortawesome/free-solid-svg-icons";

const TextStyleSettings = () => {
  const { currentItem } = useContext(GlobalContext);
  const { findStyleItem, cardItemElement, colorChange, paddingChange, otherStylesChange, inputChange } = useLayout();

  const PaddingStylesElement = () => {
    return (
      <>
        <div className="my-8 text-lg text-gray-700 border-y -mx-8 px-8 py-4 bg-slate-100"> 内边距设置</div>
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

  const textStylesElement = () => {
    const color = findStyleItem(currentItem.data.styles, "color");
    const textAlign = findStyleItem(currentItem.data.styles, "textAlign");
    const fontFamily = findStyleItem(currentItem.data.styles, "fontFamily");
    const fontSize = findStyleItem(currentItem.data.styles, "fontSize");
    const lineHeight = findStyleItem(currentItem.data.styles, "lineHeight");
    const fontFamilyList = ["sans-serif", "Arial", "仿宋", "黑体", "Verdana", "Times New Roman", "Garamond", "Georgia", "Courier New", "cursive"];

    return (
      <>
        <div className="my-8 text-lg text-gray-700 border-y -mx-8 px-8 py-4 bg-slate-100">文本样式</div>
        {cardItemElement("字体颜色", <ColorPicker color={color} setColor={colorChange("color")} />)}
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
                  onClick={() => otherStylesChange("textAlign", value)}
                >
                  <FontAwesomeIcon icon={icon} className="h-10 w-10" />
                </div>
              );
            })}
          </div>
        )}
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
      </>
    );
  };
  return (
    <div className="my-10">
      {textStylesElement()}
      {PaddingStylesElement()}
    </div>
  );
};

export default TextStyleSettings;
