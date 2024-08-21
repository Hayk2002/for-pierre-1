import { Form } from "antd";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import Layout from "layouts/layout";
import Card from "shared/components/card";
import { objectToForm, setPageTitle } from "utils/helpers";
import { selectActiveCompany, selectIsLoading } from "store/selectors";
import CircleLoader from "shared/components/circleLoader";
import useUpload from "shared/hooks/useUpload";
import { DefaultButton, PrimaryButton } from "shared/buttons/styles";
import CompanyForm from "../components/companyForm";
import { EditPageWrapper } from "../styles";
import { editCompany } from "../actions";

const CompanyEditPage = () => {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { image, imageUrl, uploadImage, resetImage } = useUpload();

  const isFetching = useSelector(selectIsLoading);
  const activeCompany = useSelector(selectActiveCompany);

  useEffect(() => {
    setPageTitle("edit-company");
  }, []);

  useEffect(() => {
    form.setFieldsValue({
      ...activeCompany,
    });
  }, [activeCompany, form]);

  const returnBack = () => {
    navigate("/companies/profile");
  };

  const handleCompanyEdit = (values) => {
    const formData = objectToForm(values);

    if (activeCompany?.photoUrl) {
      formData.append("photoUrl", activeCompany.photoUrl);
    } else {
      formData.append("photoUrl", "");
    }

    if (image) {
      formData.append("image", image);
    }

    dispatch(editCompany(formData, () => returnBack()));
  };

  return (
    <Layout
      isProfile
      backButtonTitle={t("my-company")}
      title={t("edit-company")}
    >
      <EditPageWrapper>
        {isFetching ? (
          <CircleLoader />
        ) : (
          <Card>
            <CompanyForm
              isEdit
              form={form}
              companyImage={imageUrl}
              resetImage={resetImage}
              uploadCompanyImage={uploadImage}
              handleCompanyEdit={handleCompanyEdit}
            >
              <DefaultButton onClick={returnBack}>{t("cancel")}</DefaultButton>
              <PrimaryButton htmlType="submit">{t("save")}</PrimaryButton>
            </CompanyForm>
          </Card>
        )}
      </EditPageWrapper>
    </Layout>
  );
};

export default CompanyEditPage;
