import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import * as types from "store/constants";
import { selectError } from "store/selectors";
import Card from "./card";
import { CustomModal, ErrorNotificationContent } from "./styles";
import { RedButton } from "../buttons/styles";

const ErrorNotification = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const error = useSelector(selectError);

  return (
    <CustomModal visible={error}>
      <Card>
        <ErrorNotificationContent>
          <h3>{error?.title}</h3>
          <RedButton onClick={() => dispatch({ type: types.HIDE_ERROR })}>
            {t("ok")}
          </RedButton>
        </ErrorNotificationContent>
      </Card>
    </CustomModal>
  );
};

export default ErrorNotification;
