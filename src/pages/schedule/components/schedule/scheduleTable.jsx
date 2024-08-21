import moment from "moment";
import { Tooltip } from "antd";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { UserOutlined } from "@ant-design/icons";

import { EyeIcon } from "assets/images";
import { CustomTable } from "shared/styles";
import { StaffMemberInfo } from "pages/staff/styles";
import { CustomAvatar } from "shared/components/styles";
import RenderEmptyView from "shared/components/emptyView";
import { ScheduleTableWrapper, WorkingHours } from "../../styles";

const ScheduleTable = ({ scheduleList }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const getDayInfo = (dayData) =>
    dayData.startTime || dayData.endTime ? (
      <WorkingHours $isScheduled>
        {moment(dayData.startTime, "HH:ss").format("HH:ss")}-
        {moment(dayData.endTime, "HH:ss").format("HH:ss")}
      </WorkingHours>
    ) : (
      <WorkingHours>{t("not-scheduled")}</WorkingHours>
    );

  const handleOnProfileClick = (member) => {
    navigate(`/staff/${member.accountId}`);
  };

  const columns = [
    {
      width: "15%",
      title: t("staff"),
      dataIndex: "name",
      render: (_, { firstName, lastName, title, photoUrl }) => (
        <StaffMemberInfo>
          <CustomAvatar size={36} src={photoUrl} icon={<UserOutlined />} />
          <div>
            <h4>
              {firstName} {lastName}
            </h4>
            <p>{title}</p>
          </div>
        </StaffMemberInfo>
      ),
    },
    {
      width: "10%",
      title: t("mon"),
      dataIndex: ["weekdayScheduleTemplates", 1],
      render: (dayData) => getDayInfo(dayData),
    },
    {
      width: "10%",
      title: t("tue"),
      dataIndex: ["weekdayScheduleTemplates", 2],
      render: (dayData) => getDayInfo(dayData),
    },
    {
      width: "10%",
      title: t("wed"),
      dataIndex: ["weekdayScheduleTemplates", 3],
      render: (dayData) => getDayInfo(dayData),
    },
    {
      width: "10%",
      title: t("thu"),
      dataIndex: ["weekdayScheduleTemplates", 4],
      render: (dayData) => getDayInfo(dayData),
    },
    {
      title: t("fri"),
      dataIndex: ["weekdayScheduleTemplates", 5],
      width: "10%",
      render: (dayData) => getDayInfo(dayData),
    },
    {
      width: "10%",
      title: t("sat"),
      dataIndex: ["weekdayScheduleTemplates", 6],
      render: (dayData) => getDayInfo(dayData),
    },
    {
      width: "10%",
      title: t("sun"),
      dataIndex: ["weekdayScheduleTemplates", 0],
      render: (dayData) => getDayInfo(dayData),
    },
    {
      title: t("hours"),
      dataIndex: "hours",
      render: (_, row) => {
        let minutes = row.weekdayScheduleTemplates.reduce(
          (acc, currVal) => acc + currVal.duration,
          0,
        );

        const hours = Math.trunc(minutes / 60);
        minutes -= hours * 60;

        if (hours || minutes) {
          return (
            <WorkingHours $isScheduled>{`${hours}h, ${minutes}m`}</WorkingHours>
          );
        }

        return <WorkingHours $isScheduled>0h, 0m</WorkingHours>;
      },
    },
    {
      dataIndex: "tags",
      render: (_, render) => (
        <div style={{ cursor: "pointer" }}>
          <Tooltip placement="top" title={t("view")}>
            <EyeIcon onClick={() => handleOnProfileClick(render)} />
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <ScheduleTableWrapper>
      <CustomTable
        bordered
        columns={columns}
        rowKey="accountId"
        loading={!scheduleList}
        dataSource={scheduleList}
        pagination={{ pageSize: 10 }}
        rowClassName="working-hours"
        locale={{
          emptyText: (
            <RenderEmptyView text={t("empty-account-schedule-text")} />
          ),
        }}
      />
    </ScheduleTableWrapper>
  );
};

export default ScheduleTable;
