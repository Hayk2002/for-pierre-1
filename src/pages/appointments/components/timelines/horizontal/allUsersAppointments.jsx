/* eslint-disable react/no-array-index-key */
import { useDispatch } from "react-redux";
import { useState, useEffect, useMemo, memo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { useTranslation } from "react-i18next";

import { Avatar } from "assets/images";
import {
  generateMinuteBlocks,
  isCurrentTimeInRange,
  handleCalendarSearch,
} from "../helper";
import { ProfileBox } from "../styles";
import { CALENDAR_DEFAULT_WIDTH } from "../../../constants";
import {
  HeaderSection,
  BodySection,
  StyledSearch,
  HeaderHourBlock,
  BodyHourBlock,
  StyledProfileBox,
  CurrentTimeBlock,
} from "./styles";

const AllUserAppointments = ({
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
  type,
  setIsAddingStep,
  askToClearSidebarData,
  setIsAdvancedSearchApplied,
}) => {
  const ref = useRef();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [currentTime, setCurrentTime] = useState(moment().format("HH:mm"));

  useEffect(() => {
    setAppointments(appointmentsList);
    if (ref.current.length) {
      handleCalendarSearch(
        appointmentsList,
        ref.current,
        "users",
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
      <CurrentTimeBlock
        $height={appointments.length * 55}
        $left={`${timeLineLeft}%`}
        ref={currentLineRef}
      />
    ) : null;

  const handleMinBlockClick = (sidebarDataObj) => {
    if (type === "edit") {
      setIsAddingStep(true);
    }
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
                "users",
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
                  <p />
                </>
              ) : null}
            </HeaderHourBlock>
          ))}
        </div>
      </HeaderSection>
      <BodySection wrapperMinWidth={wrapperMinWidth}>
        {appointments.map(
          ({ accountId, accountServices, appointmentsByDay, userProfile }) => (
            <div key={accountId} className="appointment-row">
              <StyledProfileBox
                onClick={() =>
                  askToClearSidebarData(() => {
                    navigate(`/appointments/${accountId}`);
                    setIsAdvancedSearchApplied(false);
                  })
                }
              >
                <ProfileBox>
                  <img src={userProfile.photoUrl || Avatar} alt="Profile" />
                  <div>
                    <h3>
                      {userProfile.firstName} {userProfile.lastName}
                    </h3>
                    <span>{userProfile.title}</span>
                  </div>
                </ProfileBox>
              </StyledProfileBox>
              {appointmentsByDay.map((appointment, index) => {
                const stepsList = {};
                appointment.appointmentsSteps.forEach((step) => {
                  stepsList[
                    moment(step.startTime, "HH:mm:ss").format("HH-mm")
                  ] = step;
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
                    {minutes.map((hourMins) => (
                      <BodyHourBlock
                        $width={hourMins.length * minBlockWidth}
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
                          {
                            stepsList,
                            blockTimesList,
                          },
                          accountServices,
                          getStepData,
                          undefined,
                          undefined,
                          undefined,
                          workingBlocks,
                          specializationId,
                        )}
                      </BodyHourBlock>
                    ))}
                  </div>
                );
              })}
            </div>
          ),
        )}
      </BodySection>
    </>
  );
};

export default memo(AllUserAppointments);
