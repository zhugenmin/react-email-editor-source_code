import { useState } from "react";
import { Popover } from "antd";
import { ChromePicker } from "react-color";

const ColorPicker = ({ color, setColor }) => {
  const [popoverOpen, setPopoverOpen] = useState(false);

  return (
    <Popover
      zIndex={1070}
      content={
        <div className="select-none">
          <ChromePicker color={color} style={{ boxShadow: "none" }} onChange={setColor} />
        </div>
      }
      trigger="click"
      open={popoverOpen}
      onOpenChange={setPopoverOpen}
    >
      <button className="color-picker-button" style={{ background: color }}></button>
    </Popover>
  );
};

export default ColorPicker;
