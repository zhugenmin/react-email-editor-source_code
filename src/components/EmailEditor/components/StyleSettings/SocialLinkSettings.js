import { useContext, useCallback, useRef, useState } from "react";
import { GlobalContext } from "../../reducers";
import classNames from "../../utils/classNames";
import { Input, InputNumber } from "antd";
import { throttle, deepClone } from "../../utils/helpers";
import PaddingSettings from "./PaddingSettings";
import useLayout from "../../utils/useStyleLayout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPen, faTimes, faAlignCenter, faAlignLeft, faAlignRight, faAlignJustify } from "@fortawesome/free-solid-svg-icons";
import useTranslation from "../../translation";

const SocialLinkSettings = () => {
  const { currentItem, previewMode } = useContext(GlobalContext);
  const { t } = useTranslation();
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
        <div className="right-setting-block-item-title"> {t("padding_settings")}</div>
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
        <div className="right-setting-block-item-title"> {t("social_link_settings")}</div>
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
        {cardItemElement(
          t("social_link_size"),
          <InputNumber min={0} className="input-width" addonAfter="px" value={width} onChange={imageWidthChange} />
        )}
        <div className="card-item-title margin-top-18">{t("social_links")}</div>
        <div
          ref={socialLists}
          onDragOver={dragOver}
          className="margin-top-12"
          onDragStart={(event) => {
            setSourceNode(event.target);
            setIsDragStart(true);
            setDragIndex(event.target.dataset.index);
            setCurrentEditIndex(null);
          }}
          onDragEnd={() => {
            sourceNode.childNodes[0].classList.remove("social-link-item-current");
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
                  "social-link-item",
                  currentEditIndex === index ? "cursor-default" : "cursor-grab",
                  isDragStart && "social-link-item-drag_start",
                  dragIndex === index ? "social-link-item-current" : "border-transparent"
                )}
              >
                <div className="social-link-item-content">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <img src={image} alt={title} className="social-link-item-img" />
                      <div className="font-semibold">{title}</div>
                    </div>
                    <div className="flex items-center">
                      {currentEditIndex !== index && (
                        <div className="social-link-item-icon social-link-item-icon-slate" onClick={() => setCurrentEditIndex(index)}>
                          <FontAwesomeIcon icon={faPen} className="social-link-item-icon-svg social-link-item-icon-svg-deep" />
                        </div>
                      )}
                      {currentEditIndex === index && (
                        <div className="social-link-item-icon social-link-item-icon-red" onClick={() => setCurrentEditIndex(null)}>
                          <FontAwesomeIcon icon={faTimes} className="social-link-item-icon-svg social-link-item-icon-svg-red" />
                        </div>
                      )}
                      <div
                        className="social-link-item-icon social-link-item-icon-slate"
                        onClick={() => {
                          updateSocialSettings(
                            "list",
                            list.filter((item, idx) => idx !== index)
                          );
                        }}
                      >
                        <FontAwesomeIcon icon={faTrash} className="social-link-item-icon-svg social-link-item-icon-svg-deep" />
                      </div>
                    </div>
                  </div>
                  {currentEditIndex === index && (
                    <div className="margin-top-12 relative">
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
            );
          })}
        </div>
        <div className="card-item-title margin-top-18">{t("add_social_link")}</div>
        <div className="social-link-add margin-top-12">
          {socialList.map((item, index) => {
            const { image, title } = item;
            return (
              <img
                src={image}
                key={index}
                alt={title}
                className="social-link-add-img"
                onClick={() => updateSocialSettings("list", list.concat(item))}
              />
            );
          })}
        </div>
        <div className="card-item-title margin-top-18"> {t("spacing")}</div>
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
    <div className="margin-y-30">
      {socialLinkLayoutElement()}
      {PaddingStylesElement()}
    </div>
  );
};

export default SocialLinkSettings;
