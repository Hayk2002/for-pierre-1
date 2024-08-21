import { Checkbox } from "antd";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import Card from "shared/components/card";
import { WarningIcon } from "assets/images";
import { CustomFormActions } from "shared/styles";
import CircleLoader from "shared/components/circleLoader";
import { DefaultButton, RedButton } from "shared/buttons/styles";
import { selectIsLoading } from "store/selectors";
import { CustomModal } from "shared/components/styles";
import { useState } from "react";
import { DeleteBranchInfo } from "../styles";

const CheckboxGroup = Checkbox.Group;

const BranchDeleteModal = ({
  isVisible,
  toggleBranchDeleteModal,
  handleOnDeleteClick,
}) => {
  const { t } = useTranslation();

  const isFetching = useSelector(selectIsLoading);

  const [isAllChecked, setIsAllChecked] = useState(false);

  const checkboxOptions = [
    t("delete-branch-first-rule"),
    t("delete-branch-second-rule"),
  ];

  const handleCheckboxGroupChange = (list) => {
    setIsAllChecked(list.length === checkboxOptions.length);
  };

  const handleModalClose = () => {
    toggleBranchDeleteModal();
    setIsAllChecked(false);
  };

  const handleBranchDelete = () => {
    handleOnDeleteClick();
    handleModalClose();
  };

  return (
    <CustomModal visible={isVisible} onCancel={handleModalClose} destroyOnClose>
      <Card small title={t("delete-branch-title")}>
        <DeleteBranchInfo>
          <div className="warning">
            <WarningIcon />
            <p>{t("delete-branch-warning")}</p>
          </div>
          <div className="content">
            <CheckboxGroup
              options={checkboxOptions}
              onChange={handleCheckboxGroupChange}
            />
          </div>
        </DeleteBranchInfo>
        <CustomFormActions row>
          {isFetching ? (
            <CircleLoader />
          ) : (
            <>
              <DefaultButton onClick={handleModalClose}>
                {t("cancel")}
              </DefaultButton>
              <RedButton disabled={!isAllChecked} onClick={handleBranchDelete}>
                {t("delete")}
              </RedButton>
            </>
          )}
        </CustomFormActions>
      </Card>
    </CustomModal>
  );
};

export default BranchDeleteModal;
