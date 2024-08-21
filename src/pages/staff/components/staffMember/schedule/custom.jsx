import { useEffect, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { Switch, Form, Space, Popover, message } from "antd";
import moment from "moment";

import {
  selectBranchSpecializations,
  selectCustomScheduleTemplate,
  selectBlockTypes,
} from "store/selectors";
import { generateTimeRangeByStep } from "utils/helpers";
import { CustomSelect, CustomInput, CustomDatePicker, StyledInput } from "shared/styles";
import { PrimaryButton, TransparentButton } from "shared/buttons/styles";
import {
  ToRightArrow,
  CircleHint,
  Plus,
  DeleteIcon,
  AddIcon,
  CloseIcon,
} from "assets/images";
import {
  getCustomScheduleTemplate,
  addCustomScheduleTemplate,
  toggleCustomScheduleActivity,
  getBranchSpecializations,
} from "../../../actions";
import {
  ScheduleSwitcherWrapper,
  TemplateWrapper,
  PatternBlock,
  ActionBox
} from "./styles";
import { updateCalendar, getWeekDays, colorsList } from "./helper";

const FormItem = Form.Item;
const { Option } = CustomSelect;
const defaultRange = [
  {
    SpecializationId: null,
    StartTime: null,
    EndTime: null,
  },
];
const defaultPattern = {
  IsWorkingDay: true,
  DaysCount: null,
  TimeRanges: defaultRange,
};

const Custom = ({ member, branchesList, isServiceProvider }) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const WEEK_DAYS = getWeekDays(t);

  const specializations = useSelector(selectBranchSpecializations);
  const template = useSelector(selectCustomScheduleTemplate);
  const blockTypes = useSelector(selectBlockTypes);

  const [selectedBranch, setSelectedBranch] = useState(null);
  const [selectedBlockType, setSelectedBlockType] = useState(0);
  const [patterns, setPatterns] = useState([defaultPattern, defaultPattern]);
  const [timeRange, setTimeRange] = useState([]);
  const [repeatUntil, setRepeatUntil] = useState('');
  const [calendarVal, setCalendarVal] = useState(moment().format("YYYY-MM-DD"));
  const [shouldSetFields, setShouldSetFields] = useState(false);
  const [switcherVal, setSwitcherVal] = useState(false);

  const calendarColorUpdater = (calledFromColoredPicker) => {
    setTimeout(
      () =>
        updateCalendar(
          patterns.filter(({ hidden }) => !hidden),
          form.getFieldValue("startingFrom"),
          form.getFieldValue("repeatCount"),
          form.getFieldValue("nonWorkingWeekdays"),
          calledFromColoredPicker ? null : setRepeatUntil,
        ),
      0,
    );
  };

  useEffect(() => {
    if (branchesList[0]) {
      setSelectedBranch(branchesList[0]);
    }
  }, [branchesList]);

  useEffect(() => {
    if (blockTypes.length) {
      setSelectedBlockType(blockTypes.find(({ isWorking }) => isWorking));
    }
  }, [blockTypes]);

  useEffect(() => {
    if (selectedBranch) {
      dispatch(
        getBranchSpecializations({
          accountId: member.id,
          branchId: selectedBranch.id,
        }),
      );
    }
  }, [dispatch, member.id, selectedBranch]);

  useEffect(() => {
    if (selectedBranch) {
      dispatch(
        getCustomScheduleTemplate({
          accountId: member.id || member.accountId,
          branchId: selectedBranch.id,
        }),
      );
      form.setFieldsValue({ branchId: selectedBranch.id });
      generateTimeRangeByStep(
        selectedBranch.timelineStart,
        selectedBranch.timelineEnd,
        5,
        (range) => setTimeRange(range),
      );
    }
  }, [dispatch, form, member.accountId, member.id, selectedBranch]);

  useEffect(() => {
    if (document.querySelector(".ant-picker-content")) {
      document
        .querySelector(".ant-picker-content")
        .classList.add("colored-picker");

      document.querySelector(".ant-picker-content").style.pointerEvents =
        "none";

      document.querySelector(".ant-picker-header-view").style.pointerEvents =
        "none";
    }
  }, []);

  useEffect(() => {
    setSwitcherVal(template.isActive);
    if (template.patterns) {
      const templateBody = template.patterns.map((pattern) => ({
        ...pattern,
        TimeRanges: pattern.IsWorkingDay ? pattern.TimeRanges : defaultRange,
      }));
      setPatterns(templateBody);
      setCalendarVal(template.startingFrom);
      form.setFieldsValue({
        nonWorkingWeekdays: template.nonWorkingDays,
        repeatCount: template.repeatCount,
        startingFrom: moment(template.startingFrom),
      });
      setShouldSetFields(true);
      setTimeout(
        () =>
          updateCalendar(
            template.patterns,
            template.startingFrom,
            template.repeatCount,
            template.nonWorkingDays,
            setRepeatUntil,
          ),
        50,
      );
    } else {
      setPatterns([defaultPattern, defaultPattern]);
      form.setFieldsValue({
        nonWorkingWeekdays: [],
        repeatCount: 1,
        startingFrom: null,
      });
    }
    setShouldSetFields(true);
  }, [form, template]);

  useEffect(() => {
    if (shouldSetFields) {
      patterns.forEach((pattern, index) => {
        form.setFieldsValue({
          [`pattern[${index}].daysCount`]: pattern.DaysCount,
          [`pattern[${index}].isWorkingDay`]: pattern.IsWorkingDay,
        });

        pattern.TimeRanges.forEach((range, ind) => {
          form.setFieldsValue({
            [`pattern[${index}].range[${ind}].startTime`]: range.StartTime
              ? moment(range.StartTime, "HH:mm").format("HH:mm")
              : null,
            [`pattern[${index}].range[${ind}].endTime`]: range.EndTime
              ? moment(range.EndTime, "HH:mm").format("HH:mm")
              : null,
            [`pattern[${index}].range[${ind}].specializationId`]:
              range.SpecializationId,
          });
        });
      });
      setShouldSetFields(false);
    }
  }, [form, patterns, shouldSetFields]);

  useEffect(() => {
    updateCalendar(
      patterns.filter(({ hidden }) => !hidden),
      form.getFieldValue("startingFrom"),
      form.getFieldValue("repeatCount"),
      form.getFieldValue("nonWorkingWeekdays"),
      setRepeatUntil,
    );
  }, [form, patterns]);

  const handleStatusSwitcherChange = useCallback(
    (val) => {
      dispatch(
        toggleCustomScheduleActivity(
          {
            customScheduleTemplateId: template.id,
            isActivate: val,
          },
          (success) => {
            if (success) {
              message.success(t("schedule-switcher-success-msg"));
              setSwitcherVal(val);
            }
          },
        ),
      );
    },
    [dispatch, t, template.id],
  );

  const handleFormSubmit = (val) => {
    const filteredBody = [];
    patterns.forEach((pattern, index) => {
      if (!pattern.hidden) {
        let TimeRanges = [];
        if (pattern.IsWorkingDay) {
          const filteredRanges = [];
          pattern.TimeRanges.forEach((range, key) => {
            if (!range.hidden) {
              filteredRanges.push({
                BlockTypeId: selectedBlockType.id,
                StartTime: val[`pattern[${index}].range[${key}].startTime`],
                EndTime: val[`pattern[${index}].range[${key}].endTime`],
                SpecializationId:
                  val[`pattern[${index}].range[${key}].specializationId`] ??
                  null,
              });
            }
          });

          TimeRanges = filteredRanges;
        }
        filteredBody.push({
          ...pattern,
          TimeRanges,
        });
      }
    });

    const data = {
      accountId: member.id || member.accountId,
      branchId: val.branchId,
      startingFrom: moment(val.startingFrom, "YYYY-MM-DD").format("YYYY-MM-DD"),
      nonWorkingWeekdays: val.nonWorkingWeekdays,
      repeatCount: val.repeatCount,
      isActive: template.isActive,
      patterns: filteredBody,
    };

    if (!isServiceProvider) {
      dispatch(
        addCustomScheduleTemplate(data, () =>
          message.success(t("saved-successfully")),
        ),
      );
    }
  };

  const removePattern = (key) => {
    if (!isServiceProvider) {
      setPatterns((prev) =>
        prev.map((pattern, index) => {
          if (key === index) {
            return { ...pattern, hidden: true };
          }
          return pattern;
        }),
      );
    }
  };

  const removeTimeRange = (index, key) => {
    if (!isServiceProvider) {
      setPatterns((prev) =>
        prev.map((pattern, ind) => {
          if (ind === index) {
            return {
              ...pattern,
              TimeRanges: pattern.TimeRanges.map((range, rangeId) => {
                if (rangeId === key) {
                  return { ...range, hidden: true };
                }
                return range;
              }),
            };
          }
          return pattern;
        }),
      );
    }
  };

  const addTimeRange = (index) => {
    if (!isServiceProvider) {
      setPatterns((prev) =>
        prev.map((pattern, ind) => {
          if (ind === index) {
            return {
              ...pattern,
              TimeRanges: [...pattern.TimeRanges, ...defaultRange],
            };
          }
          return pattern;
        }),
      );
    }
  };

  const renderAddRangeBtn = (pattern, rangeIndex, index) => {
    let currentIndex = null;
    pattern.TimeRanges.forEach((item, key) => {
      if (!item.hidden) {
        currentIndex = key;
      }
    });

    if (currentIndex === rangeIndex) {
      return (
        <AddIcon
          onClick={() => (pattern.IsWorkingDay ? addTimeRange(index) : false)}
        />
      );
    }
    return false;
  };

  const renderSwitch = useCallback(
    () => (
      <Switch
        disabled={!Object.keys(template).length}
        checked={switcherVal}
        onChange={handleStatusSwitcherChange}
      />
    ),
    [handleStatusSwitcherChange, switcherVal, template],
  );

  return (
    <div>
      <ScheduleSwitcherWrapper>
        <span>{t("schedule-status")}</span>
        {renderSwitch()}
      </ScheduleSwitcherWrapper>
      <TemplateWrapper>
        <div className="form-part">
          <Form form={form} onFinish={handleFormSubmit} requiredMark={false}>
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
                style={{ minWidth: "170px" }}
                onChange={(id) =>
                  setSelectedBranch(
                    branchesList.filter((branch) => id === branch.id)[0],
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
            <FormItem
              name="startingFrom"
              label={t("start-date")}
              rules={[
                {
                  required: true,
                  message: t("required-field-msg"),
                },
              ]}
            >
              <CustomDatePicker
                onChange={(val) => {
                  setCalendarVal(val);
                  calendarColorUpdater();
                }}
              />
            </FormItem>
            <FormItem>
              {patterns.map((pattern, index) => (
                <PatternBlock
                  style={{ display: pattern.hidden ? "none" : "block" }}
                  // eslint-disable-next-line react/no-array-index-key
                  key={index}
                  $borderLeft={`2px solid ${colorsList[index]}`}
                >
                  {patterns.filter(({ hidden }) => !hidden).length > 2 && (
                    <CloseIcon
                      onClick={() => removePattern(index)}
                      className="remove-pattern"
                    />
                  )}

                  <div className="flexed-box">
                    <div>
                      <FormItem
                        label={
                          <div>
                            {t("days")}
                            <Popover
                              content={t("custom-days-count-msg")}
                              trigger="click"
                            >
                              <CircleHint />
                            </Popover>
                          </div>
                        }
                        labelCol={{ span: 24 }}
                        name={`pattern[${index}].daysCount`}
                        rules={[
                          () => ({
                            validator(_, value) {
                              if (
                                (value > 0 && value < 366) ||
                                pattern.hidden
                              ) {
                                return Promise.resolve();
                              }

                              if (value <= 0 || value >= 366) {
                                return Promise.reject(
                                  new Error(t("value-range-msg")),
                                );
                              }

                              return Promise.reject(
                                new Error(t("required-field-msg")),
                              );
                            },
                          }),
                        ]}
                      >
                        <CustomInput
                          min={1}
                          max={365}
                          disabled={isServiceProvider}
                          onChange={(e) => {
                            if (e.target.value > 0 && e.target.value < 366) {
                              setPatterns((prev) =>
                                prev.map((patt, pattIndex) => {
                                  if (pattIndex === index) {
                                    return {
                                      ...patt,
                                      DaysCount: e.target.value,
                                    };
                                  }
                                  return patt;
                                }),
                              );
                            }
                          }}
                          type="number"
                        />
                      </FormItem>
                    </div>
                    <div className="to-right-icon-box">
                      <ToRightArrow />
                    </div>
                    <div>
                      {pattern.TimeRanges.map((range, key) => (
                        <Space
                          // eslint-disable-next-line react/no-array-index-key
                          key={`pattern[${index}].range_${key}`}
                          style={{
                            display: range.hidden ? "none" : "flex",
                            marginBottom: 8,
                          }}
                          align="baseline"
                          className="range-block"
                        >
                          <FormItem
                            name={`pattern[${index}].range[${key}].startTime`}
                            label={t("start-time")}
                            labelCol={{ span: 24 }}
                            rules={[
                              {
                                required:
                                  pattern.IsWorkingDay &&
                                  !(pattern.hidden || range.hidden),
                                message: t("required-field-msg"),
                              },
                              ({ getFieldValue }) => ({
                                validator(_, value) {
                                  const prevRangeEnd = getFieldValue(
                                    `pattern[${index}].range[${
                                      key - 1
                                    }].endTime`,
                                  );

                                  const hasRightPrevEnd = prevRangeEnd
                                    ? moment(value, "HH:mm").isAfter(
                                        moment(prevRangeEnd, "HH:mm"),
                                      ) ||
                                      moment(value, "HH:mm").isSame(
                                        moment(prevRangeEnd, "HH:mm"),
                                      )
                                    : true;

                                  if (
                                    hasRightPrevEnd ||
                                    !pattern.IsWorkingDay ||
                                    pattern.hidden ||
                                    range.hidden
                                  ) {
                                    return Promise.resolve();
                                  }
                                  return Promise.reject(
                                    new Error(t("wrong-time")),
                                  );
                                },
                              }),
                            ]}
                          >
                            <CustomSelect
                              showSearch
                              disabled={
                                isServiceProvider || !pattern.IsWorkingDay
                              }
                            >
                              {timeRange.map((time) => (
                                <Option value={time} key={time}>
                                  {time}
                                </Option>
                              ))}
                            </CustomSelect>
                          </FormItem>
                          <FormItem
                            name={`pattern[${index}].range[${key}].endTime`}
                            label={t("end-time")}
                            labelCol={{ span: 24 }}
                            rules={[
                              {
                                required:
                                  pattern.IsWorkingDay &&
                                  !(pattern.hidden || range.hidden),
                                message: t("required-field-msg"),
                              },
                              ({ getFieldValue }) => ({
                                validator(_, value) {
                                  if (
                                    moment(value, "HH:mm").isAfter(
                                      moment(
                                        getFieldValue(
                                          `pattern[${index}].range[${key}].startTime`,
                                        ),
                                        "HH:mm",
                                      ),
                                    ) ||
                                    !pattern.IsWorkingDay ||
                                    pattern.hidden ||
                                    range.hidden
                                  ) {
                                    return Promise.resolve();
                                  }
                                  return Promise.reject(
                                    new Error(t("wrong-time")),
                                  );
                                },
                              }),
                            ]}
                          >
                            <CustomSelect
                              showSearch
                              disabled={
                                isServiceProvider || !pattern.IsWorkingDay
                              }
                            >
                              {timeRange.map((time) => (
                                <Option value={time} key={time}>
                                  {time}
                                </Option>
                              ))}
                            </CustomSelect>
                          </FormItem>
                          <FormItem
                            name={`pattern[${index}].range[${key}].specializationId`}
                            label={
                              <div>
                                {t("specialization")}
                                <Popover
                                  content={t("schedule-specialization-msg")}
                                  trigger="click"
                                >
                                  <CircleHint />
                                </Popover>
                              </div>
                            }
                            labelCol={{ span: 24 }}
                          >
                            <CustomSelect
                              disabled={
                                isServiceProvider || !pattern.IsWorkingDay
                              }
                              style={{ width: "160px" }}
                            >
                              <Option key="all" value={null}>
                                {t("all")}
                              </Option>
                              {specializations.map(({ id, name }) => (
                                <Option key={id} value={id}>
                                  {name}
                                </Option>
                              ))}
                            </CustomSelect>
                          </FormItem>
                          <ActionBox>
                            <DeleteIcon
                              style={{
                                visibility:
                                  pattern.TimeRanges.filter(
                                    ({ hidden }) => !hidden,
                                  ).length - 1 && !isServiceProvider > 0
                                    ? "visible"
                                    : "hidden",
                              }}
                              onClick={() => removeTimeRange(index, key)}
                              className="remove-icon"
                            />
                            {renderAddRangeBtn(pattern, key, index)}
                          </ActionBox>
                        </Space>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Space>
                      <FormItem
                        label={t("nonworking")}
                        labelCol={{ span: 18 }}
                        name={`pattern[${index}].isWorkingDay`}
                        colon={false}
                        style={{ marginBottom: "0px" }}
                      >
                        <input
                          type="checkbox"
                          style={{
                            maxWidth: "18px",
                            height: "18px",
                            verticalAlign: "bottom",
                          }}
                          disabled={isServiceProvider}
                          checked={!pattern?.IsWorkingDay}
                          onChange={() => {
                            setPatterns((prev) =>
                              prev.map((patt, pattIndex) => {
                                if (pattIndex === index) {
                                  return {
                                    ...patt,
                                    IsWorkingDay: !patt.IsWorkingDay,
                                  };
                                }
                                return patt;
                              }),
                            );
                          }}
                        />
                      </FormItem>
                    </Space>
                  </div>
                </PatternBlock>
              ))}
            </FormItem>
            <FormItem>
              {patterns.filter(({ hidden }) => !hidden).length < 7 && (
                <TransparentButton
                  disabled={isServiceProvider}
                  type="button"
                  className="add-pattern"
                  onClick={() => {
                    setPatterns((prev) => [...prev, defaultPattern]);
                  }}
                >
                  <Plus /> {t("add-new-pattern")}
                </TransparentButton>
              )}
            </FormItem>
            <FormItem name="nonWorkingWeekdays" label={t("nonworking-days")}>
              <CustomSelect
                disabled={isServiceProvider}
                onChange={() => calendarColorUpdater(null)}
                mode="multiple"
                allowClear
              >
                {WEEK_DAYS.map((day, index) => (
                  <Option key={day.abbr} title={day.abbr} value={index}>
                    <span
                      style={{ textTransform: "capitalize" }}
                      className="non-working-days"
                    >
                      {day.value}
                    </span>
                  </Option>
                ))}
              </CustomSelect>
            </FormItem>
            <div style={{ display: "flex" }}>
              <FormItem
                name="repeatCount"
                label={t("repeat-pattern-text")}
                rules={[
                  {
                    required: true,
                    message: t("required-field-msg"),
                  },
                  () => ({
                    validator(_, value) {
                      if (value > 0 && value < 366) {
                        return Promise.resolve();
                      }

                      return Promise.reject(new Error(t("value-range-msg")));
                    },
                  }),
                ]}
              >
                <StyledInput
                  min={1}
                  max={365}
                  disabled={isServiceProvider}
                  onChange={(e) => {
                    if (e.target.value.length < 4) {
                      calendarColorUpdater();
                    }
                  }}
                  type="number"
                  addonAfter={ `${t("valid-till")}: ${repeatUntil}`}
                />
              </FormItem>
             
            </div>
            <FormItem>
              <PrimaryButton disabled={isServiceProvider} htmlType="submit">
                {t("save")}
              </PrimaryButton>
            </FormItem>
          </Form>
        </div>
        <div className="calendar-part">
          <CustomDatePicker
            value={calendarVal ? moment(calendarVal, "YYYY-MM-DD") : null}
            onPanelChange={() => calendarColorUpdater("colored-picker-update")}
            className="colored-picker"
            open
            picker="day"
          />
        </div>
      </TemplateWrapper>
    </div>
  );
};

export default Custom;
