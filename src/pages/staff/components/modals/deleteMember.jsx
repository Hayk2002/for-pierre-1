import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

import Card from "shared/components/card";
import { CardInfo, CustomModal } from "shared/components/styles";
import CircleLoader from "shared/components/circleLoader";
import { DefaultButton, RedButton } from "shared/buttons/styles";
import { selectIsLoading } from "store/selectors";
import { deleteStaffMember, deleteInvitedMember } from "../../actions";

const MemberDeleteModal = ({
  handleOnDeleteModalClose,
  isDeleteModalVisible,
  selectedMember,
  userInvitationStatuses,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const isFetching = useSelector(selectIsLoading);

  const invitationStatuses = [
    userInvitationStatuses.Pending,
    userInvitationStatuses.Rejected,
    userInvitationStatuses.NotInvited,
    userInvitationStatuses.Expired,
  ];

  const handleDelete = () => {
    if (invitationStatuses.includes(selectedMember.status)) {
      dispatch(
        deleteInvitedMember({ id: selectedMember.id }, () =>
          handleOnDeleteModalClose(),
        ),
      );
    } else {
      dispatch(
        deleteStaffMember({ id: selectedMember.id }, () =>
          handleOnDeleteModalClose(),
        ),
      );
    }
  };

  return (
    <CustomModal
      visible={isDeleteModalVisible}
      onCancel={handleOnDeleteModalClose}
    >
      <Card title={t("remove-the-user")}>
        <CardInfo>{t("remove-user-text")}</CardInfo>
        <div style={{ display: "flex" }}>
          {isFetching ? (
            <CircleLoader />
          ) : (
            <>
              <DefaultButton
                style={{ marginRight: 30 }}
                onClick={handleOnDeleteModalClose}
              >
                {t("cancel")}
              </DefaultButton>
              <RedButton onClick={handleDelete}>{t("remove")}</RedButton>
            </>
          )}
        </div>
      </Card>
    </CustomModal>
  );
};

export default MemberDeleteModal;
