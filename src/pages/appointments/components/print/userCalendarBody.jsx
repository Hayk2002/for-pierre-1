import React from "react";
import { useTranslation } from "react-i18next";
import moment from "moment";
import { v4 as uuidv4 } from "uuid";
import { StyledPrintTable, StyledBox } from "./styles";
import { generateMinutesInRange } from "../sidebar/helper";

const handleDataCollecting = (
  id,
  appointmentId,
  startTime,
  endTime,
  printData,
  services,
) => {
  const printDataStep = printData.filter(
    (print) => print.appointmentId === appointmentId,
  );

  const data = {};

  if (printDataStep[0]) {
    const stepInPrintData = printDataStep[0].stepNotes.filter(
      ({ appointmentStepId }) => appointmentStepId === id,
    );

    const service = services.filter(
      (item) => item.id === stepInPrintData[0]?.serviceId,
    );

    data.key = stepInPrintData[0].appointmentStepId;
    data.n = printDataStep[0].number;
    data.time = `${moment(startTime, "HH:mm:ss").format("HH:mm")} - ${moment(
      endTime,
      "HH:mm:ss",
    ).format("HH:mm")}`;
    data.service = service[0]?.name;
    data.name = printDataStep[0].userName;
    data.phone = printDataStep[0].phoneNumber;
    data.comment = stepInPrintData[0]?.note;
    data.note = "";

    return data;
  }

  return {
    key: uuidv4(),
    n: "",
    time: `${moment(startTime, "HH:mm:ss").format("HH:mm")} - ${moment(
      endTime,
      "HH:mm:ss",
    ).format("HH:mm")}`,
    service: "",
    name: "",
    phone: "",
    comment: "",
    note: "",
  };
};

const handlePrintData = (
  steps,
  services,
  printData,
  workingBlocks,
  timeInterval,
) => {
  const data = [];
  let availableTimes = [];
  let serviceMinDuration = null;

  steps.sort((a, b) => a.startTime.localeCompare(b.startTime));

  if (timeInterval !== "day") {
    steps.forEach(({ appointmentId, startTime, endTime, id }) => {
      const dataObj = handleDataCollecting(
        id,
        appointmentId,
        startTime,
        endTime,
        printData,
        services,
      );

      if (dataObj) {
        data.push(dataObj);
      }
    });

    return data;
  }

  services.forEach(({ duration }) => {
    if (serviceMinDuration) {
      serviceMinDuration =
        serviceMinDuration > duration ? duration : serviceMinDuration;
    } else {
      serviceMinDuration = duration;
    }
  });

  workingBlocks.forEach(({ startTime, endTime }) => {
    const times = generateMinutesInRange(
      startTime,
      moment(endTime, "HH:mm:ss")
        .subtract(serviceMinDuration, "minutes")
        .format("HH:mm:ss"),
      serviceMinDuration,
    );
    availableTimes.push(...times);
  });

  steps.forEach(({ appointmentId, startTime, endTime, id }) => {
    const timesBeforeStepStart = availableTimes.filter(
      (time) => time < moment(startTime, "HH:mm:ss").format("HH:mm"),
    );

    timesBeforeStepStart.forEach((available, index) => {
      const availableRange = moment(available, "HH:mm")
        .add(serviceMinDuration, "minutes")
        .format("HH:mm");
      let end = availableRange;
      if (index === timesBeforeStepStart.length - 1) {
        end =
          availableRange <= moment(startTime, "HH:mm:ss").format("HH:mm")
            ? availableRange
            : startTime;
      }

      const dataObj = handleDataCollecting(
        id,
        null,
        available,
        end,
        printData,
        services,
      );
      if (dataObj) {
        data.push(dataObj);
      }
    });

    data.push(
      handleDataCollecting(
        id,
        appointmentId,
        startTime,
        endTime,
        printData,
        services,
      ),
    );

    availableTimes = availableTimes.filter(
      (available) => !timesBeforeStepStart.includes(available),
    );

    const nextStart =
      availableTimes.includes(endTime) ||
      availableTimes[0] < moment(endTime, "HH:mm:ss").format("HH:mm")
        ? endTime
        : availableTimes[0];

    availableTimes = generateMinutesInRange(
      nextStart,
      availableTimes[availableTimes.length - 1],
      serviceMinDuration,
    );
  });

  availableTimes.forEach((available) => {
    const availableRange = moment(available, "HH:mm")
      .add(serviceMinDuration, "minutes")
      .format("HH:mm");
    const end =
      availableRange <= workingBlocks[workingBlocks.length - 1]?.endTime
        ? availableRange
        : workingBlocks[workingBlocks.length - 1]?.endTime;

    const dataObj =
      available < moment(end, "HH:mm:ss").format("HH:mm")
        ? handleDataCollecting(null, null, available, end, printData, services)
        : null;
    if (dataObj) {
      data.push(dataObj);
    }
  });

  return data;
};

const UserCalendarBody = ({
  appointments,
  branchName,
  printData,
  selectedBranch,
  timeInterval,
}) => {
  const { t } = useTranslation();

  const printTableColumns = [
    {
      title: "\u2116",
      dataIndex: "n",
      key: "n",
    },
    {
      title: t("time"),
      dataIndex: "time",
      key: "time",
    },
    {
      title: t("service"),
      dataIndex: "service",
      key: "service",
    },
    {
      title: t("name"),
      dataIndex: "name",
      key: "name",
    },
    {
      title: t("phone-number"),
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: t("comment"),
      dataIndex: "comment",
      key: "comment",
    },
    {
      title: t("note"),
      dataIndex: "note",
      key: "note",
    },
  ];

  return appointments.map(
    ({ accountId, userProfile, appointmentsByDay, accountServices }) => {
      if (appointmentsByDay.length) {
        return (
          <section key={accountId}>
            <StyledBox className="mt-20">
              <span className="styled-txt">{t("service-provider")}:</span>
              <span>
                {userProfile.firstName} {userProfile.lastName}
              </span>
            </StyledBox>
            <StyledBox>
              <span className="styled-txt">{t("branch")}:</span>
              <span>{branchName}</span>
            </StyledBox>
            {appointmentsByDay.map((dayData) => {
              const workingBlocks = dayData.accountTimeBlocks.filter(
                ({ blockType, startTime, endTime }) =>
                  blockType.isWorking &&
                  moment(startTime, "HH:mm:ss") >=
                    moment(selectedBranch?.timelineStart, "HH:mm:ss") &&
                  moment(endTime, "HH:mm:ss") <=
                    moment(selectedBranch?.timelineEnd, "HH:mm:ss"),
              );

              return (
                <section key={dayData.date}>
                  <StyledBox className="mb-10">
                    <span className="styled-txt">{t("date")}:</span>
                    <span>{moment(dayData.date).format("YYYY-MM-DD")}</span>
                  </StyledBox>

                  <StyledPrintTable
                    bordered
                    pagination={false}
                    dataSource={handlePrintData(
                      dayData.appointmentsSteps,
                      accountServices,
                      printData,
                      workingBlocks,
                      timeInterval,
                    )}
                    columns={printTableColumns}
                    locale={{ emptyText: " " }}
                    style={{ padding: "10px" }}
                  />
                </section>
              );
            })}
          </section>
        );
      }
      return null;
    },
  );
};

export default React.memo(UserCalendarBody);
