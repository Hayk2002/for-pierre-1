import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { UserOutlined } from "@ant-design/icons";

import {
  CustomAvatar,
  ProfileCard,
  ProfileCardContent,
  ProfileCardFooter,
  ProfileCardHeader,
} from "shared/components/styles";
import {
  BranchMailIcon,
  GlobeIcon,
  PencilIcon,
  PhoneIcon,
} from "assets/images";

import { selectActiveCompany } from "store/selectors";
import { companyAccountType } from "shared/enums";
import { useEffect, useState } from "react";

const CompanyProfileCard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const activeCompany = useSelector(selectActiveCompany);

  const [companyPhoneNumber, setCompanyPhoneNumber] = useState(null);

  useEffect(() => {
    if (activeCompany?.phones?.length > 9) {
      setCompanyPhoneNumber(`+${activeCompany?.phones}`);
    } else {
      setCompanyPhoneNumber(activeCompany?.phones);
    }
  }, [activeCompany?.phones]);

  const handleOnEditClick = () => {
    navigate(`/companies/profile/edit`);
  };

  return (
    <ProfileCard>
      <ProfileCardHeader>
        {[companyAccountType.Owner, companyAccountType.Admin].includes(
          activeCompany?.accountTypeId,
        ) && (
          <div>
            <PencilIcon onClick={handleOnEditClick} />
          </div>
        )}
      </ProfileCardHeader>
      <ProfileCardContent>
        <div className="user-info">
          <CustomAvatar
            $isSquare
            size={120}
            icon={<UserOutlined />}
            src={`${activeCompany?.photoUrl}?${new Date()}`}
          />
          <h4>{activeCompany?.name}</h4>
        </div>
      </ProfileCardContent>
      <ProfileCardFooter>
        <div>
          <span>
            <PhoneIcon />
          </span>
          <p>{companyPhoneNumber ?? t("phone-number")}</p>
        </div>
        <div>
          <span>
            <BranchMailIcon />
          </span>
          <p>{activeCompany?.emails ?? t("email")}</p>
        </div>
        <div>
          <span>
            <GlobeIcon />
          </span>
          <p>{activeCompany?.websites ?? t("website")}</p>
        </div>
      </ProfileCardFooter>
    </ProfileCard>
  );
};

export default CompanyProfileCard;
