import { CustomTimelineContent, CustomTimelineItem } from "./styles";

const CustomTimeline = ({ timeline }) => (
  <CustomTimelineContent>
    {timeline?.map(({ intervalText }) => (
      <CustomTimelineItem key={intervalText}>{intervalText}</CustomTimelineItem>
    ))}
  </CustomTimelineContent>
);

export default CustomTimeline;
