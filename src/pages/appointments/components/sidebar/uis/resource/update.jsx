import { useEffect, useCallback, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { Form } from "antd";
import moment from "moment";

import { selectDisableButton, selectTimeSlotes } from "store/selectors";
import { CustomSelect, CustomTextarea } from "shared/styles";
import {
  generateDurationsList,
  checkIfSelectedTimeIsCorrect,
} from "../../helper";
import { getAppointmentTimeSlots, updateStep } from "../../../../actions";
import { AppointmentInfo, ActionsBox, StyledChartBtn } from "../../styles";

const FormItem = Form.Item;
const { Option } = CustomSelect;

const Update = ({
  selectedBranch,
  date,
  prevType,
  editableItem,
  updateSiderState,
  setChartData,
}) => {
  const { t } = useTranslation();
  const disableButton = useSelector(selectDisableButton);

  const { data, field, services, id } = editableItem;
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  let firstRender = true;

  const providers = services.filter(
    ({ serviceId }) => serviceId === data.serviceId,
  )[0]?.companyAccountUsers;

  const timeSlots = useSelector(selectTimeSlotes);

  const getTimeSlots = useCallback(() => {
    const selectedServiceId = form.getFieldValue("serviceId");
    const callback = firstRender
      ? null
      : (range) => checkIfSelectedTimeIsCorrect(range, form);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    firstRender = false;
    if (selectedServiceId) {
      dispatch(
        getAppointmentTimeSlots(
          {
            branchId: selectedBranch.id,
            accountId: form.getFieldValue("accountId") ?? null,
            serviceId: selectedServiceId,
            resourceId: data.resourceId,
            date: moment(date, "YYYY-MM-DD").format("YYYY-MM-DD"),
            duration: form.getFieldValue("duration"),
          },
          callback,
        ),
      );
    }
  }, [data.resourceId, date, dispatch, form, selectedBranch.id]);

  const handleServiceSelect = useCallback(
    (serviceId, providerId, duration) => {
      const service = services.find((item) => item.serviceId === serviceId);
      form.setFieldsValue({
        accountId: typeof providerId === "number" ? providerId : null,
        duration: duration || service.duration,
      });

      if (typeof providerId === "number") {
        getTimeSlots();
      }
    },
    [form, getTimeSlots, services],
  );

  useEffect(() => {
    if (field === "step") {
      form.setFieldsValue({
        serviceId: data.serviceId,
        resourceId: data.resourceId,
        startTime: moment(data.startTime, "HH:mm:ss").format("HH:mm"),
        duration: data.duration,
        note: data.note,
      });
      handleServiceSelect(data.serviceId, data.accountId, data.duration);
    }
  }, [field, data, form, handleServiceSelect]);

  const durationsList = generateDurationsList(90);

  const updateAppointment = (values) => {
    if (prevType === "edit") {
      dispatch(
        updateStep({
          branchId: selectedBranch.id,
          date: moment(date, "YYYY-MM-DD").format("YYYY-MM-DD"),
          appointmentSteps: [
            {
              id: data.id,
              accountId: values.accountId,
              serviceId: values.serviceId,
              resourceId: data.resourceId,
              startTime: values.startTime,
              duration: values.duration,
              note: values.note,
            },
          ],
        }),
      );

      updateSiderState(false, "");
    } else {
      setChartData((prev) => ({
        ...prev,
        appointmentSteps: prev.appointmentSteps.map((step, index) => {
          if (index === id) {
            return {
              ...step,
              duration: values.duration,
              note: values.note,
              resourceId: data.resourceId,
              serviceId: values.serviceId,
              accountId: values.accountId,
              startTime: values.startTime,
            };
          }
          return step;
        }),
      }));
      updateSiderState(true, prevType);
    }
  };

  return (
    <Form form={form} onFinish={updateAppointment} style={{ height: "82%" }}>
      <AppointmentInfo $height="90%" className="scrollable">
        <h4>{data.resourceName}</h4>
        <br />
        <FormItem name="serviceId">
          <CustomSelect
            onSelect={handleServiceSelect}
            placeholder={t("choose-service")}
          >
            {services.map(({ serviceId, serviceName }) => (
              <Option key={serviceId} value={serviceId}>
                {serviceName}
              </Option>
            ))}
          </CustomSelect>
        </FormItem>
        <FormItem name="accountId">
          <CustomSelect
            placeholder={t("choose-provider")}
            onChange={getTimeSlots}
          >
            {providers.map((provider) => (
              <Option key={provider.id} value={provider.id}>
                {provider.firstName} {provider.lastName}
              </Option>
            ))}
          </CustomSelect>
        </FormItem>
        <div className="duration">
          <FormItem
            name="startTime"
            label={t("start-time")}
            labelCol={{ span: 24 }}
          >
            <CustomSelect>
              {timeSlots.map(({ value, label }) => (
                <Option key={value} value={value}>
                  {label}
                </Option>
              ))}
            </CustomSelect>
          </FormItem>
          <FormItem
            name="duration"
            label={t("duration")}
            labelCol={{ span: 24 }}
          >
            <CustomSelect onChange={getTimeSlots}>
              {durationsList.map((item) => (
                <Option key={item} value={item}>
                  {item}
                </Option>
              ))}
            </CustomSelect>
          </FormItem>
        </div>
        <FormItem name="note" label={t("comment")} labelCol={{ span: 24 }}>
          <CustomTextarea />
        </FormItem>
      </AppointmentInfo>
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
    </Form>
  );
};

export default Update;
