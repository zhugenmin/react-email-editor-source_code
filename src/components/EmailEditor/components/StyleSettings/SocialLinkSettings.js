import { useContext, useCallback, useRef, useState } from "react";
import { GlobalContext } from "../../reducers";
import classNames from "../../utils/classNames";
import { Input, InputNumber } from "antd";
import { throttle, deepClone } from "../../utils/helpers";
import PaddingSettings from "./PaddingSettings";
import useLayout from "../../utils/useStyleLayout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPen, faTimes, faAlignCenter, faAlignLeft, faAlignRight, faAlignJustify } from "@fortawesome/free-solid-svg-icons";

const SocialLinkSettings = () => {
  const { currentItem, previewMode } = useContext(GlobalContext);
  const { findStyleItem, paddingChange, updateItemStyles, cardItemElement } = useLayout();

  const { list } = currentItem.data;
  const [sourceNode, setSourceNode] = useState(null);
  const [isDragStart, setIsDragStart] = useState(false);
  const [dragIndex, setDragIndex] = useState(null);
  const [currentEditIndex, setCurrentEditIndex] = useState(null); // 当前编辑的索引
  const socialLists = useRef(null);

  const socialList = [
    {
      image: "https://iili.io/HMnhdkN.png",
      title: "facebook",
      linkURL: "",
    },
    {
      image: "https://iili.io/J9qW3Sj.png",
      title: "Github",
      linkURL: "",
    },
    {
      image: "https://iili.io/J9qWKHx.png",
      title: "Linkedin",
      linkURL: "",
    },
    {
      image: "https://iili.io/J9qWfAQ.png",
      title: "WeiBo",
      linkURL: "",
    },
    {
      image: "https://iili.io/J9qWqNV.png",
      title: "Instagram",
      linkURL: "",
    },
    {
      image: "https://iili.io/J9qWBDB.png",
      title: "TikTok",
      linkURL: "",
    },
    {
      image: "https://iili.io/J9qWnoP.png",
      title: "Twitter",
      linkURL: "",
    },
    {
      image: "https://iili.io/J9qWoV1.png",
      title: "Youtube",
      linkURL: "",
    },
    {
      image: "https://iili.io/J9qWxiF.png",
      title: "WeChat",
      linkURL: "",
    },
  ];

  const updateSocialSettings = (key, value) => {
    const newCurrentItem = deepClone(currentItem);
    newCurrentItem.data = {
      ...newCurrentItem.data,
      [key]: value,
    };
    updateItemStyles(newCurrentItem.data);
  };

  const dragOver = useCallback(
    throttle((event) => {
      event.preventDefault();
      const listsDom = socialLists.current;
      const children = Array.from(listsDom.childNodes);
      const overIndex = children.indexOf(event.target);

      if (overIndex === -1) return;
      const sourceIndex = dragIndex;
      const newSocialLists = deepClone(list);
      if (sourceIndex === overIndex) {
        return;
      }

      [newSocialLists[overIndex], newSocialLists[sourceIndex]] = [newSocialLists[sourceIndex], newSocialLists[overIndex]];
      setDragIndex(overIndex);
      updateSocialSettings("list", newSocialLists);
    }, 50),
    [sourceNode, dragIndex]
  );

  const move = useCallback(
    (container) => {
      for (let i = 0, len = container.children.length; i < len; i++) {
        const dom = container.children[i];
        const rect = dom.getBoundingClientRect();
        const curY = rect.top;
        dom.animate([{ transform: `translateY(${dom.startY - curY}px)` }, { transform: `translateY(0px)` }], {
          duration: 100,
        });
      }
    },
    [sourceNode, dragIndex]
  );

  const contentPaddingChange = (padding) => {
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

  const imageWidthChange = (value) => {
    const newData = deepClone(currentItem.data);
    newData.imageWidth = value;
    updateItemStyles(newData);
  };

  const PaddingStylesElement = () => {
    return (
      <>
        <div className="my-8 text-lg text-gray-700 border-y -mx-8 px-8 py-4 bg-slate-100"> 内边距设置</div>
        <PaddingSettings
          padding={{
            paddingTop: findStyleItem(currentItem.data.contentStyles, "paddingTop"),
            paddingRight: findStyleItem(currentItem.data.contentStyles, "paddingRight"),
            paddingLeft: findStyleItem(currentItem.data.contentStyles, "paddingLeft"),
            paddingBottom: findStyleItem(currentItem.data.contentStyles, "paddingBottom"),
          }}
          setPadding={contentPaddingChange}
        />
      </>
    );
  };

  const socialLinkLayoutElement = () => {
    const textAlign = findStyleItem(currentItem.data.contentStyles, "textAlign");
    const width = currentItem.data.imageWidth;
    return (
      <>
        <div className="my-8 text-lg text-gray-700 border-y -mx-8 px-8 py-4 bg-slate-100"> 社交链接设置</div>
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
                  onClick={() => updateContentTextAlign(value)}
                >
                  <FontAwesomeIcon icon={icon} className="h-10 w-10" />
                </div>
              );
            })}
          </div>
        )}
        {cardItemElement("链接大小", <InputNumber min={0} className="w-32" addonAfter="px" value={width} onChange={imageWidthChange} />)}
        <div className="text-slate-400 font-semibold mt-6">修改社交链接</div>
        <div
          ref={socialLists}
          onDragOver={dragOver}
          className="mt-4"
          onDragStart={(event) => {
            setSourceNode(event.target);
            setIsDragStart(true);
            setDragIndex(event.target.dataset.index);
            setCurrentEditIndex(null);
          }}
          onDragEnd={() => {
            sourceNode.childNodes[0].classList.remove("border", "opacity-40", "border-dashed", "border-black");
            setSourceNode(null);
            setIsDragStart(false);
            setDragIndex(null);
          }}
        >
          {list.map((item, index) => {
            const { image, title, link } = item;
            return (
              <div
                key={index}
                data-index={index}
                draggable
                className={classNames(
                  "mb-4 relative border",
                  currentEditIndex === index ? "cursor-default" : "cursor-grab",
                  isDragStart && "after:absolute after:top-0 after:left-0 after:right-0 after:bottom-0 after:z-40",
                  dragIndex === index ? "opacity-40 border-dashed border-black" : "border-transparent"
                )}
              >
                <div>
                  <div className="shadow shadow-[rgba(45,100,188,0.2)] hover:shadow-[0_3px_12px_0_rgba(45,100,188,0.2)] p-4 rounded-xl select-none">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <img src={image} alt={title} className="w-9 mr-2" />
                        <div className="font-semibold">{title}</div>
                      </div>
                      <div className="flex items-center">
                        {currentEditIndex !== index && (
                          <div
                            className="transition-all p-2 rounded-full mr-2 cursor-pointer focus-within:cursor-grabbing hover:bg-slate-100 w-10 h-10 flex justify-center items-center"
                            onClick={() => setCurrentEditIndex(index)}
                          >
                            <FontAwesomeIcon icon={faPen} className="text-[#66788a] text-lg" />
                          </div>
                        )}
                        {currentEditIndex === index && (
                          <div
                            className="transition-all p-2 rounded-full mr-2 cursor-pointer focus-within:cursor-grabbing hover:bg-red-100 w-10 h-10 flex justify-center items-center"
                            onClick={() => setCurrentEditIndex(null)}
                          >
                            <FontAwesomeIcon icon={faTimes} className="text-red-500 text-lg" />
                          </div>
                        )}
                        <div
                          className="transition-all p-2 rounded-full mr-2 cursor-pointer hover:bg-slate-100 w-10 h-10 flex justify-center items-center z-10"
                          onClick={() => {
                            updateSocialSettings(
                              "list",
                              list.filter((item, idx) => idx !== index)
                            );
                          }}
                        >
                          <FontAwesomeIcon icon={faTrash} className="text-[#66788a] text-lg" />
                        </div>
                      </div>
                    </div>
                    {currentEditIndex === index && (
                      <div className="mt-4 z-10 relative">
                        <Input
                          addonBefore="https://"
                          value={link}
                          onInput={(value) =>
                            updateSocialSettings(
                              "list",
                              list.map((item, idx) => {
                                if (idx === index) {
                                  return { ...item, link: value.target.value };
                                } else {
                                  return item;
                                }
                              })
                            )
                          }
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="text-slate-400 font-semibold mt-6">添加社交链接</div>
        <div className="flex flex-wrap gap-4 mt-4">
          {socialList.map((item, index) => {
            const { image, title } = item;
            return (
              <img
                src={image}
                key={index}
                alt={title}
                className="w-10 rounded-full cursor-pointer"
                onClick={() => updateSocialSettings("list", list.concat(item))}
              />
            );
          })}
        </div>
        <div className="text-slate-400 font-semibold mt-6"> 间距</div>
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

  return (
    <div className="my-10">
      {socialLinkLayoutElement()}
      {PaddingStylesElement()}
    </div>
  );
};

export default SocialLinkSettings;
