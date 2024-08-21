import { useTranslation } from "react-i18next";

import Card from "shared/components/card";
import { CardInfo, CustomModal } from "shared/components/styles";
import { DefaultButton, RedButton } from "shared/buttons/styles";

const DeleteConfirmationModal = ({
  title,
  warningInfo,
  isVisible,
  closeModal,
  handleItemDelete,
}) => {
  const { t } = useTranslation();

  return (
    <CustomModal visible={isVisible} onCancel={closeModal}>
      <Card>
        <CardInfo>
          <b>{title}</b>
          <br />
          {warningInfo}
        </CardInfo>
        <div style={{ display: "flex" }}>
          <DefaultButton style={{ marginRight: 30 }} onClick={closeModal}>
            {t("cancel")}
          </DefaultButton>
          <RedButton onClick={handleItemDelete}>{t("remove")}</RedButton>
        </div>
      </Card>
    </CustomModal>
  );
};

export default DeleteConfirmationModal;
