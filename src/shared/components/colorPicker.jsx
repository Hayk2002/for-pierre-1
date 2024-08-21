import { useState } from "react";
import { HexColorPicker } from "react-colorful";

import { PolygonIcon } from "assets/images";
import { ColorPickerWrapper } from "./styles";

const ColorPicker = ({ handleChange, color }) => {
  const [isVisible, setIsVisible] = useState(false);

  const popover = {
    position: "absolute",
    zIndex: "2",
  };

  const cover = {
    position: "fixed",
    top: "0px",
    right: "0px",
    bottom: "0px",
    left: "0px",
  };

  return (
    <ColorPickerWrapper $bgColor={color}>
      <div>
        <div
          className="colorPicker-frame"
          onClick={() => setIsVisible(prev => !prev)}
        >
          <div className="label-for-picker" />
          <PolygonIcon />
        </div>
        {isVisible && (
          <div style={popover} className="picker-popover">
            <div style={cover} onClick={() => setIsVisible(false)} />
            <HexColorPicker color={color} onChange={handleChange} />
          </div>
        )}
      </div>
    </ColorPickerWrapper>
  );
};

export default ColorPicker;
