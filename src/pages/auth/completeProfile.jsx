import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import Card from "shared/components/card";
import {
  CustomForm,
  CustomFormActions,
  CustomFormItem,
  CustomInput,
} from "shared/styles";
import CircleLoader from "shared/components/circleLoader";
import { PrimaryButton } from "shared/buttons/styles";
import { selectIsLoading } from "store/selectors";
import { objectToForm, setPageTitle } from "utils/helpers";
import ImageUploadView from "shared/components/imageUploadView";
import useUpload from "shared/hooks/useUpload";
import { completeProfile } from "./actions";

const CompleteProfilePage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isFetching = useSelector(selectIsLoading);
  const { image, imageUrl, uploadImage } = useUpload();

  useEffect(() => {
    setPageTitle("complete-profile");
  }, []);

  const handleProfileCompletion = (values) => {
    const formData = objectToForm(values);

    if (image) {
      formData.append("image", image);
    }

    dispatch(completeProfile(formData, () => navigate("/companies")));
  };

  return (
    <Card title={t("complete-profile")}>
      <CustomForm onFinish={handleProfileCompletion}>
        <ImageUploadView
          isCompleteProfile
          imageUrl={imageUrl}
          uploadImage={uploadImage}
        />
        <CustomFormItem
          name="firstName"
          label={`${t("first-name")}*`}
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
          name="lastName"
          label={`${t("last-name")}*`}
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
          name="title"
          label={t("title")}
          style={{ marginBottom: 0 }}
        >
          <CustomInput />
        </CustomFormItem>
        <CustomFormItem>
          <CustomFormActions>
            {isFetching ? (
              <CircleLoader />
            ) : (
              <PrimaryButton htmlType="submit">{t("create")}</PrimaryButton>
            )}
          </CustomFormActions>
        </CustomFormItem>
      </CustomForm>
    </Card>
  );
};

export default CompleteProfilePage;
