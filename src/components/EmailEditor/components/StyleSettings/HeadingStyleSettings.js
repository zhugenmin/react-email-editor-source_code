import { useContext } from "react";
import { GlobalContext } from "../../reducers";
import classNames from "../../utils/classNames";
import { InputNumber, Select } from "antd";

import ColorPicker from "../ColorPicker";
import PaddingSettings from "./PaddingSettings";
import useLayout from "../../utils/useStyleLayout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAlignCenter, faAlignLeft, faAlignRight, faAlignJustify } from "@fortawesome/free-solid-svg-icons";
import useTranslation from "../../translation";

const HeadingStyleSettings = () => {
  const { currentItem } = useContext(GlobalContext);
  const { t } = useTranslation();
  const { findStyleItem, cardItemElement, colorChange, paddingChange, otherStylesChange, inputChange, updateItemStyles } = useLayout();

  const PaddingStylesElement = () => {
    return (
      <>
        <div className="right-setting-block-item-title"> {t("padding_settings")}</div>
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
        <div className="right-setting-block-item-title">{t("text_styles")}</div>
        {cardItemElement(
          t("heading_type"),
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
                  className={classNames(type === value ? "align-style-item-active" : "align-style-item-un_active", "align-style-item")}
                  onClick={headingTypeChange(value)}
                >
                  {name}
                </div>
              );
            })}
          </div>
        )}
        {cardItemElement(t("font_color"), <ColorPicker color={color} setColor={colorChange("color")} />)}
        {cardItemElement(
          t("text_align"),
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
                  onClick={() => otherStylesChange("textAlign", value)}
                >
                  <FontAwesomeIcon icon={icon} className="tag-style-size" />
                </div>
              );
            })}
          </div>
        )}
        {cardItemElement(
          t("font_family"),
          <Select className="input-width" value={fontFamily} onChange={inputChange("fontFamily")}>
            {fontFamilyList.map((item) => (
              <Select.Option key={item} value={item}>
                {item}
              </Select.Option>
            ))}
          </Select>
        )}
        {cardItemElement(
          t("font_size"),
          <InputNumber min={0} className="input-width" addonAfter="px" value={fontSize} onChange={inputChange("fontSize")} />
        )}
        {cardItemElement(
          t("line_height"),
          <InputNumber
            className="input-width"
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
    <div className="margin-y-30">
      {textStylesElement()}
      {PaddingStylesElement()}
    </div>
  );
};

export default HeadingStyleSettings;
