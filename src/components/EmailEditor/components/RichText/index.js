import { useEffect, useRef, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faExpandAlt, faCompressAlt } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { GlobalContext } from "../../reducers";
import { deepClone } from "../../utils/helpers";
import { motion } from "framer-motion";

import Bold from "./Bold";
import Italic from "./Italic";
import Underline from "./Underline";
import Strikethrough from "./Strikethrough";
import InsertOrderedList from "./InsertOrderedList";
import InsertUnorderedList from "./InsertUnorderedList";
import Link from "./Link";
import TextAlign from "./TextAlign";
import FontColor from "./FontColor";

const RichText = ({ index, textBlock, styles }) => {
  const { blockList, setBlockList, currentItem, setCurrentItem } = useContext(GlobalContext);
  const richTextRef = useRef(null);
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    if (richTextRef.current) {
      var viewportOffset = richTextRef.current.parentNode?.getBoundingClientRect();
      const preview = document.querySelector("#preview");
      const previewOffset = preview.getBoundingClientRect();
      if (viewportOffset.top - 190 < 0) {
        richTextRef.current.style.bottom = "auto";
        richTextRef.current.style.top = "110%";
      } else {
        richTextRef.current.style.bottom = "110%";
        richTextRef.current.style.top = "auto";
      }
      if (viewportOffset.left + 375 > previewOffset.left + previewOffset.width) {
        richTextRef.current.style.left = "auto";
        richTextRef.current.style.right = "0";
      } else {
        richTextRef.current.style.left = "0";
        richTextRef.current.style.right = "auto";
      }
    }
  }, []);

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
    let newBlockList = deepClone(blockList);
    let newCurrentItem = deepClone(currentItem);
    newCurrentItem.data.text = textBlock.current.innerHTML;
    newBlockList[indexArray[0]].children[indexArray[1]].children[indexArray[2]].text = textBlock.current.innerHTML;
    setCurrentItem({ ...newCurrentItem });
    setBlockList(newBlockList);
  };

  const selectElement = (selectList, defaultValue, type, onChange) => {
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
          <FontAwesomeIcon icon={faAngleDown} className="richText-select-icon" />
        </div>
        <div className="richText-mask" id={`richText-mask-${type}-${index}`} onClick={hideOptions}></div>
        <div className="richText-select-option" id={`richText-options-${type}-${index}`}>
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

  const editFontName = (item) => {
    modifyText("fontName", false, item);
  };

  return (
    <div
      className="rich-text"
      ref={richTextRef}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
      }}
    >
      <motion.div
        className="rich-text-tools"
        initial={{ scale: 0, x: 0 }}
        animate={{ scale: 1, x: 0 }}
        style={{ width: isHidden ? "auto" : "375px" }}
      >
        <div className="rich-text-tools-body items-center">
          {!isHidden && (
            <>
              {selectElement(fontSizeList, styles.fontSize + "px", "fontSize", editFontSize)}
              {selectElement(fontname_configs, styles.fontFamily, "fontName", editFontName)}
              {/* 字体颜色 */}
              <FontColor modifyText={modifyText} setTextContent={setTextContent} />
              {/* 粗体 */}
              <Bold modifyText={modifyText} setTextContent={setTextContent} />
              {/* 斜体 */}
              <Italic modifyText={modifyText} setTextContent={setTextContent} />
              {/* 下划线 */}
              <Underline modifyText={modifyText} setTextContent={setTextContent} />
              {/* 删除线 */}
              <Strikethrough modifyText={modifyText} setTextContent={setTextContent} />
              {/* 有序列表 */}
              <InsertOrderedList modifyText={modifyText} setTextContent={setTextContent} />
              {/* 无序列表 */}
              <InsertUnorderedList modifyText={modifyText} setTextContent={setTextContent} />
              {/* 超链接 */}
              <Link modifyText={modifyText} setTextContent={setTextContent} />
              {/* text align */}
              <TextAlign modifyText={modifyText} setTextContent={setTextContent} />
            </>
          )}
          <button className="rich-text-tools-button" onClick={() => setIsHidden(!isHidden)}>
            {<FontAwesomeIcon icon={isHidden ? faExpandAlt : faCompressAlt} className="rich-text-tools-button-icon" />}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default RichText;
