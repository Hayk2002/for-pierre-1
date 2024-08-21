import moment from "moment";
import { Form, Tabs } from "antd";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useMemo, useRef, memo } from "react";

import { RightArrow, LeftArrow, Avatar, SearchIcon } from "assets/images";
import {
  selectSpecializationsList,
  selectAppointmentsList,
  selectUserAppointmentsHistory,
} from "store/selectors";
import { CustomDatePicker } from "shared/styles";
import { TransparentButton } from "shared/buttons/styles";
import { initialAdvancedSearchValues } from "shared/enums";
import { removeSimilarDates, setItemsToLocalStorage } from "utils/helpers";
import {
  HeaderWrapper,
  StyledSelect,
  StyledOption,
  StyledCascader,
  ProfileBox,
  TimeintervalBox,
  AdvancedSearchButton,
  StyledTabs,
} from "./styles";
import AdvancedSearchFields from "./advancedSearchFields";
import {
  getProvidersSuggestionsList,
  triggerAdvancedSearch,
} from "../../actions";

const { TabPane } = Tabs;

const Header = ({
  setSelectedBranch,
  currentDate,
  setCurrentDate,
  selectedBranch,
  branchList,
  setShouldGetResourceData,
  setSpecializationId,
  specializationId,
  setTimeInterval,
  accountId,
  setAppointments,
  askToClearSidebarData,
  sidebarRef,
  resourcesCalendarView,
  isAdvancedSearchApplied,
  setIsAdvancedSearchApplied,
}) => {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const userAppointments = useSelector(selectAppointmentsList);
  const specializations = useSelector(selectSpecializationsList);
  const userAppointmentsHistory = useSelector(selectUserAppointmentsHistory);

  const isSearchButtonVisible = !resourcesCalendarView && !accountId;

  const [datesList, setDatesList] = useState([]);
  const [nearestDateIndex, setNearestDateIndex] = useState(0);
  const [hasTypeSelected, setHasTypeSelected] = useState(false);
  const [specializationsList, setSpecializationsList] = useState([]);
  const [apptsPaginationCount, setApptsPaginationCount] = useState(0);
  const [isAdvancedSearchActive, setIsAdvancedSearchActive] = useState(false);
  const [advancedSearchValues, setAdvancedSearchValues] = useState(
    initialAdvancedSearchValues,
  );
  const [forceUpdateValue, setForceUpdateValue] = useState(false);

  const userProfile = useMemo(
    () => (accountId ? userAppointments[0]?.userProfile : null),
    [userAppointments, accountId],
  );

  const ref = useRef();

  const resourcesList = [
    {
      value: "resources",
      label: t("all-resources"),
    },
  ];

  useEffect(() => {
    if (specializations.length) {
      const list = specializations.map(({ id, name }) => ({
        value: id,
        label: name,
        id,
      }));
      setSpecializationsList([
        ...list,
        { value: "allSpecializations", label: t("all") },
      ]);
    } else {
      setSpecializationsList([]);
    }
  }, [specializations, t]);

  const handleSearchSubmit = () => {
    const payload = {
      ...form.getFieldsValue(),
      branchId: selectedBranch.id,
      specializationId:
        specializationId === "allSpecializations" ? null : specializationId,
    };
    dispatch(
      triggerAdvancedSearch(payload, () => setIsAdvancedSearchApplied(true)),
    );
  };

  /* eslint-disable */
  useEffect(() => {
    if (isAdvancedSearchApplied) {
      const apptsByDay = [];
      const today = moment().format("YYYY-MM-DD");

      if (userAppointmentsHistory.length) {
        userAppointmentsHistory.forEach((user) => {
          user.appointmentsByDay.forEach((appt) => {
            apptsByDay.push(appt);
          });
        });
      }

      const filteredDates = removeSimilarDates(apptsByDay);

      if (filteredDates.length) {
        const dates = filteredDates.map(({ date }) => new Date(date));
        dates.sort((a, b) => a - b);

        const nearestDate = dates.reduce((prev, curr) =>
          Math.abs(new Date(curr) - new Date(today)) <
          Math.abs(new Date(prev) - new Date(today))
            ? curr
            : prev,
        );

        setDatesList(dates);
        setApptsPaginationCount(filteredDates.length);
        setNearestDateIndex(dates.indexOf(nearestDate) + 1);
        setCurrentDate(moment(nearestDate).format("YYYY-MM-DD"));
      } else {
        setCurrentDate(today);
      }
    }
  }, [setCurrentDate, isAdvancedSearchApplied, userAppointmentsHistory]);

  useEffect(() => {
    if (isAdvancedSearchApplied) {
      const selectedDate = new Date(currentDate).setHours(0, 0, 0, 0);
      const dates = datesList.map((date) => date.setHours(0, 0, 0, 0));

      if (dates.includes(selectedDate)) {
        const dateIndex = dates.indexOf(selectedDate);
        setNearestDateIndex(dateIndex + 1);
      }
    }
  }, [datesList, forceUpdateValue, isAdvancedSearchApplied]);

  useEffect(() => {
    if (isAdvancedSearchActive && selectedBranch?.id && !accountId) {
      dispatch(
        getProvidersSuggestionsList({
          branchId: selectedBranch.id,
        }),
      );
    }
  }, [dispatch, selectedBranch, isAdvancedSearchActive, accountId]);

  const handleDateChange = (arrowDirection) => {
    setForceUpdateValue(!forceUpdateValue);
    if (arrowDirection === "left") {
      setCurrentDate((prev) =>
        moment(prev).subtract(1, "days").format("YYYY-MM-DD"),
      );
    } else {
      setCurrentDate((prev) =>
        moment(prev).add(1, "days").format("YYYY-MM-DD"),
      );
    }
  };

  const handleCascaderChange = (value) => {
    if (value[0] === "resources") {
      askToClearSidebarData(() => {
        setShouldGetResourceData(true);
        sidebarRef.current = [];
      });
    } else if (resourcesCalendarView) {
      askToClearSidebarData(() => {
        setShouldGetResourceData(false);
        setSpecializationId(value[0]);
        sidebarRef.current = [];
      });
    } else {
      setShouldGetResourceData(false);
      setSpecializationId(value[0]);
    }
  };

  const handleBranchChange = (value) => {
    const branch = branchList.find(({ id }) => id === value);
    setSelectedBranch(branch);
    setItemsToLocalStorage({ selectedBranch: branch });
  };

  const handleTimeIntervalChange = (e, interval) => {
    ref.current.classList.remove("active");
    ref.current = e.target;
    e.target.classList.add("active");
    setTimeInterval(interval);
    setAppointments([]);
  };

  const toggleAdvancedSearchState = (isSearchIcon = true) => {
    if (isSearchIcon) {
      setIsAdvancedSearchActive((prev) => !prev);
    }

    if (isAdvancedSearchActive && isAdvancedSearchApplied) {
      setIsAdvancedSearchApplied(false);
    }

    form.resetFields();
    setAdvancedSearchValues(initialAdvancedSearchValues);
  };

  const renderTabs = (menu) => (
    <StyledTabs
      type="card"
      defaultActiveKey="1"
      onChange={() => setHasTypeSelected((prev) => !prev)}
    >
      <TabPane tab={t("specializations")} key="specializations">
        {menu}
      </TabPane>
      <TabPane tab={t("resources")} key="resources">
        {menu}
      </TabPane>
    </StyledTabs>
  );

  return (
    <div id="appointment_header">
      <HeaderWrapper>
        {userProfile && (
          <ProfileBox>
            <img src={userProfile.photoUrl || Avatar} alt="Profile" />
            <div>
              <h3>
                {userProfile.firstName} {userProfile.lastName}
              </h3>
              <span>{userProfile.title}</span>
            </div>
          </ProfileBox>
        )}

        <div className="date-box">
          <TransparentButton
            type="button"
            onClick={() =>
              askToClearSidebarData(() => handleDateChange("left"))
            }
          >
            <LeftArrow />
          </TransparentButton>
          <TransparentButton
            type="button"
            onClick={() =>
              askToClearSidebarData(() => handleDateChange("right"))
            }
          >
            <RightArrow />
          </TransparentButton>
          <CustomDatePicker
            value={moment(currentDate)}
            key={moment(currentDate).format("MMM DD")}
            bordered={false}
            suffixIcon={false}
            placeholder={moment(currentDate).format("MMM DD")}
            format="MMM DD"
            inputReadOnly
            allowClear={false}
            onChange={(val) =>
              askToClearSidebarData(() => {
                setCurrentDate(moment(val).format("YYYY-MM-DD"));
              })
            }
          />
          <TransparentButton
            type="button"
            className="today-btn"
            onClick={() =>
              currentDate !== moment().format("YYYY-MM-DD")
                ? askToClearSidebarData(() =>
                    setCurrentDate(moment().format("YYYY-MM-DD")),
                  )
                : null
            }
          >
            {t("today")}
          </TransparentButton>
        </div>
        <div className="selects-box">
          {accountId && (
            <TimeintervalBox>
              <button
                type="button"
                className="active"
                ref={ref}
                onClick={(e) =>
                  askToClearSidebarData(() =>
                    handleTimeIntervalChange(e, "day"),
                  )
                }
              >
                {t("day")}
              </button>
              <button
                type="button"
                onClick={(e) =>
                  askToClearSidebarData(() =>
                    handleTimeIntervalChange(e, "week"),
                  )
                }
              >
                {t("week")}
              </button>
            </TimeintervalBox>
          )}
          {isSearchButtonVisible && (
            <AdvancedSearchButton
              onClick={toggleAdvancedSearchState}
              isActive={isAdvancedSearchActive}
            >
              <SearchIcon />
            </AdvancedSearchButton>
          )}
          <StyledSelect
            value={selectedBranch?.id}
            onChange={(value) =>
              askToClearSidebarData(() => handleBranchChange(value))
            }
          >
            {branchList.map(({ id, name }) => (
              <StyledOption key={id} value={id}>
                {name}
              </StyledOption>
            ))}
          </StyledSelect>
          {specializationsList.length > 0 && !accountId && (
            <StyledCascader
              onChange={handleCascaderChange}
              dropdownClassName="appointment-header-cascader-body"
              placement="topRight"
              options={!hasTypeSelected ? specializationsList : resourcesList}
              defaultValue={[specializationsList[0]?.label]}
              dropdownRender={renderTabs}
              allowClear={false}
            />
          )}
        </div>
      </HeaderWrapper>
      {isAdvancedSearchActive && isSearchButtonVisible && (
        <AdvancedSearchFields
          form={form}
          datesList={datesList}
          setCurrentDate={setCurrentDate}
          specializationId={specializationId}
          nearestDateIndex={nearestDateIndex}
          handleSearchSubmit={handleSearchSubmit}
          paginationMaxCount={apptsPaginationCount}
          advancedSearchValues={advancedSearchValues}
          isAdvancedSearchApplied={isAdvancedSearchApplied}
          setAdvancedSearchValues={setAdvancedSearchValues}
          toggleAdvancedSearchState={toggleAdvancedSearchState}
        />
      )}
    </div>
  );
};

export default memo(Header);
