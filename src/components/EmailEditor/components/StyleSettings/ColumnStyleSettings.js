import { useContext, useState } from "react";
import { GlobalContext } from "../../reducers";
import classNames from "../../utils/classNames";
import { Modal, Tabs } from "antd";
import { defaultColumnsSettings } from "../../configs/defaultColumnsSettings";
import { deepClone } from "../../utils/helpers";
import ColorPicker from "../ColorPicker";
import PaddingSettings from "./PaddingSettings";
import useStyleLayout from "../../utils/useStyleLayout";

const ColumnStyleSettings = () => {
  const { currentItem, previewMode } = useContext(GlobalContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentColumnType, setCurrentColumnType] = useState(null);
  const { findStyleItem, cardItemElement, updateItemStyles, colorChange, paddingChange } = useStyleLayout();

  const columnChange = (type) => () => {
    if (currentItem.data.children.length > defaultColumnsSettings[type].children.length) {
      setIsModalOpen(true);
      setCurrentColumnType(type);
      return;
    }
    const newColumnConfig = defaultColumnsSettings[type];
    const newData = {
      ...currentItem.data,
      ...newColumnConfig,
      children: newColumnConfig.children.map((item, index) => {
        let newItem = item;
        if (currentItem.data.children[index]) {
          newItem = { ...currentItem.data.children[index], width: item.width };
        }
        return { ...newItem };
      }),
    };
    updateItemStyles(newData);
  };

  const handleOk = () => {
    const newColumnConfig = defaultColumnsSettings[currentColumnType];
    const newData = {
      ...currentItem.data,
      ...newColumnConfig,
      children: newColumnConfig.children.map((item, index) => {
        let newItem = item;
        if (currentItem.data.children[index]) {
          newItem = { ...currentItem.data.children[index], width: item.width };
        }
        return { ...newItem };
      }),
    };
    updateItemStyles(newData);
    setIsModalOpen(false);
    setCurrentColumnType(null);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const columnList = [
    {
      key: "full",
      widths: ["100%"],
    },
    {
      key: "1-1",
      widths: ["50%", "50%"],
    },
    {
      key: "1-1-1",
      widths: ["33.33%", "33.33%", "33.33%"],
    },
    {
      key: "1-1-1-1",
      widths: ["25%", "25%", "25%", "25%"],
    },
    {
      key: "1-2",
      widths: ["33.33%", "66.66%"],
    },
    {
      key: "2-1",
      widths: ["66.66%", "33.33%"],
    },
    {
      key: "2-4-2-4",
      widths: ["16.66%", "33.33%", "16.66%", "33.33%"],
    },
    {
      key: "4-2-4-2",
      widths: ["33.33%", "16.66%", "33.33%", "16.66%"],
    },
  ];

  const changeColumnList = (key, index) => (value) => {
    const newData = deepClone(currentItem.data);
    newData.children[index].styles[previewMode][key] = value;
    updateItemStyles(newData);
  };

  const changePaddingStyle = (index) => (padding) => {
    const newData = deepClone(currentItem.data);
    newData.children[index].styles[previewMode] = {
      ...newData.children[index].styles[previewMode],
      ...padding,
    };
    updateItemStyles(newData);
  };

  const columnListElement = () => {
    return (
      <>
        <div className="right-setting-block-item-title"> 设置列布局</div>
        <div>
          {columnList.map((item, index) => {
            return (
              <div
                className={classNames(currentItem.data.type === item.key ? "column-item-active" : "column-item-un_active", "column-item")}
                key={index}
                onClick={columnChange(item.key)}
              >
                {item.widths.map((width, index) => {
                  const isLast = index === item.widths.length - 1;
                  return (
                    <span
                      key={index}
                      style={{ width }}
                      className={classNames(
                        isLast ? "" : "column-item-border-right",
                        currentItem.data.type === item.key ? "column-item-active" : "column-item-un_active",
                        "height-full"
                      )}
                    ></span>
                  );
                })}
              </div>
            );
          })}
        </div>
      </>
    );
  };

  const columnContentElement = () => {
    return (
      <>
        <div className="right-setting-block-item-title"> 列样式</div>
        <Tabs
          defaultActiveKey="1"
          animated={{
            inkBar: true,
            tabPane: true,
          }}
          items={currentItem.data.children.map((item, index) => {
            const key = index + 1;
            const backgroundColor = findStyleItem(item.styles, "backgroundColor");
            return {
              label: `列 ${key}`,
              key: key,
              children: (
                <>
                  {cardItemElement(
                    "背景颜色",
                    <ColorPicker color={backgroundColor} setColor={({ hex }) => changeColumnList("backgroundColor", index)(hex)} />
                  )}
                  <PaddingSettings
                    padding={{
                      paddingTop: findStyleItem(item.styles, "paddingTop"),
                      paddingRight: findStyleItem(item.styles, "paddingRight"),
                      paddingLeft: findStyleItem(item.styles, "paddingLeft"),
                      paddingBottom: findStyleItem(item.styles, "paddingBottom"),
                    }}
                    setPadding={changePaddingStyle(index)}
                  />
                </>
              ),
            };
          })}
        />
      </>
    );
  };

  const columnStylesElement = () => {
    const backgroundColor = findStyleItem(currentItem.data.styles, "backgroundColor");
    const contentBackground = findStyleItem(currentItem.data.styles, "contentBackground");
    return (
      <>
        <div className="right-setting-block-item-title"> 行样式</div>
        {cardItemElement("背景颜色", <ColorPicker color={backgroundColor} setColor={colorChange("backgroundColor")} />)}
        {cardItemElement("内容背景颜色", <ColorPicker color={contentBackground} setColor={colorChange("contentBackground")} />)}
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
    <>
      <div className="margin-y-30">
        {columnListElement()}
        {columnContentElement()}
        {columnStylesElement()}
      </div>
      <Modal title="删除列" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} width={400}>
        <p className="margin-y-30">
          您确定删除多余的
          {currentColumnType && (
            <span className="column-modal-context">
              {currentItem.data.children.length - defaultColumnsSettings[currentColumnType].children.length}
            </span>
          )}
          列吗？
        </p>
      </Modal>
    </>
  );
};

export default ColumnStyleSettings;
