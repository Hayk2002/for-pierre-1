import { useEffect, useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import { Form, List, message } from "antd";

import {
  selectWeeklyScheduleTemplate,
  selectTemplateList,
} from "store/selectors";
import { CustomSelect } from "shared/styles";
import { getTemplates } from "sharedStore/actions";
import { generateTimeRangeByStep, renderHeaderTimes } from "utils/helpers";
import { TemplateWrapper } from "./styles";
import { renderTemplateBlockTimes } from "./helper";
import {
  getWeeklyScheduleTemplate,
  addAccountSchedule,
  editAccountSchedule,
  deleteAccountSchedule,
} from "../../../actions";

const { Option } = CustomSelect;
const FormItem = Form.Item;

const Weekly = ({ member, branchesList, isServiceProvider }) => {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const templates = useSelector(selectTemplateList);
  const weeklyScheduleTemplate = useSelector(selectWeeklyScheduleTemplate);

  const [templatesList, setTemplatesList] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(null);

  useEffect(() => {
    if (selectedBranch !== null) {
      const { timelineStart, timelineEnd } = selectedBranch;

      const filteredTemplates = templates.filter((template) => {
        const { startTime, endTime } = template;
        return startTime >= timelineStart && endTime <= timelineEnd;
      });

      setTemplatesList(filteredTemplates);
    }
  }, [selectedBranch, templates]);

  useEffect(() => {
    dispatch(getTemplates({ pageSize: 0, pageNumber: 0 }));
  }, [dispatch]);

  useEffect(() => {
    if (branchesList[0]) {
      setSelectedBranch(branchesList[0]);
      form.setFieldsValue({ branchId: branchesList[0].id });
    }
  }, [branchesList, form]);

  useEffect(() => {
    if (selectedBranch) {
      dispatch(
        getWeeklyScheduleTemplate({
          branchId: selectedBranch.id,
          userId: member.id,
        }),
      );
    }
  }, [dispatch, member.accountId, member.id, selectedBranch]);

  useEffect(() => {
    if (Object.keys(weeklyScheduleTemplate).length) {
      weeklyScheduleTemplate.forEach((item) => {
        form.setFieldsValue({
          [`userTemplate${item.weekday}${item.scheduleTemplateId}`]:
            item.scheduleTemplateId,
        });
      });
    }
  }, [weeklyScheduleTemplate, form]);

  const handleTemplateChange = (templateId, item) => {
    if (!isServiceProvider) {
      if (templateId) {
        const body = {
          accountId: member.id,
          branchId: selectedBranch.id,
          isWorkingDay: true,
          scheduleTemplateId: templateId,
          weekday: item.weekday,
        };

        if (item.scheduleTemplateId) {
          dispatch(
            editAccountSchedule({ body, id: item.id }, () => {
              message.success(t("updated-successfully"));
            }),
          );
        } else {
          dispatch(
            addAccountSchedule(body, () => {
              message.success(t("updated-successfully"));
            }),
          );
        }
      } else {
        dispatch(
          deleteAccountSchedule(
            {
              id: item.id,
              weekday: item.weekday,
              scheduleTemplateId: null,
            },
            () => {
              message.success(t("updated-successfully"));
            },
          ),
        );
      }
    }
  };

  const headerTimesList = useMemo(
    () =>
      generateTimeRangeByStep(
        selectedBranch?.timelineStart,
        selectedBranch?.timelineEnd,
        5,
      ),
    [selectedBranch],
  );

  return (
    selectedBranch && (
      <TemplateWrapper
        className="scrollable"
        minsCount={headerTimesList.length}
      >
        <Form form={form} requiredMark={false}>
          <FormItem
            name="branchId"
            label={t("choose-branch")}
            rules={[
              {
                required: true,
                message: t("required-field-msg"),
              },
            ]}
          >
            <CustomSelect
              style={{ minWidth: 170, width: "max-content" }}
              onChange={(id) =>
                setSelectedBranch(
                  branchesList.find((branch) => id === branch.id),
                )
              }
            >
              {branchesList.map((branch) => (
                <Option key={branch.id} value={branch.id}>
                  {branch.name}
                </Option>
              ))}
            </CustomSelect>
          </FormItem>
          <FormItem>
            <List
              itemLayout="vertical"
              size="large"
              dataSource={weeklyScheduleTemplate}
              renderItem={(item) => (
                <List.Item key={item.weekday}>
                  <List.Item.Meta
                    style={{ maxWidth: 75, borderRight: "none" }}
                    title={t(
                      moment()
                        .day(+item.weekday)
                        .format("ddd")
                        .toLowerCase(),
                    )}
                  />
                  <FormItem
                    name={`userTemplate${item.weekday}${item.scheduleTemplateId}`}
                  >
                    <CustomSelect
                      style={{
                        width: "150px",
                      }}
                      onChange={(value) => handleTemplateChange(value, item)}
                      disabled={isServiceProvider}
                    >
                      {templatesList.map((template) => (
                        <Option key={template.id} value={template.id}>
                          {template.name}
                        </Option>
                      ))}
                      <Option key="non-working" value={null}>
                        {t("nonworking")}
                      </Option>
                    </CustomSelect>
                  </FormItem>
                  {item.weekday === 1 && (
                    <div className="header-hours">
                      {renderHeaderTimes(
                        selectedBranch.timelineStart,
                        selectedBranch.timelineEnd,
                        5,
                        7,
                      )}
                    </div>
                  )}
                  <div className="blocks-div">
                    {renderTemplateBlockTimes(
                      selectedBranch.timelineStart,
                      item.accountScheduleBlockTimes,
                      7,
                    )}
                  </div>
                </List.Item>
              )}
            />
          </FormItem>
        </Form>
      </TemplateWrapper>
    )
  );
};

export default Weekly;
