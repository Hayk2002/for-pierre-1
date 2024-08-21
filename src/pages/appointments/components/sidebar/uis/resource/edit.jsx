import React from "react";
import moment from "moment";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { selectDisableButton } from "store/selectors";

import { EditIcon, SidebarDelete, Mobile } from "assets/images";
import {
  StyledCard,
  ActionsBox,
  StyledChartBtn,
  StyledDateBlock,
  StyledMobileIconBox,
  StyledStepsListWrapper,
} from "../../styles";

const Edit = ({
  data,
  sidebarData,
  editAppointment,
  cancelAppointment,
  type,
  createAppointment,
  selectedBranch,
  appointments,
}) => {
  const { t } = useTranslation();
  const disableButton = useSelector(selectDisableButton);

  const { appointmentSteps } = data;

  return (
    <>
      <StyledStepsListWrapper className="scrollable">
        {appointmentSteps?.map((step, index) => {
          const {
            id,
            date,
            startTime,
            endTime,
            sourceType,
            resourceId,
            note,
            duration,
          } = step;

          const resource = appointments.filter(
            (appointment) => appointment.resource.id === resourceId,
          )[0]?.resource;
          const services = resource?.services ?? [];

          let { serviceName, resourceName } = step;
          if (Object.entries(sidebarData).length) {
            const service = services.filter(
              ({ serviceId }) => serviceId === step.serviceId,
            );
            serviceName = service[0]?.serviceName;
            resourceName = resource?.name;
          }

          const selectedDate = date || sidebarData.date;

          const end =
            endTime ??
            moment(startTime, "HH:mm").add(duration, "minutes").format("HH:mm");

          return (
            <StyledCard key={id ?? index}>
              {startTime && end && (
                <StyledDateBlock>
                  {`${moment(startTime, "HH:mm:ss").format("HH:mm")} - ${moment(
                    end,
                    "HH:mm:ss",
                  ).format("HH:mm")} ${moment(selectedDate).format("DD MMM")}`}
                  {sourceType === 2 ? (
                    <StyledMobileIconBox>
                      <Mobile />
                    </StyledMobileIconBox>
                  ) : null}
                </StyledDateBlock>
              )}
              <div>
                <span className="actions">
                  {(sourceType === 1 || type === "chartContent") && (
                    <EditIcon
                      onClick={() => editAppointment(step, "step", id ?? index)}
                    />
                  )}
                  <SidebarDelete
                    onClick={() => cancelAppointment(id ?? index, true)}
                  />
                </span>
              </div>
              <div>
                <h4>{serviceName}</h4>
              </div>
              {resourceId && (
                <div>
                  <b>
                    {t("resource")}: {resourceName}
                  </b>
                </div>
              )}
              {note && <div className="note">{note}</div>}
            </StyledCard>
          );
        })}
      </StyledStepsListWrapper>
      <ActionsBox>
        {type === "edit" ? (
          <StyledChartBtn
            $bg="linear-gradient(180deg, #C8D8E9 0, #E8EEF2 100%)"
            $color="#052642"
            disabled={disableButton}
            onClick={() => cancelAppointment(appointmentSteps[0]?.id)}
          >
            Cancel Appointment
          </StyledChartBtn>
        ) : (
          <StyledChartBtn
            $bg="linear-gradient(180deg, #1CC9DB 0%, #07ABBC 100%)"
            $color="#fff"
            disabled={disableButton}
            onClick={() =>
              createAppointment({
                branchId: selectedBranch.id,
                date: moment(sidebarData.date, "YYYY-MM-DD").format(
                  "YYYY-MM-DD",
                ),
                appointmentSteps,
              })
            }
          >
            {t("create")}
          </StyledChartBtn>
        )}
      </ActionsBox>
    </>
  );
};

export default Edit;
