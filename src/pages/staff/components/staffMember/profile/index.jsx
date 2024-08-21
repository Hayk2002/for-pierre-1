import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { UserOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";

import { CustomAvatar } from "shared/components/styles";
import { PrimaryButton } from "shared/buttons/styles";
import { MailIcon } from "assets/images";
import {
  selectStaffMemberData,
  selectSpecializationsList,
} from "store/selectors";
import { getSpecializationList } from "sharedStore/actions";
import {
  MemberDetailsView,
  MemberSpecializationsHeader,
  MemberSpecializationsWrapper,
  MemberViewWrapper,
} from "../../../styles";
import { getAccountSpecializations } from "../../../actions";
import SpecializationsList from "./specializationsList";
import AssignSpecializationsModal from "../../modals/assignSpecializationModal";

const Profile = ({ isServiceProvider, branches }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const member = useSelector(selectStaffMemberData);
  const specializations = useSelector(selectSpecializationsList);

  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedSpecIds, setSelectedSpecIds] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [specializationsList, setSpecializationsList] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState({ value: 0, label: "" });

  useEffect(() => {
    if (member.id) {
      dispatch(getAccountSpecializations({ accountId: member.id }));
      dispatch(getSpecializationList());
    }
  }, [dispatch, member.id]);

  useEffect(() => {
    const updatedList = specializations?.map((spec) => ({
      ...spec,
      isChecked: false,
    }));
    setSpecializationsList(updatedList);
  }, [specializations]);

  const toggleModalState = () => {
    if (isEditMode) {
      setIsEditMode(false);
    }

    setSelectedBranch({
      value: branches[0]?.id,
      label: branches[0]?.name,
    });

    setSpecializationsList(
      specializationsList?.map((spec) => ({
        ...spec,
        isChecked: false,
      })),
    );

    setSelectedSpecIds([]);

    setIsModalVisible(!isModalVisible);
  };

  const handleOnEditClick = (editableSpecializations, branchId, branchName) => {
    setIsEditMode(true);
    toggleModalState();

    setSelectedBranch({
      value: branchId,
      label: branchName,
    });

    const updatedSpecializations = specializationsList.map((spec) => {
      for (const { specializationId } of editableSpecializations) {
        if (spec.id === specializationId) {
          return {
            ...spec,
            isChecked: true,
          };
        }
      }

      return spec;
    });

    setSpecializationsList(updatedSpecializations);

    const filteredItems = updatedSpecializations.filter(
      ({ isChecked }) => isChecked,
    );

    setSelectedSpecIds(filteredItems.map(({ id }) => id));
  };

  const removeSpecialization = (list, spec) => {
    const updatedSpecializations = specializationsList.map((item) => {
      if (item.id === spec.id) {
        return {
          ...item,
          isChecked: false,
        };
      }

      return item;
    });

    setSpecializationsList(updatedSpecializations);

    const filteredItems = updatedSpecializations.filter(
      ({ isChecked }) => isChecked,
    );
    setSelectedSpecIds(filteredItems.map(({ id }) => id));
  };

  const handleOnSpecClick = (list, spec) => {
    const updatedSpecializations = specializationsList.map((item) => {
      if (item.id === spec.id) {
        setSelectedSpecIds([...selectedSpecIds, item.id]);
        return {
          ...item,
          isChecked: true,
        };
      }

      return item;
    });

    setSpecializationsList(updatedSpecializations);

    if (spec.isChecked) {
      removeSpecialization(list, spec);
    }
  };

  return (
    <>
      <MemberViewWrapper>
        <MemberDetailsView>
          <CustomAvatar
            size={100}
            icon={<UserOutlined />}
            src={member?.photoUrl}
          />
          <div>
            <h4>{member?.name}</h4>
            <p>{member?.title}</p>
          </div>
          <p>
            <MailIcon style={{ marginRight: 12 }} />
            <span>{member.email}</span>
          </p>
        </MemberDetailsView>
        <MemberSpecializationsWrapper>
          <MemberSpecializationsHeader>
            <h4>{t("specializations")}</h4>
            {!isServiceProvider && (
              <PrimaryButton onClick={toggleModalState}>
                {t("assign-specialization")}
              </PrimaryButton>
            )}
          </MemberSpecializationsHeader>
          <SpecializationsList
            isServiceProvider={isServiceProvider}
            handleOnEditClick={handleOnEditClick}
            accountId={member.id || member.accountId}
          />
        </MemberSpecializationsWrapper>
      </MemberViewWrapper>
      {!isServiceProvider && (
        <AssignSpecializationsModal
          isEdit={isEditMode}
          isVisible={isModalVisible}
          selectedBranch={selectedBranch}
          serviceProvider={member}
          selectedSpecIds={selectedSpecIds}
          toggleModalState={toggleModalState}
          handleOnSpecClick={handleOnSpecClick}
          setSelectedBranch={setSelectedBranch}
          specializationsList={specializationsList}
        />
      )}
    </>
  );
};

export default Profile;
