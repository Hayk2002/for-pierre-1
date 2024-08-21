import { Form } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import Layout from "layouts/layout";
import {
  CustomForm,
  CustomFormActions,
  CustomFormItem,
  CustomInput,
  PasswordInput,
} from "shared/styles";
import {
  objectToForm,
  passwordRegExp,
  setPageTitle,
  getItemFromLocalStorage,
} from "utils/helpers";
import {
  CustomModal,
  ProfileCard,
  ProfileCardContent,
  ProfileCardFooter,
  ProfileCardHeader,
} from "shared/components/styles";
import { DefaultButton, PrimaryButton } from "shared/buttons/styles";
import useUpload from "shared/hooks/useUpload";
import ImageUploadView from "shared/components/imageUploadView";
import CircleLoader from "shared/components/circleLoader";
import { selectIsLoading, selectUserInfo } from "store/selectors";
import Card from "shared/components/card";
import {
  changeProfilePassword,
  editUserProfile,
  removeProfileImage,
} from "../actions";

const ProfileEditPage = () => {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userInfo = useSelector(selectUserInfo);
  const isFetching = useSelector(selectIsLoading);
  const { image, imageUrl, uploadImage, resetImage } = useUpload();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [user, setUser] = useState({});

  useEffect(() => {
    setPageTitle("edit-profile");
  }, []);

  useEffect(() => {
    setUser(
      Object.entries(userInfo).length
        ? userInfo
        : getItemFromLocalStorage("user"),
    );
  }, [userInfo]);

  useEffect(() => {
    form.setFieldsValue({
      firstName: user.firstName,
      lastName: user.lastName,
      title: user.title,
      email: user.email,
    });
  }, [form, user.email, user.firstName, user.lastName, user.title]);

  const handleFormSubmit = (values) => {
    const formData = objectToForm(values);

    if (image) {
      formData.append("Image", image);
    }

    dispatch(editUserProfile(formData, () => navigate("/profile")));
  };

  const handleProfileImageRemove = () => {
    if (image) {
      resetImage();
    } else {
      dispatch(removeProfileImage());
    }
  };

  const toggleModalState = () => {
    setIsModalVisible(!isModalVisible);
  };

  const handlePasswordFormSubmit = (values) => {
    dispatch(changeProfilePassword(values, () => toggleModalState()));
  };

  return (
    <Layout
      isProfile
      customUrl="/profile"
      title={t("edit-profile")}
      backButtonTitle={t("my-profile")}
      backButtonText={t("edit-profile")}
    >
      <ProfileCard>
        <ProfileCardHeader style={{ height: 80 }} />
        <ProfileCardContent
          style={{ flexDirection: "column", padding: "0 50px 32px" }}
        >
          <div className="user-info user-info_edit">
            <ImageUploadView
              isProfile
              uploadImage={uploadImage}
              imageUrl={imageUrl || `${user.photoUrl}?${new Date()}`}
              removeProfileImage={handleProfileImageRemove}
            />
          </div>
          <div>
            <CustomForm id="form" onFinish={handleFormSubmit} form={form}>
              <CustomFormItem
                name="firstName"
                label={`${t("name")}*`}
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
              <CustomFormItem name="title" label={t("title")}>
                <CustomInput />
              </CustomFormItem>
              <CustomFormItem name="email" label={t("email")}>
                <CustomInput disabled />
              </CustomFormItem>
              <CustomFormItem>
                <DefaultButton onClick={toggleModalState}>
                  {t("change-pass")}
                </DefaultButton>
              </CustomFormItem>
            </CustomForm>
          </div>
        </ProfileCardContent>
        <ProfileCardFooter style={{ alignItems: "center" }}>
          {isFetching ? (
            <CircleLoader />
          ) : (
            <PrimaryButton form="form" htmlType="submit">
              {t("save")}
            </PrimaryButton>
          )}
        </ProfileCardFooter>
      </ProfileCard>
      <CustomModal
        footer={null}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
      >
        <Card title={t("change-pass")}>
          <CustomForm onFinish={handlePasswordFormSubmit}>
            <CustomFormItem
              name="currentPassword"
              label={t("current-pass")}
              rules={[{ required: true, message: t("required-field-msg") }]}
            >
              <PasswordInput />
            </CustomFormItem>
            <CustomFormItem
              name="newPassword"
              label={t("new-pass")}
              rules={[
                {
                  pattern: passwordRegExp,
                  message: t("pass-validation-msg"),
                },
                {
                  required: true,
                  message: t("required-field-msg"),
                },
              ]}
            >
              <PasswordInput />
            </CustomFormItem>
            <CustomFormItem
              style={{ marginBottom: 50 }}
              name="confirmPassword"
              label={t("confirm-new-pass")}
              hasFeedback
              rules={[
                {
                  required: true,
                  message: t("required-field-msg"),
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("newPassword") === value) {
                      return Promise.resolve();
                    }

                    return Promise.reject(new Error(t("pass-match-msg")));
                  },
                }),
              ]}
            >
              <PasswordInput />
            </CustomFormItem>
            <CustomFormActions row>
              {isFetching ? (
                <CircleLoader />
              ) : (
                <>
                  <DefaultButton onClick={toggleModalState}>
                    {t("cancel")}
                  </DefaultButton>
                  <PrimaryButton htmlType="submit">{t("save")}</PrimaryButton>
                </>
              )}
            </CustomFormActions>
          </CustomForm>
        </Card>
      </CustomModal>
    </Layout>
  );
};

export default ProfileEditPage;
