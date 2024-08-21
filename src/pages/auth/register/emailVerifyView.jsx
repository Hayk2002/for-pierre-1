import { useDispatch, useSelector } from "react-redux";
import { notification } from "antd";
import { useTranslation } from "react-i18next";

import { Envelope } from "assets/images";
import { resendEmail } from "pages/auth/actions";
import { selectIsLoading } from "store/selectors";
import Card from "shared/components/card";
import { PrimaryButton } from "shared/buttons/styles";
import CircleLoader from "shared/components/circleLoader";
import { EmailVerificationContent } from "../styles";

const EmailVerifyView = ({ email }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const isFetching = useSelector(selectIsLoading);

  const handleAccountVerification = () => {
    dispatch(
      resendEmail({ email }, () => {
        notification.success({
          message: t("resent-success-msg"),
          duration: 3,
          description: t("resent-notification-description"),
        });
      }),
    );
  };

  return (
    <Card title={t("check-your-email")}>
      <EmailVerificationContent>
        <Envelope />
        <p>{t("verify-email-text")}</p>
        {isFetching ? (
          <CircleLoader />
        ) : (
          <PrimaryButton onClick={handleAccountVerification}>
            {t("resend-email")}
          </PrimaryButton>
        )}
      </EmailVerificationContent>
    </Card>
  );
};

export default EmailVerifyView;
