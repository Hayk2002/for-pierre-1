import { useState, useEffect, useMemo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { Form, Select, Tag, Popover } from "antd";

import {
  setPageTitle,
  generateTimeRangeByStep,
  getTimesAfterGivenTimeInRange,
  renderHeaderTimes,
} from "utils/helpers";
import { DefaultButton, PrimaryButton } from "shared/buttons/styles";
import {
  CustomForm,
  CustomFormItem,
  CustomInput,
  CustomSelect,
  CustomTextArea,
  ScheduleBlockBox,
} from "shared/styles";
import Layout from "layouts/layout";
import { selectTemplate } from "store/selectors";
import { getBlockTypesList } from "sharedStore/actions";
import { Plus, EditIcon, DeleteIcon } from "assets/images";
import { addTemplate, getTemplate, editTemplate } from "../../actions";
import { TemplateFormActions, SlotsBoxWrapper } from "../../styles";
import { SET_ACTIVE_TAB } from "../../constants";
import SlotsForm from "./slotsForm";

const { Option } = Select;
const step = 5;

const TemplateForm = () => {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();
  const { templateId } = params;

  const templateData = useSelector(selectTemplate);

  const [fromTimes, setFromTimes] = useState([]);
  const [toTimes, setToTimes] = useState([]);
  const [slotsList, setSlotsList] = useState([]);
  const [slotData, setSlotData] = useState({});
  const [editableSlotIndex, setEditableSlotIndex] = useState(null);
  const [updateHeader, setUpdateHeader] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [slotsErrorBorder, setSlotsErrorBorder] = useState(false);
  const [allRange, setAllRange] = useState([]);
  const [modalRanges, setModalRanges] = useState([]);

  useEffect(() => {
    if (!templateId) {
      generateTimeRangeByStep("00:00:00", "23:55:00", step, (range) => {
        setFromTimes(range);
        setToTimes(range);
        setAllRange(range);
      });
    } else {
      dispatch(getTemplate({ templateId }));
    }
  }, [dispatch, templateId]);

  useEffect(() => {
    setPageTitle(templateId ? "edit-template" : "add-template");
  }, [templateId]);

  useEffect(() => {
    dispatch(getBlockTypesList());
  }, [dispatch]);

  useEffect(() => {
    if (Object.entries(templateData).length && templateId) {
      form.setFieldsValue({
        templateName: templateData.name,
        templateDescription: templateData.description,
        startWorkTime: moment(templateData.startTime, "HH:mm:ss").format(
          "HH:mm",
        ),
        endWorkTime: moment(templateData.endTime, "HH:mm:ss").format("HH:mm"),
      });

      const sortedList = templateData.stBlockTimes;

      sortedList.sort((a, b) =>
        moment(a.startTime, "HH:mm:ss").diff(
          moment(b.startTime, "HH:mm:ss"),
          "minutes",
        ),
      );

      setSlotsList(sortedList);
      setUpdateHeader((prev) => !prev);
    }
  }, [templateData, form, templateId]);

  const navigateHandler = () => {
    dispatch({ type: SET_ACTIVE_TAB, payload: "templates" });
    navigate("/schedule");
  };

  const renderHeader = useMemo(
    () =>
      renderHeaderTimes(
        form.getFieldValue("startWorkTime") ?? "00:00",
        form.getFieldValue("endWorkTime") ?? "23:55",
        step,
        7,
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [form, updateHeader, templateData],
  );

  const modalTimeRangesSetter = useCallback(
    (index) => {
      const availableTimesList = [];
      const templateStart = form.getFieldValue("startWorkTime") ?? "00:00";
      const templateEnd = form.getFieldValue("endWorkTime") ?? "23:55";
      if (slotsList.length) {
        slotsList.forEach((slot, key) => {
          let start = slot.startTime;
          let end = slot.endTime;
          const prev = slotsList[key - 1];
          const next = slotsList[key + 1];

          if (
            key === 0 &&
            index !== key &&
            !moment(templateStart, "HH:mm").isAfter(
              moment(slot.startTime, "HH:mm:ss"),
            )
          ) {
            generateTimeRangeByStep(templateStart, start, step, (range) => {
              if (range.length > 1) {
                availableTimesList.push(range);
              }
            });
          }

          if (next) {
            end = next.startTime;
          } else if (
            moment(templateEnd, "HH:mm").isAfter(
              moment(slot.endTime, "HH:mm:ss"),
            )
          ) {
            end = templateEnd;
          }

          if (key === index - 1) {
            start = null;
          } else if (key === index) {
            if (prev) {
              start = prev.endTime;
            } else if (
              !moment(templateStart, "HH:mm").isAfter(
                moment(slot.startTime, "HH:mm:ss"),
              )
            ) {
              start = templateStart;
            }
          } else {
            start = slot.endTime;
          }

          if (start) {
            generateTimeRangeByStep(start, end, step, (range) => {
              if (range.length > 1) {
                availableTimesList.push(range);
              }
            });
          }
        });
        setModalRanges(availableTimesList);
      } else {
        generateTimeRangeByStep(templateStart, templateEnd, step, (range) =>
          setModalRanges([range]),
        );
      }
    },
    [form, slotsList],
  );

  const editSlot = useCallback(
    (item, index) => {
      setSlotData(item);
      modalTimeRangesSetter(index);
      setEditableSlotIndex(index);
      setIsModalVisible(true);
    },
    [modalTimeRangesSetter],
  );

  const deleteSlot = useCallback((index) => {
    setSlotsList((prev) => prev.filter((slot, key) => key !== index));
  }, []);

  const renderTemplateBlockTimes = useMemo(
    () =>
      slotsList.map((slot, index) => {
        const durationFromStart = +moment(slot.startTime, "HH:mm").diff(
          moment(form.getFieldValue("startWorkTime"), "HH:mm"),
          "minutes",
        );
        const left = (Math.round(durationFromStart / step) + 1) * 7;
        const duration = moment(slot.endTime, "HH:mm").diff(
          moment(slot.startTime, "HH:mm"),
          "minutes",
        );
        const slotPopoverContent = (
          <div className="color_white">
            <p>
              {t(slot.name?.toLowerCase()) ||
                t(slot.blockTypeName?.toLowerCase())}
            </p>
            <p>
              {slot.description?.length > 50
                ? `${slot.description.slice(0, 50)}...`
                : slot.description}
            </p>
            <p>
              {moment(slot.startTime, "HH:mm").format("HH:mm")} -{" "}
              {moment(slot.endTime, "HH:mm").format("HH:mm")}
            </p>
          </div>
        );

        return (
          <ScheduleBlockBox
            $left={left}
            $width={Math.round(duration / step) * 7}
            isWorking={slot.isWorkingDay}
            // eslint-disable-next-line react/no-array-index-key
            key={index}
          >
            <Popover trigger="hover" content={slotPopoverContent}>
              <div className="slot-content">
                <div />
                <div className="slot-actions">
                  <EditIcon onClick={() => editSlot(slot, index)} />
                  <DeleteIcon onClick={() => deleteSlot(index)} />
                </div>
              </div>
            </Popover>
          </ScheduleBlockBox>
        );
      }),

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [deleteSlot, editSlot, form, slotsList],
  );

  const handleStartTimeChange = (time) => {
    setToTimes(getTimesAfterGivenTimeInRange(allRange, time));
    setUpdateHeader((prev) => !prev);
  };

  const handlePlusClick = () => {
    const start = form.getFieldValue("startWorkTime");
    const end = form.getFieldValue("endWorkTime");

    if (
      start &&
      end &&
      moment(moment(end, "HH:mm")).isAfter(moment(start, "HH:mm"))
    ) {
      modalTimeRangesSetter();
      setIsModalVisible((prev) => !prev);
    }
  };

  const handleModalOk = (val) => {
    if (editableSlotIndex !== null) {
      setSlotsList((prev) =>
        prev.map((item, ind) => {
          if (ind === editableSlotIndex) {
            return val;
          }
          return item;
        }),
      );
    } else {
      const sortedList = [...slotsList, val];

      sortedList.sort((a, b) =>
        moment(a.startTime, "HH:mm:ss").diff(
          moment(b.startTime, "HH:mm:ss"),
          "minutes",
        ),
      );
      setSlotsList(sortedList);
    }

    setSlotData({});
    setEditableSlotIndex(null);
    setIsModalVisible((prev) => !prev);
  };

  const handleModalOnclose = () => {
    setSlotData({});
    setIsModalVisible(false);
  };

  const handleOnFinish = ({
    templateName,
    templateDescription,
    startWorkTime,
    endWorkTime,
  }) => {
    if (slotsList.length) {
      const body = {
        name: templateName,
        description: templateDescription,
        isWorkingDay: true,
        startTime: startWorkTime,
        endTime: endWorkTime,
        isActive: true,
        stBlockTimes: slotsList,
      };

      if (templateId) {
        dispatch(editTemplate({ body, templateId }, () => navigateHandler()));
      } else {
        dispatch(addTemplate(body, () => navigateHandler()));
      }
    } else {
      setSlotsErrorBorder(true);
    }
  };

  return (
    <Layout noMargin contentScrollable>
      <div style={{ padding: 38 }}>
        <CustomForm form={form} preserve={false}>
          <div>
            <div style={{ display: "flex" }}>
              <CustomFormItem
                name="templateName"
                label={t("template-name")}
                rules={[
                  {
                    required: true,
                    message: t("required-field-msg"),
                  },
                ]}
              >
                <CustomInput autoComplete="off" style={{ width: 300 }} />
              </CustomFormItem>
            </div>
            <div style={{ display: "flex", minWidth: 300 }}>
              <CustomFormItem
                name="templateDescription"
                label={t("optional-description")}
              >
                <CustomTextArea
                  autoSize={{ minRows: 3, maxRows: step }}
                  style={{ width: 300 }}
                />
              </CustomFormItem>
            </div>
          </div>
          <div style={{ display: "flex" }}>
            <span style={{ width: 150 }}>
              <CustomFormItem
                name="startWorkTime"
                label={t("start-time")}
                rules={[
                  {
                    required: true,
                    message: t("required-field-msg"),
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      const toTime = getFieldValue("endWorkTime");
                      if (
                        moment(moment(value, "HH:mm")).isBefore(
                          moment(toTime, "HH:mm"),
                        ) ||
                        !toTime
                      ) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error(t("wrong-time")));
                    },
                  }),
                ]}
              >
                <CustomSelect
                  showSearch
                  onChange={handleStartTimeChange}
                  disabled={templateId}
                >
                  {fromTimes.map((time) => (
                    <Option value={time} key={time}>
                      {time}
                    </Option>
                  ))}
                </CustomSelect>
              </CustomFormItem>
            </span>
            <span style={{ width: 150, marginLeft: 20 }}>
              <CustomFormItem
                name="endWorkTime"
                label={t("end-time")}
                rules={[
                  {
                    required: true,
                    message: t("required-field-msg"),
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      const fromTime = getFieldValue("startWorkTime");

                      if (
                        moment(moment(value, "HH:mm")).isAfter(
                          moment(fromTime, "HH:mm"),
                        ) ||
                        !fromTime
                      ) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error(t("wrong-time")));
                    },
                  }),
                ]}
              >
                <CustomSelect
                  onChange={() => {
                    form.validateFields(["startWorkTime"]);
                    setUpdateHeader((prev) => !prev);
                  }}
                  showSearch
                  disabled={templateId}
                >
                  {toTimes.map((time) => (
                    <Option value={time} key={time}>
                      {time}
                    </Option>
                  ))}
                </CustomSelect>
              </CustomFormItem>
            </span>
          </div>

          <div>
            <SlotsBoxWrapper
              $errorOutline={slotsErrorBorder && !slotsList.length}
            >
              <div style={{ width: 64 }}>
                <Tag
                  color="success"
                  className="add-block-btn"
                  onClick={handlePlusClick}
                >
                  <Plus />
                </Tag>
              </div>
              <div className="slotsBox">
                {slotsList.length > 0 && renderTemplateBlockTimes}
              </div>
              <div className="header-times-box">{renderHeader}</div>
            </SlotsBoxWrapper>
          </div>

          <SlotsForm
            isModalVisible={isModalVisible}
            handleModalOk={handleModalOk}
            handleModalOnclose={handleModalOnclose}
            availableRanges={modalRanges}
            slot={slotData}
          />

          <TemplateFormActions>
            <DefaultButton
              style={{
                marginRight: 20,
              }}
              onClick={() => navigateHandler()}
            >
              {t("cancel")}
            </DefaultButton>
            <PrimaryButton
              onClick={() => {
                form
                  .validateFields()
                  .then((values) => {
                    handleOnFinish(values);
                  })
                  .catch((info) => {
                    // eslint-disable-next-line no-console
                    console.log("Validate Failed:", info);
                  });
              }}
            >
              {t("save")}
            </PrimaryButton>
          </TemplateFormActions>
        </CustomForm>
      </div>
    </Layout>
  );
};

export default TemplateForm;
