import { useEffect, useState } from "react";
import { Tooltip, message } from "antd";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { UserOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";

import Layout from "layouts/layout";
import RenderEmptyView from "shared/components/emptyView";
import {
  selectCompanyAccountsList,
  selectCompanyInvitationsList,
  selectIsLoading,
} from "store/selectors";
import { CustomAvatar } from "shared/components/styles";
import TableHeader from "shared/components/tableHeader";
import { setPageTitle, antTableSearch, renderRow } from "utils/helpers";
import {
  CustomTable,
  TableActionsWrapper,
  TableDescriptionWrapper,
} from "shared/styles";
import {
  ClockIcon,
  DeleteIcon,
  PencilIconGray,
  RejectIcon,
  ResubmitIcon,
  TriangleWarningIcon,
  UserIcon,
} from "assets/images";
import {
  getCompanyStaff,
  getCompanyInvitations,
  reInviteUser,
} from "./actions";
import { InvitationStateActions, StaffMemberInfo } from "./styles";
import DeleteMemberModal from "./components/modals/deleteMember";
import AddMemberModal from "./components/modals/addMember";
import { companyAccountType, userInvitationStatuses } from "../../shared/enums";

const StaffPage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isFetching = useSelector(selectIsLoading);
  const companyAccounts = useSelector(selectCompanyAccountsList);
  const invitations = useSelector(selectCompanyInvitationsList);

  const [dataList, setDataList] = useState([]);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  useEffect(() => {
    setPageTitle("staff");
  }, []);

  useEffect(() => {
    dispatch(getCompanyStaff());
    dispatch(getCompanyInvitations());
  }, [dispatch]);

  useEffect(() => {
    setDataList([...companyAccounts, ...invitations]);
  }, [companyAccounts, invitations]);

  const handleSearch = (e) => {
    const searchKey = e.target.value;
    if (searchKey.length) {
      antTableSearch(
        [...companyAccounts, ...invitations],
        searchKey,
        ["accountTypeName", "name", "email"],
        (filteredList) => setDataList(filteredList),
      );
    } else {
      setDataList([...companyAccounts, ...invitations]);
    }
  };

  const handleOnAddModalClose = () => {
    setIsAddModalVisible(false);
    setSelectedMember(null);
  };

  const handleOnDeleteModalClose = () => {
    setIsDeleteModalVisible(false);
    setSelectedMember(null);
  };

  const handleOnEditClick = (member) => {
    setSelectedMember(member);
    setIsAddModalVisible(true);
  };

  const handleOnDeleteClick = (member) => {
    setSelectedMember(member);
    setIsDeleteModalVisible(true);
  };

  const handleOnInviteClick = (email, accountTypeId) => {
    dispatch(
      reInviteUser(
        { email, accountTypeId, status: userInvitationStatuses.Pending },
        () => {
          message.success(t("invitation-resent-msg"), 3);
        },
      ),
    );
  };

  const columns = [
    {
      dataIndex: "name",
      width: "20%",
      render: (_, { name, title, photoUrl, searchKey }) => ({
        children: (
          <StaffMemberInfo>
            <CustomAvatar size={36} src={photoUrl} icon={<UserOutlined />} />
            <div>
              {renderRow(name, searchKey)}
              {renderRow(title, searchKey, "highlighter-title")}
            </div>
          </StaffMemberInfo>
        ),
      }),
    },
    {
      dataIndex: "email",
      width: "20%",
      render: (_, { email, searchKey }) => renderRow(email, searchKey),
    },
    {
      dataIndex: "accountTypeName",
      width: "20%",
      render: (_, { accountTypeName, searchKey }) =>
        renderRow(
          accountTypeName === "ServiceProvider"
            ? t("service-provider")
            : t(accountTypeName.toLowerCase()),
          searchKey,
        ),
    },
    {
      dataIndex: "actions",
      width: "20%",
      render: (_, record) => (
        <TableDescriptionWrapper >
          {record.accountTypeId !== companyAccountType.Owner && (
            <>
              {[
                userInvitationStatuses.Pending,
                userInvitationStatuses.Expired,
                userInvitationStatuses.Rejected,
                userInvitationStatuses.NotInvited,
              ].includes(record.status) && (
                <InvitationStateActions
                  onClick={() =>
                    handleOnInviteClick(record.email, record.accountTypeId)
                  }
                >
                  <ResubmitIcon />
                  <p>
                    {record.status === userInvitationStatuses.NotInvited
                      ? t("invite")
                      : t("reinvite")}
                  </p>
                  <Tooltip
                    placement="top"
                    title={
                      (record.status === userInvitationStatuses.Pending &&
                        t("pending-invitation-text")) ||
                      (record.status === userInvitationStatuses.Expired &&
                        t("expired-invitation-text")) ||
                      (record.status === userInvitationStatuses.Rejected &&
                        t("rejected-invitation-text"))
                    }
                  >
                    {record.status === userInvitationStatuses.Pending && (
                      <TriangleWarningIcon />
                    )}
                    {record.status === userInvitationStatuses.Expired && (
                      <ClockIcon />
                    )}
                    {record.status === userInvitationStatuses.Rejected && (
                      <RejectIcon />
                    )}
                  </Tooltip>
                </InvitationStateActions>
              )}
              <TableActionsWrapper
                isServiceProvider={
                  (record.accountTypeId ===
                    companyAccountType.ServiceProvider &&
                    record.status === userInvitationStatuses.Accepted) ||
                  record.accountId
                }
              >
                {((record.accountTypeId ===
                  companyAccountType.ServiceProvider &&
                  record.accountId) ||
                  (record.accountTypeId ===
                    companyAccountType.ServiceProvider &&
                    record.status === userInvitationStatuses.Accepted)) && (
                  <Tooltip placement="top" title={t("profile")}>
                    <UserIcon
                      onClick={() =>
                        navigate(`/staff/${record.accountId ?? record.id}`)
                      }
                    />
                  </Tooltip>
                )}
                <Tooltip placement="top" title={t("edit")}>
                  <PencilIconGray
                    onClick={() => {
                      handleOnEditClick(record);
                    }}
                  />
                </Tooltip>
                <Tooltip placement="top" title={t("delete")}>
                  <DeleteIcon
                    onClick={() => {
                      handleOnDeleteClick(record);
                    }}
                  />
                </Tooltip>
              </TableActionsWrapper>
            </>
          )}
        </TableDescriptionWrapper>
      ),
    },
  ];

  return (
    <Layout noMargin contentScrollable>
      <TableHeader
        btnText={t("add-user")}
        searchText={t("search")}
        handleSearch={handleSearch}
        openFormModal={() => setIsAddModalVisible((prev) => !prev)}
      />
      <CustomTable
        bordered
        rowKey="id"
        columns={columns}
        showHeader={false}
        loading={isFetching}
        dataSource={dataList}
        locale={{
          emptyText: <RenderEmptyView text={t("empty-specializations-text")} />,
        }}
        pagination={{ pageSize: 10 }}
      />
      <DeleteMemberModal
        handleOnDeleteModalClose={handleOnDeleteModalClose}
        isDeleteModalVisible={isDeleteModalVisible}
        selectedMember={selectedMember}
        userInvitationStatuses={userInvitationStatuses}
      />
      <AddMemberModal
        isVisible={isAddModalVisible}
        onClose={handleOnAddModalClose}
        selectedMember={selectedMember}
        userInvitationStatuses={userInvitationStatuses}
      />
    </Layout>
  );
};

export default StaffPage;
