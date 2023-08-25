import { useState, useCallback, useRef } from "react";
import { connect } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGripVertical, faTrash } from "@fortawesome/free-solid-svg-icons";
import { setBlockList } from "../../redux/reducerCollection/AuthOptions";
import { deepClone, throttle } from "../../utils/helpers";
import { Input } from "antd";
import clsx from "clsx";

const SocialSettings = (props) => {
  const { currentItem, blockList, setCurrentItem, setBlockList } = props;
  const { lists } = currentItem.data.config;
  const [sourceNode, setSourceNode] = useState(null);
  const [sourceIndex, setSourceIndex] = useState(null);
  const [isDragStart, setIsDragStart] = useState(false);
  const [dragIndex, setDragIndex] = useState(null);
  const socialLists = useRef(null);
  const socialLinkUpdate = (key, newValue) => {
    const newCurrentItem = deepClone(currentItem);
    const newBlockList = deepClone(blockList);
    newCurrentItem.data.config[key] = newValue;
    const blockIndexArray = String(currentItem.index).split("-");
    newBlockList[blockIndexArray[0]].config.data[blockIndexArray[1]].data[blockIndexArray[2]].config[key] = newValue;   
    setBlockList([...newBlockList]);
    setCurrentItem({ ...newCurrentItem });
  };

  function record(container) {
    for (let i = 0, len = container.children.length; i < len; i++) {
      const dom = container.children[i];
      const rect = dom.getBoundingClientRect();
      dom.startX = rect.left;
      dom.startY = rect.top;
    }
  }

  const dragOver = useCallback(
    throttle((event) => {
      event.preventDefault();
      const listsDom = socialLists.current;
      const children = Array.from(listsDom.childNodes);
      const overIndex = children.indexOf(event.target);
      const sourceIndex = dragIndex;
      const newSocialLists = deepClone(lists);
      if (sourceIndex === overIndex) {
        return;
      }
      [newSocialLists[overIndex], newSocialLists[sourceIndex]] = [newSocialLists[sourceIndex], newSocialLists[overIndex]];
      setDragIndex(overIndex);
      socialLinkUpdate("lists", newSocialLists);
    }, 50),
    [sourceNode, dragIndex]
  );

  function move(container) {
    for (let i = 0, len = container.children.length; i < len; i++) {
      const dom = container.children[i];
      const rect = dom.getBoundingClientRect();
      const curY = rect.top;
      dom.animate([{ transform: `translateY(${dom.startY - curY}px)` }, { transform: `translateY(0px)` }], {
        duration: 100,
      });
    }
  }

  return (
    <>
      {/* 一个按钮 */}
      <button className="w-full h-10 bg-slate-100 rounded-lg text-slate-500 text-sm flex items-center justify-center">添
加</button>
      <div
        ref={socialLists}
        onDragOver={dragOver}
        onDragStart={(event) => {
          setSourceNode(event.target);
          setSourceIndex(event.target.dataset.index);
          setIsDragStart(true);
          setDragIndex(event.target.dataset.index);
        }}
        onDragEnd={() => {
          sourceNode.childNodes[0].classList.remove("border", "opacity-40", "border-dashed", "border-black");
          setSourceNode(null);
          setIsDragStart(false);
          setDragIndex(null);
        }}
      >
        {lists.map((item, index) => {
          const { image, title, link } = item;
          return (
            <div
              key={index}
              data-index={index}
              draggable
              className={clsx("pb-4 relative", {
                "after:absolute after:top-0 after:left-0 after:right-0 after:bottom-0 after:z-40 py-4": isDragStart,    
                "border opacity-40 border-dashed border-black": dragIndex === index,
              })}
            >
              <div className="shadow-[0_2px_4px_rgba(45,100,188,0.2)] hover:shadow-[0_3px_12px_0_rgba(45,100,188,0.2)] p-4 rounded-xl select-none">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <img src={image} alt={title} className="w-9 mr-2" />
                    <div>{title}</div>
                  </div>
                  <div className="flex items-center">
                    <div
                      className="p-2 rounded-full mr-2 cursor-pointer hover:bg-slate-100 w-10 h-10 flex justify-center items-center z-10"
                      onClick={() => {
                        socialLinkUpdate(
                          "lists",
                          lists.filter((item, idx) => idx !== index)
                        );
                      }}
                    >
                      <FontAwesomeIcon icon={faTrash} className="text-[#66788a] text-lg" />
                    </div>
                    <div className="p-2 rounded-full mr-2 cursor-grab focus-within:cursor-grabbing hover:bg-slate-100 w-10 h-10 flex justify-center items-center">
                      <FontAwesomeIcon icon={faGripVertical} className="text-[#66788a] text-lg" />
                    </div>
                  </div>
                </div>
                <div className="mt-4 z-10 relative">
                  <Input
                    addonBefore="https://"
                    value={link}
                    onInput={(value) =>
                      socialLinkUpdate(
                        "lists",
                        lists.map((item, idx) => {
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
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  blockList: state.AuthOptions.blockList,
});

const mapDispatchToProps = (dispatch) => ({
  setBlockList: (blockList, action) => dispatch(setBlockList(blockList, action)),
});
export default connect(mapStateToProps, mapDispatchToProps)(SocialSettings);