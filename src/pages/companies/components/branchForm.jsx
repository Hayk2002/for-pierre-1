import { Select } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { PlusOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";

import {
  CustomForm,
  CustomFormActions,
  CustomFormItem,
  CustomInput,
  CustomSelect,
} from "shared/styles";
import { generateTimeRange, phoneRegExp } from "utils/helpers";
import CircleLoader from "shared/components/circleLoader";
import { selectIsLoading, selectTimezonesList } from "store/selectors";
import { getTimezonesList } from "../actions";
import { WorkingHoursInputs, WorkingHoursWrapper } from "../styles";

const { Option } = Select;

const workingHours = generateTimeRange({
  timelineStart: "00:00",
  timelineEnd: "23:55",
});

const BranchForm = ({
  form,
  isEdit,
  children,
  isInCompany,
  handleBranchEdit,
  handleBranchCreate,
  handleCompanyUpdate,
  companyFieldsValues,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const isFetching = useSelector(selectIsLoading);
  const timeZones = useSelector(selectTimezonesList);

  const [toTimes, setToTimes] = useState([]);
  const [fromTimes, setFromTimes] = useState([]);

  useEffect(() => {
    setToTimes(workingHours.slice(1));
    setFromTimes(workingHours.slice(0, workingHours.length - 1));
  }, []);

  useEffect(() => {
    dispatch(getTimezonesList());
  }, [dispatch]);

  const handleFormSubmit = (values) => {
    if (isInCompany) {
      handleCompanyUpdate(companyFieldsValues, { ...values });
    } else if (!isInCompany && isEdit) {
      handleBranchEdit(values);
    } else {
      handleBranchCreate(values);
    }
  };

  const handleStartTimeChange = (time) => {
    const selectedItemIndex = workingHours.findIndex(
      ({ value }) => value === time,
    );

    const toTimeList = workingHours.slice(selectedItemIndex + 1);
    setToTimes(toTimeList);

    if (isEdit) {
      const { timelineEnd } = form.getFieldsValue();
      let canItemBeSelected = false;

      toTimeList.forEach(({ value }) => {
        if (value === timelineEnd) canItemBeSelected = true;
      });

      if (!canItemBeSelected) {
        form.resetFields(["timelineEnd"]);
      }
    }
  };

  const handleEndTimeChange = (time) => {
    const selectedItemIndex = workingHours.findIndex(
      ({ value }) => value === time,
    );

    const fromTimeList = workingHours.slice(0, selectedItemIndex);
    setFromTimes(fromTimeList);

    if (isEdit) {
      const { timelineStart } = form.getFieldsValue();
      let canItemBeSelected = false;

      fromTimeList.forEach(({ value }) => {
        if (value === timelineStart) canItemBeSelected = true;
      });

      if (!canItemBeSelected) {
        form.resetFields(["timelineStart"]);
      }
    }
  };

  return (
    <CustomForm form={form} onFinish={handleFormSubmit}>
      <CustomFormItem
        name="name"
        label={t("branch-name")}
        rules={[
          {
            required: true,
            message: t("required-field-msg"),
          },
        ]}
      >
        <CustomInput />
      </CustomFormItem>
      <CustomFormItem
        name="address"
        label={t("address")}
        rules={[
          {
            required: true,
            message: t("required-field-msg"),
          },
        ]}
      >
        <CustomInput />
      </CustomFormItem>
      <CustomFormItem
        name="phones"
        label={t("phone-number")}
        rules={[
          {
            pattern: phoneRegExp,
            message: t("invalid-phone"),
          },
        ]}
      >
        <CustomInput prefix={<PlusOutlined />} placeholder="XXX XX XXX XXX" />
      </CustomFormItem>
      <WorkingHoursWrapper>
        <label>{t("branch-working-hours")}</label>
        <WorkingHoursInputs>
          <CustomFormItem
            name="timelineStart"
            sibling="true"
            rules={[
              {
                required: true,
                message: t("required-field-msg"),
              },
            ]}
          >
            <CustomSelect
              showSearch
              style={{ width: 130 }}
              onChange={handleStartTimeChange}
            >
              {fromTimes.map(({ value }) => (
                <Option key={value} value={value}>
                  {value}
                </Option>
              ))}
            </CustomSelect>
          </CustomFormItem>
          <span className="middle-line">-</span>
          <CustomFormItem
            name="timelineEnd"
            sibling="true"
            dependencies={["timeLineStart"]}
            rules={[
              {
                required: true,
                message: t("required-field-msg"),
              },
            ]}
          >
            <CustomSelect
              showSearch
              style={{ width: 130 }}
              onChange={handleEndTimeChange}
            >
              {toTimes.map(({ value }) => (
                <Option key={value} value={value}>
                  {value}
                </Option>
              ))}
            </CustomSelect>
          </CustomFormItem>
        </WorkingHoursInputs>
      </WorkingHoursWrapper>
      <CustomFormItem
        name="timezone"
        label={t("timezone")}
        rules={[
          {
            required: true,
            message: t("required-field-msg"),
          },
        ]}
      >
        <CustomSelect>
          {timeZones.map((item) => (
            <Option key={item.id} value={item.id}>
              {item.displayName}
            </Option>
          ))}
        </CustomSelect>
      </CustomFormItem>
      <CustomFormItem>
        <CustomFormActions row>
          {isFetching ? <CircleLoader /> : children}
        </CustomFormActions>
      </CustomFormItem>
    </CustomForm>
  );
};

export default BranchForm;
