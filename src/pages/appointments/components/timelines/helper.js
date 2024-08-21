import React from "react";
import i18n from "i18next";
import moment from "moment";
import { Tooltip, Popover } from "antd";
import {
  FileIcon,
  ClockIcon,
  UserIcon,
  PhoneIcon,
  CommentIcon,
} from "assets/images/index";

import {
  InfoRow,
  StyledMinuteBlock,
  StyledStepBlock,
  StyledUserMinuteBlock,
  TicketInfo,
} from "./styles";

export const generateDates = (startHour, endHour, minuteStep) => {
  const hours = [moment(startHour, "HH:mm:ss").format("HH:mm")];
  const start = +startHour.split(":")[0];
  const endParts = endHour.split(":");
  const end = +endParts[1] ? +endParts[0] + 1 : +endParts[0];
  const minutes = {};

  for (let i = start + 1; i <= end; i += 1) {
    hours.push(`${`${i}`.length === 1 ? `0${i}` : i}:00`);
  }

  for (let j = 0; j < hours.length - 1; j += 1) {
    const hour = hours[j];
    const key = +moment(hour, "HH:mm").format("HH");
    const currentMin = +moment(hour, "HH:mm").format("mm");
    const startMinute = currentMin ? currentMin - minuteStep : 0;
    const endMinute = currentMin ? 60 - minuteStep : 60;
    let addedMinutes = 0;
    for (let i = startMinute; i < endMinute; i += minuteStep) {
      const nextMin = moment(hour, "HH:mm")
        .add(addedMinutes, "minutes")
        .format("HH:mm");

      if (!moment(nextMin, "HH:mm").isAfter(moment(endHour, "HH:mm:ss"))) {
        if (minutes[key] && !minutes[key].includes(nextMin)) {
          minutes[key].push(nextMin);
          addedMinutes += 5;
        } else { 
          minutes[key] = [nextMin];
          addedMinutes += 5;
        }
      }
    }
  }
  return { hours, minutes: Object.values(minutes) };
};

export const generateMinuteBlocks = (
  t,
  id,
  isTodaySelected,
  isPast,
  minutes,
  sidebarDataObj,
  handleMinBlockClick,
  { stepsList, blockTimesList },
  services,
  getStepData,
  resource,
  userCalendar,
  isWeekly,
  workingBlocks,
  specializationId,
  setSidebarDate,
) => {
  const blocks = minutes.map((minute, index) => {
    const minIsInWorkingRange = workingBlocks
      ? workingBlocks.find(
          (block) =>
            moment(minute, "HH:mm").isBetween(
              moment(block.startTime, "HH:mm:ss"),
              moment(block.endTime, "HH:mm:ss"),
            ) ||
            minute === moment(block.startTime, "HH:mm:ss").format("HH:mm") ||
            moment().add(5, "minutes").format("HH:mm") ===
              moment(block.endTime, "HH:mm:ss").format("HH:mm"),
        )
      : true;

    let workingSpecialization = false;
    
    if (
      specializationId !== "allSpecializations" &&
     ( minIsInWorkingRange?.specializationId &&
      specializationId !== minIsInWorkingRange.specializationId )
    ) {
      workingSpecialization = true;
    }

    const canBook =
      moment(minute, "HH:mm:ss").format("HH:mm") > moment().format("HH:mm");
    const min = +moment(minute, "HH:mm:ss").format("mm");
    const attr = moment(minute, "HH:mm:ss").format("HH-mm");
    const pastTime =
      moment(`${sidebarDataObj.date} ${minute}`, "YYYY-MM-DD HH:mm").format(
        "YYYY-MM-DD HH:mm",
      ) < moment().format("YYYY-MM-DD HH:mm");
    const BlockType = userCalendar ? StyledUserMinuteBlock : StyledMinuteBlock;
    const invalidDate = isWeekly
      ? pastTime
      : (isTodaySelected && !canBook) || isPast;

    let title = moment(minute, "HH:mm:ss").format("HH:mm");
    if (workingSpecialization || !minIsInWorkingRange) {
      title = t("nonworking");
    }
    if (invalidDate) {
      title = t("past-time-book-text");
    }

    const hasBorderedMim = [15, 30, 45].includes(min) && index;
    const borderBox =
      hasBorderedMim &&
      (stepsList[attr] || (blockTimesList && blockTimesList[attr]))
        ? "content-box"
        : "bordr-box";

    return (
      <Tooltip
        key={`${id}_${minute}`}
        placement="top"
        title={title}
        overlayStyle={{ zIndex: "301" }}
        trigger={
          !((blockTimesList && blockTimesList[attr]) || stepsList[attr])
            ? "hover"
            : " "
        }
      >
        <BlockType
          $width={100 / minutes.length}
          $borderBox={borderBox}
          $isWeekly={isWeekly}
          $disabled={
            invalidDate || workingSpecialization || !minIsInWorkingRange
          }
          className={`${hasBorderedMim ? "bordered-min" : ""}
            ${
              workingSpecialization || !minIsInWorkingRange
                ? "non-working-hour"
                : "working-hour"
            }
          `}
          id={`${attr}_${id}`}
          onClick={() =>
            invalidDate ||
            !minIsInWorkingRange ||
            workingSpecialization ||
            (blockTimesList && blockTimesList[attr])
              ? ""
              : handleMinBlockClick({ id, minute, ...sidebarDataObj })
          }
        >
          {stepsList[attr]
            ? renderAppointmentBlocks(
                id,
                stepsList[attr],
                services,
                getStepData,
                resource,
                false,
                userCalendar,
                borderBox,
                setSidebarDate,
                isWeekly,
                invalidDate,
              )
            : null}
          {blockTimesList && blockTimesList[attr]
            ? renderAppointmentBlocks(
                id,
                blockTimesList[attr],
                services,
                getStepData,
                resource,
                true,
                userCalendar,
                borderBox,
                setSidebarDate,
                isWeekly,
                invalidDate,
              )
            : null}
        </BlockType>
      </Tooltip>
    );
  });

  return blocks;
};

