import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import moment from "moment";
import { Tooltip } from "antd";
import { useTranslation } from "react-i18next";

import {
  selectAppointmentsList,
  selectResourceAppointmentsList,
  selectActiveCompany,
  selectUserAppointmentsHistory,
} from "store/selectors";
import {
  getSpecializationList,
  getAccountBranches,
  getBranchesList,
  resetSpecializationsList,
} from "sharedStore/actions";
import { MinifiedIcon, LeftArrow } from "assets/images";
import EmptyView from "shared/components/emptyView";
import { getCompanyStaff } from "pages/staff/actions";
import {
  getComparisonDate,
  getItemFromLocalStorage,
  setItemsToLocalStorage,
  setPageTitle,
} from "utils/helpers";
import Calendar from "./components/timelines/calendar";
import Zoomer from "./components/zoomer";
import {
  getUserAppointments,
  getResourceAppointments,
  signalRConnectionClose,
  filterUserAppointments,
  resetAdvancedSearchValues,
  resetUserAppointmentsList,
} from "./actions";
import { CALENDAR_DEFAULT_WIDTH } from "./constants";
import Header from "./components/header/header";
import SideBar from "./components/sidebar/sidebar";
import Print from "./components/print/print";
import {
  AppointmentWrapper,
  MinifiedIconBox,
  CalendarWrapper,
  SidebarWrapper,
  BackBtn,
} from "./styles";
import ConfirmationModal from "./components/header/confirmationModal";

