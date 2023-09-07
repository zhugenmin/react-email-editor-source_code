import { useContext } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ColorPicker from "../ColorPicker";
import { GlobalContext } from "../../reducers";
import { InputNumber, Input } from "antd";
import StyleSettings from "../StyleSettings";

const RightSetting = () => {
  const { currentItem, isDragStart, bodySettings, setBodySettings } = useContext(GlobalContext);

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

  const cardItemElement = (title, dom) => {
    return (
      <div className="flex items-center justify-between mb-4">
        <div className="text-slate-400 font-semibold">{title}</div>
        <div>{dom}</div>
      </div>
    );
  };

  const colorChange = (key) => (color) => {
    setBodySettings({ ...bodySettings, styles: { ...bodySettings.styles, [key]: color.hex } }, "set_body_settings");
  };

  const themeElement = () => {
    return (
      <>
        <div className="text-xl font-semibold mb-10">邮件主题设置</div>
        {cardItemElement("字体颜色", <ColorPicker color={bodySettings.styles.color} setColor={colorChange("color")} />)}
        {cardItemElement("邮件背景颜色", <ColorPicker color={bodySettings.styles.backgroundColor} setColor={colorChange("backgroundColor")} />)}

        <div>
          {cardItemElement(
            "行高",
            <InputNumber
              className="w-32"
              addonAfter="px"
              min={0}
              max={900}
              value={Number(bodySettings.contentWidth)}
              onChange={(value) => setBodySettings({ ...bodySettings, contentWidth: value }, "set_body_settings")}
            />
          )}
        </div>
        <div>
          <div className="text-slate-400 font-semibold">标题文本</div>
          <Input
            className="mt-4"
            value={bodySettings.preHeader}
            onChange={(event) => setBodySettings({ ...bodySettings, preHeader: event.target.value }, "set_body_settings")}
          />
          <div className="text-gray-400 text-sm mt-2">标题是从收件箱查看电子邮件时跟随在主题行之后的简短摘要文本。</div>
        </div>
      </>
    );
  };

  const stopPropagation = (event) => {
    event.stopPropagation();
  };

  return (
    <div className="w-[300px] h-full overflow-auto py-12 px-8 default-scrollbar border-left border" onClick={stopPropagation}>
      <AnimatePresence mode="wait">
        {!isDragStart && currentItem && currentItem.type === "edit" ? (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
            key={0}
          >
            <h2 className="pl-2 text-[16px] leading-[16px] text-[#5E6875] font-semibold border-l-4 border-blue-500">{blockTitle()}</h2>
            <div className="mt-6">
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
