import moment from "moment";

export const generateDurationsList = (maxVal) => {
  const durationsList = [];
  for (let i = 5; i <= maxVal; i += 5) {
    durationsList.push(i);
  }
  return durationsList;
};

export const addAppointmentSteps = (
  setAppointmentSteps,
  sidebarData,
  { serviceId, resourceId, startTime, duration, note },
) => {
  setAppointmentSteps((prev) => [
    ...prev,
    {
      accountId: sidebarData.accountId,
      serviceId,
      resourceId,
      startTime,
      duration,
      note,
      additionalData: sidebarData,
    },
  ]);
};

export const generateMinutesInRange = (start, end, step) => {
  let nextMin = moment(start, "HH:mm");
  const minutes = [moment(nextMin).format("HH:mm")];
  const endMin = moment(end, "HH:mm");
  for (let i = 0; nextMin.isBefore(endMin); i += 1) {
    nextMin = moment(nextMin, "HH:mm").add(step, "minute");
    minutes.push(moment(nextMin).format("HH:mm"));
  }
  return minutes;
};

export const checkIfSelectedTimeIsCorrect = (range, form) => {
  const selectedTime = form.getFieldValue("startTime");
  const inRangeData = range.find(({ value }) => value === selectedTime);
  if (range.length && !inRangeData) {
    form.setFieldsValue({ startTime: null });
  }
};

export const getSelectedTimeBlockSpecialization = (
  appointments,
  date,
  minute,
) => {
  const selectedDayData = appointments?.filter(
    (dayData) => moment(dayData.date).format("YYYY-MM-DD") === date,
  )[0];

  if (selectedDayData) {
    return selectedDayData.accountTimeBlocks.filter(
      (block) =>
        moment(minute, "HH:mm").isBetween(
          moment(block.startTime, "HH:mm:ss"),
          moment(block.endTime, "HH:mm:ss"),
        ) ||
        minute === moment(block.startTime, "HH:mm:ss").format("HH:mm") ||
        minute === moment(block.endTime, "HH:mm:ss").format("HH:mm"),
    )[0];
  }

  return null;
};
