import { Select } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { SearchOutlined } from "@ant-design/icons";

import { CardInfo, CustomModal } from "shared/components/styles";
import Card from "shared/components/card";
import {
  AssignableItemsActions,
  AssignableItemsList,
  AssignableItemsSearch,
  AssignableItemsWrapper,
  CustomCheckbox,
  CustomSelect,
} from "shared/styles";
import CircleLoader from "shared/components/circleLoader";
import { DefaultButton, PrimaryButton } from "shared/buttons/styles";
import { selectIsLoading, selectStaffMemberBranches } from "store/selectors";
import { LocationAdditionWrapper } from "../../styles";
import {
  assignMemberSpecializations,
  editMemberSpecializations,
} from "../../actions";

const { Option } = Select;

const AssignableSpecializationsModal = ({
  isEdit,
  isVisible,
  selectedBranch,
  selectedSpecIds,
  serviceProvider,
  toggleModalState,
  handleOnSpecClick,
  setSelectedBranch,
  specializationsList,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const isFetching = useSelector(selectIsLoading);
  const branches = useSelector(selectStaffMemberBranches);

  const [dataSource, setDataSource] = useState([]);

  useEffect(() => {
    setDataSource(specializationsList);
  }, [specializationsList]);

  const handleSearch = ({ target: { value } }) => {
    const filteredList = [];
    if (!value.length) {
      setDataSource(specializationsList);
    } else {
      specializationsList.forEach((item) => {
        const { name } = item;
        const tmpName = name.replace(
          new RegExp(value, "gi"),
          (match) => `<mark style="background-color: yellow">${match}</mark>`,
        );

        if (tmpName.toLowerCase().includes(value.toLowerCase())) {
          filteredList.push({ ...item, name: tmpName });
        }
      });

      setDataSource(filteredList);
    }
  };

  const handleOnSaveClick = () => {
    const payload = {
      accountId: serviceProvider.id || serviceProvider.accountId,
      branchId: selectedBranch.value,
      specializationIds: selectedSpecIds,
    };

    if (isEdit) {
      dispatch(
        editMemberSpecializations(payload, () => {
          toggleModalState();
        }),
      );
    } else {
      dispatch(
        assignMemberSpecializations(payload, () => {
          toggleModalState();
        }),
      );
    }
  };

  return (
    <CustomModal visible={isVisible} onCancel={toggleModalState}>
      {isEdit || branches.length ? (
        <Card
          className="assignable-items-content"
          title={isEdit ? t("edit-specialization") : t("assign-specialization")}
        >
          <AssignableItemsWrapper>
            <LocationAdditionWrapper>
              <p>{t("add-location")}</p>
              <CustomSelect
                disabled={isEdit}
                style={{ width: 267 }}
                value={selectedBranch.label}
                onChange={(value) =>
                  setSelectedBranch({
                    value,
                    label: branches.find((item) => item.branchId === value)
                      .branchName,
                  })
                }
              >
                {branches.map(({ branchId, branchName }) => (
                  <Option key={branchId} value={branchId}>
                    {branchName}
                  </Option>
                ))}
              </CustomSelect>
            </LocationAdditionWrapper>
            <AssignableItemsSearch
              allowClear
              onChange={handleSearch}
              placeholder={t("search")}
              prefix={<SearchOutlined className="search-icon" />}
            />
            <div className="scrollable">
              {dataSource?.map((spec) => (
                <AssignableItemsList key={spec.id}>
                  <p dangerouslySetInnerHTML={{ __html: spec.name }} />
                  <CustomCheckbox
                    checked={spec.isChecked}
                    className="green-checkbox"
                    onChange={() => handleOnSpecClick(dataSource, spec)}
                  />
                </AssignableItemsList>
              ))}
            </div>
            <AssignableItemsActions>
              {isFetching ? (
                <CircleLoader />
              ) : (
                <>
                  <DefaultButton onClick={toggleModalState}>
                    {t("cancel")}
                  </DefaultButton>
                  <PrimaryButton onClick={handleOnSaveClick}>
                    {t("save")}
                  </PrimaryButton>
                </>
              )}
            </AssignableItemsActions>
          </AssignableItemsWrapper>
        </Card>
      ) : (
        <Card style={{ textAlign: "center" }}>
          <CardInfo>{t("member-empty-specializations-info")}</CardInfo>
          <PrimaryButton onClick={toggleModalState}>{t("ok")}</PrimaryButton>
        </Card>
      )}
    </CustomModal>
  );
};

export default AssignableSpecializationsModal;
