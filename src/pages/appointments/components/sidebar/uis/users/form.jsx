import { Form } from "antd";
import { useState, useEffect } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";

import { selectDisableButton, selectTimeSlotes } from "store/selectors";
import { UpOutLined, DownOutLined, Avatar, RightArrow } from "assets/images";
import {
  CustomForm,
  CustomFormItem,
  CustomInput,
  CustomSelect,
  CustomTextarea,
} from "shared/styles";
import { TransparentButton } from "shared/buttons/styles";
import { useTranslation } from "react-i18next";
import { clientMobileRegex } from "utils/helpers";
import {
  generateDurationsList,
  checkIfSelectedTimeIsCorrect,
  getSelectedTimeBlockSpecialization,
} from "../../helper";
import { getAppointmentTimeSlots } from "../../../../actions";
import {
  ClientInfo,
  AppointmentInfo,
  ActionsBox,
  StyledBtn,
  StyledChartBox,
} from "../../styles";

const { Option } = CustomSelect;

const UserAppointmentForm = ({
  sidebarData,
  selectedBranch,
  date,
  addService,
  userData,
  createAppointmentHandler,
  stepsCount,
  handleChartClick,
  appointments,
  specializationId,
  tabKey
}) => {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const disableButton = useSelector(selectDisableButton);

  const { id, minute, userProfile } = sidebarData;

  const selectedAppointment = appointments.filter(
    ({ accountId }) => accountId === id,
  )[0];

  const selectedBlock = getSelectedTimeBlockSpecialization(
    selectedAppointment?.appointmentsByDay,
    date,
    minute,
  );

  const services =
    selectedBlock?.specializationId && specializationId
      ? sidebarData.services.filter(
        (service) =>
          service.specializationId === selectedBlock.specializationId,
      )
      : sidebarData.services;

  const timeSlots = useSelector(selectTimeSlotes);

  const [isCascaderOpen, setIsCascaderOpen] = useState(false);
  const [hasResource, setHasResource] = useState(false);
  const [resources, setResources] = useState([]);

  const durationsList = generateDurationsList(90);

  const handleCascaderBodyDisplay = () => {
    setIsCascaderOpen((prev) => !prev);
  };

  useEffect(() => {
    form.resetFields();

    form.setFieldsValue({ startTime: minute });
  }, [form, minute]);

  const handleServiceSelect = (serviceId) => {
    const service = services.find((item) => item.id === serviceId);
    setResources(service.resources);
    setHasResource(Boolean(service.resources.length));
    form.setFieldsValue({ duration: service.duration });
    form.setFieldsValue({ resourceId: null });

    if (!service.resources.length) {
      getTimeSlots();
    }
  };

  const timeSlotsGet = (selectedServiceId) => {
    dispatch(
      getAppointmentTimeSlots(
        {
          branchId: selectedBranch.id,
          accountId: id,
          serviceId: selectedServiceId ?? null,
          resourceId: form.getFieldValue("resourceId") ?? null,
          date,
          duration: form.getFieldValue("duration"),
        },
        (range) => checkIfSelectedTimeIsCorrect(range, form),
      ),
    );
  }

  const getTimeSlots = () => {
    const checkIsRequired = tabKey === "appointment";
    if(id){
      if(checkIsRequired){
        const selectedServiceId = form.getFieldValue("serviceId");
        if(selectedServiceId){
          timeSlotsGet(selectedServiceId)
        }
      }else {
        timeSlotsGet()
      }
    }
  };

  useEffect(() => {
    if (tabKey === "appointment") {
      getTimeSlots();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabKey]);

  return (
    <CustomForm form={form} onFinish={createAppointmentHandler}>
      {userData && (
        <ClientInfo bodyDisplay={isCascaderOpen ? "block" : "none"}>
          <div className="cascader-header">
            <h4>{t("client-info")}</h4>
            <TransparentButton
              type="button"
              onClick={handleCascaderBodyDisplay}
            >
              {isCascaderOpen ? <UpOutLined /> : <DownOutLined />}
            </TransparentButton>
          </div>
          <div className="cascader-body">
            <CustomFormItem
              name="userName"
              label={t("name")}
              initialValue={userData.userName}
            >
              <CustomInput type="text" maxLength={100}/>
            </CustomFormItem>
            <CustomFormItem
              name="phoneNumber"
              style={{ marginTop: 15 }}
              label={t("phone-number")}  
              initialValue={userData.phoneNumber}
              rules={[
                {
                  pattern: clientMobileRegex,
                  message: t("invalid-phone"),
                }
              ]}
            >
              <CustomInput
                prefix={<PlusOutlined />}
                placeholder="XXX XX XXX XXX"
                
              />
            </CustomFormItem>
          </div>
        </ClientInfo>
      )}
      <AppointmentInfo>
        <StyledChartBox>
          <h4>{t("appointment")}</h4>
          {stepsCount > 0 && (
            <div>
              <span>{stepsCount}</span>
              <RightArrow onClick={handleChartClick} />
            </div>
          )}
        </StyledChartBox>

        <div className="provider-box">
          <img src={userProfile?.photoUrl ?? Avatar} alt="Service provider" />
          <div>
            <h5>
              {userProfile?.firstName} {userProfile?.lastName}
            </h5>
            <p>{userProfile?.title}</p>
          </div>
        </div>
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
            {services?.map((service) => (
              <Option key={service.id} value={service.id}>
                {service.name}
              </Option>
            ))}
          </CustomSelect>
        </CustomFormItem>
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
              onChange={getTimeSlots}
              placeholder={t("choose-resource")}
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
            style={{ marginTop: 0 }}
            name="duration"
            label={t("duration")}
            initialValue={15}
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
        <CustomFormItem name="note" label={t("comment")}>
          <CustomTextarea />
        </CustomFormItem>
      </AppointmentInfo>

      <ActionsBox>
        <StyledBtn
          $bg="linear-gradient(180deg, #C8D8E9 0%, #E8EEF2 100%);"
          $color="#052642"
          onClick={() =>
            form.validateFields().then(() => {
              addService(form.getFieldsValue());
            })
          }
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

export default UserAppointmentForm;
