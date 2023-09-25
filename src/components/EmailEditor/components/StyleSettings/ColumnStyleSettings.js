import { useContext, useState } from "react";
import { GlobalContext } from "../../reducers";
import classNames from "../../utils/classNames";
import { Modal, Tabs } from "antd";

import { deepClone } from "../../utils/helpers";
import ColorPicker from "../ColorPicker";
import PaddingSettings from "./PaddingSettings";
import useStyleLayout from "../../utils/useStyleLayout";
import useDataSource from "../../configs/useDataSource";
import useTranslation from "../../translation";

const ColumnStyleSettings = () => {
  const { currentItem, previewMode } = useContext(GlobalContext);
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentColumnType, setCurrentColumnType] = useState(null);
  const { findStyleItem, cardItemElement, updateItemStyles, colorChange, paddingChange } = useStyleLayout();
  const { columnsSetting } = useDataSource();

  const columnChange = (type) => () => {
    if (currentItem.data.children.length > columnsSetting[type].children.length) {
      setIsModalOpen(true);
      setCurrentColumnType(type);
      return;
    }
    const newColumnConfig = columnsSetting[type];
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
    const newColumnConfig = columnsSetting[currentColumnType];
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
        <div className="right-setting-block-item-title"> {t("columns")}</div>
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
        <div className="right-setting-block-item-title"> {t("column_settings")}</div>
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
              label: `${t("column")} ${key}`,
              key: key,
              children: (
                <>
                  {cardItemElement(
                    t("content_background_color"),
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
        <div className="right-setting-block-item-title"> {t("column_styles")}</div>
        {cardItemElement(t("background_color"), <ColorPicker color={backgroundColor} setColor={colorChange("backgroundColor")} />)}
        {cardItemElement(t("content_background_color"), <ColorPicker color={contentBackground} setColor={colorChange("contentBackground")} />)}
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
      <Modal
        title={t("column_delete")}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        width={400}
        okText={t("confirm")}
        cancelText={t("cancel")}
      >
        <p
          className="margin-y-30"
          dangerouslySetInnerHTML={{
            __html: t("column_delete_desc", {
              count: `<span class="column-modal-context">
              ${currentColumnType ? currentItem.data.children.length - columnsSetting[currentColumnType].children.length : 0}
            </span>`,
            }),
          }}
        ></p>
      </Modal>
    </>
  );
};

export default ColumnStyleSettings;
