import { useTranslation } from "react-i18next";

import Card from "shared/components/card";
import { CardInfo, CustomModal } from "shared/components/styles";
import { DefaultButton, PrimaryButton } from "shared/buttons/styles";

const ConfirmationModal = ({ isVisible, closeModal, onConfirm }) => {
  const { t } = useTranslation();

  return (
    <CustomModal visible={isVisible} onCancel={closeModal}>
      <Card title="">
        <CardInfo>{t("clear-sidebar-data")}</CardInfo>
        <div style={{ display: "flex" }}>
          <DefaultButton style={{ marginRight: 30 }} onClick={closeModal}>
            {t("no")}
          </DefaultButton>
          <PrimaryButton onClick={onConfirm}>{t("yes")}</PrimaryButton>
        </div>
      </Card>
    </CustomModal>
  );
};

export default ConfirmationModal;
