import { useState } from "react";
import { Popover } from "antd";
import { ChromePicker } from "react-color";

const FontColor = ({ modifyText, setTextContent }) => {
  const [color, setColor] = useState("#000");
  const [open, setOpen] = useState(false);

  const handleOpenChange = (newOpen) => {
    setOpen(newOpen);
  };

  return (
    <Popover
      zIndex={1070}
      content={
        <div className="select-none">
          <ChromePicker
            color={color}
            style={{ boxShadow: "none" }}
            onChange={(color) => {
              setColor(color.hex);
              modifyText("ForeColor", false, color.hex);
            }}
          />
        </div>
      }
      trigger="click"
      open={open}
      onOpenChange={handleOpenChange}
    >
      <button className="rich_text-font_color">
        <div className="rich_text-font_color-content" style={{ background: color }}></div>
      </button>
    </Popover>
  );
};

export default FontColor;
