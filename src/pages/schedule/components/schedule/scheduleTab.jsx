import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { Form, Select } from "antd";

import {
  selectBranchesList,
  selectScheduleList,
  selectSpecializationsList,
} from "store/selectors";
import { setPageTitle } from "utils/helpers";
import {
  getBranchesList,
  getSpecializationList,
  resetSpecializationsList,
} from "sharedStore/actions";
import { CustomForm, CustomFormItem, CustomSelect } from "shared/styles";
import ScheduleTable from "./scheduleTable";
import { accountScheduleListRequest, resetScheduleList } from "../../actions";
import { ScheduleTabHeader } from "../../styles";

const { Option } = Select;

const ScheduleTab = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const branches = useSelector(selectBranchesList);
  const scheduleList = useSelector(selectScheduleList);
  const specializations = useSelector(selectSpecializationsList);

  const [selectedBranchId, setSelectedBranchId] = useState(null);
  const [selectedSpecializationId, setSelectedSpecializationId] =
    useState(null);
  const [shouldUpdate, setShouldUpdate] = useState(true);

  useEffect(() => {
    setPageTitle("schedule");
  }, []);

  useEffect(() => {
    dispatch(getBranchesList((branch) => setSelectedBranchId(branch.id)));
    dispatch(getSpecializationList());

    return () => {
      dispatch(resetSpecializationsList());
      dispatch(resetScheduleList());
    };
  }, [dispatch]);

  useEffect(() => {
    if (selectedBranchId) {
      form.setFieldsValue({
        branch: selectedBranchId,
      });
    }
  }, [selectedBranchId, form]);

  useEffect(() => {
    if (selectedBranchId && specializations.length && shouldUpdate) {
      dispatch(
        accountScheduleListRequest({
          branchId: selectedBranchId,
          specializationIds: selectedSpecializationId
            ? [selectedSpecializationId]
            : specializations.map((item) => item.id),
        }),
      );
      setShouldUpdate(false);
    }
  }, [
    selectedSpecializationId,
    selectedBranchId,
    dispatch,
    specializations,
    shouldUpdate,
  ]);

  return (
    <CustomForm form={form}>
      <ScheduleTabHeader>
        <CustomFormItem name="branch" style={{ margin: 0 }}>
          <CustomSelect
            style={{
              width: 200,
              marginRight: 20,
            }}
            onChange={(id) => {
              setSelectedBranchId(id);
              setShouldUpdate(true);
            }}
          >
            {branches.map(({ id, name }) => (
              <Option key={id} value={id}>
                {name}
              </Option>
            ))}
          </CustomSelect>
        </CustomFormItem>
        <CustomFormItem
          name="specialization"
          style={{ margin: 0 }}
          initialValue={null}
        >
          <CustomSelect
            style={{
              width: 200,
            }}
            onChange={(id) => {
              setSelectedSpecializationId(id);
              setShouldUpdate(true);
            }}
          >
            <Option key="all" value={null}>
              {t("all-specializations")}
            </Option>
            {specializations.map(({ id, name }) => (
              <Option key={id} value={id}>
                {name}
              </Option>
            ))}
          </CustomSelect>
        </CustomFormItem>
      </ScheduleTabHeader>
      <ScheduleTable branches={branches} scheduleList={scheduleList} />
    </CustomForm>
  );
};

export default ScheduleTab;
