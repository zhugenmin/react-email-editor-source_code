import { useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBold,
  faItalic,
  faUnderline,
  faStrikethrough,
  faListOl,
  faListUl,
  faAlignLeft,
  faAlignCenter,
  faAlignRight,
  faLink,
  faUnlink,
  faAngleDown,
  faExpandAlt,
  faCompressAlt,
} from "@fortawesome/free-solid-svg-icons";
import { ChromePicker } from "react-color";
import { useState } from "react";
import { Popover, Modal, Input } from "antd";

const RichText = (props) => {
  const { index, textBlock, blockList, setBlockList, styles } = props;
  const richTextRef = useRef(null);
  const [color, setColor] = useState("#000");
  const [open, setOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [inputConfig, setInputConfig] = useState({
    value: "",
    range: null,
  });

  const handleOpenChange = (newOpen) => {
    setOpen(newOpen);
  };

  useEffect(() => {
    if (richTextRef.current) {
      var viewportOffset = richTextRef.current.parentNode.getBoundingClientRect();
      if (viewportOffset.top - 140 < 0) {
        richTextRef.current.style.bottom = "auto";
        richTextRef.current.style.top = "110%";
      } else {
        richTextRef.current.style.bottom = "110%";
        richTextRef.current.style.top = "auto";
      }
    }
  }, []);

  const fontStyleList = [
    { title: "加粗", icon: faBold, key: "bold" },
    { title: "斜体", icon: faItalic, key: "italic" },
    { title: "下划线", icon: faUnderline, key: "underline" },
    { title: "删除线", icon: faStrikethrough, key: "strikethrough" },
    { title: "有序列表", icon: faListOl, key: "insertOrderedList" },
    { title: "无序列表", icon: faListUl, key: "insertUnorderedList" },
    { title: "超链接", icon: faLink, key: "createLink" },
    { title: "删除超链接", icon: faUnlink, key: "unlink" },
    { title: "居中", icon: faAlignLeft, key: "justifyLeft" },
    { title: "居左", icon: faAlignCenter, key: "justifyCenter" },
    { title: "居右", icon: faAlignRight, key: "justifyRight" },
    // { title: "上标", icon: faSuperscript, key: "superscript" },
    // { title: "下标", icon: faSubscript, key: "subscript" },
  ];
  const modifyText = (command, defaultUi, value) => {
    document.execCommand(command, defaultUi, value);
  };

  const fontSizeList = [
    "8px",
    "10px",
    "12px",
    "14px",
    "16px",
    "18px",
    "20px",
    "22px",
    "24px",
    "26px",
    "28px",
    "30px",
    "32px",
    "34px",
    "36px",
    "38px",
    "40px",
    "44px",
    "48px",
    "72px",
  ];

  const fontname_configs = ["sans-serif", "Arial", "仿宋", "黑体", "Verdana", "Times New Roman", "Garamond", "Georgia", "Courier New", "cursive"];

  const setTextContent = () => {
    const indexArray = index.split("-");
    let newBlockList = blockList;
    newBlockList[indexArray[0]].config.data[indexArray[1]].data[indexArray[2]].config.text = textBlock.current.innerHTML;
    setBlockList(newBlockList);
  };

  const addLink = () => {
    const { range, value, rangeIsLink } = inputConfig;
    if (rangeIsLink) {
      range.commonAncestorContainer.parentNode.href = value;
    } else {
      let link = document.createElement("a");
      link.href = value;
      // 给选中文本添加<link>标签
      range.surroundContents(link);
    }

    // 给选中文本添加<link>标签

    closeModal();
  };

  const renderSelect = (selectList, defaultValue, type, onChange) => {
    const hideOptions = () => {
      const options = document.querySelector(`#richText-options-${type}-${index}`);
      const mask = document.querySelector(`#richText-mask-${type}-${index}`);
      options.style.animation = "leave 0.2s linear";
      setTimeout(() => {
        options.style.display = "none";
        mask.style.display = "none";
      }, 100);
    };

    const showOptions = () => {
      const options = document.querySelector(`#richText-options-${type}-${index}`);
      const mask = document.querySelector(`#richText-mask-${type}-${index}`);
      options.style.display = "block";
      mask.style.display = "block";
      options.style.animation = "move 0.2s linear";
    };
    return (
      <div className="richText-select">
        <div
          className="richText-select-select"
          onClick={(event) => {
            event.stopPropagation();
            const options = document.querySelector(`#richText-options-${type}-${index}`);
            if (options.style.display === "block") {
              hideOptions();
            } else {
              showOptions();
            }
          }}
        >
          <span className="richText-select-value" id={`richText-select-value-${type}-${index}`}>
            {defaultValue}
          </span>
          <FontAwesomeIcon icon={faAngleDown} className="ml-2" />
        </div>
        <div className="fixed w-screen hidden h-screen top-0 left-0 z-[1070]" id={`richText-mask-${type}-${index}`} onClick={hideOptions}></div>
        <div className="richText-select-option z-[1071]" id={`richText-options-${type}-${index}`}>
          {selectList.map((item) => {
            return (
              <div
                className="richText-select-option_item"
                key={item}
                onClick={() => {
                  const currentValueDom = document.querySelector(`#richText-select-value-${type}-${index}`);
                  currentValueDom.innerHTML = item;
                  hideOptions();
                  onChange && onChange(item);
                  setTextContent();
                }}
              >
                {item}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const editFontSize = (item) => {
    document.execCommand("fontSize", 0, "7");
    var fontElements = document.getElementsByTagName("font");
    for (var idx = 0, len = fontElements.length; idx < len; ++idx) {
      if (fontElements[idx].size === "7") {
        fontElements[idx].removeAttribute("size");
        fontElements[idx].style.fontSize = item;
      }
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setInputConfig({ value: "", range: null });
  };

  const editFontName = (item) => {
    modifyText("fontName", false, item);
  };

  return (
    <>
      <div
        ref={richTextRef}
        className="rich-text-tools"
        style={{ width: isHidden ? "auto" : "375px" }}
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
        }}
      >
        <div className="rich-text-tools-body items-center">
          {!isHidden && (
            <>
              {renderSelect(fontSizeList, styles.fontSize + "px", "fontSize", editFontSize)}
              {renderSelect(fontname_configs, styles.fontFamily, "fontName", editFontName)}
              <Popover
                zIndex={1070}
                content={
                  <div className="select-none">
                    <ChromePicker
                      color={color}
                      style={{ boxShadow: "none" }}
                      onChange={(color) => {
                        setColor(color.hex);
                        modifyText("ForeColor", false, color.hex);
                      }}
                    />
                  </div>
                }
                trigger="click"
                open={open}
                onOpenChange={handleOpenChange}
              >
                <button className="rounded-sm border p-1">
                  <div className="rounded-sm h-3 w-12" style={{ background: color }}></div>
                </button>
              </Popover>

              {fontStyleList.map((item) => {
                return (
                  <button
                    key={item.key}
                    className="rich-text-tools-button"
                    title={item.title}
                    onClick={(event) => {
                      if (item.key === "createLink") {
                        let selection = window.getSelection();
                        let range = selection.getRangeAt(0);
                        const rangeParentNode = range.commonAncestorContainer.parentNode;
                        const rangeIsLink = rangeParentNode.nodeName === "A";
                        const newInputConfig = { ...inputConfig, range };
                        if (rangeIsLink) {
                          newInputConfig.rangeIsLink = true;
                          newInputConfig.value = rangeParentNode.href.replace("https://", "");
                        }
                        setInputConfig(newInputConfig);
                        setIsModalOpen(true);
                      } else {
                        modifyText(item.key, false, null);
                      }
                      setTextContent();
                    }}
                  >
                    <FontAwesomeIcon icon={item.icon} className="rich-text-tools-button-icon" />
                  </button>
                );
              })}
            </>
          )}
          <button className="rich-text-tools-button" onClick={() => setIsHidden(!isHidden)}>
            {<FontAwesomeIcon icon={isHidden ? faExpandAlt : faCompressAlt} className="rich-text-tools-button-icon" />}
          </button>
        </div>
        <Modal title="添加超链接" open={isModalOpen} zIndex={1100} onOk={addLink} onCancel={closeModal} okText="确定" cancelText="取消">
          <Input
            addonBefore="https://"
            value={inputConfig.value.replace("https://", "")}
            onChange={(event) => setInputConfig({ ...inputConfig, value: "https://" + event.target.value })}
          />
        </Modal>
      </div>
    </>
  );
};

export default RichText;
