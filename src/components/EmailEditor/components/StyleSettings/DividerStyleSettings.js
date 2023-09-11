import { useContext } from "react";
import { GlobalContext } from "../../reducers";
import classNames from "../../utils/classNames";
import { InputNumber, Select, Slider } from "antd";
import { deepClone } from "../../utils/helpers";
import ColorPicker from "../ColorPicker";
import PaddingSettings from "./PaddingSettings";
import useLayout from "../../utils/useStyleLayout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAlignCenter, faAlignLeft, faAlignRight, faAlignJustify } from "@fortawesome/free-solid-svg-icons";

const DividerStyleSettings = () => {
  const { currentItem, previewMode } = useContext(GlobalContext);
  const { findStyleItem, cardItemElement, colorChange, updateItemStyles, inputChange } = useLayout();

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

  const dividerStyleSettings = () => {
    const textAlign = findStyleItem(currentItem.data.contentStyles, "textAlign");
    const width = findStyleItem(currentItem.data.styles, "width");
    const borderTopColor = findStyleItem(currentItem.data.styles, "borderTopColor");
    const borderTopWidth = findStyleItem(currentItem.data.styles, "borderTopWidth");
    const borderTopStyle = findStyleItem(currentItem.data.styles, "borderTopStyle");
    const dividerType = [
      { label: "实线", value: "solid" },
      { label: "虚线（点）", value: "dotted" },
      { label: "虚线（破折号）", value: "dashed" },
    ];

    return (
      <>
        <div className="right-setting-block-item-title"> 分割线样式</div>
        {cardItemElement(
          "字体大小",
          <Select className="input-width" value={borderTopStyle} onChange={inputChange("borderTopStyle")}>
            {dividerType.map((item) => (
              <Select.Option key={item.value} value={item.value}>
                {item.label}
              </Select.Option>
            ))}
          </Select>
        )}
        {cardItemElement(
          "分割线宽度",
          <InputNumber min={0} className="input-width" addonAfter="px" value={borderTopWidth} onChange={inputChange("borderTopWidth")} />
        )}
        {cardItemElement("分割线颜色", <ColorPicker color={borderTopColor} setColor={colorChange("borderTopColor")} />)}
        <div className="card-item-title"> 分割线宽度</div>
        <Slider value={Number(width.replace("%", ""))} onChange={(value) => inputChange("width")(value + "%")} />
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
                  className={classNames(textAlign === value ? "align-style-item-active" : "align-style-item-un_active", "align-style-item")}
                  onClick={() => updateContentTextAlign(value)}
                >
                  <FontAwesomeIcon icon={icon} className="tag-style-size" />
                </div>
              );
            })}
          </div>
        )}
        <div className="card-item-title"> 内边距设置</div>
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
  return <div className="margin-y-30">{dividerStyleSettings()}</div>;
};

export default DividerStyleSettings;
