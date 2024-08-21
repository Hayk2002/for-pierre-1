import { memo, useMemo, useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";

import { selectActiveCompany, selectCalendarLoading } from "store/selectors";
import CircleLoader from "shared/components/circleLoader";
import { generateDates } from "./helper";
import Resources from "./horizontal/resources";
import AllUserAppointments from "./horizontal/allUsersAppointments";
import UserAppointments from "./vertical/dayAppointments";
import Weekly from "./vertical/weeklyAppointments";
import { StyledWrapper } from "./styles";
import { getAppointmentById } from "../../actions";
import { CALENDAR_DEFAULT_WIDTH } from "../../constants";

const MINUTE_STEP = 5;

const Calendar = ({
  resourcesCalendarView,
  appointments,
  selectedBranch,
  currentDate,
  setSideBarStyles,
  setType,
  accountId,
  timeInterval,
  setSidebarData,
  maximizeSideBar,
  sideBarIsOpen,
  specializationId,
  type,
  setIsAddingStep,
  askToClearSidebarData,
  setIsAdvancedSearchApplied,
}) => {
  const dispatch = useDispatch();
  const company = useSelector(selectActiveCompany);
  const isFetching = useSelector(selectCalendarLoading);

  const [minBlockWidth, setMinBlockWidth] = useState(0);
  const [wrapperMinWidth, setWrapperMinWidth] = useState(0);

  const currentLineRef = useRef(null);

  const getStepData = (e, id) => {
    e.stopPropagation();
    dispatch(
      getAppointmentById(id, () => {
        setType("edit");
        setSideBarStyles((prev) => ({
          ...prev,
          isOpen: true,
          width: 100 - CALENDAR_DEFAULT_WIDTH,
        }));
        maximizeSideBar();
      }),
    );
  };
  const isTodaySelected = useMemo(
    () =>
      moment(currentDate, "YYYY-MM-DD").format("YYYY-MM-DD") ===
      moment().format("YYYY-MM-DD"),
    [currentDate],
  );

  const isPast = useMemo(
    () =>
      moment(currentDate, "YYYY-MM-DD").format("YYYY-MM-DD") <
      moment().format("YYYY-MM-DD"),
    [currentDate],
  );

  const { hours: headerHours, minutes } = useMemo(
    () =>
      generateDates(
        selectedBranch.timelineStart,
        selectedBranch.timelineEnd,
        MINUTE_STEP,
      ),
    [selectedBranch.timelineEnd, selectedBranch.timelineStart],
  );

  useEffect(() => {
    let minuteBlocksCount = 0;
    minutes.forEach((min) => {
      minuteBlocksCount += min.length;
    });
    setMinBlockWidth(100 / minuteBlocksCount);
    setWrapperMinWidth(7 * minuteBlocksCount + 222);
  }, [minutes]);

  let CalendarType = AllUserAppointments;

  if (resourcesCalendarView) {
    CalendarType = Resources;
  } else if (accountId || company?.accountTypeId === 4) {
    if (timeInterval === "week") {
      CalendarType = Weekly;
    } else {
      CalendarType = UserAppointments;
    }
  }

  const calendarProps = {
    setIsAdvancedSearchApplied,
    appointmentsList: appointments,
    currentDate,
    wrapperMinWidth,
    headerHours,
    minutes,
    minBlockWidth,
    getStepData,
    setSidebarData,
    setSideBarStyles,
    setType,
    isTodaySelected,
    isPast,
    maximizeSideBar,
    selectedBranch,
    currentLineRef,
    sideBarIsOpen,
    specializationId:
      CalendarType === UserAppointments || CalendarType === Weekly
        ? "allSpecializations"
        : specializationId,
    type,
    setIsAddingStep,
    askToClearSidebarData,
  };

  return isFetching ? (
    <CircleLoader />
  ) : (
    <StyledWrapper
      minBlockWidth={minBlockWidth}
      wrapperMinWidth={wrapperMinWidth}
      id="timeline"
    >
      {appointments.length > 0 && <CalendarType {...calendarProps} />}
    </StyledWrapper>
  );
};

export default memo(Calendar);
