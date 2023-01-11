import { useState } from "react";
import { connect } from "react-redux";
import { ChromePicker } from "react-color";
import { InputNumber, Popover, Select, Modal, Tabs, Collapse, Input, Switch, Slider } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAlignCenter, faAlignLeft, faAlignRight, faAlignJustify } from "@fortawesome/free-solid-svg-icons";
import { defaultColumnsSettings } from "../../utils/defaultColumnsSettings";
import { setBlockList } from "../../redux/reducerCollection/AuthOptions";
import { deepClone } from "../../utils/helpers";

const StyleSettings = (props) => {
  const { blockList, setBlockList, currentItem, setCurrentItem, previewMode } = props;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentColumnType, setCurrentColumnType] = useState(null);
  const [popoverConfig, setPopoverConfig] = useState({ open: false, type: null });

  const findStyleItem = (styles, key) => {
    let styleItem = styles[previewMode][key];

    if (!styleItem) {
      styleItem = styles["desktop"][key];
    }
    return styleItem;
  };

  const classNames = (...classes) => {
    return classes.filter(Boolean).join(" ");
  };

  const inputChange = (key) => (value) => {
    const newStyles = deepClone(currentItem.data.styles || currentItem.data.config.styles);
    newStyles[previewMode][key] = value;
    updateBlockStyles(newStyles);
  };

  const colorChange = (key) => (color) => {
    const newStyles = deepClone(currentItem.data.styles || currentItem.data.config.styles);
    newStyles[previewMode][key] = color.hex;
    updateBlockStyles(newStyles);
  };

  const handleOk = () => {
    const newColumnConfig = defaultColumnsSettings[currentColumnType];
    const newData = {
      ...newColumnConfig,
      data: newColumnConfig.data.map((item, index) => {
        let newItem = item;
        if (currentItem.data.config.data[index]) {
          newItem = { ...currentItem.data.config.data[index], width: item.width };
        }
        return { ...newItem };
      }),
    };
    updateColumnStyles(newData);
    setIsModalOpen(false);
    setCurrentColumnType(null);
  };

  const columnChange = (type) => () => {
    if (currentItem.data.config.data.length > defaultColumnsSettings[type].data.length) {
      setIsModalOpen(true);
      setCurrentColumnType(type);
      return;
    }
    const newColumnConfig = defaultColumnsSettings[type];
    const newData = {
      ...newColumnConfig,
      data: newColumnConfig.data.map((item, index) => {
        let newItem = item;
        if (currentItem.data.config.data[index]) {
          newItem = { ...currentItem.data.config.data[index], width: item.width };
        }
        return { ...newItem };
      }),
    };
    updateColumnStyles(newData);
  };

  const changeColumnStyles = (key, index) => (value) => {
    const newData = deepClone(currentItem.data.config);
    newData.data[index].styles[previewMode][key] = value;
    updateColumnStyles(newData);
  };

  const updateColumnStyles = (newData) => {
    const newCurrentItem = deepClone(currentItem);
    const newBlockList = deepClone(blockList);
    newCurrentItem.data.config = {
      ...newData,
    };
    newBlockList[currentItem.index].config = {
      ...newData,
    };
    setBlockList(newBlockList);
    setCurrentItem(newCurrentItem);
  };

  const updateBlockStyles = (newStyles) => {
    const newCurrentItem = deepClone(currentItem);
    const newBlockList = deepClone(blockList);
    const blockIndexArray = String(currentItem.index).split("-");
    if (blockIndexArray.length === 1) {
      newCurrentItem.data.styles = newStyles;
      newBlockList[blockIndexArray[0]].styles = newStyles;
    } else {
      newCurrentItem.data.config.styles = newStyles;
      newBlockList[blockIndexArray[0]].config.data[blockIndexArray[1]].data[blockIndexArray[2]].config.styles = newStyles;
    }
    setBlockList(newBlockList);
    setCurrentItem(newCurrentItem);
  };

  const headingTypeChange = (type) => () => {
    let fontSize = currentItem.data.config.styles.desktop.fontSize;
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
      ...currentItem.data.config,
      type,
      styles: {
        ...currentItem.data.config.styles,
        desktop: {
          ...currentItem.data.config.styles.desktop,
          fontSize,
        },
      },
    };
    updateBlockConfig(newConfig);
  };
  const updateBlockConfig = (newConfig) => {
    const newCurrentItem = deepClone(currentItem);
    const newBlockList = deepClone(blockList);
    const blockIndexArray = String(currentItem.index).split("-");
    newCurrentItem.data.config = newConfig;
    newBlockList[blockIndexArray[0]].config.data[blockIndexArray[1]].data[blockIndexArray[2]].config = newConfig;
    setBlockList(newBlockList);
    setCurrentItem(newCurrentItem);
  };

  const popoverConfigChange = (key) => (open) => {
    if (open) {
      setPopoverConfig({ open, type: key });
    } else {
      setPopoverConfig({ open, type: null });
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const renderCardDom = (title, dom) => {
    return (
      <div className="flex items-center justify-between mb-4">
        <div className="text-slate-400 font-semibold">{title}</div>
        <div>{dom}</div>
      </div>
    );
  };

  const renderFontFamilyDom = () => {
    const fontFamily = findStyleItem(currentItem.data.config.styles, "fontFamily");
    const fontFamilyList = ["sans-serif", "Arial", "仿宋", "黑体", "Verdana", "Times New Roman", "Garamond", "Georgia", "Courier New", "cursive"];
    return renderCardDom(
      "字体大小",
      <Select className="w-32" value={fontFamily} onChange={inputChange("fontFamily")}>
        {fontFamilyList.map((item) => (
          <Select.Option key={item} value={item}>
            {item}
          </Select.Option>
        ))}
      </Select>
    );
  };

  const renderLineHeight = () => {
    const lineHeight = findStyleItem(currentItem.data.config.styles, "lineHeight");
    return renderCardDom(
      "行高",
      <InputNumber
        className="w-32"
        addonAfter="%"
        min={0}
        value={Number(lineHeight.replace("%", ""))}
        onChange={(value) => inputChange("lineHeight")(value + "%")}
      />
    );
  };

  const renderFontSize = () => {
    const fontSize = findStyleItem(currentItem.data.config.styles, "fontSize");
    return renderCardDom("字体大小", <InputNumber min={0} className="w-32" addonAfter="px" value={fontSize} onChange={inputChange("fontSize")} />);
  };

  const renderColorPicker = (title, key) => {
    const color = findStyleItem(currentItem.data.config.styles, key);
    return renderCardDom(
      title,
      <Popover
        zIndex={1070}
        content={
          <div className="select-none">
            <ChromePicker color={color} style={{ boxShadow: "none" }} onChange={colorChange(key)} />
          </div>
        }
        trigger="click"
        open={popoverConfig.open && popoverConfig.type === key}
        onOpenChange={popoverConfigChange(key)}
      >
        <button className="rounded-lg border h-10 w-10" style={{ background: color }}></button>
      </Popover>
    );
  };

  const renderHeadingType = () => {
    const { type } = currentItem.data.config;
    return renderCardDom(
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
    );
  };

  const renderAlign = () => {
    const textAlign = findStyleItem(currentItem.data.config.styles, "textAlign");
    return renderCardDom(
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
              onClick={() => inputChange("textAlign")(value)}
            >
              <FontAwesomeIcon icon={icon} className="h-10 w-10" />
            </div>
          );
        })}
      </div>
    );
  };

  const renderPaddingDom = () => {
    return (
      <>
        <div className="my-10 flex flex-wrap">
          {[
            { name: "上", value: "paddingTop" },
            { name: "右", value: "paddingRight" },
            { name: "左", value: "paddingLeft" },
            { name: "下", value: "paddingBottom" },
          ].map((item) => {
            const value = findStyleItem(currentItem.data.config.styles, item.value);
            return (
              <div key={item.value} className="w-1/2 mb-4">
                <div>{item.name}</div>
                <InputNumber className="w-32" addonAfter="px" min={0} value={value} onChange={inputChange(item.value)} />
              </div>
            );
          })}
        </div>
      </>
    );
  };

  const renderColumns = () => {
    return (
      <div className="my-10">
        <div
          className={classNames(
            currentItem.data.config.type === "full" ? "border-slate-400" : "hover:shadow-md border-gray-300",
            "w-[100%] rounded-lg h-12 bg-gray-100 border-2 transition-all cursor-pointer"
          )}
          onClick={columnChange("full")}
        ></div>
        <div
          className={classNames(
            currentItem.data.config.type === "1-1" ? "border-slate-400" : "hover:shadow-md border-gray-300",
            "w-[100%] rounded-lg h-12 bg-gray-100 border-2 transition-all cursor-pointer flex mt-4"
          )}
          onClick={columnChange("1-1")}
        >
          <span
            className={classNames(currentItem.data.config.type === "1-1" ? "border-slate-400" : "border-gray-300", "w-1/2 h-full border-r")}
          ></span>
          <span
            className={classNames(currentItem.data.config.type === "1-1" ? "border-slate-400" : "border-gray-300", "w-1/2 h-full border-l")}
          ></span>
        </div>
        <div
          className={classNames(
            currentItem.data.config.type === "1-1-1" ? "border-slate-400" : "hover:shadow-md border-gray-300",
            "w-[100%] rounded-lg h-12 bg-gray-100 border-2 transition-all cursor-pointer flex mt-4"
          )}
          onClick={columnChange("1-1-1")}
        >
          <span
            className={classNames(currentItem.data.config.type === "1-1-1" ? "border-slate-400" : "border-gray-300", "w-1/3 h-full border-r")}
          ></span>
          <span
            className={classNames(currentItem.data.config.type === "1-1-1" ? "border-slate-400" : "border-gray-300", "w-1/3 h-full border-x")}
          ></span>
          <span
            className={classNames(currentItem.data.config.type === "1-1-1" ? "border-slate-400" : "border-gray-300", "w-1/3 h-full border-l")}
          ></span>
        </div>
        <div
          className={classNames(
            currentItem.data.config.type === "1-1-1-1" ? "border-slate-400" : "hover:shadow-md border-gray-300",
            "w-[100%] rounded-lg h-12 bg-gray-100 border-2 transition-all cursor-pointer flex mt-4"
          )}
          onClick={columnChange("1-1-1-1")}
        >
          <span
            className={classNames(currentItem.data.config.type === "1-1-1-1" ? "border-slate-400" : "border-gray-300", "w-1/4 h-full border-r")}
          ></span>
          <span
            className={classNames(currentItem.data.config.type === "1-1-1-1" ? "border-slate-400" : "border-gray-300", "w-1/4 h-full border-x")}
          ></span>
          <span
            className={classNames(currentItem.data.config.type === "1-1-1-1" ? "border-slate-400" : "border-gray-300", "w-1/4 h-full border-x")}
          ></span>
          <span
            className={classNames(currentItem.data.config.type === "1-1-1-1" ? "border-slate-400" : "border-gray-300", "w-1/4 h-full border-l")}
          ></span>
        </div>
        <div
          className={classNames(
            currentItem.data.config.type === "1-2" ? "border-slate-400" : "hover:shadow-md border-gray-300",
            "w-[100%] rounded-lg h-12 bg-gray-100 border-2 transition-all cursor-pointer flex mt-4"
          )}
          onClick={columnChange("1-2")}
        >
          <span
            className={classNames(currentItem.data.config.type === "1-2" ? "border-slate-400" : "border-gray-300", "w-1/3 h-full border-r")}
          ></span>
          <span
            className={classNames(currentItem.data.config.type === "1-2" ? "border-slate-400" : "border-gray-300", "w-2/3 h-full border-l")}
          ></span>
        </div>
        <div
          className={classNames(
            currentItem.data.config.type === "2-1" ? "border-slate-400" : "hover:shadow-md border-gray-300",
            "w-[100%] rounded-lg h-12 bg-gray-100 border-2 transition-all cursor-pointer flex mt-4"
          )}
          onClick={columnChange("2-1")}
        >
          <span
            className={classNames(currentItem.data.config.type === "2-1" ? "border-slate-400" : "border-gray-300", "w-2/3 h-full border-r")}
          ></span>
          <span
            className={classNames(currentItem.data.config.type === "2-1" ? "border-slate-400" : "border-gray-300", "w-1/3 h-full border-l")}
          ></span>
        </div>
        <div
          className={classNames(
            currentItem.data.config.type === "2-4-2-4" ? "border-slate-400" : "hover:shadow-md border-gray-300",
            "w-[100%] rounded-lg h-12 bg-gray-100 border-2 transition-all cursor-pointer flex mt-4"
          )}
          onClick={columnChange("2-4-2-4")}
        >
          <span
            className={classNames(currentItem.data.config.type === "2-4-2-4" ? "border-slate-400" : "border-gray-300", "w-2/12 h-full border-r")}
          ></span>
          <span
            className={classNames(currentItem.data.config.type === "2-4-2-4" ? "border-slate-400" : "border-gray-300", "w-4/12 h-full border-x")}
          ></span>
          <span
            className={classNames(currentItem.data.config.type === "2-4-2-4" ? "border-slate-400" : "border-gray-300", "w-2/12 h-full border-x")}
          ></span>
          <span
            className={classNames(currentItem.data.config.type === "2-4-2-4" ? "border-slate-400" : "border-gray-300", "w-4/12 h-full border-l")}
          ></span>
        </div>
        <div
          className={classNames(
            currentItem.data.config.type === "4-2-4-2" ? "border-slate-400" : "hover:shadow-md border-gray-300",
            "w-[100%] rounded-lg h-12 bg-gray-100 border-2 transition-all cursor-pointer flex mt-4"
          )}
          onClick={columnChange("4-2-4-2")}
        >
          <span
            className={classNames(currentItem.data.config.type === "4-2-4-2" ? "border-slate-400" : "border-gray-300", "w-4/12 h-full border-r")}
          ></span>
          <span
            className={classNames(currentItem.data.config.type === "4-2-4-2" ? "border-slate-400" : "border-gray-300", "w-2/12 h-full border-x")}
          ></span>
          <span
            className={classNames(currentItem.data.config.type === "4-2-4-2" ? "border-slate-400" : "border-gray-300", "w-4/12 h-full border-x")}
          ></span>
          <span
            className={classNames(currentItem.data.config.type === "4-2-4-2" ? "border-slate-400" : "border-gray-300", "w-2/12 h-full border-l")}
          ></span>
        </div>
      </div>
    );
  };

  const renderColumnsStyle = () => {
    return (
      <Tabs
        defaultActiveKey="1"
        items={currentItem.data.config.data.map((item, index) => {
          const key = index + 1;
          const backgroundColor = findStyleItem(item.styles, "backgroundColor");
          return {
            label: `列 ${key}`,
            key: key,
            children: (
              <>
                {renderCardDom(
                  "背景颜色",
                  <Popover
                    zIndex={1070}
                    content={
                      <div className="select-none">
                        <ChromePicker
                          color={backgroundColor}
                          style={{ boxShadow: "none" }}
                          onChange={({ hex }) => changeColumnStyles("backgroundColor", index)(hex)}
                        />
                      </div>
                    }
                    trigger="click"
                    open={popoverConfig.open && popoverConfig.type === "backgroundColor" + index}
                    onOpenChange={popoverConfigChange("backgroundColor" + index)}
                  >
                    <button className="rounded-lg border h-10 w-10" style={{ background: backgroundColor }}></button>
                  </Popover>
                )}
                <div className="text-slate-400 font-semibold">内边距</div>
                <div className="my-4 flex flex-wrap">
                  {[
                    { name: "上", value: "paddingTop" },
                    { name: "右", value: "paddingRight" },
                    { name: "左", value: "paddingLeft" },
                    { name: "下", value: "paddingBottom" },
                  ].map(({ name, value }) => {
                    const style = findStyleItem(item.styles, value);
                    return (
                      <div key={value} className="w-1/2 mb-4">
                        <div>{name}</div>
                        <InputNumber className="w-32" addonAfter="px" min={0} value={style} onChange={changeColumnStyles(value, index)} />
                      </div>
                    );
                  })}
                </div>
              </>
            ),
          };
        })}
      />
    );
  };

  const renderContentStyles = () => {
    const textAlign = findStyleItem(currentItem.data.config.contentStyles, "textAlign");
    const contentInputChange = (key) => (value) => {
      const newCurrentItem = deepClone(currentItem);
      const newBlockList = deepClone(blockList);
      currentItem.data.config.contentStyles[previewMode][key] = value;
      const blockIndexArray = String(currentItem.index).split("-");
      newBlockList[blockIndexArray[0]].config.data[blockIndexArray[1]].data[blockIndexArray[2]].config.contentStyles[key] = value;
      setBlockList([...newBlockList]);
      setCurrentItem({ ...newCurrentItem });
    };
    return (
      <div className="my-10">
        {renderCardDom(
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
                  onClick={() => contentInputChange("textAlign")(value)}
                >
                  <FontAwesomeIcon icon={icon} className="h-10 w-10" />
                </div>
              );
            })}
          </div>
        )}
        <div className="text-slate-400 font-semibold">内边距</div>
        <div className="my-4 flex flex-wrap">
          {[
            { name: "上", value: "paddingTop" },
            { name: "右", value: "paddingRight" },
            { name: "左", value: "paddingLeft" },
            { name: "下", value: "paddingBottom" },
          ].map(({ name, value }) => {
            const style = findStyleItem(currentItem.data.config.contentStyles, value);
            return (
              <div key={value} className="w-1/2 mb-4">
                <div>{name}</div>
                <InputNumber className="w-32" addonAfter="px" min={0} value={style} onChange={contentInputChange(value)} />
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderRowStyles = () => {
    const backgroundColor = findStyleItem(currentItem.data.styles, "backgroundColor");
    const contentBackground = findStyleItem(currentItem.data.styles, "contentBackground");
    return (
      <div className="my-10">
        {renderCardDom(
          "背景颜色",
          <Popover
            zIndex={1070}
            content={
              <div className="select-none">
                <ChromePicker color={backgroundColor} style={{ boxShadow: "none" }} onChange={colorChange("backgroundColor")} />
              </div>
            }
            trigger="click"
            open={popoverConfig.open && popoverConfig.type === "backgroundColor"}
            onOpenChange={popoverConfigChange("backgroundColor")}
          >
            <button className="rounded-lg border h-10 w-10" style={{ background: backgroundColor }}></button>
          </Popover>
        )}
        {renderCardDom(
          "内容背景颜色",
          <Popover
            zIndex={1070}
            content={
              <div className="select-none">
                <ChromePicker color={contentBackground} style={{ boxShadow: "none" }} onChange={colorChange("contentBackground")} />
              </div>
            }
            trigger="click"
            open={popoverConfig.open && popoverConfig.type === "contentBackground"}
            onOpenChange={popoverConfigChange("contentBackground")}
          >
            <button className="rounded-lg border h-10 w-10" style={{ background: contentBackground }}></button>
          </Popover>
        )}
        <div className="text-slate-400 font-semibold">内边距</div>
        <div className="my-4 flex flex-wrap">
          {[
            { name: "上", value: "paddingTop" },
            { name: "右", value: "paddingRight" },
            { name: "左", value: "paddingLeft" },
            { name: "下", value: "paddingBottom" },
          ].map(({ name, value }) => {
            const style = findStyleItem(currentItem.data.styles, value);
            return (
              <div key={value} className="w-1/2 mb-4">
                <div>{name}</div>
                <InputNumber className="w-32" addonAfter="px" min={0} value={style} onChange={inputChange(value)} />
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderActionSettings = () => {
    const { linkURL } = currentItem.data.config;

    const linkChange = (event) => {
      const newValue = event.target.value;
      const newCurrentItem = deepClone(currentItem);
      const newBlockList = deepClone(blockList);
      currentItem.data.config.linkURL = newValue;
      const blockIndexArray = String(currentItem.index).split("-");
      newBlockList[blockIndexArray[0]].config.data[blockIndexArray[1]].data[blockIndexArray[2]].config.linkURL = newValue;
      setBlockList([...newBlockList]);
      setCurrentItem({ ...newCurrentItem });
    };

    return (
      <div>
        {renderCardDom("按钮类型", <div className="text-center text-sky-500 border-sky-500 border px-2 py-1 rounded-lg font-semibold">超链接</div>)}
        <div className="text-slate-400 font-semibold">超链接URL</div>
        <div className="mt-2">
          <Input addonBefore="https://" value={linkURL} onChange={linkChange} />
        </div>
      </div>
    );
  };

  const renderButtonWidth = () => {
    const width = findStyleItem(currentItem.data.config.styles, "width");
    return (
      <>
        {renderCardDom(
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
      </>
    );
  };

  const renderLineStyle = () => {
    const width = findStyleItem(currentItem.data.config.styles, "width");
    const borderTopColor = findStyleItem(currentItem.data.config.styles, "borderTopColor");
    const borderTopWidth = findStyleItem(currentItem.data.config.styles, "borderTopWidth");
    const borderTopStyle = findStyleItem(currentItem.data.config.styles, "borderTopStyle");
    const dividerType = [
      { label: "实线", value: "solid" },
      { label: "虚线（点）", value: "dotted" },
      { label: "虚线（破折号）", value: "dashed" },
    ];

    return (
      <>
        {renderCardDom(
          "字体大小",
          <Select className="w-32" value={borderTopStyle} onChange={inputChange("borderTopStyle")}>
            {dividerType.map((item) => (
              <Select.Option key={item.value} value={item.value}>
                {item.label}
              </Select.Option>
            ))}
          </Select>
        )}
        {renderCardDom(
          "分割线宽度",
          <InputNumber min={0} className="w-32" addonAfter="px" value={borderTopWidth} onChange={inputChange("borderTopWidth")} />
        )}
        {renderCardDom(
          "分割线颜色",
          <Popover
            zIndex={1070}
            content={
              <div className="select-none">
                <ChromePicker color={borderTopColor} style={{ boxShadow: "none" }} onChange={colorChange("borderTopColor")} />
              </div>
            }
            trigger="click"
            open={popoverConfig.open && popoverConfig.type === "borderTopColor"}
            onOpenChange={popoverConfigChange("borderTopColor")}
          >
            <button className="rounded-lg border h-10 w-10" style={{ background: borderTopColor }}></button>
          </Popover>
        )}
        <Slider value={Number(width.replace("%", ""))} onChange={(value) => inputChange("width")(value + "%")} />
      </>
    );
  };

  const renderImageSettings = () => {
    const { src, alt } = currentItem.data.config;

    const linkChange = (key) => (event) => {
      const newValue = event.target.value;
      const newCurrentItem = deepClone(currentItem);
      const newBlockList = deepClone(blockList);
      currentItem.data.config[key] = newValue;
      const blockIndexArray = String(currentItem.index).split("-");
      newBlockList[blockIndexArray[0]].config.data[blockIndexArray[1]].data[blockIndexArray[2]].config[key] = newValue;
      setBlockList([...newBlockList]);
      setCurrentItem({ ...newCurrentItem });
    };

    return (
      <div>
        <div className="text-slate-400 font-semibold">图片URL</div>
        <div className="my-2">
          <Input value={src} onChange={linkChange("src")} />
        </div>
        <div className="text-slate-400 font-semibold">图片alt</div>
        <div className="my-2">
          <Input value={alt} onChange={linkChange("alt")} />
        </div>
      </div>
    );
  };

  const renderTextStyles = () => {
    return (
      <>
        <Collapse ghost defaultActiveKey={["1", "2"]} bordered={false} expandIconPosition="end" className="block-style_settings-collapse">
          <Collapse.Panel header="文本" key="1">
            <div className="my-10">
              {renderColorPicker("字体颜色", "color")}
              {renderAlign()}
              {renderFontFamilyDom()}
              {renderFontSize()}
              {renderLineHeight()}
            </div>
          </Collapse.Panel>
          <Collapse.Panel header="内边距" key="2">
            {renderPaddingDom()}
          </Collapse.Panel>
        </Collapse>
      </>
    );
  };

  const renderHeadingStyles = () => {
    return (
      <>
        <Collapse ghost defaultActiveKey={["1", "2"]} bordered={false} expandIconPosition="end" className="block-style_settings-collapse">
          <Collapse.Panel header="文本" key="1">
            <div className="my-10">
              {renderHeadingType()}
              {renderColorPicker("字体颜色", "color")}
              {renderAlign()}
              {renderFontFamilyDom()}
              {renderFontSize()}
              {renderLineHeight()}
            </div>
          </Collapse.Panel>
          <Collapse.Panel header="内边距" key="2">
            {renderPaddingDom()}
          </Collapse.Panel>
        </Collapse>
      </>
    );
  };

  const renderColumnStyles = () => {
    return (
      <>
        <Collapse ghost defaultActiveKey={["1", "2", "3"]} bordered={false} expandIconPosition="end" className="block-style_settings-collapse">
          <Collapse.Panel header="排列" key="1">
            {renderColumns()}
          </Collapse.Panel>
          <Collapse.Panel header="列样式" key="2">
            {renderColumnsStyle()}
          </Collapse.Panel>
          <Collapse.Panel header="整体样式" key="3">
            {renderRowStyles()}
          </Collapse.Panel>
        </Collapse>
      </>
    );
  };

  const renderButtonStyles = () => {
    return (
      <>
        <Collapse ghost defaultActiveKey={["1", "2", "3"]} bordered={false} expandIconPosition="end" className="block-style_settings-collapse">
          <Collapse.Panel header="按钮操作" key="1">
            <div className="my-10">{renderActionSettings()}</div>
          </Collapse.Panel>
          <Collapse.Panel header="按钮样式" key="2">
            <div className="my-10">
              {renderButtonWidth()}
              {renderColorPicker("字体颜色", "color")}
              {renderColorPicker("按钮颜色", "backgroundColor")}
              {renderFontFamilyDom()}
              {renderFontSize()}
              {renderLineHeight()}
            </div>
          </Collapse.Panel>
          <Collapse.Panel header="按钮内边距" key="3">
            {renderPaddingDom()}
          </Collapse.Panel>
          <Collapse.Panel header="整体样式" key="4">
            {renderContentStyles()}
          </Collapse.Panel>
        </Collapse>
      </>
    );
  };

  const renderDividerStyles = () => {
    return (
      <>
        <Collapse ghost defaultActiveKey={["1", "2", "3"]} bordered={false} expandIconPosition="end" className="block-style_settings-collapse">
          <Collapse.Panel header="分割线样式" key="1">
            <div className="my-10">
              {renderLineStyle()}
              {renderContentStyles()}
            </div>
          </Collapse.Panel>
        </Collapse>
      </>
    );
  };

  const renderImageStyles = () => {
    return (
      <>
        <Collapse ghost defaultActiveKey={["1", "2"]} bordered={false} expandIconPosition="end" className="block-style_settings-collapse">
          <Collapse.Panel header="点击图片触发" key="1">
            <div className="my-10">{renderActionSettings()}</div>
          </Collapse.Panel>
          <Collapse.Panel header="图片设置" key="2">
            <div className="my-10">
              {renderImageSettings()}
              {renderButtonWidth()}
              {renderContentStyles()}
            </div>
          </Collapse.Panel>
        </Collapse>
      </>
    );
  };

  return (
    <>
      {currentItem.data.key === "column" && renderColumnStyles()}
      {currentItem.data.key === "text" && renderTextStyles()}
      {currentItem.data.key === "heading" && renderHeadingStyles()}
      {currentItem.data.key === "button" && renderButtonStyles()}
      {currentItem.data.key === "divider" && renderDividerStyles()}
      {currentItem.data.key === "image" && renderImageStyles()}
      <Modal title="删除列" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} width={400}>
        <p className="my-10">
          您确定删除多余的
          {currentColumnType && (
            <span className="mx-1 font-semibold">{currentItem.data.config.data.length - defaultColumnsSettings[currentColumnType].data.length}</span>
          )}
          列吗？
        </p>
      </Modal>
    </>
  );
};

const mapStateToProps = (state) => ({
  previewMode: state.AuthOptions.previewMode,
  blockList: state.AuthOptions.blockList,
});

const mapDispatchToProps = (dispatch) => ({
  setBlockList: (blockList, action) => dispatch(setBlockList(blockList, action)),
});
export default connect(mapStateToProps, mapDispatchToProps)(StyleSettings);
