import { useEffect } from "react";
import { List, message, Tooltip } from "antd";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { UserOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";

import { selectCompaniesList, selectIsLoading } from "store/selectors";
import RenderEmptyView from "shared/components/emptyView";
import {
  CalendarIcon,
  SettingsIcon,
  StaffIcon,
  ResubmitIcon,
  TriangleWarningIcon,
  RejectIcon,
} from "assets/images";
import { setItemsToLocalStorage } from "utils/helpers";
import { insertCompanyIdInHeader } from "api/axios";
import { CustomAvatar } from "shared/components/styles";
import { companyAccountType, companyApprovalState } from "shared/enums";
import { CustomList } from "shared/styles";
import { CompanyApprovalActions, ListItemAction } from "../styles";
import {
  removeSelectedCompany,
  resubmitCompany,
  setSelectedCompany,
} from "../actions";

const CompaniesList = ({ form, toggleStepsModalState }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isFetching = useSelector(selectIsLoading);
  const companiesList = useSelector(selectCompaniesList);

  useEffect(() => {
    localStorage.removeItem("companyId");
    insertCompanyIdInHeader(null);
    dispatch(removeSelectedCompany());
  }, [dispatch]);

  const handleOnCompanyCLick = (company) => {
    dispatch(setSelectedCompany(company));
    if (company.hasBranches) {
      navigate(`/companies/profile`);
      setItemsToLocalStorage({ companyId: company.id });
    } else if (
      !company.hasBranches &&
      company.status === companyApprovalState.Approved
    ) {
      insertCompanyIdInHeader(company.id);
      toggleStepsModalState();
      form.setFieldsValue({
        ...company,
      });
    }
  };

  const handleListActionClick = (company, url) => {
    setItemsToLocalStorage({ companyId: company.id });
    dispatch(setSelectedCompany(company));
    navigate(`/${url}`);
  };

  const handleOnResubmitClick = (companyId) => {
    dispatch(
      resubmitCompany(companyId, () =>
        message.success(t("invitation-resent-msg"), 3),
      ),
    );
  };

  const renderCompanyActions = (company) => {
    const isVisible =
      company.accountTypeId === companyAccountType.Owner ||
      company.accountTypeId === companyAccountType.Admin;

    const hasBranch = company.hasBranches;

    return (
      <>
        {isVisible && (
          <Tooltip placement="top" title={t("settings")}>
            <ListItemAction
              onClick={() =>
                hasBranch && handleListActionClick(company, "settings")
              }
            >
              <SettingsIcon />
            </ListItemAction>
          </Tooltip>
        )}
        <Tooltip placement="top" title={t("appointments")}>
          <ListItemAction
            onClick={() =>
              hasBranch && handleListActionClick(company, "appointments")
            }
          >
            <CalendarIcon />
          </ListItemAction>
        </Tooltip>
        {isVisible && (
          <Tooltip placement="top" title={t("staff")}>
            <ListItemAction
              onClick={() =>
                hasBranch && handleListActionClick(company, "staff")
              }
            >
              <StaffIcon />
            </ListItemAction>
          </Tooltip>
        )}
      </>
    );
  };

  return (
    <CustomList
      loading={isFetching}
      itemLayout="horizontal"
      className="companies-list"
      dataSource={companiesList}
      locale={{
        emptyText: <RenderEmptyView text={t("empty-companies-text")} />,
      }}
      renderItem={(item) => (
        <List.Item
          onClick={() => handleOnCompanyCLick(item)}
          actions={[
            item.status === companyApprovalState.Approved &&
              renderCompanyActions(item),
            item.status === companyApprovalState.Pending && (
              <CompanyApprovalActions>
                <div onClick={() => handleOnResubmitClick(item.id)}>
                  <ResubmitIcon />
                  <p>{t("resubmit")}</p>
                </div>
                <Tooltip
                  placement="bottom"
                  title={t("unverified-company-text")}
                >
                  <TriangleWarningIcon />
                </Tooltip>
              </CompanyApprovalActions>
            ),
            item.status === companyApprovalState.Rejected && (
              <CompanyApprovalActions>
                <div onClick={() => handleOnResubmitClick(item.id)}>
                  <ResubmitIcon />
                  <p>{t("resubmit")}</p>
                </div>
                <Tooltip placement="bottom" title={t("rejected-company-text")}>
                  <RejectIcon />
                </Tooltip>
              </CompanyApprovalActions>
            ),
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
            title={item.name}
          />
          <div className="truncated-text">{item.description}</div>
        </List.Item>
      )}
    />
  );
};

export default CompaniesList;
