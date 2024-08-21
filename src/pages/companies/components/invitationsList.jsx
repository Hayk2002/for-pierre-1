import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { UserOutlined } from "@ant-design/icons";

import RenderEmptyView from "shared/components/emptyView";
import { selectInvitationsList, selectIsLoading } from "store/selectors";
import { CheckIcon, CloseIcon } from "assets/images";
import { insertCompanyIdInHeader } from "api/axios";
import { CustomAvatar } from "shared/components/styles";
import { List, Tooltip } from "antd";
import { CustomList } from "shared/styles";
import { ListItemAction } from "../styles";
import { changeInvitation } from "../actions";

const InvitationsList = ({ closeListView }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const isFetching = useSelector(selectIsLoading);
  const invitationsList = useSelector(selectInvitationsList);

  const handleInvitationChange = ({ id, status, companyId }) => {
    closeListView();
    insertCompanyIdInHeader(companyId);
    dispatch(changeInvitation({ id, status }));
  };

  return (
    <CustomList
      loading={isFetching}
      itemLayout="horizontal"
      className="invitations-list"
      dataSource={invitationsList}
      locale={{
        emptyText: <RenderEmptyView text={t("empty-invitations-text")} />,
      }}
      renderItem={(item) => (
        <List.Item
          actions={[
            <Tooltip placement="top" title={t("reject")}>
              <ListItemAction
                style={{ width: 15, height: 15 }}
                onClick={() =>
                  handleInvitationChange({
                    id: item.id,
                    companyId: item.companyId,
                    status: 2,
                  })
                }
              >
                <CloseIcon />
              </ListItemAction>
            </Tooltip>,
            <Tooltip placement="top" title={t("accept")}>
              <ListItemAction
                style={{ height: 15 }}
                onClick={() =>
                  handleInvitationChange({
                    id: item.id,
                    companyId: item.companyId,
                    status: 1,
                  })
                }
              >
                <CheckIcon />
              </ListItemAction>
            </Tooltip>,
          ]}
        >
          <List.Item.Meta
            avatar={
              <CustomAvatar
                $isSquare
                size={50}
                src={item.photoUrl}
                icon={<UserOutlined />}
              />
            }
            title={item.companyName}
          />
          <div className="invitations-list-content">
            <div>{item.email}</div>
            <div>{moment(item.createdDate).format("Do MMM YYYY")}</div>
          </div>
        </List.Item>
      )}
    />
  );
};

export default InvitationsList;
