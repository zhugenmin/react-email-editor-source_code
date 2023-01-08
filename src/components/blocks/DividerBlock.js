import { connect } from "react-redux";

const DividerBlock = (props) => {
  const { block, previewMode } = props;
  const styles = previewMode === "desktop" ? block.config.styles.desktop : { ...block.config.styles.desktop, ...block.config.styles.mobile };
  const contentStyles =
    previewMode === "desktop" ? block.config.contentStyles.desktop : { ...block.config.contentStyles.desktop, ...block.config.contentStyles.mobile };

  return (
    <div className="relative">
      <div style={{ ...contentStyles }}>
        <div style={{ ...styles }}></div>
      </div>
    </div>
  );
};
const mapStateToProps = (state) => ({
  previewMode: state.AuthOptions.previewMode,
});

export default connect(mapStateToProps)(DividerBlock);
