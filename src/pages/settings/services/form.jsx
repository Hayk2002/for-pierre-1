import { Select } from "antd";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import {
  CustomForm,
  CustomFormActions,
  CustomFormItem,
  CustomInput,
  CustomSelect,
  CustomTextArea,
} from "shared/styles";
import { PolygonIcon } from "assets/images";
import { selectIsLoading } from "store/selectors";
import CircleLoader from "shared/components/circleLoader";
import { DefaultButton, PrimaryButton } from "shared/buttons/styles";
import { generateServiceDurations } from "utils/helpers";
import ColorPicker from "shared/components/colorPicker";
import { addService, editService } from "../actions";

const { Option } = Select;
const durationMinutes = generateServiceDurations(180);

const ServicesForm = ({ form, isEdit, closeModal, editableService }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const isFetching = useSelector(selectIsLoading);

  const [serviceColor, setServiceColor] = useState(
    form.getFieldValue("color") || "#fcb900",
  );

  const handleColorChange = (hex) => {
    setServiceColor(hex);
    form.setFieldsValue({
      color: hex,
    });
  };

  const handleDurationChange = (value) => {
    form.setFieldsValue({
      duration: value,
    });
  };

  const handleFormSubmit = (values) => {
    const payload = { ...values, color: serviceColor, isReception: false };
    if (isEdit) {
      dispatch(editService(editableService.id, payload, () => closeModal()));
    } else {
      dispatch(addService(payload, () => closeModal()));
    }
  };

  return (
    <CustomForm form={form} onFinish={handleFormSubmit}>
      <CustomFormItem
        name="name"
        label={t("service-name")}
        rules={[
          {
            required: true,
            message: t("required-field-msg"),
          },
        ]}
      >
        <CustomInput />
      </CustomFormItem>
      <CustomFormItem name="description" label={t("description")}>
        <CustomTextArea autoSize={{ minRows: 3, maxRows: 5 }} />
      </CustomFormItem>
      <div style={{ display: "flex" }}>
        <CustomFormItem
          name="duration"
          label={t("duration")}
          style={{ marginBottom: 0 }}
          rules={[
            {
              required: true,
              message: t("required-field-msg"),
            },
          ]}
        >
          <CustomSelect style={{ width: 130 }} onChange={handleDurationChange} suffixIcon={<PolygonIcon />}>
            {durationMinutes.map(({ id, label }) => (
              <Option key={id} value={id}>
                {label}
              </Option>
            ))}
          </CustomSelect>
        </CustomFormItem>
        <CustomFormItem name="color" label={t("color")} style={{ margin: 0 }}>
          <ColorPicker handleChange={handleColorChange} color={serviceColor} />
        </CustomFormItem>
      </div>
      <CustomFormItem>
        <CustomFormActions row>
          {isFetching ? (
            <CircleLoader />
          ) : (
            <>
              <DefaultButton onClick={closeModal}>{t("cancel")}</DefaultButton>
              <PrimaryButton htmlType="submit">{t("save")}</PrimaryButton>
            </>
          )}
        </CustomFormActions>
      </CustomFormItem>
    </CustomForm>
  );
};

export default ServicesForm;
