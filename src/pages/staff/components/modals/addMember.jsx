import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Select, Form, message } from "antd";

import Card from "shared/components/card";
import {
  CustomCheckbox,
  CustomForm,
  CustomFormActions,
  CustomFormItem,
  CustomInput,
  CustomSelect,
} from "shared/styles";
import CircleLoader from "shared/components/circleLoader";
import { DefaultButton, PrimaryButton } from "shared/buttons/styles";
import { CustomModal } from "shared/components/styles";
import { rolesList } from "shared/enums";
import { selectIsLoading, selectCompanyInvitationsList } from "store/selectors";
import { InvitationCheckboxWrapper } from "../../styles";
import {
  inviteUserToCompany,
  updateCompanyUser,
  updateInvitedUser,
} from "../../actions";

const { Option } = Select;

const AddMemberModal = ({
  isVisible,
  onClose,
  selectedMember,
  userInvitationStatuses,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const invitationStatuses = [
    userInvitationStatuses.Pending,
    userInvitationStatuses.Rejected,
    userInvitationStatuses.NotInvited,
  ];

  const invitations = useSelector(selectCompanyInvitationsList);
  const isFetching = useSelector(selectIsLoading);

  const [selectedRole, setSelectedRole] = useState(rolesList[0].label);
  const [addWithoutInvitation, setAddWithoutInvitation] = useState(false);

  useEffect(() => {
    if (selectedMember) {
      form.setFieldsValue({
        email: selectedMember.email,
        accountTypeId: selectedMember.accountTypeId,
      });
    } else {
      form.resetFields();
    }
  }, [form, selectedMember]);

  const selectRole = (roleId) => {
    setAddWithoutInvitation(false);
    const { label } = rolesList.find((item) => item.id === roleId);
    setSelectedRole(label);
  };

  const handleOnClose = () => {
    setAddWithoutInvitation(false);
    setSelectedRole(rolesList[0].label);
    onClose();
  };

  const handleFormSubmit = (values) => {
    if (!selectedMember) {
      const existedUser = invitations.filter(
        ({ email }) => email === values.email,
      );
      if (!existedUser.length) {
        dispatch(
          inviteUserToCompany(
            {
              ...values,
              isWithoutInvitation: addWithoutInvitation,
            },
            () => handleOnClose(),
          ),
        );
      } else {
        message.error(t("existed-user-msg"));
        handleOnClose();
      }
    } else if (invitationStatuses.includes(selectedMember.status)) {
      dispatch(
        updateInvitedUser(
          {
            id: selectedMember.id,
            ...values,
            accountTypeName: rolesList.find(
              ({ id }) => id === values.accountTypeId,
            ).label,
          },
          () => handleOnClose(),
        ),
      );
    } else {
      dispatch(
        updateCompanyUser(
          {
            id: selectedMember.id,
            ...values,
            accountTypeName: rolesList.find(
              ({ id }) => id === values.accountTypeId,
            ).label,
          },
          () => handleOnClose(),
        ),
      );
    }
  };

  return (
    <CustomModal visible={isVisible} onCancel={handleOnClose} destroyOnClose>
      <Card small title={selectedMember ? t("edit-user") : t("add-user")}>
        <CustomForm form={form} onFinish={handleFormSubmit} preserve={false}>
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
            <CustomInput
              disabled={
                !selectedMember
                  ? false
                  : !(
                      selectedMember.accountTypeId === 4 &&
                      selectedMember.name !== null &&
                      selectedMember.status !== 1
                    )
              }
            />
          </CustomFormItem>
          <CustomFormItem
            label={t("role")}
            name="accountTypeId"
            style={{ marginBottom: 0 }}
            rules={[
              {
                required: true,
                message: t("required-field-msg"),
              },
            ]}
          >
            <CustomSelect
              onChange={selectRole}
              disabled={selectedMember?.accountTypeId === 4}
            >
              {rolesList.map(({ id, label }) => (
                <Option key={id} value={id}>
                  {t(label)}
                </Option>
              ))}
            </CustomSelect>
          </CustomFormItem>
          {selectedRole === rolesList[3].label && !selectedMember && (
            <CustomFormItem>
              <InvitationCheckboxWrapper>
                <CustomCheckbox
                  checked={addWithoutInvitation}
                  onChange={() => setAddWithoutInvitation((prev) => !prev)}
                />
                <p>{t("add-without-invitation")}</p>
              </InvitationCheckboxWrapper>
            </CustomFormItem>
          )}
          {selectedRole === rolesList[3].label &&
            addWithoutInvitation &&
            !selectedMember && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  columnGap: "20px",
                }}
              >
                <CustomFormItem
                  name="firstName"
                  sibling="true"
                  style={{ height: "65px" }}
                  rules={[
                    {
                      required: true,
                      message: t("required-field-msg"),
                    },
                  ]}
                  label={t("first-name")}
                >
                  <CustomInput />
                </CustomFormItem>
                <CustomFormItem
                  name="lastName"
                  sibling="true"
                  style={{ height: "65px" }}
                  rules={[
                    {
                      required: true,
                      message: t("required-field-msg"),
                    },
                  ]}
                  label={t("last-name")}
                >
                  <CustomInput />
                </CustomFormItem>
              </div>
            )}
          <CustomFormItem>
            <CustomFormActions row>
              {isFetching ? (
                <CircleLoader />
              ) : (
                <>
                  <DefaultButton onClick={handleOnClose}>
                    {t("cancel")}
                  </DefaultButton>
                  <PrimaryButton htmlType="submit">{t("add")}</PrimaryButton>
                </>
              )}
            </CustomFormActions>
          </CustomFormItem>
        </CustomForm>
      </Card>
    </CustomModal>
  );
};

export default AddMemberModal;