const Appointment = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const params = useParams();
  const navigate = useNavigate();
  const sidebarRef = useRef([]);

  const company = useSelector(selectActiveCompany);
  const userAppointments = useSelector(selectAppointmentsList);
  const resourceAppointments = useSelector(selectResourceAppointmentsList);
  const userAppointmentsHistory = useSelector(selectUserAppointmentsHistory);

  const [currentDate, setCurrentDate] = useState(() =>
    moment().format("YYYY-MM-DD"),
  );

  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [nextAction, setNextAction] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [branchList, setBranchList] = useState([]);
  const [specializationId, setSpecializationId] = useState(null);
  const [resourcesCalendarView, setResourcesCalendarView] = useState(false);
  const [shouldGetResourceData, setShouldGetResourceData] = useState(false);
  const [timeInterval, setTimeInterval] = useState("day");
  const [type, setType] = useState("");
  const [sidebarData, setSidebarData] = useState({});
  const [sideBarStyles, setSideBarStyles] = useState({
    width: 0,
    visibility: "visible",
    isOpen: false,
  });
  const [appointments, setAppointments] = useState([]);
  const [isAddingStep, setIsAddingStep] = useState(false);
  const [accountId, setAccountId] = useState(undefined);
  const [calendarWidth, setCalendarWidth] = useState(CALENDAR_DEFAULT_WIDTH);
  const [isAdvancedSearchApplied, setIsAdvancedSearchApplied] = useState(false);

  useEffect(() => {
    if (isAdvancedSearchApplied && !accountId) {
      const selectedDate = getComparisonDate(currentDate);
      const result = [];

      userAppointmentsHistory.forEach((user) => {
        user.appointmentsByDay.forEach((appt) => {
          if (selectedDate === getComparisonDate(appt.date)) {
            const filteredData = { ...user, appointmentsByDay: [appt] };
            result.push(filteredData);
          }
        });
      });

      dispatch(filterUserAppointments(result));
    }
  }, [
    dispatch,
    accountId,
    currentDate,
    isAdvancedSearchApplied,
    userAppointmentsHistory,
  ]);

  useEffect(() => {
    if(sideBarStyles.isOpen && type === "edit"){
      setSideBarStyles(prev => ({...prev, isOpen: false, width: 0}))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[selectedBranch, currentDate]);

  useEffect(() => {
    if (selectedBranch?.id) {
      if (!shouldGetResourceData) {
        const payload = {
          branchId: selectedBranch.id,
          date: currentDate,
          timeInterval: timeInterval === "day" ? 0 : 1,
        };

        const id = accountId || specializationId;
        const key = accountId ? "accountId" : "specializationId";
        setTimeInterval((prev) => (accountId ? prev : "day"));

        if (id) {
          if (!isAdvancedSearchApplied) {
            dispatch(
              getUserAppointments(
                {
                  ...payload,
                  [key]: id === "allSpecializations" ? null : id,
                },
                company?.accountTypeId === 4,
                () => setResourcesCalendarView(false),
              ),
            );
          }
        }
      } else {
        dispatch(
          getResourceAppointments(
            {
              branchId: selectedBranch.id,
              date: currentDate,
            },
            () => setResourcesCalendarView(true),
          ),
        );
      }
    }
  }, [
    accountId,
    company?.accountTypeId,
    currentDate,
    dispatch,
    isAdvancedSearchApplied,
    selectedBranch?.id,
    shouldGetResourceData,
    specializationId,
    timeInterval,
  ]);

  useEffect(() => {
    setPageTitle("appointment");

    return () => {
      dispatch(resetAdvancedSearchValues());
      dispatch(resetUserAppointmentsList());
    };
  }, [dispatch]);

  useEffect(() => {
    if (!sideBarStyles.isOpen) {
      setIsAddingStep(false);
    }
  }, [sideBarStyles, setIsAddingStep]);

  useEffect(() => {
    if (company?.accountTypeId) {
      if (company?.accountTypeId === 4) {
        dispatch(getCompanyStaff((data) => setAccountId(data[0].id)));
      } else {
        setAccountId(params.accountId);
      }
    }

    return () => setAccountId(params.accountId);
  }, [company?.accountTypeId, dispatch, params.accountId]);

  useEffect(() => {
    if (accountId !== null) {
      dispatch(
        getBranchesList((firstBranch, list) => {
          if (accountId) {
            dispatch(
              getAccountBranches(
                { accountId },
                (accountFirstBranch, accountBranchesList) => {
                  const filteredList = [];
                  list.forEach((branch) => {
                    const item = accountBranchesList.find(
                      ({ branchId }) => branchId === branch.id,
                    );
                    if (!item) {
                      filteredList.push(branch);
                    }
                  });
                  setBranchList(filteredList);
                },
              ),
            );
          } else {
            setBranchList(list);
          }
        }),
      );
    }
    return () => {
      dispatch(signalRConnectionClose());
      setSelectedBranch(null);
    };
  }, [dispatch, accountId]);

  useEffect(() => {
    if (branchList.length) {
      if (accountId) {
        setSelectedBranch(getItemFromLocalStorage("selectedBranch"));
      } else {
        setSelectedBranch(branchList[0]);
        setItemsToLocalStorage({ selectedBranch: branchList[0] });
      }
    }

    return () => {
      setSelectedBranch(null);
    };
  }, [branchList, accountId]);

  const appointmentsList = useMemo(
    () => (resourcesCalendarView ? resourceAppointments : userAppointments),
    [resourceAppointments, resourcesCalendarView, userAppointments],
  );

  useEffect(() => {
    setSidebarData({});
  }, [resourcesCalendarView]);

  useEffect(() => {
    if (!accountId) {
      dispatch(getSpecializationList({}, (id) => setSpecializationId(id)));
    }

    return () => dispatch(resetSpecializationsList());
  }, [accountId, dispatch]);

  useEffect(() => {
    if (appointmentsList.length) {
      setAppointments(appointmentsList);
      appointmentsList?.forEach((account) => {
        let index = null;
        if (resourcesCalendarView) {
          index = sidebarRef.current.findIndex(
            (item) => item.resource.id === account.resource?.id,
          );
        } else {
          index = sidebarRef.current.findIndex(
            (item) => item.accountId === account.accountId,
          );
        }

        if (index < 0) {
          sidebarRef.current.push(account);
        } else {
          sidebarRef.current[index] = account;
        }
      });
    } else {
      setAppointments(appointmentsList);
    }
  }, [appointmentsList, resourcesCalendarView]);

  const onConfirmToClearData = () => {
    setSideBarStyles({
      width: 0,
      visibility: "visible",
      isOpen: false,
    });
    setShowConfirmationModal(false);
    if (nextAction) {
      nextAction();
    }
  };

  const continueSidebarActions = () => {
    setShowConfirmationModal(false);
    maximizeSideBar();
  };

  const askToClearSidebarData = useCallback(
    (callback) => {
      if (sideBarStyles.isOpen && type !== "edit") {
        setShowConfirmationModal(true);
        setNextAction(() => callback);
      } else if (callback) {
        callback();
      }
    },
    [sideBarStyles, type],
  );

  const maximizeSideBar = useCallback(() => {
    setSideBarStyles((prev) => ({
      ...prev,
      width: 100 - CALENDAR_DEFAULT_WIDTH,
      visibility: "visible",
    }));
    setCalendarWidth(CALENDAR_DEFAULT_WIDTH);
  }, []);

  const minifySidebar = useCallback(() => {
    setSideBarStyles((prev) => ({
      ...prev,
      width: 0,
      visibility: "hidden",
    }));
    setCalendarWidth(97);
  }, []);

  const sharedProps = {
    selectedBranch,
    currentDate,
    accountId,
    resourcesCalendarView,
    setSideBarStyles,
    setType,
    specializationId,
  };
  return (
    <AppointmentWrapper>
      <ConfirmationModal
        isVisible={showConfirmationModal}
        closeModal={continueSidebarActions}
        onConfirm={onConfirmToClearData}
      />
      <CalendarWrapper
        $width={sideBarStyles.isOpen ? calendarWidth : 100}
        sidebarIsOpen={sideBarStyles.isOpen}
        className="main-box scrollable"
      >
        {accountId && (
          <>
            <BackBtn
              style={{
                visibility: company?.accountTypeId === 4 ? "hidden" : "visible",
              }}
              type="button"
              onClick={() =>
                askToClearSidebarData(() => {
                  setAppointments([]);
                  setTimeInterval("day");
                  navigate("/appointments");
                })
              }
            >
              <LeftArrow /> <span>{t("all-service-providers")}</span>
            </BackBtn>
            <Print
              accountId={accountId}
              currentDate={currentDate}
              selectedBranch={selectedBranch}
              timeInterval={timeInterval}
              appointments={appointments}
            />
          </>
        )}
        <Header
          {...sharedProps}
          branchList={branchList}
          setSelectedBranch={setSelectedBranch}
          setCurrentDate={setCurrentDate}
          setShouldGetResourceData={setShouldGetResourceData}
          setSpecializationId={setSpecializationId}
          specializationId={specializationId}
          setTimeInterval={setTimeInterval}
          setAppointments={setAppointments}
          askToClearSidebarData={askToClearSidebarData}
          sidebarRef={sidebarRef}
          setIsAdvancedSearchApplied={setIsAdvancedSearchApplied}
          isAdvancedSearchApplied={isAdvancedSearchApplied}
        />

        {selectedBranch && appointments.length ? (
          <Calendar
            {...sharedProps}
            appointments={appointments}
            timeInterval={timeInterval}
            setSidebarData={setSidebarData}
            maximizeSideBar={maximizeSideBar}
            sideBarIsOpen={sideBarStyles.isOpen}
            type={type}
            setIsAddingStep={setIsAddingStep}
            askToClearSidebarData={askToClearSidebarData}
            setIsAdvancedSearchApplied={setIsAdvancedSearchApplied}
          />
        ) : (
          <EmptyView />
        )}
      </CalendarWrapper>
      <SidebarWrapper
        $width={sideBarStyles.width}
        $visibility={sideBarStyles.visibility}
      >
        {sideBarStyles.isOpen && (
          <SideBar
            {...sharedProps}
            sidebarData={sidebarData}
            setSidebarData={setSidebarData}
            type={type}
            appointments={sidebarRef.current}
            minifySidebar={minifySidebar}
            isAddingStep={isAddingStep}
            setIsAddingStep={setIsAddingStep}
            askToClearSidebarData={askToClearSidebarData}
          />
        )}
      </SidebarWrapper>
      {!accountId && (
        <Zoomer
          sideBarStyles={sideBarStyles}
          CALENDAR_DEFAULT_WIDTH={CALENDAR_DEFAULT_WIDTH}
        />
      )}

      {sideBarStyles.isOpen && sideBarStyles.visibility !== "visible" && (
        <MinifiedIconBox>
          <Tooltip placement="left" title={t("finish-creating-appointment")}>
            <MinifiedIcon onClick={maximizeSideBar} />
          </Tooltip>
        </MinifiedIconBox>
      )}
    </AppointmentWrapper>
  );
};

export default Appointment;
