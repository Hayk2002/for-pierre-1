import { Tabs } from "antd";
import { useTranslation } from "react-i18next";

import Layout from "layouts/layout";
import { TabsPageWrapper } from "shared/styles";
import Specializations from "./specializations";
import Services from "./services";
import Resources from "./resources";

const { TabPane } = Tabs;

const SettingsPage = () => {
  const { t } = useTranslation();

  return (
    <Layout noMargin contentScrollable>
      <TabsPageWrapper>
        <Tabs defaultActiveKey="1" destroyInactiveTabPane centered>
          <TabPane tab={t("specializations")} key="1">
            <Specializations />
          </TabPane>
          <TabPane tab={t("services")} key="2">
            <Services />
          </TabPane>
          <TabPane tab={t("resources")} key="3">
            <Resources />
          </TabPane>
        </Tabs>
      </TabsPageWrapper>
    </Layout>
  );
};

export default SettingsPage;
