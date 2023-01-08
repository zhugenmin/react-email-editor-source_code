import { connect } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-solid-svg-icons";

const ImageBlock = (props) => {
  const { block, previewMode } = props;
  const { src } = block.config;
  const styles = previewMode === "desktop" ? block.config.styles.desktop : { ...block.config.styles.desktop, ...block.config.styles.mobile };
  const contentStyles =
    previewMode === "desktop" ? block.config.contentStyles.desktop : { ...block.config.contentStyles.desktop, ...block.config.contentStyles.mobile };
  const emptyImage = (
    <div className="empty-image" style={{ ...styles, width: styles.width === "auto" ? "100%" : styles.width }}>
      <FontAwesomeIcon icon={faImage} className="empty-image-icon" />
    </div>
  );

  return (
    <div className="relative">
      <div style={{ ...contentStyles }}>{src ? <img src={src}   style={styles} alt={block.alt} className="inline-block" /> : emptyImage}</div>
    </div>
  );
};
const mapStateToProps = (state) => ({
  previewMode: state.AuthOptions.previewMode,
});

export default connect(mapStateToProps)(ImageBlock);
