import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import {
  CustomForm,
  CustomFormActions,
  CustomFormItem,
  CustomInput,
  CustomTextArea,
} from "shared/styles";
import { selectIsLoading, selectServicesList } from "store/selectors";
import CircleLoader from "shared/components/circleLoader";
import { DefaultButton, PrimaryButton } from "shared/buttons/styles";
import { BlackCrossIcon, CloseIconSmall } from "assets/images";
import { removeHighlight } from "utils/helpers";
import { addResource, editResource, getServices } from "../actions";
import { SelectedService, SelectedServicesList } from "../styles";
import AssignableServicesModal from "../components/assignableServicesModal";

const ResourcesForm = ({ form, isEdit, closeModal, editableResource }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const isFetching = useSelector(selectIsLoading);
  const services = useSelector(selectServicesList);

  const [servicesList, setServicesList] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedServices, setSelectedServices] = useState([]);

  useEffect(() => {
    dispatch(getServices());
  }, [dispatch]);

  useEffect(() => {
    if (isEdit) {
      if (editableResource.services?.length) {
        const servicesData = editableResource.services.map((item) => ({
          name: item.serviceName,
          id: item.serviceId,
        }));
        setSelectedServices(servicesData);
      }
    }
  }, [editableResource, isEdit]);

  useEffect(() => {
    if (isModalVisible) {
      const updatedCopy = services?.map((service) => ({
        ...service,
        isChecked: false,
      }));

      let filteredItems = [];

      if (selectedServices.length) {
        filteredItems = updatedCopy.map((item) => {
          for (const { id } of selectedServices) {
            if (item.id === id) {
              return { ...item, isChecked: true };
            }
          }

          return item;
        });
      }

      setServicesList(filteredItems.length ? filteredItems : updatedCopy);
    }
  }, [isModalVisible, selectedServices, services]);

  const toggleModalState = () => {
    setIsModalVisible(!isModalVisible);
  };

  const removeService = (service) => {
    const updatedServices = servicesList.map((item) => {
      if (item.id === service.id) {
        return {
          ...item,
          isChecked: false,
        };
      }

      return item;
    });

    setServicesList(updatedServices);

    setSelectedServices(
      selectedServices.filter((item) => item.id !== service.id),
    );
  };

  const handleOnServiceClick = (list, service, index) => {
    if (service.isChecked) {
      removeService(service);
      return;
    }

    const updatedServices = [...list];

    updatedServices[index].isChecked = true;
    setServicesList(updatedServices);
  };

  const handleOnSaveClick = () => {
    const checkedServices = servicesList.filter((service) => service.isChecked);
    setSelectedServices(checkedServices);
    toggleModalState();
  };

  const handleFormSubmit = (values) => {
    const serviceIds = selectedServices.map((service) => service.id);

    const payload = {
      ...values,
      serviceIds,
    };

    const updatedServices = selectedServices.map(({ name, id }) => ({
      serviceId: id,
      serviceName: removeHighlight(name),
    }));

    if (isEdit) {
      dispatch(
        editResource(editableResource.id, payload, updatedServices, () =>
          closeModal(),
        ),
      );
    } else {
      dispatch(addResource(payload, () => closeModal()));
    }
  };

  return (
    <>
      <CustomForm form={form} onFinish={handleFormSubmit}>
        <CustomFormItem
          name="name"
          label={t("resource-name")}
          rules={[
            {
              required: true,
              message: t("required-field-msg"),
            },
          ]}
        >
          <CustomInput />
        </CustomFormItem>
        <CustomFormItem name="description" label={t("description")}>
          <CustomTextArea autoSize={{ minRows: 3, maxRows: 5 }} />
        </CustomFormItem>
        <CustomFormItem style={{ marginBottom: 0 }}>
          <DefaultButton onClick={toggleModalState}>
            <BlackCrossIcon style={{ margin: "0 5px -2px 0" }} />
            {t("assign-services")}
          </DefaultButton>
          {selectedServices.length ? (
            <SelectedServicesList className="scrollable">
              {selectedServices.map((service) => (
                <SelectedService key={service.id}>
                  <span>{removeHighlight(service.name)}</span>
                  <CloseIconSmall onClick={() => removeService(service)} />
                </SelectedService>
              ))}
            </SelectedServicesList>
          ) : null}
        </CustomFormItem>
        <CustomFormItem>
          <CustomFormActions row>
            {isFetching ? (
              <CircleLoader />
            ) : (
              <>
                <DefaultButton onClick={closeModal}>
                  {t("cancel")}
                </DefaultButton>
                <PrimaryButton htmlType="submit">{t("save")}</PrimaryButton>
              </>
            )}
          </CustomFormActions>
        </CustomFormItem>
      </CustomForm>
      <AssignableServicesModal
        isVisible={isModalVisible}
        servicesList={servicesList}
        toggleModalState={toggleModalState}
        handleOnSaveClick={handleOnSaveClick}
        handleOnServiceClick={handleOnServiceClick}
      />
    </>
  );
};

export default ResourcesForm;
