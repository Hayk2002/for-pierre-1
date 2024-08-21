import { Form } from "antd";
import moment from "moment";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { PlusOutlined } from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";

import { selectDisableButton, selectTimeSlotes } from "store/selectors";
import { Avatar } from "assets/images";
import {
  CustomForm,
  CustomFormItem,
  CustomInput,
  CustomSelect,
  CustomTextarea,
} from "shared/styles";
import { clientMobileRegex } from "utils/helpers";
import {
  generateDurationsList,
  checkIfSelectedTimeIsCorrect,
  getSelectedTimeBlockSpecialization,
} from "../../helper";
import {
  getAppointmentTimeSlots,
  updateUserDetails,
  updateStep,
  updateBlocker,
} from "../../../../actions";
import {
  ClientInfo,
  AppointmentInfo,
  ActionsBox,
  StyledChartBtn,
} from "../../styles";

const { Option } = CustomSelect;

const Update = ({
  selectedBranch,
  date,
  prevType,
  editableItem,
  updateSiderState,
  setChartData,
  appointments,
  specializationId,
  isAddingStep,
  setNewStepsData,
  newStepsData,
  updateNewStepsData,
}) => {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const disableButton = useSelector(selectDisableButton);

  const { data, field, userProfile, id, customerDetails } = editableItem;
  const selectedAppointment = appointments.filter(
    ({ accountId }) => accountId === data.accountId,
  )[0];

  const selectedBlock = getSelectedTimeBlockSpecialization(
    selectedAppointment?.appointmentsByDay,
    date,
    moment(editableItem.data.startTime, "HH:mm:ss").format("HH:mm"),
  );

  const services =
    selectedBlock?.specializationId && specializationId
      ? editableItem.services?.filter(
          (service) =>
            service.specializationId === selectedBlock.specializationId,
        )
      : editableItem.services;

  const timeSlots = useSelector(selectTimeSlotes);
  const [hasResource, setHasResource] = useState(false);
  const [resources, setResources] = useState([]);
  const [firstRender, setFirstRender] = useState(true);

  const getTimeSlots = () => {
    const selectedServiceId = form.getFieldValue("serviceId");
    const callback = firstRender
      ? null
      : (range) => checkIfSelectedTimeIsCorrect(range, form);

    setFirstRender(false);

    dispatch(
      getAppointmentTimeSlots(
        {
          branchId: selectedBranch.id,
          accountId: data.accountId,
          serviceId: selectedServiceId || null,
          resourceId: form.getFieldValue("resourceId") ?? null,
          date: date ?? moment(data?.date, "YYYY-MM-DD").format("YYYY-MM-DD"),
          duration: form.getFieldValue("duration"),
          stepId: id,
        },
        callback,
      ),
    );
  };

  const handleServiceSelect = (serviceId, resId, duration) => {
    const service = services?.find((item) => item.id === serviceId);
    setResources(service?.resources);
    setHasResource(Boolean(service?.resources.length));
    form.setFieldsValue({ duration: duration || service?.duration });
    form.setFieldsValue({
      resourceId: typeof resId === "number" ? resId : null,
    });

    if (!service?.resources.length || typeof resId === "number") {
      getTimeSlots();
    }
  };

  useEffect(() => {
    if (field !== "clientInfo") {
      form.setFieldsValue({
        serviceId: data.serviceId,
        resourceId: data.resourceId,
        startTime: moment(data.startTime, "HH:mm:ss").format("HH:mm"),
        duration: data.duration,
        note: data.note,
      });
      handleServiceSelect(data.serviceId, data.resourceId, data.duration);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [field, data, form]);

  const durationsList = generateDurationsList(90);

  const updateAppointment = (values) => {
    if (prevType === "edit" || (prevType === "chartContent" && isAddingStep)) {
      if (field === "clientInfo") {
        dispatch(
          updateUserDetails({
            appointmentId: id,
            phoneNumber: values.phoneNumber,
            userName: values.userName,
            accountId: data.accountId,
          }),
        );
      } else if (field === "step") {
        if (!data.appointmentId) {
          const index = editableItem.id;
          setNewStepsData((prev) => {
            prev.appointmentSteps[index] = {
              ...prev.appointmentSteps[index],
              ...values,
            };
            return prev;
          });
        } else {
          dispatch(
            updateStep({
              appointmentId: data.appointmentId,
              branchId: selectedBranch.id,
              date: moment(data?.date, "YYYY-MM-DD").format("YYYY-MM-DD"),
              customerDetails,
              appointmentSteps: [
                {
                  id: data.id,
                  accountId: data.accountId,
                  serviceId: values.serviceId,
                  resourceId: values.resourceId,
                  startTime: values.startTime,
                  duration: values.duration,
                  note: values.note,
                },
              ],
            }),
          );
        }
      } else {
        dispatch(
          updateBlocker({
            id: data.id,
            branchId: selectedBranch.id,
            accountId: data.accountId,
            date: data?.date,
            startTime: values.startTime,
            duration: values.duration,
            reason: values.note,
          }),
        );
      }
      const hasUnsavedSteps = newStepsData?.appointmentSteps?.find(
        (step) => !step.appointmentId,
      );

      if (hasUnsavedSteps) {
        const updatedFields =
          field === "clientInfo"
            ? values
            : {
                ...values,
                endTime: moment(values.startTime, "HH:mm:ss")
                  .add(values.duration, "minute")
                  .format("HH:mm:ss"),
              };

        updateSiderState(
          true,
          "chartContent",
          updateNewStepsData(updatedFields),
        );
      } else {
        updateSiderState(false, "");
      }
    } else {
      if (field === "clientInfo") {
        setChartData((prev) => ({
          ...prev,
          userDetails: {
            phoneNumber: values.phoneNumber,
            userName: values.userName,
          },
        }));
      } else {
        setChartData((prev) => ({
          ...prev,
          appointmentSteps: prev.appointmentSteps.map((step, index) => {
            if (index === id) {
              return {
                ...step,
                duration: values.duration,
                note: values.note,
                resourceId: values.resourceId,
                serviceId: values.serviceId,
                startTime: values.startTime,
              };
            }
            return step;
          }),
        }));
      }
      updateSiderState(true, prevType);
    }
  };
  const isBlockTimeEditing = data.serviceId === null;

  return (
    <CustomForm
      form={form}
      onFinish={updateAppointment}
      style={{ height: "82%" }}
    >
      {field === "clientInfo" ? (
        <ClientInfo bodyDisplay="block">
          <div className="cascader-body" style={{ paddingTop: "10px" }}>
            <CustomFormItem
              name="userName"
              label={t("name")}
              initialValue={data.userName}
            >
              <CustomInput type="text" maxLength={100} />
            </CustomFormItem>
            <CustomFormItem
              name="phoneNumber"
              label={t("phone-number")}
              initialValue={data.phoneNumber}
              rules={[
                {
                  pattern: clientMobileRegex,
                  message: t("invalid-phone"),
                },
              ]}
            >
              <CustomInput
                prefix={<PlusOutlined />}
                placeholder="XXX XX XXX XXX"
              />
            </CustomFormItem>
          </div>
        </ClientInfo>
      ) : (
        <AppointmentInfo $height="90%" className="scrollable">
          <h4>{isBlockTimeEditing ? `Time blocker` : t("appointment")}</h4>
          <div className="provider-box">
            <img src={userProfile?.photoUrl ?? Avatar} alt="Service provider" />
            <div>
              <h5>
                {userProfile
                  ? `${userProfile.firstName} ${userProfile.lastName}`
                  : `${data?.firstName} ${data?.lastName}`}
              </h5>
              <p>{userProfile?.title}</p>
            </div>
          </div>
          {!isBlockTimeEditing ? (
            <CustomFormItem
              name="serviceId"
              rules={[
                {
                  required: true,
                  message: t("required-field-msg"),
                },
              ]}
            >
              <CustomSelect
                onSelect={handleServiceSelect}
                placeholder={t("choose-service")}
              >
                {services ? (
                  services.map((service) => (
                    <Option key={service.id} value={service.id}>
                      {service.name}
                    </Option>
                  ))
                ) : (
                  <Option value={data.serviceId}>{data.serviceName}</Option>
                )}
              </CustomSelect>
            </CustomFormItem>
          ) : (
            ""
          )}
          {hasResource && (
            <CustomFormItem
              name="resourceId"
              rules={[
                {
                  required: true,
                  message: t("required-field-msg"),
                },
              ]}
            >
              <CustomSelect
                placeholder="Select resource"
                onChange={getTimeSlots}
              >
                {resources.map((resource) => (
                  <Option key={resource.id} value={resource.id}>
                    {resource.name}
                  </Option>
                ))}
              </CustomSelect>
            </CustomFormItem>
          )}
          <div className="duration">
            <CustomFormItem
              name="startTime"
              label={t("start-time")}
              rules={[
                {
                  required: true,
                  message: t("required-field-msg"),
                },
              ]}
            >
              <CustomSelect>
                {timeSlots.map(({ value, label }) => (
                  <Option key={value} value={value}>
                    {label}
                  </Option>
                ))}
              </CustomSelect>
            </CustomFormItem>
            <CustomFormItem
              name="duration"
              label={t("duration")}
              initialValue={data.duration}
              rules={[
                {
                  required: true,
                  message: t("required-field-msg"),
                },
              ]}
            >
              <CustomSelect onChange={getTimeSlots}>
                {durationsList.map((item) => (
                  <Option key={item} value={item}>
                    {item}
                  </Option>
                ))}
              </CustomSelect>
            </CustomFormItem>
          </div>
          <CustomFormItem
            name="note"
            label={isBlockTimeEditing ? t("reason") : t("comment")}
            labelCol={{ span: 24 }}
            rules={[
              {
                required: isBlockTimeEditing,
                whitespace: isBlockTimeEditing,
                message: t("required-field-msg"),
              },
            ]}
          >
            <CustomTextarea />
          </CustomFormItem>
        </AppointmentInfo>
      )}
      <ActionsBox>
        <StyledChartBtn
          $bg="linear-gradient(180deg, #1CC9DB 0%, #07ABBC 100%)"
          $color="#fff"
          type="submit"
          disabled={disableButton}
        >
          {t("save")}
        </StyledChartBtn>
      </ActionsBox>
    </CustomForm>
  );
};

export default Update;
