import moment from "moment";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { PlusOutlined } from "@ant-design/icons";

import { LeftArrow, RightArrow } from "assets/images";
import {
  CustomForm,
  CustomFormItem,
  CustomInput,
  CustomSelect,
} from "shared/styles";
import { PrimaryButton } from "shared/buttons/styles";
import {
  selectProvidersSuggestionsList,
  selectUserAppointmentsHistory,
} from "store/selectors";
import { clientMobileRegex } from "utils/helpers";
import {
  AppointmentsPagination,
  AppointmentsPaginationButtons,
  ClearButton,
  FilterWrapper,
  LeftPaginationButton,
  RightPaginationButton,
} from "./styles";

const AdvancedSearchFields = ({
  form,
  datesList,
  setCurrentDate,
  specializationId,
  nearestDateIndex,
  paginationMaxCount,
  handleSearchSubmit,
  advancedSearchValues,
  isAdvancedSearchApplied,
  setAdvancedSearchValues,
  toggleAdvancedSearchState,
}) => {
  const { t } = useTranslation();

  const userAppointmentsHistory = useSelector(selectUserAppointmentsHistory);
  const providersSuggestionsList = useSelector(selectProvidersSuggestionsList);

  const [options, setOptions] = useState([]);
  const [paginationCount, setPaginationCount] = useState(0);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [filteredProvidersList, setFilteredProvidersList] = useState([]);

  const { clientName, phoneNumber, accountIds } = advancedSearchValues;

  useEffect(() => {
    if (isAdvancedSearchApplied) {
      setPaginationCount(nearestDateIndex);
    }
  }, [
    datesList,
    nearestDateIndex,
    isAdvancedSearchApplied,
    userAppointmentsHistory,
  ]);

  useEffect(() => {
    const filteredSuggestions = providersSuggestionsList.filter((provider) =>
      provider.specializationIds.includes(specializationId),
    );
    setFilteredProvidersList(
      filteredSuggestions.length ? filteredSuggestions : [],
    );
  }, [providersSuggestionsList, specializationId]);

  useEffect(() => {
    const isNotEmpty =
      clientName.length > 1 || phoneNumber.length || accountIds.length;

    if (isNotEmpty) {
      setIsButtonDisabled(false);
    } else {
      setIsButtonDisabled(true);
    }
  }, [clientName.length, accountIds.length, phoneNumber.length]);

  /* eslint-disable */
  useEffect(() => {
    const showList = accountIds.filter((id) =>
      filteredProvidersList.map((item) => item.id).includes(id),
    );
    form.setFieldsValue({ accountIds: showList });
    if (isAdvancedSearchApplied && showList.length) {
      handleSearchSubmit();
    }

    if (!showList.length) {
      toggleAdvancedSearchState(false);
    }
  }, [form, filteredProvidersList]);

  useEffect(() => {
    if (filteredProvidersList.length) {
      setOptions(
        filteredProvidersList.map(({ id, name }) => ({
          value: id,
          label: name,
        })),
      );
    } else {
      setOptions(
        providersSuggestionsList.map(({ id, name }) => ({
          value: id,
          label: name,
        })),
      );
      form.setFieldsValue({ accountIds: [] });
    }
  }, [filteredProvidersList, form]);

  useEffect(() => {
    if (paginationCount) {
      setCurrentDate(
        moment(datesList[paginationCount - 1]).format("YYYY-MM-DD"),
      );
    }
  }, [paginationCount]);

  const handleInputChange = (event) => {
    const { id, value } = event.target;

    setAdvancedSearchValues({ ...advancedSearchValues, [id]: value });
  };

  const renderSuggestedProvidersList = () => {
    const handleOnListClear = () => {
      const onlyProvidersSelected =
        !clientName.length && !phoneNumber.length && accountIds.length;
      if (onlyProvidersSelected && isAdvancedSearchApplied) {
        toggleAdvancedSearchState(false);
      }
    };

    const handleOnChange = (data) => {
      setAdvancedSearchValues({
        ...advancedSearchValues,
        accountIds: data,
      });

      if (!data.length) {
        handleOnListClear();
      }
    };

    return (
      <CustomSelect
        showArrow
        allowClear
        mode="multiple"
        options={options}
        optionFilterProp="label"
        onChange={handleOnChange}
        onClear={handleOnListClear}
        className="providers-suggestion-list"
      />
    );
  };

  return (
    <FilterWrapper>
      <CustomForm
        form={form}
        onFinish={handleSearchSubmit}
        style={{ alignItems: "flex-start" }}
      >
        <CustomFormItem
          name="clientName"
          label={t("client-name")}
          style={{
            maxWidth: 260,
          }}
        >
          <CustomInput
            allowClear
            onChange={handleInputChange}
            value={advancedSearchValues.clientName}
          />
        </CustomFormItem>
        <CustomFormItem
          name="phoneNumber"
          label={t("client-phone-number")}
          style={{
            maxWidth: 260,
          }}
          rules={[
            {
              pattern: clientMobileRegex,
              message: t("invalid-phone"),
            },
          ]}
        >
          <CustomInput
            allowClear
            prefix={<PlusOutlined />}
            placeholder="XXX XX XXX XXX"
            onChange={handleInputChange}
            value={advancedSearchValues.phoneNumber}
          />
        </CustomFormItem>
        <CustomFormItem
          name="accountIds"
          label={t("service-provider")}
          style={{
            minWidth: 260,
            maxWidth: 260,
          }}
        >
          {renderSuggestedProvidersList()}
        </CustomFormItem>
        <CustomFormItem style={{ marginTop: 32 }}>
          <PrimaryButton
            htmlType="submit"
            style={{ width: 85 }}
            disabled={isButtonDisabled}
          >
            {t("search")}
          </PrimaryButton>
        </CustomFormItem>
        {!isButtonDisabled && (
          <CustomFormItem style={{ marginTop: 38 }}>
            <ClearButton onClick={() => toggleAdvancedSearchState(false)}>
              {t("clear-all")}
            </ClearButton>
          </CustomFormItem>
        )}
        {userAppointmentsHistory.length ? (
          <CustomFormItem style={{ marginTop: 38 }}>
            <AppointmentsPagination>
              <div className="count">
                ({paginationCount} {t("of")} {paginationMaxCount})
              </div>
              <AppointmentsPaginationButtons>
                <LeftPaginationButton
                  count={paginationCount}
                  onClick={() => setPaginationCount((prev) => prev - 1)}
                >
                  <LeftArrow />
                </LeftPaginationButton>
                <RightPaginationButton
                  count={paginationCount}
                  maxCount={paginationMaxCount}
                  onClick={() => setPaginationCount((prev) => prev + 1)}
                >
                  <RightArrow />
                </RightPaginationButton>
              </AppointmentsPaginationButtons>
            </AppointmentsPagination>
          </CustomFormItem>
        ) : null}
      </CustomForm>
    </FilterWrapper>
  );
};

export default AdvancedSearchFields;
