import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import {
  CustomForm,
  CustomFormActions,
  CustomFormItem,
  CustomInput,
  PasswordInput,
} from "shared/styles";
import { PrimaryButton } from "shared/buttons/styles";
import CircleLoader from "shared/components/circleLoader";
import Card from "shared/components/card";
import { selectIsLoading } from "store/selectors";
import EmailVerifyView from "pages/auth/register/emailVerifyView";
import {
  passwordRegExp,
  setItemsToLocalStorage,
  setPageTitle,
} from "utils/helpers";
import { registerUser } from "../actions";
import { AccountPageSwitcher } from "../styles";
import * as types from "../constants";

const RegisterPage = ({ isInvitationFlow, form, invitedUserEmail }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isFetching = useSelector(selectIsLoading);

  const [userEmail, setUserEmail] = useState(null);

  useEffect(() => {
    setPageTitle("registration");
  }, []);

  useEffect(() => {
    if (isInvitationFlow) {
      form.setFieldsValue({
        email: invitedUserEmail,
      });
    }
  }, [form, invitedUserEmail, isInvitationFlow]);

  const handleUserRegistration = (values) => {
    if (isInvitationFlow) {
      dispatch(
        registerUser(values, (data) => {
          setItemsToLocalStorage({ token: data.token });
          setItemsToLocalStorage({ refreshToken: data.refreshToken });
          dispatch({ type: types.SET_USER_DATA, payload: data });
          navigate("/completeProfile");
        }),
      );
    } else {
      dispatch(registerUser(values, ({ email }) => setUserEmail(email)));
    }
  };

  return !userEmail ? (
    <Card title={t("create-account-title")}>
      <CustomForm form={form} onFinish={handleUserRegistration}>
        <CustomFormItem
          name="email"
          label={t("email")}
          rules={[
            {
              type: "email",
              message: t("invalid-email"),
            },
            {
              required: true,
              message: t("required-field-msg"),
            },
          ]}
        >
          <CustomInput disabled={invitedUserEmail} />
        </CustomFormItem>
        <CustomFormItem
          name="password"
          label={t("pass")}
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
                if (!value || getFieldValue("password") === value) {
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
          <CustomFormActions>
            {isFetching ? (
              <CircleLoader />
            ) : (
              <PrimaryButton htmlType="submit">
                {t("create-account")}
              </PrimaryButton>
            )}
            <AccountPageSwitcher>
              {t("already-have-account")}{" "}
              <Link to="/login">{t("sign-in")}</Link>
            </AccountPageSwitcher>
          </CustomFormActions>
        </CustomFormItem>
      </CustomForm>
    </Card>
  ) : (
    <EmailVerifyView email={userEmail} />
  );
};

export default RegisterPage;
