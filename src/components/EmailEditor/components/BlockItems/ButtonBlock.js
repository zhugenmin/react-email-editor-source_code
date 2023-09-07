import { useContext } from "react";
import { GlobalContext } from "../../reducers";
import RichTextLayout from "../RichText/RichTextLayout";
import { useMemo } from "react";

const ButtonBlock = (props) => {
  const { blockItem, index } = props;
  const { currentItem, previewMode, actionType } = useContext(GlobalContext);

  //TODO: border radius未制作
  const isEdit = currentItem && currentItem.index === index;
  const styles = previewMode === "desktop" ? blockItem.styles.desktop : { ...blockItem.styles.desktop, ...blockItem.styles.mobile };

  const contentStyles =
    previewMode === "desktop" ? blockItem.contentStyles?.desktop : { ...blockItem.contentStyles?.desktop, ...blockItem.contentStyles?.mobile };

  const richTextElement = useMemo(() => <RichTextLayout {...props} />, [isEdit, actionType]);
  return (
    <div style={{ ...contentStyles }}>
      {isEdit ? richTextElement : <div style={{ ...styles }} dangerouslySetInnerHTML={{ __html: blockItem.text }}></div>}
    </div>
  );
};

export default ButtonBlock;
