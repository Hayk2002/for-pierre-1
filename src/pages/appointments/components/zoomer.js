import { Select } from "antd";

import { zoomHandler } from "utils/helpers";
import { ZoomIcon } from "assets/images";
import { ZoomerBox } from "../styles";

const { Option } = Select;

const Zoomer = ({ sideBarStyles, CALENDAR_DEFAULT_WIDTH }) => (
  <ZoomerBox
    $right={
      sideBarStyles.isOpen && sideBarStyles.visibility !== "hidden"
        ? `${100 - CALENDAR_DEFAULT_WIDTH}%`
        : "4%"
    }
  >
    <Select defaultValue="100" prefix={<ZoomIcon />} onChange={zoomHandler}>
      <Option value="300">300%</Option>
      <Option value="200">200%</Option>
      <Option value="125">125%</Option>
      <Option value="100">100%</Option>
    </Select>
  </ZoomerBox>
);

export default Zoomer;
