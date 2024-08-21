import { useEffect, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import moment from "moment";
import { Form } from "antd";

import { getTimesAfterGivenTimeInRange } from "utils/helpers";
import { selectBlockTypes } from "store/selectors";
import {
  CustomForm,
  CustomFormItem,
  CustomSelect,
  CustomTextArea,
} from "shared/styles";
import { PrimaryButton, DefaultButton } from "shared/buttons/styles";
import { CustomModal } from "shared/components/styles";
import Card from "shared/components/card";
import { ActionsBox } from "../../styles";

const { Option } = CustomSelect;

const SlotsForm = ({
  isModalVisible,
  availableRanges,
  handleModalOk,
  handleModalOnclose,
  slot,
}) => {
  const [form] = Form.useForm();
  const { t } = useTranslation();

  const blockTypesList = useSelector(selectBlockTypes);

  const [modalEndTimes, setModalEndTimes] = useState([]);

  const handleStartTimeChange = useCallback(
    (val) => {
      if (val) {
        const endRange = availableRanges.filter((range) => range.includes(val));
        setModalEndTimes(getTimesAfterGivenTimeInRange(endRange[0], val));
        if (!endRange[0].includes(form.getFieldValue("endTime"))) {
          form.setFieldsValue({ endTime: null });
        }
      }
    },
    [availableRanges, form],
  );

  useEffect(() => {
    if (Object.entries(slot).length) {
      form.setFieldsValue({
        blockTypeId: slot.blockTypeId,
        description: slot.description,
        startTime: moment(slot.startTime, "HH:mm:ss").format("HH:mm"),
        endTime: moment(slot.endTime, "HH:mm:ss").format("HH:mm"),
        isWorkingDay: slot.isWorkingDay,
        name: slot.name || slot.blockTypeName,
      });

      handleStartTimeChange(moment(slot.startTime, "HH:mm:ss").format("HH:mm"));
    }
  }, [form, handleStartTimeChange, slot]);

  const handleBlockTypeChange = (val) => {
    const block = blockTypesList.filter(({ id }) => val === id)[0];
    form.setFieldsValue({ isWorkingDay: block.isWorking, name: block.name });
  };

  const renderEndTimes = useCallback(() => {
    if (modalEndTimes.length) {
      return modalEndTimes.map((time) => (
        <Option value={time} key={time}>
          {time}
        </Option>
      ));
    }

    let ranges = [];
    availableRanges.forEach((range) => {
      ranges = [...ranges, ...range];
    });

    return ranges.map((time) => (
      <Option value={time} key={time}>
        {time}
      </Option>
    ));
  }, [availableRanges, modalEndTimes]);

  return (
    <CustomModal
      centered
      destroyOnClose
      visible={isModalVisible}
      footer={null}
      onCancel={handleModalOnclose}
    >
      <Card title={t("add-time-interval")}>
        <CustomForm form={form} onFinish={handleModalOk} preserve={false}>
          <CustomFormItem name="isWorkingDay" hidden />
          <CustomFormItem name="name" hidden />
          <CustomFormItem
            name="blockTypeId"
            label={t("select-type")}
            rules={[
              {
                required: true,
                message: t("required-field-msg"),
              },
            ]}
          >
            <CustomSelect onChange={handleBlockTypeChange}>
              {blockTypesList.map((type) => (
                <Option key={type.id} value={type.id}>
                  {t(`${type.name.toLowerCase()}-hours`)}
                </Option>
              ))}
            </CustomSelect>
          </CustomFormItem>
          <CustomFormItem label={t("optional-description")} name="description">
            <CustomTextArea autoSize={{ minRows: 3, maxRows: 5 }} />
          </CustomFormItem>
          <CustomFormItem
            name="startTime"
            label={t("start-time")}
            style={{ width: "40%", float: "left" }}
            rules={[
              {
                required: true,
                message: t("required-field-msg"),
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  const toTime = getFieldValue("endTime");
                  if (
                    moment(moment(value, "HH:mm")).isBefore(
                      moment(toTime, "HH:mm"),
                    ) ||
                    !toTime
                  ) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error(t("wrong-time")));
                },
              }),
            ]}
          >
            <CustomSelect showSearch onChange={handleStartTimeChange}>
              {availableRanges.map((range) =>
                range.map((time) => (
                  <Option value={time} key={time}>
                    {time}
                  </Option>
                )),
              )}
            </CustomSelect>
          </CustomFormItem>
          <CustomFormItem
            name="endTime"
            label={t("end-time")}
            style={{ width: "40%", float: "right" }}
            rules={[
              {
                required: true,
                message: t("required-field-msg"),
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  const fromTime = getFieldValue("startTime");

                  if (
                    moment(moment(value, "HH:mm")).isAfter(
                      moment(fromTime, "HH:mm"),
                    ) ||
                    !fromTime
                  ) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error(t("wrong-time")));
                },
              }),
            ]}
          >
            <CustomSelect
              showSearch
              onChange={() => form.validateFields(["startTime"])}
            >
              {renderEndTimes()}
            </CustomSelect>
          </CustomFormItem>
          <ActionsBox>
            <DefaultButton onClick={handleModalOnclose}>
              {t("cancel")}
            </DefaultButton>
            <PrimaryButton htmlType="submit">{t("save")}</PrimaryButton>
          </ActionsBox>
        </CustomForm>
      </Card>
    </CustomModal>
  );
};

export default SlotsForm;
