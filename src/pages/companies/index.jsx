import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { setPageTitle } from "utils/helpers";
import Layout from "layouts/layout";
import { selectInvitationsList, selectUserInfo } from "store/selectors";
import { ArrowIcon, MailIcon } from "assets/images";
import Card from "shared/components/card";
import { CardInfo, CustomModal } from "shared/components/styles";
import { PrimaryButton } from "shared/buttons/styles";
import { Form } from "antd";
import InvitationsList from "./components/invitationsList";
import CompaniesList from "./components/companiesList";
import {
  CustomBadge,
  InvitationsWrapper,
  InvitationsWrapperItems,
  InvitationsWrapperTitle,
  ToggleArrowIcon,
} from "./styles";
import InitialCompanyForm from "./components/initialCompanyForm";
import CompleteCompanyCreateView from "./components/completeCompanyCreateView";

const CompaniesPage = () => {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const userInfo = useSelector(selectUserInfo);
  const invitationsList = useSelector(selectInvitationsList);

  const [isListVisible, setIsListVisible] = useState(false);
  const [isStepsModalVisible, setIsStepsModalVisible] = useState(false);
  const [isCompanyModalVisible, setIsCompanyModalVisible] = useState(false);
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);

  useEffect(() => {
    setPageTitle("companies");
  }, []);

  useEffect(() => {
    if (userInfo?.firstName) {
      navigate("/companies");
    } else {
      navigate("/completeProfile");
    }
  }, [navigate, userInfo?.firstName]);

  const collapseInvitationsListState = () => {
    setIsListVisible(!isListVisible);
  };

  const toggleSuccessModalState = () => {
    setIsSuccessModalVisible(!isSuccessModalVisible);
  };

  const toggleCompanyModalState = () => {
    form.resetFields();
    setIsCompanyModalVisible(!isCompanyModalVisible);
  };

  const toggleStepsModalState = () => {
    setIsStepsModalVisible(!isStepsModalVisible);
  };

  return (
    <>
      <Layout
        hasButton
        contentScrollable
        title={t("companies")}
        handleButtonClick={toggleCompanyModalState}
      >
        <InvitationsWrapper onClick={collapseInvitationsListState}>
          <InvitationsWrapperItems>
            <MailIcon />
            <InvitationsWrapperTitle>
              {t("invitations")}
            </InvitationsWrapperTitle>
            <CustomBadge disabled={!invitationsList?.length}>
              {invitationsList?.length}
            </CustomBadge>
          </InvitationsWrapperItems>
          <ToggleArrowIcon toggled={isListVisible}>
            <ArrowIcon />
          </ToggleArrowIcon>
        </InvitationsWrapper>
        {isListVisible && (
          <InvitationsList closeListView={collapseInvitationsListState} />
        )}
        <CompaniesList
          form={form}
          toggleStepsModalState={toggleStepsModalState}
        />
      </Layout>
      <CustomModal
        visible={isCompanyModalVisible}
        onCancel={toggleCompanyModalState}
      >
        <Card title={t("create-company")}>
          <InitialCompanyForm
            form={form}
            closeModal={toggleCompanyModalState}
            showSuccessModal={toggleSuccessModalState}
          />
        </Card>
      </CustomModal>
      <CustomModal
        visible={isSuccessModalVisible}
        onCancel={toggleSuccessModalState}
      >
        <Card title={t("request-sent")} style={{ textAlign: "center" }}>
          <CardInfo>{t("company-request-text")}</CardInfo>
          <PrimaryButton onClick={toggleSuccessModalState}>
            {t("got-it")}
          </PrimaryButton>
        </Card>
      </CustomModal>
      <CustomModal
        visible={isStepsModalVisible}
        onCancel={toggleStepsModalState}
      >
        <CompleteCompanyCreateView
          form={form}
          closeModal={toggleStepsModalState}
        />
      </CustomModal>
    </>
  );
};

export default CompaniesPage;
