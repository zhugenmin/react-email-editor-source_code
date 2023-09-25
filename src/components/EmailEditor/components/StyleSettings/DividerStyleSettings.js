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
import useTranslation from "../../translation";

const DividerStyleSettings = () => {
  const { currentItem, previewMode } = useContext(GlobalContext);
  const { t } = useTranslation();

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
      { label: t("solid"), value: "solid" },
      { label: t("dotted"), value: "dotted" },
      { label: t("dashed"), value: "dashed" },
    ];

    return (
      <>
        <div className="right-setting-block-item-title"> {t("divider_styles")}</div>
        {cardItemElement(
          t("divider_type"),
          <Select className="input-width" value={borderTopStyle} onChange={inputChange("borderTopStyle")}>
            {dividerType.map((item) => (
              <Select.Option key={item.value} value={item.value}>
                {item.label}
              </Select.Option>
            ))}
          </Select>
        )}
        {cardItemElement(
          t("height"),
          <InputNumber min={0} className="input-width" addonAfter="px" value={borderTopWidth} onChange={inputChange("borderTopWidth")} />
        )}
        {cardItemElement(t("divider_color"), <ColorPicker color={borderTopColor} setColor={colorChange("borderTopColor")} />)}
        <div className="card-item-title">{t("width")}</div>
        <Slider value={Number(width.replace("%", ""))} onChange={(value) => inputChange("width")(value + "%")} />
        {cardItemElement(
          t("align"),
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
        <div className="card-item-title"> {t("padding_settings")}</div>
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
