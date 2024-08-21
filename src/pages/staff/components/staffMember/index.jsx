import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Tabs } from "antd";
import { useTranslation } from "react-i18next";

import Layout from "layouts/layout";
import { TabsPageWrapper } from "shared/styles";
import {
  selectStaffMemberData,
  selectBranchesList,
  selectStaffMemberBranches,
} from "store/selectors";
import RenderEmptyView from "shared/components/emptyView";

import {
  getBranchesList,
  getBlockTypesList,
  getAccountBranches,
} from "sharedStore/actions";
import { getItemFromLocalStorage } from "utils/helpers";
import { CustomTabsWrapper, ProfileScheduleWrapper } from "../../styles";
import { getStaffMemberData } from "../../actions";
import Profile from "./profile";
import CustomSchedule from "./schedule/custom";
import WeeklySchedule from "./schedule/weekly";
import CustomDaySchedule from "./schedule/daily";

const { TabPane } = Tabs;

const StaffMember = ({ isServiceProvider }) => {
  const { t } = useTranslation();
  const params = useParams();
  const dispatch = useDispatch();
  const accountId = params.accountId ?? getItemFromLocalStorage("member")?.id;

  const member = useSelector(selectStaffMemberData);
  const accountBranches = useSelector(selectStaffMemberBranches);
  const branches = useSelector(selectBranchesList);

  const [branchesList, setBranchesList] = useState([]);
  const [shcheduleBranches, setShcheduleBranches] = useState([]);

  useEffect(() => {
    dispatch(getBlockTypesList());
  }, [dispatch]);

  useEffect(() => {
    if (accountId) {
      dispatch(getStaffMemberData({ accountId }));
      dispatch(getAccountBranches({ accountId }));
      dispatch(getBranchesList());
    }
  }, [dispatch, accountId]);

  useEffect(() => {
    if (branches.length && accountBranches.length) {
      const filteredList = [];
      const sheduleBranchedFilteredList = [];

      accountBranches.forEach(({ branchId }) => {
        const branch = branches.find(({ id }) => id === branchId);
        if (branch) {
          filteredList.push(branch);
        }
      });
      setBranchesList(filteredList.length ? filteredList : []);

      branches.forEach((branch) => {
        const item = filteredList.find(({ id }) => id === branch.id);
        if (!item) {
          sheduleBranchedFilteredList.push(branch);
        }
      });

      setShcheduleBranches(
        sheduleBranchedFilteredList.length ? sheduleBranchedFilteredList : [],
      );
    } else if (branches.length && !accountBranches.length) {
      setBranchesList([]);
      setShcheduleBranches(branches);
    } else {
      setBranchesList([]);
      setShcheduleBranches([]);
    }
  }, [accountBranches, branches]);

  return (
    Object.keys(member).length > 0 && (
      <Layout
        noMargin
        customUrl="/staff"
        contentScrollable
        backButtonTitle={isServiceProvider ? false : t("back")}
      >
        <TabsPageWrapper className="staff-member">
          <Tabs
            centered
            defaultActiveKey="1"
            className="scrollable"
            destroyInactiveTabPane
          >
            <TabPane tab={t("profile")} key="1">
              <Profile
                isServiceProvider={isServiceProvider}
                branches={branchesList}
              />
            </TabPane>
            <TabPane tab={t("schedule")} key="2">
              <ProfileScheduleWrapper>
                <CustomTabsWrapper>
                  <Tabs defaultActiveKey="weekly" destroyInactiveTabPane>
                    <TabPane tab={t("weekly")} key="weekly">
                      {shcheduleBranches.length ? (
                        <WeeklySchedule
                          member={member}
                          isServiceProvider={isServiceProvider}
                          branchesList={shcheduleBranches}
                        />
                      ) : (
                        <RenderEmptyView />
                      )}
                    </TabPane>
                    <TabPane tab={t("daily")} key="daily">
                      {shcheduleBranches.length ? (
                        <CustomSchedule
                          member={member}
                          isServiceProvider={isServiceProvider}
                          branchesList={shcheduleBranches}
                        />
                      ) : (
                        <RenderEmptyView />
                      )}
                    </TabPane>
                    <TabPane key="custom" tab={t("custom-schedule")}>
                      {shcheduleBranches.length ? (
                        <CustomDaySchedule
                          member={member}
                          isServiceProvider={isServiceProvider}
                          branchesList={shcheduleBranches}
                        />
                      ) : (
                        <RenderEmptyView />
                      )}
                    </TabPane>
                  </Tabs>
                </CustomTabsWrapper>
              </ProfileScheduleWrapper>
            </TabPane>
          </Tabs>
        </TabsPageWrapper>
      </Layout>
    )
  );
};

export default StaffMember;
