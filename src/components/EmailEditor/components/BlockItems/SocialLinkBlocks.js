import { useContext } from "react";
import { GlobalContext } from "../../reducers";

const SocialLinkBlocks = ({ blockItem }) => {
  const { previewMode } = useContext(GlobalContext);
  const { list, imageWidth } = blockItem;
  const styles = previewMode === "desktop" ? blockItem.styles.desktop : { ...blockItem.styles.desktop, ...blockItem.styles.mobile };
  const contentStyles =
    previewMode === "desktop" ? blockItem.contentStyles?.desktop : { ...blockItem.contentStyles?.desktop, ...blockItem.contentStyles?.mobile };
  return (
    <div className="relative">
      <div style={contentStyles}>
        {list.map((socialLinkItem, index) => {
          const { image, title } = socialLinkItem;
          return (
            <div key={index} style={{ ...styles, display: "inline-block" }}>
              <img src={image} alt={title} style={{ width: imageWidth }} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SocialLinkBlocks;
