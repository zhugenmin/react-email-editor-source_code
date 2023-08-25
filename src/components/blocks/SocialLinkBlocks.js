import { connect } from "react-redux";

const SocialLinkBlocks = (props) => {
  const { block, previewMode } = props;
  const { lists } = block.config;
  const styles = previewMode === "desktop" ? block.config.styles.desktop : { ...block.config.styles.desktop, ...block.config.styles.mobile };
  const contentStyles =
    previewMode === "desktop" ? block.config.contentStyles.desktop : { ...block.config.contentStyles.desktop, ...block.config.contentStyles.mobile };
  return (
    <div className="relative">
      <div style={contentStyles}>
        {lists.map((socialLinkItem, index) => {
          const { image, title } = socialLinkItem;
          return (
            <div key={index} style={styles}>
              <img src={image} alt={title} />
            </div>
          );
        })}
      </div>
    </div>
  );
};
const mapStateToProps = (state) => ({
  previewMode: state.AuthOptions.previewMode,
});

export default connect(mapStateToProps)(SocialLinkBlocks);