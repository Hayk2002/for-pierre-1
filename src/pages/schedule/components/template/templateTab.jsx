import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { List, Tooltip } from "antd";

import { setPageTitle } from "utils/helpers";
import { PrimaryButton, DefaultButton } from "shared/buttons/styles";
import { getTemplates } from "sharedStore/actions";
import { DeleteIcon, PencilIconGray } from "assets/images";
import { CardInfo, CustomModal } from "shared/components/styles";
import Card from "shared/components/card";
import RenderEmptyView from "shared/components/emptyView";
import {
  selectIsLoading,
  selectTemplateList,
  selectTemplatesPagination,
} from "store/selectors";
import { CustomList } from "shared/styles";
import { deleteTemplate } from "../../actions";
import { TemplatesHeader } from "../../styles";

export const TemplateTab = () => {
  const { t } = useTranslation();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isFetching = useSelector(selectIsLoading);
  const templateList = useSelector(selectTemplateList);
  const pagination = useSelector(selectTemplatesPagination);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  useEffect(() => {
    setPageTitle("templates");
  }, []);

  useEffect(() => {
    dispatch(getTemplates());
  }, [dispatch]);

  const toggleModalState = () => {
    setIsModalVisible(!isModalVisible);
  };

  const handleOnDeleteClick = (template) => {
    toggleModalState();
    setSelectedTemplate(template);
  };

  const triggerTemplateDelete = () => {
    dispatch(
      deleteTemplate({ id: selectedTemplate.id }, () => toggleModalState()),
    );
  };

  const handlePaginationChange = (pageNumber, pageSize) => {
    dispatch(getTemplates({ pageNumber, pageSize }));
  };

  return (
    <>
      <TemplatesHeader>
        <PrimaryButton onClick={() => navigate("/schedule/template")}>
          {t("add-template")}
        </PrimaryButton>
      </TemplatesHeader>

      <CustomList
        loading={isFetching}
        itemLayout="horizontal"
        dataSource={templateList}
        locale={{
          emptyText: <RenderEmptyView text={t("empty-templates-text")} />,
        }}
        pagination={{
          hideOnSinglePage: true,
          total: pagination?.TotalCount,
          current: pagination?.CurrentPage,
          onChange: handlePaginationChange,
        }}
        renderItem={(item) => (
          <List.Item
            style={{
              borderLeft: `4px solid #${(Math.random() * 0xfffff * 1000000)
                .toString(16)
                .slice(0, 6)}`,
            }}
            actions={[
              <Tooltip placement="top" title={t("edit")}>
                <PencilIconGray
                  onClick={() => navigate(`/schedule/template/${item.id}`)}
                />
              </Tooltip>,
              <Tooltip placement="top" title={t("delete")}>
                <DeleteIcon onClick={() => handleOnDeleteClick(item)} />
              </Tooltip>,
            ]}
          >
            <List.Item.Meta title={item.name} />
            <div className="list-content truncated-text">
              {item.description}
            </div>
          </List.Item>
        )}
      />

      <CustomModal
        visible={isModalVisible}
        okButtonProps={{
          style: {
            background: "linear-gradient(180deg, #F25D78 0%, #ED143B 100%)",
          },
        }}
        destroyOnClose
        onCancel={toggleModalState}
      >
        <Card title={t("delete-template")}>
          <CardInfo>{t("delete-template-info")}</CardInfo>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <DefaultButton onClick={toggleModalState}>
              {t("cancel")}
            </DefaultButton>
            <PrimaryButton onClick={triggerTemplateDelete}>
              {t("delete")}
            </PrimaryButton>
          </div>
        </Card>
      </CustomModal>
    </>
  );
};

export default TemplateTab;
