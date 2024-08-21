import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import {
  ProfileCard,
  ProfileCardFooter,
  ProfileCardHeader,
} from "shared/components/styles";
import {
  ClockIcon,
  DeleteIcon,
  LocationIcon,
  PencilIconGray,
  PhoneIcon,
} from "assets/images";
import { setItemsToLocalStorage } from "utils/helpers";
import { companyAccountType } from "shared/enums";
import { selectActiveCompany } from "store/selectors";
import { setSelectedBranch } from "../actions";

const BranchCard = ({ branch, handleOnDeleteCLick, listCount }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const activeCompany = useSelector(selectActiveCompany);

  const [branchPhoneNumber, setBranchPhoneNumber] = useState(null);

  useEffect(() => {
    if (branch?.phones?.length > 9) {
      setBranchPhoneNumber(`+${branch?.phones}`);
    } else {
      setBranchPhoneNumber(branch?.phones);
    }
  }, [branch?.phones]);

  const handleOnEditClick = (selectedBranch) => {
    dispatch(setSelectedBranch(selectedBranch));
    setItemsToLocalStorage({ branchId: selectedBranch.id });
    navigate(`/companies/editBranch`);
  };

  return (
    <ProfileCard small>
      <ProfileCardHeader small>
        <h4 className="truncated-text">{branch.name}</h4>
        {[companyAccountType.Owner, companyAccountType.Admin].includes(
          activeCompany?.accountTypeId,
        ) && (
          <div>
            <PencilIconGray onClick={() => handleOnEditClick(branch)} />
            {listCount > 1 ? (
              <DeleteIcon
                style={{ marginLeft: "22px" }}
                onClick={() => handleOnDeleteCLick(branch.id)}
              />
            ) : null}
          </div>
        )}
      </ProfileCardHeader>
      <ProfileCardFooter>
        <div>
          <span>
            <LocationIcon />
          </span>
          <p>{branch?.address}</p>
        </div>
        <div>
          <span>
            <PhoneIcon />
          </span>
          <p>{branchPhoneNumber || t("phone-number")}</p>
        </div>
        <div>
          <span>
            <ClockIcon />
          </span>
          <p>
            {branch?.timelineStart.slice(0, 5)}
            {" - "}
            {branch?.timelineEnd.slice(0, 5)}, {branch?.timezone}
          </p>
        </div>
      </ProfileCardFooter>
    </ProfileCard>
  );
};

export default BranchCard;
