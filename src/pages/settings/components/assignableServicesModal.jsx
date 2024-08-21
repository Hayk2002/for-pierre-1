import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { SearchOutlined } from "@ant-design/icons";

import Card from "shared/components/card";
import {
  CustomCheckbox,
  AssignableItemsActions,
  AssignableItemsSearch,
  AssignableItemsWrapper,
  AssignableItemsList,
} from "shared/styles";
import { DefaultButton, PrimaryButton, RedButton } from "shared/buttons/styles";
import { CardInfo, CustomModal } from "shared/components/styles";

const AssignableServicesModal = ({
  isVisible,
  servicesList,
  toggleModalState,
  handleOnSaveClick,
  handleOnServiceClick,
}) => {
  const { t } = useTranslation();

  const [dataSource, setDataSource] = useState([]);

  useEffect(() => {
    setDataSource(servicesList);
  }, [servicesList]);

  const handleSearch = ({ target: { value } }) => {
    const filteredList = [];
    if (!value.length) {
      setDataSource(servicesList);
    } else {
      servicesList.forEach((item) => {
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

  return servicesList.length ? (
    <CustomModal visible={isVisible} onCancel={toggleModalState}>
      <Card title={t("add-service")} className="assignable-items-content">
        <AssignableItemsWrapper>
          <AssignableItemsSearch
            allowClear
            onChange={handleSearch}
            placeholder={t("search")}
            prefix={<SearchOutlined className="search-icon" />}
          />
          <div className="scrollable">
            {dataSource.map((service, index, list) => (
              <AssignableItemsList key={service.id}>
                <p dangerouslySetInnerHTML={{ __html: service.name }} />
                <CustomCheckbox
                  className="green-checkbox"
                  checked={service.isChecked}
                  onChange={() => handleOnServiceClick(list, service, index)}
                />
              </AssignableItemsList>
            ))}
          </div>
          <AssignableItemsActions>
            <DefaultButton onClick={toggleModalState}>
              {t("cancel")}
            </DefaultButton>
            <PrimaryButton onClick={handleOnSaveClick}>
              {t("assign")}
            </PrimaryButton>
          </AssignableItemsActions>
        </AssignableItemsWrapper>
      </Card>
    </CustomModal>
  ) : (
    <CustomModal visible={isVisible} onCancel={toggleModalState}>
      <Card>
        <CardInfo>{t("no-services-text")}</CardInfo>
        <AssignableItemsActions>
          <RedButton onClick={toggleModalState}>{t("ok")}</RedButton>
        </AssignableItemsActions>
      </Card>
    </CustomModal>
  );
};

export default AssignableServicesModal;
