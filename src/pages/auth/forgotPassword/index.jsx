import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import {
  CustomForm,
  CustomFormActions,
  CustomFormItem,
  CustomInput,
} from "shared/styles";
import { CardInfo } from "shared/components/styles";
import { PrimaryButton } from "shared/buttons/styles";
import CircleLoader from "shared/components/circleLoader";
import { Link } from "react-router-dom";
import Card from "shared/components/card";
import { useDispatch, useSelector } from "react-redux";
import { selectIsLoading } from "store/selectors";
import { setPageTitle } from "utils/helpers";
import PasswordResetView from "pages/auth/forgotPassword/passwordResetView";
import { AccountPageSwitcher } from "../styles";
import { forgotPassword } from "../actions";

const ForgotPasswordPage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const isFetching = useSelector(selectIsLoading);

  const [userEmail, setUserEmail] = useState(null);

  useEffect(() => {
    setPageTitle("pass-recovery");
  }, []);

  const handlePasswordReset = ({ email }) => {
    dispatch(forgotPassword({ email }, (data) => setUserEmail(data.email)));
  };

  return !userEmail ? (
    <Card title={t("pass-recovery")}>
      <CustomForm onFinish={handlePasswordReset}>
        <CardInfo>{t("pass-recovery-text")}</CardInfo>
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
        <CustomFormItem>
          <CustomFormActions>
            {isFetching ? (
              <CircleLoader />
            ) : (
              <PrimaryButton htmlType="submit">{t("continue")}</PrimaryButton>
            )}
            <AccountPageSwitcher>
              <Link to="/login">{t("back-to-sign-in")}</Link>
            </AccountPageSwitcher>
          </CustomFormActions>
        </CustomFormItem>
      </CustomForm>
    </Card>
  ) : (
    <PasswordResetView email={userEmail} />
  );
};

export default ForgotPasswordPage;
