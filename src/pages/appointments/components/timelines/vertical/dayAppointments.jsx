/* eslint-disable react/no-array-index-key */
import React, { useState, useEffect, useMemo } from "react";
import moment from "moment";
import { useTranslation } from "react-i18next";

import { generateMinuteBlocks, isCurrentTimeInRange } from "../helper";
import {
  HeaderSection,
  HeaderHourBlock,
  BodySection,
  BodyHourBlock,
  CurrentTimeBlock,
} from "./styles";
import { CALENDAR_DEFAULT_WIDTH } from "../../../constants";

const UserAppointments = ({
  appointmentsList,
  currentDate,
  setSideBarStyles,
  setType,
  setSidebarData,
  minBlockWidth,
  wrapperMinWidth,
  headerHours,
  minutes,
  isTodaySelected,
  isPast,
  getStepData,
  maximizeSideBar,
  selectedBranch,
  currentLineRef,
  specializationId,
}) => {
  const { t } = useTranslation();
  const minutesLength = minutes.length;

  const [currentTime, setCurrentTime] = useState(moment().format("HH:mm"));
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    setAppointments(appointmentsList);
    return () => {
      setAppointments([]);
    };
  }, [appointmentsList]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(moment().format("HH:mm"));
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const isCurrentTimeInBranchTimes = useMemo(
    () =>
      isTodaySelected
        ? isCurrentTimeInRange(
            currentTime,
            selectedBranch.timelineStart,
            selectedBranch.timelineEnd,
          )
        : false,
    [
      isTodaySelected,
      currentTime,
      selectedBranch.timelineStart,
      selectedBranch.timelineEnd,
    ],
  );

  const timeLineTop = useMemo(() => {
    let left = 0;
    const index = headerHours.indexOf(
      `${moment(currentTime, "HH:mm").format("HH")}:00`,
    );

    for (let i = 0; i < index; i += 1) {
      if (minutes[i]) {
        left += minutes[i].length * minBlockWidth;
      }
    }
    return (
      left + (+moment(currentTime, "HH:mm").format("mm") / 5) * minBlockWidth
    );
  }, [currentTime, minutes, headerHours, minBlockWidth]);

  useEffect(() => {
    if (currentLineRef.current) {
      currentLineRef.current.scrollIntoView({
        behavior: "smooth",
        inline: "center",
      });
    }
  });

  const currentTimeLine =
    isTodaySelected && isCurrentTimeInBranchTimes ? (
      <CurrentTimeBlock $top={`${timeLineTop}%`} ref={currentLineRef} />
    ) : null;

  const handleMinBlockClick = (sidebarDataObj) => {
    setSidebarData(sidebarDataObj);
    setSideBarStyles((prev) => ({
      ...prev,
      isOpen: true,
      width: 100 - CALENDAR_DEFAULT_WIDTH,
    }));
    maximizeSideBar();
    setType("create");
  };

  return (
    <>
      <HeaderSection>
        {headerHours.map((hour, index) => (
          <HeaderHourBlock
            key={index}
            id={`hour_${moment(hour, "HH:mm").format("HH_mm")}`}
            $height={minBlockWidth}
          >
            {minutes[index]?.map((minute, key) => {
              const time = moment(minute, "HH:mm").format("HH:mm");
              return (
                <div key={key}>
                  {(time === `${moment(hour, "HH:mm").format("HH")}:00` ||
                    (index !== minutesLength - 1 &&
                      time === `${moment(hour, "HH:mm").format("HH")}:30`)) && (
                    <span>{(index || (!index && key > 0)) && time}</span>
                  )}
                </div>
              );
            })}
          </HeaderHourBlock>
        ))}
      </HeaderSection>
      <BodySection wrapperMinWidth={wrapperMinWidth}>
        {appointments.map(
          ({ accountId, accountServices, appointmentsByDay, userProfile }) =>
            appointmentsByDay.map((appointment, index) => {
              const stepsList = {};
              appointment.appointmentsSteps.forEach((step) => {
                stepsList[moment(step.startTime, "HH:mm:ss").format("HH-mm")] =
                  step;
              });

              const blockTimesList = {};
              appointment.accountTimeBlocks.forEach((block) => {
                if (!block.blockType.isWorking) {
                  blockTimesList[
                    moment(block.startTime, "HH:mm:ss").format("HH-mm")
                  ] = block;
                }
              });

              const isProviderWorks = appointment.accountTimeBlocks.length;
              const workingBlocks = isProviderWorks
                ? appointment.accountTimeBlocks.filter(
                    ({ blockType }) => blockType.isWorking,
                  )
                : [];

              return (
                <div
                  key={index}
                  className={`blocks-box ${
                    !isProviderWorks ? "nonWorking" : ""
                  }`}
                >
                  {currentTimeLine}
                  {minutes.map((hourMins) => (
                    <BodyHourBlock
                      $height={hourMins.length * minBlockWidth}
                      key={`${accountId}_${hourMins}`}
                    >
                      {generateMinuteBlocks(
                        t,
                        accountId,
                        isTodaySelected,
                        isPast,
                        hourMins,
                        {
                          services: accountServices,
                          userProfile,
                          date: currentDate,
                        },
                        handleMinBlockClick,
                        { stepsList, blockTimesList },
                        accountServices,
                        getStepData,
                        null,
                        true,
                        undefined,
                        workingBlocks,
                        specializationId,
                      )}
                    </BodyHourBlock>
                  ))}
                </div>
              );
            }),
        )}
      </BodySection>
    </>
  );
};

export default React.memo(UserAppointments);
