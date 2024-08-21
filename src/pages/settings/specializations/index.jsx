import { Form, Tooltip } from "antd";
import { useTranslation } from "react-i18next";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  selectCoreSpecializationsList,
  selectIsLoading,
  selectSpecializationsPagination,
} from "store/selectors";
import RenderEmptyView from "shared/components/emptyView";
import { DeleteIcon, PencilIconGray } from "assets/images";
import { removeHighlight, setPageTitle } from "utils/helpers";
import { CustomModal } from "shared/components/styles";
import Card from "shared/components/card";
import {
  CustomTable,
  TableActionsWrapper,
  TableDescriptionWrapper,
} from "shared/styles";
import { getSpecializationList } from "sharedStore/actions";
import TableHeader from "../components/tableHeader";
import { deleteSpecialization } from "../actions";
import SpecializationsForm from "./form";
import DeleteModal from "../components/deleteModal";

const Specializations = () => {
  const inputRef = useRef();
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const isFetching = useSelector(selectIsLoading);
  const pagination = useSelector(selectSpecializationsPagination);
  const specializations = useSelector(selectCoreSpecializationsList);

  const [form] = Form.useForm();

  const [isEditMode, setIsEditMode] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isFormModalVisible, setIsFormModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [selectedSpecialization, setSelectedSpecialization] = useState({});
  const [searchedSpecializations, setSearchedSpecializations] = useState([]);

  useEffect(() => {
    setPageTitle("specializations");
  }, []);

  useEffect(() => {
    dispatch(getSpecializationList({ pageSize: 10 }));
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
    setSelectedSpecialization(record);
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
    setSelectedSpecialization(record);
    toggleDeleteModalState();
  };

  const handleSpecializationDelete = () => {
    const { id } = selectedSpecialization;
    dispatch(
      deleteSpecialization(id, () => {
        handleInputClear();
        toggleDeleteModalState();
      }),
    );
  };

  const handlePaginationChange = (pageNumber, pageSize) => {
    dispatch(getSpecializationList({ pageNumber, pageSize }));
  };

  const handleSearch = ({ target: { value } }) => {
    const filteredList = [];

    if (value.length) {
      specializations.forEach((item) => {
        const { name, description, specializationName, services } = item;
        let tmpName = name;
        let tmpDesc = description;
        let tmpSpecName = specializationName;
        let tmpServ = services;

        if (
          name.toLowerCase().includes(value.toLowerCase()) ||
          description?.toLowerCase().includes(value.toLowerCase()) ||
          specializationName?.toLowerCase().includes(value.toLowerCase()) ||
          services?.filter(({ serviceName }) =>
            serviceName.toLowerCase().includes(value.toLowerCase()),
          ).length
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

          if (services?.length) {
            const filteredServices = [];
            services.forEach((srv) => {
              if (srv.serviceName.toLowerCase().includes(value.toLowerCase())) {
                filteredServices.push({
                  ...srv,
                  serviceName: srv.serviceName.replace(
                    new RegExp(value, "gi"),
                    (match) =>
                      `<mark style="background-color: yellow">${match}</mark>`,
                  ),
                });

                return;
              }

              filteredServices.push({
                ...srv,
              });
            });

            tmpServ = filteredServices;
          }

          filteredList.push({
            ...item,
            name: tmpName,
            description: tmpDesc,
            specializationName: tmpSpecName,
            services: tmpServ,
          });
        }
      });

      setIsSearching(true);
      setSearchedSpecializations(filteredList);
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
      title: t("services"),
      dataIndex: "services",
      width: "20%",
      render: (record) => (
        <span
          dangerouslySetInnerHTML={{
            __html: record?.map(({ serviceName }) => serviceName).join(", "),
          }}
        />
      ),
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
        btnText={t("add-specialization")}
        openFormModal={toggleFormModalState}
        searchText={t("search-specializations")}
      />
      <CustomTable
        bordered
        rowKey="id"
        columns={columns}
        loading={isFetching}
        dataSource={isSearching ? searchedSpecializations : specializations}
        locale={{
          emptyText: <RenderEmptyView text={t("empty-specializations-text")} />,
        }}
        pagination={{
          hideOnSinglePage: true,
          total: pagination?.TotalCount,
          current: pagination?.CurrentPage,
          onChange: handlePaginationChange,
        }}
      />
      <DeleteModal
        isVisible={isDeleteModalVisible}
        title={t("delete-specialization")}
        closeModal={toggleDeleteModalState}
        handleItemDelete={handleSpecializationDelete}
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
        <Card
          title={
            isEditMode ? t("edit-specialization") : t("add-specialization")
          }
        >
          <SpecializationsForm
            form={form}
            isEdit={isEditMode}
            closeModal={toggleFormModalState}
            editableSpecialization={selectedSpecialization}
          />
        </Card>
      </CustomModal>
    </>
  );
};

export default Specializations;
