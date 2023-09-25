import { InputNumber } from "antd";
import useTranslation from "../../translation";

const PaddingSettings = ({ padding, setPadding }) => {
  const { t } = useTranslation();
  const paddingChange = (key) => (value) => {
    const newPadding = { ...padding, [key]: value };
    setPadding(newPadding);
  };
  return (
    <div className="padding-settings">
      {[
        { name: t("top"), value: "paddingTop" },
        { name: t("right"), value: "paddingRight" },
        { name: t("left"), value: "paddingLeft" },
        { name: t("bottom"), value: "paddingBottom" },
      ].map(({ name, value }) => {
        const style = padding[value];
        return (
          <div key={value}>
            <div>{name}</div>
            <InputNumber className="width-full" addonAfter="px" min={0} value={style} onChange={paddingChange(value)} />
          </div>
        );
      })}
    </div>
  );
};

export default PaddingSettings;
