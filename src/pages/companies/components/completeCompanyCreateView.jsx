import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import Card from "shared/components/card";
import Steps from "shared/components/steps";
import Step from "shared/components/steps/step";
import useUpload from "shared/hooks/useUpload";
import { DefaultButton, PrimaryButton } from "shared/buttons/styles";
import { objectToForm, setItemsToLocalStorage } from "utils/helpers";
import { createBranch } from "sharedStore/actions";
import { selectActiveCompany } from "store/selectors";
import BranchForm from "./branchForm";
import CompanyForm from "./companyForm";
import { editCompany, getCompanyProfile } from "../actions";

const CompleteCompanyCreateView = ({ form, closeModal }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { image, imageUrl, uploadImage } = useUpload();
  const activeCompany = useSelector(selectActiveCompany);

  const [current, setCurrent] = useState(0);
  const [companyFieldsValues, setCompanyFieldsValues] = useState({});

  const stepNext = (values) => {
    setCurrent(current + 1);
    setCompanyFieldsValues(values);
  };

  const stepBack = () => {
    setCurrent(current - 1);
  };

  const handleBranchCreate = (values) => {
    dispatch(
      createBranch(values, () => {
        navigate("/companies/profile");
        dispatch(getCompanyProfile(activeCompany?.id));
        setItemsToLocalStorage({ companyId: activeCompany?.id });
      }),
    );
  };

  const handleCompanyUpdate = (values, branchFieldsValues) => {
    const formData = objectToForm(values);

    if (activeCompany?.photoUrl) {
      formData.append("photoUrl", activeCompany?.photoUrl);
    } else {
      formData.append("photoUrl", "");
    }

    if (image) {
      formData.append("image", image);
    }

    dispatch(
      editCompany(formData, () => handleBranchCreate(branchFieldsValues)),
    );
  };

  const steps = [
    {
      count: 1,
      title: t("company"),
      content: (
        <CompanyForm
          form={form}
          isInStepFlow
          stepNext={stepNext}
          companyImage={imageUrl}
          uploadCompanyImage={uploadImage}
        >
          <DefaultButton onClick={closeModal}>{t("cancel")}</DefaultButton>
          <PrimaryButton htmlType="submit">{t("next")}</PrimaryButton>
        </CompanyForm>
      ),
    },
    {
      count: 2,
      title: t("branch"),
      content: (
        <BranchForm
          isInCompany
          handleBranchCreate={handleBranchCreate}
          handleCompanyUpdate={handleCompanyUpdate}
          companyFieldsValues={companyFieldsValues}
        >
          <DefaultButton onClick={stepBack}>{t("back")}</DefaultButton>
          <PrimaryButton htmlType="submit">{t("save")}</PrimaryButton>
        </BranchForm>
      ),
    },
  ];

  return (
    <Card
      small
      title={
        <Steps>
          {steps.map((step) => (
            <Step
              key={step.count}
              current={current}
              count={step.count}
              title={step.title}
            />
          ))}
        </Steps>
      }
    >
      {steps[current].content}
    </Card>
  );
};

export default CompleteCompanyCreateView;
