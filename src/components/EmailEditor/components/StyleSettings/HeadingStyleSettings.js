import { useContext } from "react";
import { GlobalContext } from "../../reducers";
import classNames from "../../utils/classNames";
import { InputNumber, Select } from "antd";

import ColorPicker from "../ColorPicker";
import PaddingSettings from "./PaddingSettings";
import useLayout from "../../utils/useStyleLayout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAlignCenter, faAlignLeft, faAlignRight, faAlignJustify } from "@fortawesome/free-solid-svg-icons";

const HeadingStyleSettings = () => {
  const { currentItem } = useContext(GlobalContext);
  const { findStyleItem, cardItemElement, colorChange, paddingChange, otherStylesChange, inputChange, updateItemStyles } = useLayout();

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

  const headingTypeChange = (type) => () => {
    let fontSize = currentItem.data.styles.desktop.fontSize;
    switch (type) {
      case "h1":
        fontSize = 22;
        break;
      case "h2":
        fontSize = 20;
        break;
      case "h3":
        fontSize = 18;
        break;
      case "h4":
        fontSize = 16;
        break;
      default:
        break;
    }
    let newConfig = {
      ...currentItem.data,
      type,
      styles: {
        ...currentItem.data.styles,
        desktop: {
          ...currentItem.data.styles.desktop,
          fontSize,
        },
      },
    };
    updateItemStyles(newConfig);
  };

  const textStylesElement = () => {
    const { type } = currentItem.data;
    const color = findStyleItem(currentItem.data.styles, "color");
    const textAlign = findStyleItem(currentItem.data.styles, "textAlign");
    const fontFamily = findStyleItem(currentItem.data.styles, "fontFamily");
    const fontSize = findStyleItem(currentItem.data.styles, "fontSize");
    const lineHeight = findStyleItem(currentItem.data.styles, "lineHeight");
    const fontFamilyList = ["sans-serif", "Arial", "仿宋", "黑体", "Verdana", "Times New Roman", "Garamond", "Georgia", "Courier New", "cursive"];

    return (
      <>
        <div className="my-8 text-lg text-gray-700 border-y -mx-8 px-8 py-4 bg-slate-100">文本样式</div>
        {cardItemElement(
          "标题类型",
          <div className="flex justify-center items-center">
            {[
              { name: "H1", value: "h1" },
              { name: "H2", value: "h2" },
              { name: "H3", value: "h3" },
              { name: "H4", value: "h4" },
            ].map(({ name, value }) => {
              return (
                <div
                  key={value}
                  className={classNames(
                    type === value ? "border-gray-500 text-gray-500" : "border-gray-200 text-gray-200 hover:border-gray-500 hover:text-gray-500",
                    "rounded-md p-1 text-2xl border text-center ml-2 cursor-pointer transition-all font-bold select-none"
                  )}
                  onClick={headingTypeChange(value)}
                >
                  {name}
                </div>
              );
            })}
          </div>
        )}
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

export default HeadingStyleSettings;
