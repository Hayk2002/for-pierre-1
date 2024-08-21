import { Tabs } from "antd";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";

import {
  selectActiveCompany,
  selectSchedulePageActiveTab,
} from "store/selectors";
import Layout from "layouts/layout";
import { TabsPageWrapper } from "shared/styles";
import ServiceProviderView from "pages/staff/components/staffMember";
import { SET_ACTIVE_TAB } from "./constants";
import ScheduleTab from "./components/schedule/scheduleTab";
import TemplateTab from "./components/template/templateTab";

const { TabPane } = Tabs;

const SchedulePage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const activeCompany = useSelector(selectActiveCompany);
  const activeTab = useSelector(selectSchedulePageActiveTab);

  useEffect(() => {
    if (activeTab) {
      dispatch({ type: SET_ACTIVE_TAB, payload: null });
    }
  }, [activeTab, dispatch]);

  return activeCompany !== null && activeCompany?.accountTypeId !== 4 ? (
    <Layout noMargin contentScrollable>
      <TabsPageWrapper className="staff-member">
        <Tabs
          centered
          className="scrollable"
          destroyInactiveTabPane
          defaultActiveKey={activeTab ? "templates" : "schedule"}
        >
          <TabPane tab={t("schedule")} key="schedule">
            <ScheduleTab />
          </TabPane>
          <TabPane tab={t("templates")} key="templates">
            <TemplateTab />
          </TabPane>
        </Tabs>
      </TabsPageWrapper>
    </Layout>
  ) : (
    <ServiceProviderView isServiceProvider />
  );
};

export default SchedulePage;
