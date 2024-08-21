import { RenderEmptyContent } from "shared/components/styles";
import { EmptyIcon } from "assets/images";

const RenderEmptyView = ({ text }) => (
  <RenderEmptyContent>
    <EmptyIcon />
    <p>{text}</p>
  </RenderEmptyContent>
);

export default RenderEmptyView;
