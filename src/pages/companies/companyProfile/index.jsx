import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import { setPageTitle, setItemsToLocalStorage } from "utils/helpers";
import Layout from "layouts/layout";
import { selectActiveCompany, selectIsLoading } from "store/selectors";
import Card from "shared/components/card";
import CircleLoader from "shared/components/circleLoader";
import { DefaultButton, PrimaryButton } from "shared/buttons/styles";
import { CustomModal } from "shared/components/styles";
import {
  getBranchesList,
  createBranch,
  deleteBranch,
} from "sharedStore/actions";
import { ActiveCompanyWrapper, BranchesWrapper } from "../styles";
import BranchDeleteModal from "../branches/branchDeleteModal";
import BranchForm from "../components/branchForm";
import Branches from "../branches";
import CompanyProfileCard from "./companyProfileCard";
import { getCompanyStaff } from "../../staff/actions";

const CompanyProfilePage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const isFetching = useSelector(selectIsLoading);
  const activeCompany = useSelector(selectActiveCompany);

  const [selectedBranchId, setSelectedBranchId] = useState(0);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);

  useEffect(() => {
    setPageTitle("companies");
    localStorage.removeItem("branchId");
  }, []);

  useEffect(() => {
    if (activeCompany?.accountTypeId === 4) {
      dispatch(
        getCompanyStaff((data) => setItemsToLocalStorage({ member: data[0] })),
      );
    }
  }, [activeCompany?.accountTypeId, dispatch]);

  useEffect(() => {
    dispatch(getBranchesList());
  }, [dispatch]);

  const toggleBranchDeleteModal = () => {
    setIsDeleteModalVisible(!isDeleteModalVisible);
  };

  const collapseCreateBranchModal = () => {
    setIsCreateModalVisible(!isCreateModalVisible);
  };

  const handleBranchDelete = (id) => {
    dispatch(deleteBranch(id, () => toggleBranchDeleteModal()));
  };

  const handleBranchCreate = (values) => {
    const payload = { ...values };
    if (!payload?.phones?.length) {
      delete payload.phones;
    }
    dispatch(createBranch(payload, () => setIsCreateModalVisible(false)));
  };

  return (
    <>
      <Layout isProfile title={t("company-profile")}>
        {isFetching ? (
          <CircleLoader />
        ) : (
          <ActiveCompanyWrapper>
            <CompanyProfileCard />
            <BranchesWrapper>
              <Branches
                setSelectedBranchId={setSelectedBranchId}
                openBranchDeleteModal={toggleBranchDeleteModal}
                openBranchCreateModal={collapseCreateBranchModal}
              />
            </BranchesWrapper>
          </ActiveCompanyWrapper>
        )}
      </Layout>
      <BranchDeleteModal
        isVisible={isDeleteModalVisible}
        toggleBranchDeleteModal={toggleBranchDeleteModal}
        handleOnDeleteClick={() => handleBranchDelete(selectedBranchId)}
      />
      <CustomModal
        visible={isCreateModalVisible}
        onCancel={collapseCreateBranchModal}
        destroyOnClose
      >
        <Card small title={t("add-branch")}>
          <BranchForm handleBranchCreate={handleBranchCreate}>
            <DefaultButton onClick={collapseCreateBranchModal}>
              {t("cancel")}
            </DefaultButton>
            <PrimaryButton htmlType="submit">{t("save")}</PrimaryButton>
          </BranchForm>
        </Card>
      </CustomModal>
    </>
  );
};

export default CompanyProfilePage;
