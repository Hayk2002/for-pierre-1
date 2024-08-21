import { Form, Tooltip } from "antd";
import { useTranslation } from "react-i18next";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  selectIsLoading,
  selectServicesList,
  selectServicesPagination,
} from "store/selectors";
import RenderEmptyView from "shared/components/emptyView";
import { DeleteIcon, PencilIconGray } from "assets/images";
import { removeHighlight, setPageTitle } from "utils/helpers";
import {
  CustomTable,
  TableActionsWrapper,
  TableDescriptionWrapper,
} from "shared/styles";
import { CustomModal } from "shared/components/styles";
import Card from "shared/components/card";
import { deleteService, getServices } from "../actions";
import TableHeader from "../components/tableHeader";
import DeleteModal from "../components/deleteModal";
import ServicesForm from "./form";

const Services = () => {
  const inputRef = useRef();
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const isFetching = useSelector(selectIsLoading);
  const services = useSelector(selectServicesList);
  const pagination = useSelector(selectServicesPagination);

  const [form] = Form.useForm();

  const [isEditMode, setIsEditMode] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedService, setSelectedService] = useState({});
  const [searchedServices, setSearchedServices] = useState([]);
  const [isFormModalVisible, setIsFormModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  useEffect(() => {
    setPageTitle("services");
  }, []);

  useEffect(() => {
    dispatch(getServices({ pageSize: 10 }));
  }, [dispatch]);

  const handleInputClear = () => {
    inputRef.current.input.nextElementSibling.children[0].click();
  };

  const toggleDeleteModalState = () => {
    setIsDeleteModalVisible(!isDeleteModalVisible);
  };

  const toggleFormModalState = () => {
    if (isEditMode) {
      setIsEditMode(false);
    }
    setIsFormModalVisible(!isFormModalVisible);
    form.resetFields();
  };

  const handleOnEditClick = (record) => {
    setIsEditMode(true);
    setSelectedService(record);
    toggleFormModalState();
    const updatedRecord = {
      ...record,
      name: removeHighlight(record.name),
      description: record.description
        ? removeHighlight(record.description)
        : "",
    };
    form.setFieldsValue({
      ...updatedRecord,
    });
  };

  const handleOnDeleteClick = (record) => {
    setSelectedService(record);
    toggleDeleteModalState();
  };

  const handleServiceDelete = () => {
    const { id } = selectedService;
    dispatch(
      deleteService(id, () => {
        handleInputClear();
        toggleDeleteModalState();
      }),
    );
  };

  const handlePaginationChange = (pageNumber, pageSize) => {
    dispatch(getServices({ pageNumber, pageSize }));
  };

  const handleSearch = ({ target: { value } }) => {
    const filteredList = [];

    if (value.length) {
      services.forEach((item) => {
        const { name, description, specializationName } = item;
        let tmpName = name;
        let tmpDesc = description;
        let tmpSpecName = specializationName;

        if (
          name.toLowerCase().includes(value.toLowerCase()) ||
          description?.toLowerCase().includes(value.toLowerCase()) ||
          specializationName?.toLowerCase().includes(value.toLowerCase())
        ) {
          if (name.toLowerCase().includes(value.toLowerCase())) {
            tmpName = name.replace(
              new RegExp(value, "gi"),
              (match) =>
                `<mark style="background-color: yellow">${match}</mark>`,
            );
          }

          if (description?.toLowerCase().includes(value.toLowerCase())) {
            tmpDesc = description.replace(
              new RegExp(value, "gi"),
              (match) =>
                `<mark style="background-color: yellow">${match}</mark>`,
            );
          }

          if (specializationName?.toLowerCase().includes(value.toLowerCase())) {
            tmpSpecName = specializationName.replace(
              new RegExp(value, "gi"),
              (match) =>
                `<mark style="background-color: yellow">${match}</mark>`,
            );
          }

          filteredList.push({
            ...item,
            name: tmpName,
            description: tmpDesc,
            specializationName: tmpSpecName,
          });
        }
      });

      setIsSearching(true);
      setSearchedServices(filteredList);
    } else {
      setIsSearching(false);
    }
  };

  const columns = [
    {
      title: t("name"),
      dataIndex: "name",
      width: "20%",
      render: (_, { name, color }) => ({
        props: {
          style: {
            fontWeight: "bold",
            width: 0,
            height: 0,
            borderLeftWidth: 5,
            borderTopWidth: 0,
            borderStyle: "solid",
            borderLeftColor: color,
          },
        },
        children: <div dangerouslySetInnerHTML={{ __html: name }} />,
      }),
    },
    {
      title: t("specializations"),
      dataIndex: "specializationName",
      width: "20%",
      render: (val) => <span dangerouslySetInnerHTML={{ __html: val }} />,
    },
    {
      title: t("description"),
      dataIndex: "description",
      width: "52%",
      render: (value, record) => (
        <TableDescriptionWrapper>
          <span
            dangerouslySetInnerHTML={{
              __html: value,
            }}
          />
          <TableActionsWrapper>
            <Tooltip placement="bottom" title={t("edit")}>
              <PencilIconGray
                onClick={() => {
                  handleOnEditClick(record);
                }}
              />
            </Tooltip>
            <Tooltip placement="bottom" title={t("delete")}>
              <DeleteIcon
                onClick={() => {
                  handleOnDeleteClick(record);
                }}
              />
            </Tooltip>
          </TableActionsWrapper>
        </TableDescriptionWrapper>
      ),
    },
  ];

  return (
    <>
      <TableHeader
        inputRef={inputRef}
        handleSearch={handleSearch}
        btnText={t("add-service")}
        searchText={t("search-services")}
        openFormModal={toggleFormModalState}
      />
      <CustomTable
        bordered
        rowKey="id"
        columns={columns}
        loading={isFetching}
        dataSource={isSearching ? searchedServices : services}
        locale={{
          emptyText: <RenderEmptyView text={t("empty-services-text")} />,
        }}
        pagination={{
          hideOnSinglePage: true,
          total: pagination?.TotalCount,
          current: pagination?.CurrentPage,
          onChange: handlePaginationChange,
        }}
      />
      <DeleteModal
        isService
        title={t("delete-service")}
        isVisible={isDeleteModalVisible}
        closeModal={toggleDeleteModalState}
        handleItemDelete={handleServiceDelete}
      />
      <CustomModal
        destroyOnClose
        visible={isFormModalVisible}
        onCancel={() => toggleFormModalState()}
        onOk={() => {
          form
            .validateFields()
            .then(() => toggleFormModalState())
            .catch((info) => {
              console.log("Validate Failed:", info);
            });
        }}
        confirmLoading={isFetching}
      >
        <Card title={isEditMode ? t("edit-service") : t("add-service")}>
          <ServicesForm
            form={form}
            isEdit={isEditMode}
            closeModal={toggleFormModalState}
            editableService={selectedService}
          />
        </Card>
      </CustomModal>
    </>
  );
};

export default Services;
