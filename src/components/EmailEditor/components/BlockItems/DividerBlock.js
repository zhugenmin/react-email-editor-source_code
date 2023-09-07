import { useContext } from "react";
import { GlobalContext } from "../../reducers";

const DividerBlock = ({ blockItem }) => {
  const { previewMode } = useContext(GlobalContext);
  const styles = previewMode === "desktop" ? blockItem.styles.desktop : { ...blockItem.styles.desktop, ...blockItem.styles.mobile };
  const contentStyles =
    previewMode === "desktop" ? blockItem.contentStyles?.desktop : { ...blockItem.contentStyles?.desktop, ...blockItem.contentStyles?.mobile };

  return (
    <div className="relative">
      <div style={{ ...contentStyles }}>
        <div style={{ ...styles }}></div>
      </div>
    </div>
  );
};

export default DividerBlock;