export const renderAppointmentBlocks = (
  accountId,
  data,
  services,
  getStepData,
  resourceData,
  block = false,
  userCalendar,
  borderBox,
  setSidebarDate,
  isWeekly,
  invalidDate,
) => {
  const start = moment(data.startTime, "HH:mm:ss");
  const end = moment(data.endTime, "HH:mm:ss");
  const $width = end.diff(start, "minutes") / 5;
  const diff =
    borderBox === "content-box"
      ? Math.floor($width / 5) * 2
      : (Math.round($width / 15) + 2) * 2;

  const pastDate = moment(data.date, "YYYY-MM-DD").isBefore(
    moment().format("YYYY-MM-DD"),
  );

  let blockHasOpacity = false;

  if (invalidDate) {
    blockHasOpacity = pastDate
      ? true
      : moment(end, "HH:mm:ss").isBefore(moment());
  }

  if (block && !data.blockType?.isWorking) {
    const blockPopoverContent = (
      <div className="color_white">
        <p>{i18n.t(`${data.blockType.name.toLowerCase()}-hours`)}</p>
        <p>{`${moment(data.startTime, "HH:mm:ss").format("HH:mm")} - ${moment(
          data.endTime,
          "HH:mm:ss",
        ).format("HH:mm")}`}</p>
      </div>
    );
    return (
      <Popover
        title={<p style={{ color: "#fff" }}>{}</p>}
        trigger="hover"
        content={blockPopoverContent}
      >
        <StyledStepBlock
          $width={$width}
          $userCalendar={userCalendar}
          className="non-working"
          diff={diff}
        />
      </Popover>
    );
  }

  const service = services.filter(({ id }) => data.serviceId === id);

  const resource = resourceData
    ? [resourceData]
    : service[0]?.resources?.filter(({ id }) => id === data.resourceId);
  const $boxBgColor = resourceData
    ? resourceData.color
    : service[0]?.color ?? null;
  const popoverContent = (
    <div className="color_white">
      {data.userDetails?.userName && (
        <InfoRow>
          <UserIcon />
          <span>{data.userDetails.userName}</span>
        </InfoRow>
      )}
      {data.userDetails?.phoneNumber && (
        <InfoRow>
          <PhoneIcon />
          <span>{data.userDetails.phoneNumber}</span>
        </InfoRow>
      )}
      {resource?.length ? (
        <InfoRow>
          <FileIcon />
          <span>{resource[0]?.name}</span>
        </InfoRow>
      ) : (
        ""
      )}
      {service.length ? (
        <InfoRow>
          <FileIcon />
          <span>{service[0]?.name}</span>
        </InfoRow>
      ) : (
        ""
      )}
      <InfoRow>
        <ClockIcon />
        <span>{`${moment(start).format("HH:mm")} - ${moment(end).format(
          "HH:mm",
        )}`}</span>
      </InfoRow>
      {data.note && (
        <InfoRow>
          <CommentIcon />
          <span>{data.note}</span>
        </InfoRow>
      )}
    </div>
  );

  return (
    <Popover
      title={
        <TicketInfo $isTimeBlock={data.serviceId === null}>
          <p>
            {data.serviceId !== null &&
              `${i18n.t("number")}: ${data.appointmentNumber}`}{" "}
          </p>
          <p>{data.pin && `Pin: ${data.pin}`} </p>
        </TicketInfo>
      }
      trigger="hover"
      content={popoverContent}
      overlayStyle={{
        maxWidth: "300px",
      }}
      overlayClassName={
        data.serviceId !== null ? "apt-hover-popover" : "tb-hover-popover"
      }
    >
      <StyledStepBlock
        $userCalendar={userCalendar}
        $boxBgColor={$boxBgColor}
        $width={$width}
        $pastStep={blockHasOpacity}
        diff={diff}
        onClick={(e) => {
          if (isWeekly) {
            setSidebarDate(data.date);
          }
          getStepData(e, data.appointmentId);
        }}
      >
        <div></div>
      </StyledStepBlock>
    </Popover>
  );
};

export const isCurrentTimeInRange = (currentTime, timelineStart, timelineEnd) =>
  moment(currentTime, "HH:mm:ss").isBetween(
    moment(timelineStart, "HH:mm:ss"),
    moment(timelineEnd, "HH:mm:ss"),
  );

export const handleCalendarSearch = (
  data,
  searchKey,
  calendarType,
  callback,
) => {
  let filteredData = [];
  if (searchKey.length) {
    if (calendarType === "users") {
      filteredData = data.filter(({ userProfile }) =>
        `${userProfile.firstName.toLowerCase()} ${userProfile.lastName.toLowerCase()}`.includes(
          searchKey.toLowerCase(),
        ),
      );
    } else {
      filteredData = data.filter(({ resource }) =>
        `${resource.name.toLowerCase()}`.includes(searchKey.toLowerCase()),
      );
    }
    callback(filteredData);
  } else {
    callback(data);
  }
};
