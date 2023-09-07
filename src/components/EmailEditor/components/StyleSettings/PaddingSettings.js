import { InputNumber } from "antd";

const PaddingSettings = ({ padding, setPadding }) => {
  const paddingChange = (key) => (value) => {
    const newPadding = { ...padding, [key]: value };
    setPadding(newPadding);
  };
  return (
    <div className="my-4 grid grid-cols-2 gap-8">
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
            <InputNumber className="w-full" addonAfter="px" min={0} value={style} onChange={paddingChange(value)} />
          </div>
        );
      })}
    </div>
  );
};

export default PaddingSettings;
