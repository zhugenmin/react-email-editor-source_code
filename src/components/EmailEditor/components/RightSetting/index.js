import { useContext } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ColorPicker from "../ColorPicker";
import { GlobalContext } from "../../reducers";
import { InputNumber, Input } from "antd";
import StyleSettings from "../StyleSettings";
import useLayout from "../../utils/useStyleLayout";
import useTranslation from "../../translation";

const RightSetting = () => {
  const { currentItem, isDragStart, bodySettings, setBodySettings } = useContext(GlobalContext);
  const { t } = useTranslation();
  const { cardItemElement } = useLayout();
  const blockTitle = () => {
    let title = "Block";
    const type = currentItem?.data.key;
    switch (type) {
      case "text":
        title = t("text_settings");
        break;
      case "column":
        title = t("column_settings");
        break;
      case "heading":
        title = t("heading_settings");
        break;
      case "button":
        title = t("button_settings");
        break;
      case "divider":
        title = t("divider_settings");
        break;
      case "image":
        title = t("image_settings");
        break;
      case "social_link":
        title = t("social_link_settings");
        break;
      default:
        break;
    }
    return title;
  };

  const colorChange = (key) => (color) => {
    setBodySettings({ ...bodySettings, styles: { ...bodySettings.styles, [key]: color.hex } }, "set_body_settings");
  };

  const themeElement = () => {
    return (
      <>
        <div className="subject-settings">{t("body_settings")}</div>
        <div className="margin-top-32">
          {cardItemElement(t("text_color"), <ColorPicker color={bodySettings.styles.color} setColor={colorChange("color")} />)}
          {cardItemElement(
            t("email_theme_background_color"),
            <ColorPicker color={bodySettings.styles.backgroundColor} setColor={colorChange("backgroundColor")} />
          )}
          {cardItemElement(
            t("line_height"),
            <InputNumber
              className="input-width"
              addonAfter="px"
              min={0}
              max={900}
              value={Number(bodySettings.contentWidth)}
              onChange={(value) => setBodySettings({ ...bodySettings, contentWidth: value }, "set_body_settings")}
            />
          )}
          <div>
            <div className="pre_header">{t("pre_header")}</div>
            <Input
              className="margin-top-12"
              value={bodySettings.preHeader}
              onChange={(event) => setBodySettings({ ...bodySettings, preHeader: event.target.value }, "set_body_settings")}
            />
            <div className="pre_header-desc">{t("pre_header_description")}</div>
          </div>
        </div>
      </>
    );
  };

  const stopPropagation = (event) => {
    event.stopPropagation();
  };

  return (
    <div className="right-settings default-scrollbar" onClick={stopPropagation}>
      <AnimatePresence mode="wait">
        {!isDragStart && currentItem && currentItem.type === "edit" ? (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
            key={0}
          >
            <h2 className="right-setting-block-title">{blockTitle()}</h2>
            <div className="margin-top-18">
              <StyleSettings />
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
            key={1}
          >
            {themeElement()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RightSetting;
