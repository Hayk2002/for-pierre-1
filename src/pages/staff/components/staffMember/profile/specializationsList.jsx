import { Tooltip } from "antd";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import { selectStaffMemberSpecializations } from "store/selectors";
import { DeleteIcon, PencilIconGray } from "assets/images";
import RenderEmptyView from "shared/components/emptyView";
import {
  SpecializationItem,
  SpecializationsCollection,
  SpecializationsCollectionActions,
  SpecializationsCollectionHeader,
} from "../../../styles";
import { deleteMemberSpecializations } from "../../../actions";

const MemberSpecializationsList = ({
  accountId,
  isServiceProvider,
  handleOnEditClick,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const memberSpecializations = useSelector(selectStaffMemberSpecializations);

  const handleOnDeleteClick = (branchId, branchName) => {
    dispatch(deleteMemberSpecializations({ accountId, branchId, branchName }));
  };

  return (
    <SpecializationsCollection>
      {memberSpecializations.map(
        ({ specializations, branchId, branchName, color }) => (
          <div key={branchId}>
            <SpecializationsCollectionHeader>
              <h4>{branchName}</h4>
              {!isServiceProvider && (
                <SpecializationsCollectionActions>
                  <Tooltip placement="top" title={t("edit")}>
                    <PencilIconGray
                      onClick={() =>
                        handleOnEditClick(specializations, branchId, branchName)
                      }
                    />
                  </Tooltip>
                  <Tooltip placement="top" title={t("delete")}>
                    <DeleteIcon
                      onClick={() => handleOnDeleteClick(branchId, branchName)}
                    />
                  </Tooltip>
                </SpecializationsCollectionActions>
              )}
            </SpecializationsCollectionHeader>
            {specializations.map(
              ({ specializationId, specializationName, services }) => (
                <SpecializationItem key={specializationId}>
                  <div
                    style={{
                      borderLeft: `4px solid ${color}`,
                    }}
                  >
                    <h4>{specializationName}</h4>
                  </div>
                  <div>
                    <span>
                      {services.map(({ serviceName }) =>
                        services.length > 0 ? `${serviceName},` : serviceName,
                      )}
                    </span>
                  </div>
                </SpecializationItem>
              ),
            )}
          </div>
        ),
      )}
      {!memberSpecializations.length && (
        <RenderEmptyView text={t("empty-staff-specializations-text")} />
      )}
    </SpecializationsCollection>
  );
};

export default MemberSpecializationsList;
