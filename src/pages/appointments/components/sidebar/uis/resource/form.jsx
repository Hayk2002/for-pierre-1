import { Form } from "antd";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";

import { selectDisableButton, selectTimeSlotes } from "store/selectors";
import { RightArrow } from "assets/images";
import {
  CustomForm,
  CustomFormItem,
  CustomSelect,
  CustomTextarea,
} from "shared/styles";
import {
  generateDurationsList,
  checkIfSelectedTimeIsCorrect,
} from "../../helper";
import { getAppointmentTimeSlots } from "../../../../actions";
import {
  AppointmentInfo,
  ActionsBox,
  StyledBtn,
  StyledChartBox,
} from "../../styles";

const { Option } = CustomSelect;

const ResourceAppointmentForm = ({
  sidebarData,
  selectedBranch,
  date,
  addService,
  createAppointmentHandler,
  stepsCount,
  handleChartClick,
}) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const disableButton = useSelector(selectDisableButton);

  const { minute, resource } = sidebarData;
  const { services } = resource;

  const timeSlots = useSelector(selectTimeSlotes);

  const [providers, setProviders] = useState([]);

  const durationsList = generateDurationsList(90);

  useEffect(() => {
    form.resetFields();

    form.setFieldsValue({ startTime: minute });
  }, [form, minute]);

  const handleServiceSelect = (serviceId) => {
    const service = services.filter((item) => item.serviceId === serviceId);
    setProviders(service[0]?.companyAccountUsers ?? []);
    form.setFieldsValue({ duration: service[0].duration });
    form.setFieldsValue({ accountId: null });
  };

  const getTimeSlots = (accountId) => {
    const selectedServiceId = form.getFieldValue("serviceId");
    if (selectedServiceId) {
      dispatch(
        getAppointmentTimeSlots(
          {
            branchId: selectedBranch.id,
            accountId,
            serviceId: selectedServiceId,
            resourceId: resource.id,
            date,
            duration: form.getFieldValue("duration"),
          },
          (range) => checkIfSelectedTimeIsCorrect(range, form),
        ),
      );
    }
  };

  return (
    <CustomForm form={form} onFinish={createAppointmentHandler}>
      <AppointmentInfo $height="70%" className="scrollable">
        <StyledChartBox>
          <h4>{resource.name}</h4>
          {stepsCount > 0 && (
            <div>
              <span>{stepsCount}</span>
              <RightArrow onClick={handleChartClick} />
            </div>
          )}
        </StyledChartBox>
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
            {services.map(({ serviceId, serviceName }) => (
              <Option key={serviceId} value={serviceId}>
                {serviceName}
              </Option>
            ))}
          </CustomSelect>
        </CustomFormItem>
        <CustomFormItem
          name="accountId"
          rules={[
            {
              required: true,
              message: t("required-field-msg"),
            },
          ]}
        >
          <CustomSelect
            onChange={getTimeSlots}
            placeholder={t("choose-provider")}
          >
            {providers.map((provider) => (
              <Option key={provider.id} value={provider.id}>
                {provider.firstName} {provider.lastName}
              </Option>
            ))}
          </CustomSelect>
        </CustomFormItem>
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
            rules={[
              {
                required: true,
                message: t("required-field-msg"),
              },
            ]}
          >
            <CustomSelect
              onChange={() => getTimeSlots(form.getFieldValue("accountId"))}
            >
              {durationsList.map((item) => (
                <Option key={item} value={item}>
                  {item}
                </Option>
              ))}
            </CustomSelect>
          </CustomFormItem>
        </div>
        <CustomFormItem name="note" label={t("comment")}>
          <CustomTextarea />
        </CustomFormItem>
      </AppointmentInfo>
      <ActionsBox>
        <StyledBtn
          $bg="linear-gradient(180deg, #C8D8E9 0%, #E8EEF2 100%);"
          $color="#052642"
          onClick={() => addService(form.getFieldsValue())}
        >
          {t("add-service")}
        </StyledBtn>
        <StyledBtn
          $bg="linear-gradient(180deg, #1CC9DB 0%, #07ABBC 100%)"
          $color="#fff"
          type="submit"
          disabled={disableButton}
        >
          {t("create")}
        </StyledBtn>
      </ActionsBox>
    </CustomForm>
  );
};

export default ResourceAppointmentForm;
