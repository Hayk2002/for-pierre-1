import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { PlusOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";

import ImageUploadView from "shared/components/imageUploadView";
import {
  CustomForm,
  CustomFormActions,
  CustomFormItem,
  CustomInput,
} from "shared/styles";
import { phoneRegExp } from "utils/helpers";
import CircleLoader from "shared/components/circleLoader";
import { selectActiveCompany, selectIsLoading } from "store/selectors";
import { removeCompanyImage } from "../actions";

const CompanyForm = ({
  form,
  isEdit,
  stepNext,
  children,
  resetImage,
  isInStepFlow,
  companyImage,
  handleCompanyEdit,
  uploadCompanyImage,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const isFetching = useSelector(selectIsLoading);
  const activeCompany = useSelector(selectActiveCompany);

  const [activeCompanyPhoto, setActiveCompanyPhoto] = useState("");

  useEffect(() => {
    setActiveCompanyPhoto(`${activeCompany?.photoUrl}?${new Date()}`);
  }, [activeCompany?.photoUrl]);

  const handleFormSubmit = (values) => {
    if (isEdit) {
      handleCompanyEdit(values);
    } else {
      stepNext(values);
    }

    if (!activeCompanyPhoto) {
      dispatch(removeCompanyImage());
    }
  };

  const handleCompanyImageRemove = () => {
    resetImage();
    setActiveCompanyPhoto(null);
  };

  return (
    <CustomForm form={form} onFinish={handleFormSubmit}>
      <ImageUploadView
        isInStepFlow={isInStepFlow}
        uploadImage={uploadCompanyImage}
        removeCompanyImage={handleCompanyImageRemove}
        imageUrl={companyImage || activeCompanyPhoto}
      />
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
      <CustomFormItem name="websites" label={t("website")}>
        <CustomInput />
      </CustomFormItem>
      <CustomFormItem
        name="emails"
        label={t("email")}
        style={{ marginBottom: 0 }}
        rules={[
          {
            type: "email",
            message: t("invalid-email"),
          },
        ]}
      >
        <CustomInput />
      </CustomFormItem>
      <CustomFormItem>
        <CustomFormActions row>
          {isFetching ? <CircleLoader /> : children}
        </CustomFormActions>
      </CustomFormItem>
    </CustomForm>
  );
};

export default CompanyForm;
