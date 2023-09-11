import { InputNumber } from "antd";

const PaddingSettings = ({ padding, setPadding }) => {
  const paddingChange = (key) => (value) => {
    const newPadding = { ...padding, [key]: value };
    setPadding(newPadding);
  };
  return (
    <div className="padding-settings">
      {[
        { name: "上", value: "paddingTop" },
        { name: "右", value: "paddingRight" },
        { name: "左", value: "paddingLeft" },
        { name: "下", value: "paddingBottom" },
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
