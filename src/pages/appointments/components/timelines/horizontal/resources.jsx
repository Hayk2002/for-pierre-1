/* eslint-disable react/no-array-index-key */
import React, { useState, useEffect, useMemo, useRef } from "react";
import moment from "moment";
import { useTranslation } from "react-i18next";

import {
  generateMinuteBlocks,
  isCurrentTimeInRange,
  handleCalendarSearch,
} from "../helper";
import {
  HeaderSection,
  BodySection,
  StyledSearch,
  HeaderHourBlock,
  BodyHourBlock,
  StyledProfileBox,
  CurrentTimeBlock,
} from "./styles";
import { ProfileBox } from "../styles";
import { CALENDAR_DEFAULT_WIDTH } from "../../../constants";

const Resources = ({
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
}) => {
  const { t } = useTranslation();
  const ref = useRef();

  const [currentTime, setCurrentTime] = useState(moment().format("HH:mm"));
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    setAppointments(appointmentsList);
    if (ref.current.length) {
      handleCalendarSearch(
        appointmentsList,
        ref.current,
        "resources",
        (filteredData) => setAppointments(filteredData),
      );
    }
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

  const timeLineLeft = useMemo(() => {
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

  const currentTimeLine =
    isTodaySelected && isCurrentTimeInBranchTimes ? (
      <CurrentTimeBlock
        $height={appointments.length * 55}
        $left={`${timeLineLeft}%`}
        ref={currentLineRef}
      />
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
      <HeaderSection wrapperMinWidth={wrapperMinWidth}>
        <div className="search-box">
          <StyledSearch
            ref={ref}
            placeholder={t("search")}
            onChange={(e) => {
              handleCalendarSearch(
                appointmentsList,
                e.target.value,
                "resources",
                (filteredData) => setAppointments(filteredData),
              );
              ref.current = e.target.value;
            }}
          />
        </div>
        <div className="hours-section">
          {currentTimeLine}
          {headerHours.map((hour, index) => (
            <HeaderHourBlock
              key={index}
              id={`hour_${moment(hour, "HH:mm").format("HH_mm")}`}
              $width={
                minutes[index] ? minutes[index].length * minBlockWidth : 0
              }
              $minWidth={minutes[index] ? minutes[index].length * 7 + 2 : 0}
            >
              {index ? (
                <>
                  <span>{hour}</span>
                  <p></p>
                </>
              ) : null}
            </HeaderHourBlock>
          ))}
        </div>
      </HeaderSection>
      <BodySection wrapperMinWidth={wrapperMinWidth}>
        {appointments.map(({ appointmentsSteps, resource }) => {
          const stepsList = {};
          appointmentsSteps.forEach((step) => {
            stepsList[moment(step.startTime, "HH:mm:ss").format("HH-mm")] =
              step;
          });

          return (
            <div key={resource.id} className="appointment-row">
              <StyledProfileBox>
                <ProfileBox className="resource-box">
                  <div>
                    <h3>{resource.name}</h3>
                  </div>
                </ProfileBox>
              </StyledProfileBox>
              <div className="blocks-box">
                {minutes.map((hourMins) => (
                  <BodyHourBlock
                    $width={hourMins.length * minBlockWidth}
                    key={`${resource.id}_${hourMins}`}
                  >
                    {generateMinuteBlocks(
                      t,
                      resource.id,
                      isTodaySelected,
                      isPast,
                      hourMins,
                      {
                        resource,
                        date: currentDate,
                      },
                      handleMinBlockClick,
                      { stepsList },
                      resource.services,
                      getStepData,
                      resource,
                    )}
                  </BodyHourBlock>
                ))}
              </div>
            </div>
          );
        })}
      </BodySection>
    </>
  );
};

export default React.memo(Resources);
