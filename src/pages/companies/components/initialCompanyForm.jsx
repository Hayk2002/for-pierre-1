import { useTranslation } from "react-i18next";
import { PlusOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";

import {
  CustomForm,
  CustomFormActions,
  CustomFormItem,
  CustomInput,
} from "shared/styles";
import { objectToForm, phoneRegExp } from "utils/helpers";
import CircleLoader from "shared/components/circleLoader";
import { selectIsLoading } from "store/selectors";
import { DefaultButton, PrimaryButton } from "shared/buttons/styles";
import { createCompany } from "../actions";

const InitialCompanyForm = ({ form, closeModal, showSuccessModal }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const isFetching = useSelector(selectIsLoading);

  const handleFormSubmit = (values) => {
    const formData = objectToForm(values);

    dispatch(
      createCompany(formData, () => {
        closeModal();
        showSuccessModal();
      }),
    );
  };

  return (
    <CustomForm form={form} onFinish={handleFormSubmit}>
      <CustomFormItem
        name="name"
        label={t("company-name")}
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
        label={`${t("phone-number")}*`}
        rules={[
          {
            pattern: phoneRegExp,
            message: t("invalid-phone"),
          },
          {
            required: true,
            message: t("required-field-msg"),
          },
        ]}
      >
        <CustomInput prefix={<PlusOutlined />} placeholder="XXX XX XXX XXX" />
      </CustomFormItem>
      <CustomFormItem>
        <CustomFormActions row>
          {isFetching ? (
            <CircleLoader />
          ) : (
            <>
              <DefaultButton onClick={closeModal}>{t("cancel")}</DefaultButton>
              <PrimaryButton htmlType="submit">{t("send")}</PrimaryButton>
            </>
          )}
        </CustomFormActions>
      </CustomFormItem>
    </CustomForm>
  );
};

export default InitialCompanyForm;
