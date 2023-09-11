import { useContext } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ColorPicker from "../ColorPicker";
import { GlobalContext } from "../../reducers";
import { InputNumber, Input } from "antd";
import StyleSettings from "../StyleSettings";
import useLayout from "../../utils/useStyleLayout";

const RightSetting = () => {
  const { currentItem, isDragStart, bodySettings, setBodySettings } = useContext(GlobalContext);
  const { cardItemElement } = useLayout();
  const blockTitle = () => {
    let title = "Block";
    const type = currentItem?.data.key;
    switch (type) {
      case "text":
        title = "文本设置";
        break;
      case "column":
        title = "行设置";
        break;
      case "heading":
        title = "标题设置";
        break;
      case "button":
        title = "按钮设置";
        break;
      case "divider":
        title = "分割线设置";
        break;
      case "image":
        title = "图片设置";
        break;
      case "social_link":
        title = "社交链接设置";
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
        <div className="subject-settings">邮件主题设置</div>
        {cardItemElement("字体颜色", <ColorPicker color={bodySettings.styles.color} setColor={colorChange("color")} />)}
        {cardItemElement("邮件背景颜色", <ColorPicker color={bodySettings.styles.backgroundColor} setColor={colorChange("backgroundColor")} />)}

        <div>
          {cardItemElement(
            "行高",
            <InputNumber
              className="input-width"
              addonAfter="px"
              min={0}
              max={900}
              value={Number(bodySettings.contentWidth)}
              onChange={(value) => setBodySettings({ ...bodySettings, contentWidth: value }, "set_body_settings")}
            />
          )}
        </div>
        <div>
          <div className="pre_header">标题文本</div>
          <Input
            className="margin-top-12"
            value={bodySettings.preHeader}
            onChange={(event) => setBodySettings({ ...bodySettings, preHeader: event.target.value }, "set_body_settings")}
          />
          <div className="pre_header-desc">标题是从收件箱查看电子邮件时跟随在主题行之后的简短摘要文本。</div>
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
