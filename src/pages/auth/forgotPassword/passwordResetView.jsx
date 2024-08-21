import { notification } from "antd";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

import { Success } from "assets/images";
import Card from "shared/components/card";
import { PrimaryButton } from "shared/buttons/styles";

import { AccountPageSwitcher, PasswordResetSuccessContent } from "../styles";
import { forgotPassword } from "../actions";

const PasswordResetView = ({ email }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const handleEmailResend = () => {
    dispatch(
      forgotPassword({ email }, () => {
        notification.success({
          message: t("resent-success-msg"),
          duration: 3,
        });
      }),
    );
  };

  return (
    <Card small title={t("reset-pass")}>
      <PasswordResetSuccessContent>
        <Success />
        <p>{t("reset-pass-text")}</p>
        <PrimaryButton type="primary" onClick={handleEmailResend}>
          {t("resend")}
        </PrimaryButton>
        <AccountPageSwitcher>
          <Link to="/login">{t("back-to-sign-in")}</Link>
        </AccountPageSwitcher>
      </PasswordResetSuccessContent>
    </Card>
  );
};

export default PasswordResetView;
