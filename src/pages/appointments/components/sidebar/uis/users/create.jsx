import moment from "moment";

import Form from "./form";

const Create = ({
  sidebarData,
  selectedBranch,
  date,
  updateSiderState,
  setChartData,
  chartData,
  createAppointment,
  appointments,
  specializationId,
  tabKey,
  isAddingStep,
  newStepsData,
  setNewStepsData,
}) => {
  const addService = ({
    note,
    duration,
    startTime,
    serviceId,
    resourceId,
    phoneNumber,
    userName
  }) => {
    const { userProfile } = sidebarData;

    const newStep = {
      accountId: sidebarData.id,
      serviceId,
      resourceId,
      startTime,
      duration,
      note,
      firstName: userProfile?.firstName,
      lastName: userProfile?.lastName
    }

    if (isAddingStep) {
      setNewStepsData(prev => ({
        ...prev,
        appointmentSteps: [
          ...prev.appointmentSteps,
          newStep,
        ]
      })
      )
    } else {
      setChartData((prev) => ({
        appointmentSteps: [
          ...prev.appointmentSteps,
          newStep,
        ],
        userDetails: {
          userName,
          phoneNumber,
        },
      }));
    }
    updateSiderState(true, "chartContent");

  };

  const createAppointmentHandler = (fields) => {
    const { userProfile } = sidebarData;
    
    const {
      note,
      duration,
      startTime,
      serviceId,
      resourceId,
      phoneNumber,
      userName,
    } = fields;

    const newStep = fields
      ? {
        accountId: sidebarData.id,
        serviceId,
        resourceId,
        startTime,
        duration,
        note,
        firstName: userProfile?.firstName,
        lastName: userProfile?.lastName
      }
      : null;

    const steps = isAddingStep ? newStepsData.appointmentSteps : chartData.appointmentSteps;

    createAppointment({
      branchId: selectedBranch.id,
      date: moment(sidebarData.date, "YYYY-MM-DD").format("YYYY-MM-DD"),
      userName: userName ?? chartData.userDetails.userName,
      phoneNumber: phoneNumber ?? chartData.userDetails.phoneNumber,
      appointmentSteps: [...steps, newStep],
    });
  };

  const handleChartClick = () => {
    setChartData((prev) => ({
      ...prev,
      userDetails: {
        userName: chartData.userDetails.userName,
        phoneNumber: chartData.userDetails.phoneNumber,
      },
    }));
    updateSiderState(true, "chartContent");
  };

  return (
    <Form
      sidebarData={sidebarData}
      selectedBranch={selectedBranch}
      date={date}
      userData={isAddingStep ? "" : chartData.userDetails}
      addService={addService}
      createAppointmentHandler={createAppointmentHandler}
      stepsCount={isAddingStep ? newStepsData?.appointmentSteps?.length : chartData?.appointmentSteps?.length}
      handleChartClick={handleChartClick}
      appointments={appointments}
      specializationId={specializationId}
      tabKey={tabKey}
    />
  );
};

export default Create;
