import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import { selectIsLoading } from "store/selectors";
import { setPageTitle } from "utils/helpers";
import Card from "shared/components/card";
import {
  CustomForm,
  CustomFormActions,
  CustomFormItem,
  CustomInput,
  PasswordInput,
} from "shared/styles";
import { PrimaryButton } from "shared/buttons/styles";
import CircleLoader from "shared/components/circleLoader";
import { loginUser } from "./actions";
import { ForgotPasswordLink, AccountPageSwitcher } from "./styles";

const LoginPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isFetching = useSelector(selectIsLoading);

  const handleUserLogin = ({ email, password }) => {
    dispatch(
      loginUser({ email, password }, (response) => {
        if (response?.firstName) {
          navigate("/companies");
        } else {
          navigate("/completeProfile");
        }
      }),
    );
  };

  useEffect(() => {
    setPageTitle("sign-in");
  }, []);

  return (
    <Card title={t("sign-in-title")}>
      <CustomForm onFinish={handleUserLogin}>
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
          <CustomInput />
        </CustomFormItem>
        <CustomFormItem
          name="password"
          label={t("pass")}
          style={{ marginBottom: 0 }}
          rules={[
            {
              required: true,
              message: t("required-field-msg"),
            },
          ]}
        >
          <PasswordInput />
        </CustomFormItem>
        <CustomFormItem style={{ marginBottom: 0 }}>
          <ForgotPasswordLink to="/forgotPassword">
            {t("forgot-pass")}
          </ForgotPasswordLink>
        </CustomFormItem>
        <CustomFormItem>
          <CustomFormActions>
            {isFetching ? (
              <CircleLoader />
            ) : (
              <PrimaryButton htmlType="submit">{t("sign-in")}</PrimaryButton>
            )}
            <AccountPageSwitcher>
              {t("dont-have-account")} <Link to="/register">{t("create")}</Link>
            </AccountPageSwitcher>
          </CustomFormActions>
        </CustomFormItem>
      </CustomForm>
    </Card>
  );
};

export default LoginPage;
