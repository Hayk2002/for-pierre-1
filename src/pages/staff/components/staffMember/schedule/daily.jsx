import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { Form, Space, Popover, message } from "antd";
import moment from "moment";
import { v4 as uuidv4 } from "uuid";

import {
  selectBranchSpecializations,
  selectCustomDayScheduleTemplate,
  selectBlockTypes,
} from "store/selectors";
import { generateTimeRangeByStep } from "utils/helpers";
import { CustomSelect, CustomDatePicker } from "shared/styles";
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
  addCustomDaySchedule,
  getBranchSpecializations,
  getCustomDaySchedule,
  deleteCustomDayPattern,
} from "../../../actions";
import { TemplateWrapper, PatternBlock, ActionBox } from "./styles";
import { colorsList } from "./helper";

const FormItem = Form.Item;
const { Option } = CustomSelect;

const defaultRange = [
  {
    specializationId: null,
    startTime: null,
    endTime: null,
  },
];

const defaultPattern = {
  isWorkingDay: true,
  date: null,
  customDayScheduleBlockTimes: defaultRange,
  error: false,
  msg: null,
  uId: uuidv4()
};
const CustomDay = ({ member, branchesList, isServiceProvider }) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  

  const specializations = useSelector(selectBranchSpecializations);
  const template = useSelector(selectCustomDayScheduleTemplate);
  const blockTypes = useSelector(selectBlockTypes);

  const [selectedBranch, setSelectedBranch] = useState(null);
  const [selectedBlockType, setSelectedBlockType] = useState(0);
  const [patterns, setPatterns] = useState([defaultPattern]);
  const [timeRange, setTimeRange] = useState([]);
  const [shouldSetFields, setShouldSetFields] = useState(false);

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
        getCustomDaySchedule({
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
    if (template.length) {
      const templateBody = template.map((pattern) => ({
        ...pattern,
        uId: uuidv4(),
        isWorkingDay: pattern.isWorkingDay,
        customDayScheduleBlockTimes: pattern.isWorkingDay
          ? pattern.customDayScheduleBlockTimes
          : defaultRange,
      }));
      setPatterns(templateBody);
      setShouldSetFields(true);
    } else {
      setPatterns([defaultPattern]);
    }
    setShouldSetFields(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form, template]);

  useEffect(() => {
    if (shouldSetFields) {
      patterns.forEach((pattern, index) => {
        form.setFieldsValue({
          [`pattern[${pattern.uId}].date`]: pattern.date
            ? moment(pattern.date, "YYYY-MM-DD")
            : moment(),
          [`pattern[${pattern.uId}].isWorkingDay`]: pattern.isWorkingDay,
          [`pattern[${pattern.uId}].id`]: pattern.id,
        });

        pattern.customDayScheduleBlockTimes.forEach((range, ind) => {
          form.setFieldsValue({
            [`pattern[${pattern.uId}].range[${ind}].id`]: range.id,
            [`pattern[${pattern.uId}].range[${ind}].startTime`]: range.startTime
              ? moment(range.startTime, "HH:mm:ss").format("HH:mm")
              : null,
            [`pattern[${pattern.uId}].range[${ind}].endTime`]: range.endTime
              ? moment(range.endTime, "HH:mm:ss").format("HH:mm")
              : null,
            [`pattern[${pattern.uId}].range[${ind}].specializationId`]: range.specializationId,
          });
        });
      });
      setShouldSetFields(false);
    }
  }, [form, patterns, shouldSetFields]);

  useEffect(() => {
    if (!patterns.filter(({ hidden }) => !hidden).length) {
      setTimeout(() => {
        setPatterns(prev => [...prev, defaultPattern])
        setShouldSetFields(true)
      }, 300);
    }
  }, [patterns]);

  const handleFormSubmit = (val) => {
    const filteredBody = [];
    patterns.forEach((pattern, index) => {
      if (!pattern.hidden) {
        let customDayScheduleBlockTimes = [];
        if (pattern.isWorkingDay) {
          const filteredRanges = [];
          pattern.customDayScheduleBlockTimes.forEach((range, key) => {
            if (!range.hidden) {
              let rangeData = {
                blockTypeId: selectedBlockType.id,
                startTime: val[`pattern[${pattern.uId}].range[${key}].startTime`],
                endTime: val[`pattern[${pattern.uId}].range[${key}].endTime`],
                specializationId:
                  val[`pattern[${pattern.uId}].range[${key}].specializationId`] ??
                  null,
              };

              if (val[`pattern[${pattern.uId}].range[${key}].id`] >= 0) {
                rangeData = {
                  ...rangeData,
                  id: val[`pattern[${pattern.uId}].range[${key}].id`],
                };
              }
              filteredRanges.push(rangeData);
            }
          });

          customDayScheduleBlockTimes = filteredRanges;
        }

        let filteredBodyData = {
          date: moment(
            form.getFieldValue(`pattern[${pattern.uId}].date`),
            "YYYY-MM-DD",
          ).format("YYYY-MM-DD"),
          isWorkingDay: pattern.isWorkingDay,
          customDayScheduleBlockTimes,
        };

        if (form.getFieldValue(`pattern[${pattern.uId}].id`) >= 0) {
          filteredBodyData = {
            ...filteredBodyData,
            id: form.getFieldValue(`pattern[${pattern.uId}].id`),
          };
        }
        filteredBody.push(filteredBodyData);
      }
    });

    const data = {
      accountId: member.id || member.accountId,
      branchId: val.branchId,
      startTime: selectedBranch.timelineStart,
      endTime: selectedBranch.timelineEnd,
      customDays: filteredBody,
    };

    if (!isServiceProvider) {
      dispatch(
        addCustomDaySchedule(data, () =>
          message.success(t("saved-successfully")),
        ),
      );
    }
  };

  const removePattern = (uId, id) => {
    if (!isServiceProvider) {
      if (id && id !== null) {
        dispatch(
          deleteCustomDayPattern({ id }, () =>
            setPatterns((prev) => prev.filter((pattern) => pattern.id !== id)),
          ),
        );
      } else {
        setPatterns((prev) => prev.filter((pattern) => pattern.uId !== uId));
      }
    }
  };

  const removeTimeRange = (index, key) => {
    if (!isServiceProvider) {
      setPatterns((prev) =>
        prev.map((pattern, ind) => {
          if (ind === index) {
            return {
              ...pattern,
              customDayScheduleBlockTimes:
                pattern.customDayScheduleBlockTimes.map((range, rangeId) => {
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
              customDayScheduleBlockTimes: [
                ...pattern.customDayScheduleBlockTimes,
                ...defaultRange,
              ],
            };
          }
          return pattern;
        }),
      );
    }
  };

  const renderAddRangeBtn = (pattern, rangeIndex, index) => {
    let currentIndex = null;
    pattern.customDayScheduleBlockTimes.forEach((item, key) => {
      if (!item.hidden) {
        currentIndex = key;
      }
    });

    if (currentIndex === rangeIndex) {
      return (
        <AddIcon
          onClick={() => (pattern.isWorkingDay ? addTimeRange(index) : false)}
        />
      );
    }
    return false;
  };

  return (
    <div>
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

            <FormItem>
              {patterns.map((pattern, index) => (
                    <PatternBlock
                      style={{
                        display: pattern.hidden ? "none" : "block",
                        outline: pattern.error ? "1px solid red" : "none",
                      }}
                      key={pattern.uId}
                      $borderLeft={`2px solid ${colorsList[index]}`}
                    >
                      {patterns.filter(({ hidden }) => !hidden).length > 0 && (
                        <CloseIcon
                          onClick={() => removePattern(pattern.uId, pattern.id)}
                          className="remove-pattern"
                        />
                      )}
                      {pattern.msg && <p className="error-box">{pattern.msg}</p>}
                      <div className="flexed-box">
                        <div>
                          {pattern.id >= 0 ? (
                            <FormItem hidden name={`pattern[${pattern.uId}].id`} />
                          ) : null}
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
                            name={`pattern[${pattern.uId}].date`}
                            rules={[
                              {
                                required: !pattern.hidden,
                                message: t("required-field-msg"),
                              },
                            ]}
                          >
                            <CustomDatePicker />
                          </FormItem>
                        </div>
                        <div className="to-right-icon-box">
                          <ToRightArrow />
                        </div>
                        <div>
                          {pattern.customDayScheduleBlockTimes.map(
                            (range, key) => (
                                <Space
                                  // eslint-disable-next-line react/no-array-index-key
                                  key={`pattern[${pattern.uId}].range_${key}`}
                                  style={{
                                    display: range.hidden ? "none" : "flex",
                                    marginBottom: 8,
                                  }}
                                  align="baseline"
                                  className="range-block"
                                >
                                  {range.id >= 0 ? (
                                    <FormItem
                                      hidden
                                      name={`pattern[${pattern.uId}].range[${key}].id`}
                                    />
                                  ) : null}
                                  <FormItem
                                    name={`pattern[${pattern.uId}].range[${key}].startTime`}
                                    label={t("start-time")}
                                    labelCol={{ span: 24 }}
                                    rules={[
                                      {
                                        required:
                                          pattern.isWorkingDay &&
                                          !(pattern.hidden || range.hidden),
                                        message: t("required-field-msg"),
                                      },
                                      ({ getFieldValue }) => ({
                                        validator(_, value) {
                                          const prevRangeEnd = getFieldValue(
                                            `pattern[${pattern.uId}].range[${
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
                                            !pattern.isWorkingDay ||
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
                                        isServiceProvider || !pattern.isWorkingDay
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
                                    name={`pattern[${pattern.uId}].range[${key}].endTime`}
                                    label={t("end-time")}
                                    labelCol={{ span: 24 }}
                                    rules={[
                                      {
                                        required:
                                          pattern.isWorkingDay &&
                                          !(pattern.hidden || range.hidden),
                                        message: t("required-field-msg"),
                                      },
                                      ({ getFieldValue }) => ({
                                        validator(_, value) {
                                          if (
                                            moment(value, "HH:mm").isAfter(
                                              moment(
                                                getFieldValue(
                                                  `pattern[${pattern.uId}].range[${key}].startTime`,
                                                ),
                                                "HH:mm",
                                              ),
                                            ) ||
                                            !pattern.isWorkingDay ||
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
                                        isServiceProvider || !pattern.isWorkingDay
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
                                    name={`pattern[${pattern.uId}].range[${key}].specializationId`}
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
                                        isServiceProvider || !pattern.isWorkingDay
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
                                          pattern.customDayScheduleBlockTimes.filter(
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
                            label={t("nonworking-days")}
                            labelCol={{ span: 18 }}
                            name={`pattern[${pattern.uId}].isWorkingDay`}
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
                              checked={!pattern?.isWorkingDay}
                              onChange={() => {
                                setPatterns((prev) =>
                                  prev.map((patt, pattIndex) => {
                                    if (pattIndex === index) {
                                      return {
                                        ...patt,
                                        isWorkingDay: !patt.isWorkingDay,
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
                  )
                )}
            </FormItem>
            <FormItem>
              <TransparentButton
                disabled={isServiceProvider}
                type="button"
                className="add-pattern"
                onClick={() => {
                  setPatterns((prev) => [
                    ...prev,
                    { ...defaultPattern, uId: uuidv4() },
                  ]);
                }}
              >
                <Plus /> {t("add-new-pattern")}
              </TransparentButton>
            </FormItem>

            <FormItem>
              <PrimaryButton disabled={isServiceProvider} htmlType="submit">
                {t("save")}
              </PrimaryButton>
            </FormItem>
          </Form>
        </div>
      </TemplateWrapper>
    </div>
  );
};

export default CustomDay;
