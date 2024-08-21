import { Row, Col } from "antd";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import { selectActiveCompany, selectBranchesList } from "store/selectors";
import { CrossIcon } from "assets/images";
import { AddBranchButton } from "shared/buttons/styles";
import { companyAccountType } from "shared/enums";
import BranchCard from "./branchCard";

const Branches = ({
  setSelectedBranchId,
  openBranchDeleteModal,
  openBranchCreateModal,
}) => {
  const { t } = useTranslation();

  const branches = useSelector(selectBranchesList);
  const activeCompany = useSelector(selectActiveCompany);

  const handleOnDeleteCLick = (id) => {
    setSelectedBranchId(id);
    openBranchDeleteModal();
  };

  return (
    <Row gutter={20}>
      {branches.map((branch) => (
        <Col xs={24} md={12} xl={8} xxl={6} key={branch.id}>
          <BranchCard
            branch={branch}
            listCount={branches.length}
            handleOnDeleteCLick={handleOnDeleteCLick}
          />
        </Col>
      ))}
      {[companyAccountType.Owner, companyAccountType.Admin].includes(
        activeCompany?.accountTypeId,
      ) && (
        <Col xs={24} md={12} xl={8} xxl={6}>
          <AddBranchButton onClick={openBranchCreateModal}>
            <span>
              <CrossIcon />
              <p>{t("add-branch")}</p>
            </span>
          </AddBranchButton>
        </Col>
      )}
    </Row>
  );
};

export default Branches;
