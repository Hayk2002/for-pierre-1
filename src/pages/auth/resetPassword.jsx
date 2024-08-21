import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

import {
  CustomForm,
  CustomFormActions,
  CustomFormItem,
  PasswordInput,
} from "shared/styles";
import CircleLoader from "shared/components/circleLoader";
import { DefaultButton, PrimaryButton } from "shared/buttons/styles";
import Card from "shared/components/card";
import { selectIsLoading } from "store/selectors";
import { passwordRegExp, setPageTitle } from "utils/helpers";
import { resetPassword } from "./actions";

const ResetPasswordPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isFetching = useSelector(selectIsLoading);

  const query = new URLSearchParams(useLocation().search);
  const email = query.get("email");
  const invUid = query.get("invUid");
  const passwordResetToken = query.get("token");

  useEffect(() => {
    setPageTitle("reset-password");
  }, []);

  const handlePasswordReset = ({ newPassword, confirmPassword }) => {
    dispatch(
      resetPassword(
        {
          email,
          invUid,
          newPassword,
          confirmPassword,
          passwordResetToken,
        },
        () => navigate("/login"),
      ),
    );
  };

  return (
    <Card title={t("reset-pass-title")}>
      <CustomForm onFinish={handlePasswordReset}>
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
          hasFeedback
          name="confirmPassword"
          label={t("confirm-pass")}
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
        <CustomFormItem>
          <CustomFormActions row>
            {isFetching ? (
              <CircleLoader />
            ) : (
              <>
                <DefaultButton onClick={() => navigate("/login")}>
                  {t("cancel")}
                </DefaultButton>
                <PrimaryButton htmlType="submit">{t("save")}</PrimaryButton>
              </>
            )}
          </CustomFormActions>
        </CustomFormItem>
      </CustomForm>
    </Card>
  );
};

export default ResetPasswordPage;
