import moment from "moment";
import { Popover } from "antd";

import { ScheduleBlockBox } from "./styles";

let daysMaxCount = 365;

export const colorsList = [
  "#19BBCE",
  "#FBCD2A",
  "#F76951",
  "#2E85CE",
  "#F98820",
  "#8C57FE",
  "#14C972",
];

export const getWeekDays = (t) => [
  { abbr: "sun", value: t("sun") },
  { abbr: "mon", value: t("mon") },
  { abbr: "tue", value: t("tue") },
  { abbr: "wed", value: t("wed") },
  { abbr: "thu", value: t("thu") },
  { abbr: "fri", value: t("fri") },
  { abbr: "sat", value: t("sat") },
];

export const updateCalendar = (
  patterns,
  startDate,
  repeatCount,
  nonWorkingDays,
  callback,
) => {
  let daysCount = 0;
  const tds = document.querySelectorAll(
    ".colored-picker .ant-picker-cell-inner",
  );
  tds.forEach((td) => {
    // eslint-disable-next-line no-param-reassign
    td.style.backgroundColor = "unset";
    // eslint-disable-next-line no-param-reassign
    td.style.color = "#000";
  });

  if(nonWorkingDays.length === 7){
    daysMaxCount = 0;
  }else {
    daysMaxCount = 365
  }

  let currentTd = moment(startDate, "YYYY-MM-DD").format("YYYY-MM-DD");
  for (let i = 0; i < +repeatCount; i += 1) {
    // eslint-disable-next-line no-loop-func
    patterns.forEach((pattern, index) => {
      let daysLimit = +pattern.DaysCount;
      if(nonWorkingDays.length === 7){
        daysMaxCount += daysLimit;
      }
      for (let j = 0; j < daysLimit; j += 1) {
        if (daysCount < daysMaxCount) {
          const item = document.querySelector(
            `.colored-picker [title="${currentTd}"] .ant-picker-cell-inner`,
          );
          if (item) {
            if (
              nonWorkingDays.includes(
                +moment(currentTd, "YYYY-MM-DD").format("e"),
              )
            ) {
              item.style.backgroundColor = "#B7B9CA";
              daysLimit += 1;
            } else {
              item.style.backgroundColor = pattern.IsWorkingDay ? colorsList[index] : "#B7B9CA";
            }
          } else if (
            nonWorkingDays.includes(
              +moment(currentTd, "YYYY-MM-DD").format("e"),
            )
          ) {
            daysLimit += 1;
          }
          currentTd = moment(currentTd).add(1, "day").format("YYYY-MM-DD");
          daysCount += 1;
        }
      }
    });
  }
  if (callback && startDate) {
    callback(
      moment(startDate, "YYYY-MM-DD")
        .add(daysCount - 1, "day")
        .format("YYYY-MM-DD"),
    );
  }
};

export const renderTemplateBlockTimes = (start, blocks, stepWidth) => {
  if (blocks?.length) {
    return blocks.map((block) => {
      const blockDuration = moment(block.endTime, "HH:mm").diff(
        moment(block.startTime, "HH:mm"),
        "minutes",
      );

      const left = moment(block.startTime, "HH:mm").diff(
        moment(start, "HH:mm"),
        "minutes",
      );

      const content = (
        <div>
          <p>{block.blockTypeName || block.name}</p>
          <p>{block.description}</p>
          <p>
            {moment(block.startTime, "HH:mm:ss").format("HH:mm")} -{" "}
            {moment(block.endTime, "HH:mm:ss").format("HH:mm")}
          </p>
        </div>
      );
      return (
        <ScheduleBlockBox
          $width={(blockDuration / 5) * stepWidth}
          $left={(left / 5) * stepWidth}
          isWorking={block.blockTypeName === "Working"}
          key={block.id}
        >
          <div></div>
          <Popover content={content} trigger="hover">
            <div></div>
          </Popover>
        </ScheduleBlockBox>
      );
    });
  }
  return "";
};
