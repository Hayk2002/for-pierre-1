import { useEffect, memo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form } from "antd";

import { selectDisableButton, selectTimeSlotes } from "store/selectors";
import {
  CustomForm,
  CustomFormItem,
  CustomSelect,
  CustomTextarea,
} from "shared/styles";
import { useTranslation } from "react-i18next";
import { addBlockTime, getAppointmentTimeSlots } from "../../../../actions";
import {
  checkIfSelectedTimeIsCorrect,
  generateDurationsList,
} from "../../helper";
import { AppointmentInfo, ActionsBox, StyledChartBtn } from "../../styles";

const { Option } = CustomSelect;

const TimeBlock = ({
  sidebarData: { minute },
  selectedBranch,
  date,
  accountId,
  updateSiderState,
  tabKey
}) => {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const disableButton = useSelector(selectDisableButton);
  const durationsList = useCallback(() => generateDurationsList(90), []);

  const availableTimes = useSelector(selectTimeSlotes);

  useEffect(() => {
    form.resetFields();

    form.setFieldsValue({ startTime: minute });
  }, [form, minute]);

  const blockhandler = ({ reason, startTime, duration }) => {
    dispatch(
      addBlockTime(
        {
          accountId: +accountId,
          branchId: selectedBranch.id,
          startTime,
          duration,
          reason,
          date,
        },
        updateSiderState(false, ""),
      ),
    );
  };

  const getTimeSlots = () => {
    dispatch(
      getAppointmentTimeSlots(
        {
          branchId: selectedBranch.id,
          accountId: +accountId,
          date,
          duration: form.getFieldValue("duration"),
        },
        (range) => checkIfSelectedTimeIsCorrect(range, form),
      ),
    );
  };

  useEffect(() => {
    if(tabKey === "timeBlocker"){
      getTimeSlots();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabKey]);

  return (
    <CustomForm form={form} onFinish={blockhandler}>
      <AppointmentInfo $height="100%" className="scrollable">
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
              {availableTimes?.map(({ value, label }) => (
                // eslint-disable-next-line react/no-array-index-key
                <Option key={value} value={value}>
                  {label}
                </Option>
              ))}
            </CustomSelect>
          </CustomFormItem>
          <CustomFormItem
            name="duration"
            initialValue={15}
            label={t("duration")}
            rules={[
              {
                required: true,
                message: t("required-field-msg"),
              },
            ]}
          >
            <CustomSelect onChange={getTimeSlots}>
              {durationsList().map((item) => (
                <Option key={item} value={item}>
                  {item}
                </Option>
              ))}
            </CustomSelect>
          </CustomFormItem>
        </div>

        <CustomFormItem
          name="reason"
          label={t("reason")}
          rules={[
            {
              required: true,
              whitespace: true,
              message: t("required-field-msg"),
            },
          ]}
        >
          <CustomTextarea />
        </CustomFormItem>
      </AppointmentInfo>

      <ActionsBox>
        <StyledChartBtn
          $bg="linear-gradient(180deg, #1CC9DB 0%, #07ABBC 100%)"
          $color="#fff"
          type="submit"
          disabled={disableButton}
        >
          {t("block")}
        </StyledChartBtn>
      </ActionsBox>
    </CustomForm>
  );
};

export default memo(TimeBlock);
