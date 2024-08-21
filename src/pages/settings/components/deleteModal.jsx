import { useTranslation } from "react-i18next";

import Card from "shared/components/card";
import { CardInfo, CustomModal } from "shared/components/styles";
import { DefaultButton, RedButton } from "shared/buttons/styles";

const DeleteModal = ({
  title,
  isVisible,
  isService,
  isResource,
  closeModal,
  handleItemDelete,
}) => {
  const { t } = useTranslation();

  const isSpecialization = !(isService || isResource);

  return (
    <CustomModal visible={isVisible} onCancel={closeModal}>
      <Card title={title}>
        <CardInfo>
          {isSpecialization && t("specialization-delete-text")}
          {isService && t("service-delete-text")}
          {isResource && t("resource-delete-text")}
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

export default DeleteModal;
