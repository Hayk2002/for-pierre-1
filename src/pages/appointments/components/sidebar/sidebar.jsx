import moment from "moment";
import { useState, useEffect, useCallback, memo } from "react";
import { useDispatch, useSelector } from "react-redux";

import { SidebarMinifier, CloseIcon, LeftArrow } from "assets/images";
import { Tabs } from "antd";
import { selectStepData } from "store/selectors";
import { useTranslation } from "react-i18next";
import {
  addAppointmentRequest,
  addStepRequest,
  deleteAppoinmentSuccess,
  deleteAppointment,
  deleteTimeBlocker,
} from "../../actions";
import { SidebarWrapper } from "./styles";
import CreateResourceAppointment from "./uis/resource/create";
import CreateUserAppointment from "./uis/users/create";
import EditUserAppointment from "./uis/users/edit";
import EditResourceAppointment from "./uis/resource/edit";
import UpdateUserAppointment from "./uis/users/update";
import UpdateResourceAppointment from "./uis/resource/update";
import { CALENDAR_DEFAULT_WIDTH } from "../../constants";
import TimeBlock from "./uis/users/timeBlock";

const { TabPane } = Tabs;

const Sidebar = ({
  sidebarData,
  type,
  selectedBranch,
  setType,
  setSideBarStyles,
  resourcesCalendarView,
  appointments,
  minifySidebar,
  accountId,
  specializationId,
  setSidebarData,
  isAddingStep,
  setIsAddingStep,
  askToClearSidebarData,
}) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const selectedStepData = useSelector(selectStepData);

  const [ticketData, setTicketData] = useState({});
  const [chartData, setChartData] = useState({
    appointmentSteps: [],
    userDetails: {},
  });
  const [newStepsData, setNewStepsData] = useState({});

  const [editableItem, setEditableItem] = useState({});
  const [showAppointmentNumber, setShowAppointmentNumber] = useState("");
  const [pin, setPin] = useState("");
  const [tabKey, setTabKey] = useState("appointment");

  useEffect(() => {
    if (type === "edit") {
      setIsAddingStep(false);
      setNewStepsData({});
    }
  }, [type, setIsAddingStep]);

  useEffect(() => {
    setTicketData(selectedStepData);
  }, [selectedStepData]);

  useEffect(() => {
    if (ticketData && ticketData.appointmentSteps) {
      setShowAppointmentNumber(
        ticketData.appointmentSteps[0]?.appointmentNumber,
      );
      setPin(ticketData.appointmentSteps[0]?.pin);
    }
  }, [ticketData]);

  useEffect(() => {
    if (isAddingStep) {
      setNewStepsData(ticketData);
      updateSiderState(true, "create");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAddingStep]);

  const updateSiderState = (isOpen, newType = "") => {
    setSideBarStyles((prev) => ({
      ...prev,
      isOpen,
      width: isOpen ? 100 - CALENDAR_DEFAULT_WIDTH : 0,
    }));
    setType(newType);
    if (newType === "chartContent") {
      setTicketData({});
    }
    if (!isOpen) {
      setSidebarData({});
    }
  };

  const deleteStep = (id, isOnlyStep) => {
    dispatch(
      deleteAppointment(
        {
          id,
          isOnlyStep,
        },
        () => {
          setNewStepsData((prev) => ({
            ...prev,
            appointmentSteps: prev.appointmentSteps.filter(
              (step) => step.id !== id,
            ),
          }));
        },
      ),
    );
  };

  const cancelAppointment = (id, isOnlyStep, key) => {
    if (type !== "chartContent") {
      const stepsLength = ticketData.appointmentSteps?.length;
      dispatch(
        deleteAppointment(
          {
            id,
            isOnlyStep,
          },
          () => {
            if (stepsLength === 1 || !isOnlyStep) {
              updateSiderState(false);
            } else if (resourcesCalendarView) {
              setTicketData((prev) => ({
                ...prev,
                appointmentSteps: prev.appointmentSteps.filter(
                  (step) => step.id !== id,
                ),
              }));
            }else {
              dispatch(deleteAppoinmentSuccess({ accountId, stepId: id }))
            }
          },
        ),
      );
    } else if (isAddingStep) {
      let stepsLength = newStepsData.appointmentSteps?.length;

      if (key === "id") {
        stepsLength = newStepsData.appointmentSteps?.filter(
          (item) => item.appointmentId,
        ).length;
        if (stepsLength === 1 || !isOnlyStep) {
          askToClearSidebarData(() => {
            deleteStep(id, isOnlyStep);
          });
        } else deleteStep(id, isOnlyStep);
      } else {
        setNewStepsData((prev) => ({
          ...prev,
          appointmentSteps: prev.appointmentSteps.filter(
            (step, index) => index !== id,
          ),
        }));
        if (stepsLength === 1 || !isOnlyStep) {
          updateSiderState(false);
        }
      }
    } else {
      const stepsLength = chartData.appointmentSteps?.length;
      setChartData((prev) => ({
        ...prev,
        appointmentSteps: prev.appointmentSteps.filter((step, index) =>
          key === "id" ? step.id !== id : index !== id,
        ),
      }));

      if (stepsLength === 1) {
        updateSiderState(false);
      }
    }
  };

  const cancelTimeBlocker = (id) => {
    dispatch(deleteTimeBlocker({ id }, () => updateSiderState(false)));
  };

  const createAppointment = (data) => {
    if (isAddingStep) {
      const appointmentId = data?.appointmentSteps?.find(
        (item) => item.appointmentId,
      )?.appointmentId;
      const requestData = data?.appointmentSteps
        ?.filter((item) => !item.appointmentId)
        .map((step) => ({ ...step, appointmentId }));

      const payload = {
        userDetails: {
          phoneNumber: newStepsData?.userDetails?.phoneNumber,
          userName: newStepsData?.userDetails?.userName,
          appointmentId,
        },
        requestData,
      };

      dispatch(addStepRequest(payload, () => updateSiderState(false)));
    } else {
      dispatch(addAppointmentRequest(data, () => updateSiderState(false)));
    }
  };

  const updateNewStepsData = (values) => {
    setNewStepsData((prev) => {
      const index = prev.appointmentSteps?.findIndex(
        (step) => step.id === editableItem.id,
      );
      if (Object.entries(values).length === 2) {
        prev.userDetails = values;
      } else {
        prev.appointmentSteps[index] = {
          ...prev.appointmentSteps[index],
          ...values,
        };
        Object.entries(values).forEach(([key, value]) => {
          prev.appointmentSteps[index][key] = value;
        });
      }

      return prev;
    });
  };

  const editAppointment = (data, field, id) => {
    const account = resourcesCalendarView
      ? appointments.filter(
          (appointment) => appointment.resource.id === data?.resourceId,
        )
      : appointments.filter(
          (appointment) => appointment.accountId === data?.accountId,
        );

    const customer = account[0]?.appointmentsByDay
      ?.filter((item) => item.appointmentsSteps.length)
      ?.find((item) => item.date === data.date)
      ?.appointmentsSteps?.find(
        ({ appointmentId }) => appointmentId === data.appointmentId,
      )?.userDetails;

    setEditableItem({
      id,
      data,
      field,
      services: resourcesCalendarView
        ? account[0]?.resource.services
        : account[0]?.accountServices,
      userProfile: account[0]?.userProfile,
      customerDetails: customer,
    });

    updateSiderState(true, "update");
  };

  const createPropsData = {
    sidebarData,
    selectedBranch,
    date: moment(sidebarData.date, "YYYY-MM-DD").format("YYYY-MM-DD"),
    updateSiderState,
    setChartData,
    chartData,
    createAppointment,
    accountId,
    appointments,
    specializationId,
    tabKey,
    isAddingStep,
    newStepsData,
    setNewStepsData,
  };

  const editableData = useCallback(() => {
    let result = {};
    if (isAddingStep) {
      result = newStepsData;
    } else {
      result = type === "edit" ? ticketData : chartData;
    }
    return result;
  }, [chartData, ticketData, newStepsData, isAddingStep, type]);

  const editPropsData = {
    data: editableData(),
    sidebarData,
    editAppointment,
    cancelAppointment,
    type,
    createAppointment,
    selectedBranch,
    cancelTimeBlocker,
    isAddingStep,
    newStepsData,
    appointments,
  };

  const updatePropsData = {
    selectedBranch,
    date: sidebarData.date,
    prevType: Object.entries(ticketData).length ? "edit" : "chartContent",
    editableItem,
    updateSiderState,
    setChartData,
    appointments,
    specializationId,
    isAddingStep,
    setNewStepsData,
    newStepsData,
    updateNewStepsData,
  };

  const defaultTab = () => (
    <>
      {type === "create" &&
        (resourcesCalendarView ? (
          <CreateResourceAppointment {...createPropsData} />
        ) : (
          <CreateUserAppointment {...createPropsData} />
        ))}
      {(type === "chartContent" || type === "edit") &&
        (resourcesCalendarView ? (
          <EditResourceAppointment {...editPropsData} />
        ) : (
          <EditUserAppointment {...editPropsData} />
        ))}
      {type === "update" &&
        (resourcesCalendarView ? (
          <UpdateResourceAppointment {...updatePropsData} />
        ) : (
          <UpdateUserAppointment {...updatePropsData} />
        ))}
    </>
  );

  return (
    <SidebarWrapper
      $justifyContent={
        type === "update" || type === "edit" ? "space-between" : "flex-end"
      }
      className="scrollable"
    >
      <div className="header-actions">
        {(type === "update" ||
          type === "edit" ||
          (isAddingStep && type === "create")) && (
          <div style={{ marginRight: "auto" }}>
            <div
              className={type === "edit" ? "hiddenBackBox" : "backBox"}
              onClick={() =>
                updateSiderState(
                  true,
                  Object.entries(ticketData).length ? "edit" : "chartContent",
                )
              }
            >
              <LeftArrow /> <span>{t("back")}</span>
            </div>

            {showAppointmentNumber ? (
              <>
                <div style={{ display: "inline-block" }}>
                  <p>{t("appointment-number")}</p>
                  <h2>{showAppointmentNumber}</h2>
                </div>
                {pin && (
                  <div style={{ display: "inline-block", marginLeft: "20px" }}>
                    <p>Pin</p>
                    <h2>{pin}</h2>
                  </div>
                )}
              </>
            ) : (
              ""
            )}
          </div>
        )}
        <div className="actionsDiv">
          <SidebarMinifier onClick={minifySidebar} />
          <CloseIcon
            onClick={() => {
              setType("");
              setSideBarStyles((prev) => ({
                ...prev,
                isOpen: false,
                width: 0,
              }));
            }}
          />
        </div>
      </div>

      {accountId && type === "create" ? (
        <Tabs
          defaultActiveKey="appointment"
          centered
          className="scrollable"
          onChange={(key) => setTabKey(key)}
        >
          <TabPane tab={t("appointment")} key="appointment">
            {defaultTab()}
          </TabPane>
          <TabPane tab={t("time-block")} key="timeBlocker">
            <TimeBlock {...createPropsData} />
          </TabPane>
        </Tabs>
      ) : (
        defaultTab()
      )}
    </SidebarWrapper>
  );
};

export default memo(Sidebar);
