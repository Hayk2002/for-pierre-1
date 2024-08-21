import { Form } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import Layout from "layouts/layout";
import Card from "shared/components/card";
import { getItemFromLocalStorage, setPageTitle } from "utils/helpers";
import { selectActiveBranch, selectBranchesList } from "store/selectors";
import { DefaultButton, PrimaryButton } from "shared/buttons/styles";
import { editBranch, getBranchesList } from "sharedStore/actions";
import BranchForm from "../components/branchForm";
import { EditPageWrapper } from "../styles";

const branchId = getItemFromLocalStorage("branchId");

const BranchesEditPage = () => {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const branches = useSelector(selectBranchesList);
  const selectedBranch = useSelector(selectActiveBranch);

  const [selectedBranchInfo, setSelectedBranchInfo] = useState({});

  useEffect(() => {
    const branch = branches.find(
      (item) => item.id === Number(selectedBranch.id || branchId),
    );
    setSelectedBranchInfo(branch);
  }, [branches, selectedBranch.id]);

  useEffect(() => {
    setPageTitle("edit-branch");
  }, []);

  useEffect(() => {
    dispatch(getBranchesList());
  }, [dispatch]);

  useEffect(() => {
    form.setFieldsValue({
      ...selectedBranchInfo,
      timelineStart: selectedBranchInfo?.timelineStart
        ?.split(":")
        .slice(0, 2)
        .join(":"),
      timelineEnd: selectedBranchInfo?.timelineEnd
        ?.split(":")
        .slice(0, 2)
        .join(":"),
    });
  }, [selectedBranchInfo, form]);

  const returnBack = () => {
    navigate("/companies/profile");
  };

  const handleBranchEdit = (values) => {
    dispatch(editBranch(values, () => navigate("/companies/profile")));
  };

  return (
    <Layout
      isProfile
      backButtonTitle={t("my-company")}
      title={t("edit-branch")}
    >
      <EditPageWrapper>
        <Card>
          <BranchForm isEdit form={form} handleBranchEdit={handleBranchEdit}>
            <DefaultButton onClick={returnBack}>{t("cancel")}</DefaultButton>
            <PrimaryButton htmlType="submit">{t("save")}</PrimaryButton>
          </BranchForm>
        </Card>
      </EditPageWrapper>
    </Layout>
  );
};

export default BranchesEditPage;
