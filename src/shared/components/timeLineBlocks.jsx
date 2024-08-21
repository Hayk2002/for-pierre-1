import { generateTimelineIntervals } from "utils/helpers";
import CustomTimeline from "./customTimeline";
import { DeleteIcon, EditIcon } from "../../assets/images";

const TimeLineBlocks = ({
  disable,
  addBlock,
  deleteBlock,
  editBlockType,
  blockTimeView,
}) => (
  <div className="time-line-block-container">
    {blockTimeView?.map((item, idx) => {
      const { startTime, endTime, name, blockTypeName, description } = item;
      const templateTimeline = generateTimelineIntervals(startTime, endTime);
      const calc = parseInt(endTime, 10) - parseInt(startTime, 10) || 1;

      return (
        <div
          key={item.id}
          className={`${
            name === "Nonworking" || blockTypeName === "Nonworking"
              ? "non-working-border"
              : ""
          } item-block`}
          style={{ width: `${calc / 0.1}%` }}
        >
          <CustomTimeline timeline={templateTimeline} />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              margin: "8px 12px",
              height: "auto",
            }}
          >
            {description ? (
              <p>{description}</p>
            ) : (
              <h3>{name || blockTypeName}</h3>
            )}
          </div>

          <div style={{ display: "flex", marginTop: "4px" }}>
            <EditIcon onClick={() => editBlockType(item, idx)} />
            <DeleteIcon onClick={() => deleteBlock(idx)} />
          </div>
        </div>
      );
    })}

    <div
      className={`add-block-button ${disable ? "custom-button-disable" : ""}`}
      onClick={addBlock}
    />
  </div>
);

export default TimeLineBlocks;
