import { useState } from "react";
import moment from "moment";
import { useSelector } from "react-redux";
import { selectDisableButton } from "store/selectors";
import DeleteConfirmationModal from "pages/appointments/components/sidebar/deleteConfirmationModal";
import { useTranslation } from "react-i18next";
import {
  EditIcon,
  SidebarDelete,
  PhoneIcon,
  Mobile,
  UserIcon,
} from "assets/images";
import {
  StyledCard,
  ActionsBox,
  StyledChartBtn,
  StyledDateBlock,
  StyledMobileIconBox,
  StyledStepsListWrapper,
} from "../../styles";


const UserAppointmentEdit = ({
  data,
  sidebarData,
  editAppointment,
  cancelAppointment,
  type,
  createAppointment,
  selectedBranch,
  cancelTimeBlocker,
  isAddingStep,
  newStepsData,
  appointments
}) => {
  const { appointmentSteps, userDetails } = data;
  const [deleteItem, setDeleteItem] = useState("");

  const isTimeBlockEditing =
    appointmentSteps && appointmentSteps[0]?.serviceId === null;

  const { t } = useTranslation();
  const disableButton = useSelector(selectDisableButton);

  const renderButton = () => {
    let lastEndTime = appointmentSteps && appointmentSteps[0]?.endTime;
    let lastEndDate = appointmentSteps && appointmentSteps[0]?.date;
    appointmentSteps?.forEach(element => {
      if (moment(moment(element.endTime, "HH:mm")).isAfter(
        moment(lastEndTime, "HH:mm"))) {
        lastEndTime = element.endTime;
        lastEndDate = element.date
      }
    })

    const compareTimes = moment().format("HH:mm:ss").localeCompare(lastEndTime);
    const compareDates = moment().format("YYYY-MM-DD").localeCompare(moment(lastEndDate).format("YYYY-MM-DD"))

    if (appointmentSteps?.length && appointmentSteps[0].serviceId !== null) {
      if (type === "edit") {
        return (
          <div className="apt-footer-actions">
            {
              (compareDates < 0 || (compareDates === 0 && compareTimes < 0)) &&
                <StyledChartBtn
                  $bg="linear-gradient(180deg, #C8D8E9 0, #E8EEF2 100%)"
                  $color="#052642"
                  disabled={disableButton}
                  onClick={() => cancelAppointment(appointmentSteps[0]?.id, false, "id")}
                >
                  {t("cancel-appointment")}
                </StyledChartBtn>
            }
          </div >
        );
      }

      return (
        <StyledChartBtn
          $bg="linear-gradient(180deg, #1CC9DB 0%, #07ABBC 100%)"
          $color="#fff"
          disabled={disableButton}
          onClick={() => createAppointment({
            branchId: selectedBranch.id,
            date: moment(sidebarData.date, "YYYY-MM-DD").format("YYYY-MM-DD"),
            userName: userDetails?.userName,
            phoneNumber: userDetails?.phoneNumber,
            appointmentSteps,
          })}
        >
          {isAddingStep ? t("save") : t("create")}
        </StyledChartBtn>
      );
    }
    return "";
  };

  const confirmCancelation = () => {

    if (isTimeBlockEditing) {
      cancelTimeBlocker(deleteItem);
    } else cancelAppointment(deleteItem, true, "id");
    setDeleteItem("");
  };

  const editStep = (step, id) => {
    if (step.serviceId !== null) {
      editAppointment(step, "step", id);
    } else {
      editAppointment(step, "timeBlocker", id);
    }
  }

  const editClientInfo = () => {
    editAppointment(
      {
        ...userDetails,
        accountId: appointmentSteps[0].accountId,
      },
      "clientInfo",
      appointmentSteps[0].appointmentId,
    )
  }

  return (
    <>
      <StyledStepsListWrapper className="scrollable">
        <DeleteConfirmationModal
          title={
            isTimeBlockEditing
              ? t("block-time-delete-title")
              : t("delete-appointment")
          }
          warningInfo={
            isTimeBlockEditing
              ? t("block-time-delete-info")
              : t("appointment-delete-text")
          }
          isVisible={deleteItem}
          closeModal={() => setDeleteItem("")}
          handleItemDelete={confirmCancelation}
        />
        {appointmentSteps?.length && appointmentSteps[0].serviceId !== null ? (
          <StyledCard className="userPart">
            <StyledDateBlock>{t("client-info")}</StyledDateBlock>
            <div className="actions">
              <EditIcon
                onClick={() => editClientInfo()}
              />
            </div>

            <div className="client-data">
              <span>
                <UserIcon />
                <p id="user-name">{userDetails?.userName ?? null}</p>
              </span>
              <span className="phone">
                <PhoneIcon /> <p id="user-mobile">{userDetails?.phoneNumber ?? null}</p>
              </span>
            </div>
          </StyledCard>
        ) : (
          ""
        )}
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
            firstName,
            lastName,
            accountId
          } = step;

          const account = appointments.find(sp => sp.accountId === accountId);

          const service = account?.accountServices.find(item => item.id === step.serviceId)
          const serviceName = service?.name || step.serviceName;

          const resource = service?.resources?.find(item => item.id === step.resourceId);
          const resourceName = resource?.name || step.resourceName;
  
          const selectedDate = date || sidebarData.date;

          const end =
            endTime ??
            moment(startTime, "HH:mm").add(duration, "minutes").format("HH:mm");

          const showEditForTimeBlock =
            moment(selectedDate).isBefore(moment()) &&
            moment(end, "HH:mm").isBefore(moment(), "HH:mm");
            
            const stepIsStarted = moment().format("HH:mm:ss").localeCompare(startTime);
            const dateIsPast = moment().format("YYYY-MM-DD").localeCompare(moment(selectedDate).format("YYYY-MM-DD"));

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
                {!showEditForTimeBlock ? (
                  <span className="actions">
                    {(sourceType === 1 || type === "chartContent") && (
                      <EditIcon
                        onClick={() => editStep(step, id ?? index)
                        }
                      />
                    )}
                    {
                    (dateIsPast < 0 || (dateIsPast === 0 && stepIsStarted < 0)) &&
                      <SidebarDelete
                      onClick={() => {
                        if(id){
                          if(isAddingStep){
                            const stepsLength = newStepsData.appointmentSteps?.filter(item => item.appointmentId).length;
                            if(stepsLength > 1){
                              setDeleteItem(id)
                            }else cancelAppointment(id, true, "id")
                          }else setDeleteItem(id)
                        }else cancelAppointment(index, true, "index")
                      }}
                    />
                    }
                  </span>
                ) : (
                  ""
                )}
              </div>
              <div style={{ marginTop: showEditForTimeBlock ? "20px" : "0" }}>
                <h4 style={{ marginBottom: 0 }}>{serviceName}</h4>
              </div>
              <div>
                {step.serviceId !== null ? (
                  <b>{`${firstName} ${lastName}`}</b>
                ) : (
                  <b className="block-time-reason">{note}</b>
                )}
              </div>
              {resourceName &&  (
                <div>
                  <b>
                    {t("resource")}: {resourceName}
                  </b>
                </div>
              )}
              {note && step.serviceId !== null && (
                <div className="note">{note}</div>
              )}
            </StyledCard>
          );
        })}
      </StyledStepsListWrapper>
      <ActionsBox>{renderButton()}</ActionsBox>
    </>
  );
};

export default UserAppointmentEdit;
