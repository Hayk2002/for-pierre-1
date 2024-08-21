import moment from "moment";

import Form from "./form";

const Create = ({
  sidebarData,
  selectedBranch,
  date,
  updateSiderState,
  setChartData,
  chartData,
  createAppointment
}) => {
  const addService = ({ note, duration, startTime, serviceId, accountId }) => {
    setChartData((prev) => ({
      appointmentSteps: [
        ...prev.appointmentSteps,
        {
          accountId,
          serviceId,
          resourceId: sidebarData.resource?.id,
          startTime,
          duration,
          note,
        },
      ],
    }));

    updateSiderState(true, "chartContent");
  };

  const createAppointmentHandler = (fields) => {
    const { note, duration, startTime, serviceId, accountId } = fields;
    const newStep = fields
      ? {
          accountId,
          serviceId,
          resourceId: sidebarData.resource?.id,
          startTime,
          duration,
          note,
        }
      : null;

    createAppointment({
      branchId: selectedBranch.id,
      date: moment(sidebarData.date, "YYYY-MM-DD").format("YYYY-MM-DD"),
      appointmentSteps: [...chartData.appointmentSteps, newStep],
    });
  };

  const handleChartClick = () => {
    setChartData((prev) => ({
      ...prev,
      userDetails: {
        userName: chartData.userDetails?.userName,
        phoneNumber: chartData.userDetails?.phoneNumber,
      },
    }));
    updateSiderState(true, "chartContent");
  };

  return (
    <Form
      sidebarData={sidebarData}
      selectedBranch={selectedBranch}
      date={date}
      userData={chartData.userDetails}
      addService={addService}
      createAppointmentHandler={createAppointmentHandler}
      stepsCount={chartData?.appointmentSteps?.length}
      handleChartClick={handleChartClick}
    />
  );
};

export default Create;
