/* eslint-disable react/no-array-index-key */
import React, { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import moment from "moment";

import { generateMinuteBlocks, isCurrentTimeInRange } from "../helper";
import {
  TopHeader,
  HeaderSection,
  HeaderHourBlock,
  BodySection,
  BodyHourBlock,
  CurrentTimeBlock,
} from "./styles";
import { CALENDAR_DEFAULT_WIDTH } from "../../../constants";

const Weekly = ({
  appointmentsList,
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
  sideBarIsOpen,
  specializationId,
}) => {
  const { t } = useTranslation();
  const minutesLength = minutes.length;

  const [currentTime, setCurrentTime] = useState(moment().format("HH:mm"));
  const [appointments, setAppointments] = useState([]);
  const [sidebarDate, setSidebarDate] = useState(null);

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

  const dayOfWeek = moment().day();

  useEffect(() => {
    if(currentLineRef.current){
      currentLineRef.current.scrollIntoView({ behavior: "smooth", inline: "center" });
    }
  });
  
  const currentTimeLine =
    isTodaySelected && isCurrentTimeInBranchTimes ? (
      <CurrentTimeBlock
        weekly
        $top={`${timeLineTop}%`}
        dayOfWeek={dayOfWeek || 7}
        ref={currentLineRef}
      />
    ) : null;

  const handleMinBlockClick = (sidebarDataObj) => {
    setSidebarDate(sidebarDataObj.date);
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
      <TopHeader>
        <div />
        <div>
          {appointments[0]?.appointmentsByDay.map(({ date }, index) => (
            <div key={index}>{`${t(
              moment(date).format("ddd").toLowerCase(),
            )} ${moment(date).format("DD")}`}</div>
          ))}
        </div>
      </TopHeader>
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
      <BodySection wrapperMinWidth={wrapperMinWidth} className="weekly">
        {currentTimeLine}
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
              const disabledColumn =
                sideBarIsOpen &&
                moment(appointment?.date).format("ddd DD") !==
                  moment(sidebarDate).format("ddd DD");

              return (
                <div
                  key={index}
                  className={`box-body ${
                    !isProviderWorks ? "nonWorking" : ""
                  } ${disabledColumn ? "disabled-column" : ""}
                  `}
                >
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
                          date: moment(appointment?.date, "YYYY-MM-DD").format(
                            "YYYY-MM-DD",
                          ),
                        },
                        handleMinBlockClick,
                        { stepsList, blockTimesList },
                        accountServices,
                        getStepData,
                        null,
                        true,
                        true,
                        workingBlocks,
                        specializationId,
                        setSidebarDate,
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

export default React.memo(Weekly);
