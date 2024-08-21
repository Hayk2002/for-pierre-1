import styled from "styled-components";

export const ScheduleTableWrapper = styled.div`
  .ant-table.ant-table-bordered
    > .ant-table-container
    > .ant-table-content
    > table {
    border: none;

    thead tr th {
      border-right: none;
      background-color: rgb(247, 249, 251);
    }
  }

  .working-hours td {
    padding: 14px;
  }
`;

export const ScheduleTabHeader = styled.div`
  display: flex;
  padding: 20px 20px 14px;
  background-color: #f7f9fb;
  justify-content: ${({ $splitted }) => $splitted && "space-between"};
`;

export const WorkingHours = styled.span`
  font-size: 12px;
  line-height: 14px;
  font-weight: bold;
  color: ${({ $isScheduled }) => ($isScheduled ? "#052642" : "#69869E")};
`;

export const UserProfileIndicator = styled.div`
  display: flex;
  cursor: pointer;
  align-items: center;
  justify-content: center;
`;

export const TemplatesHeader = styled.div`
  display: flex;
  padding: 20px;
  justify-content: flex-end;
`;

export const TimeLineBlocksWrapper = styled.div`
  margin: 48px 0 24px;
`;

export const TemplateFormActions = styled.div`
  display: flex;
  justify-content: center;
`;

export const CustomDaysButton = styled.div`
  display: flex;
  cursor: pointer;
  align-items: center;

  p {
    margin: 0;
  }
`;

export const ServiceProviderScheduleWrapper = styled.div`
  color: #07abbc;
  font-weight: bold;
`;

export const SlotsBoxWrapper = styled.div`
position: relative;
margin: 40px 0;
min-width: calc(100% - 64px);
width: max-content;
display: flex;
align-items: center;
padding: 8px;
border 1px dashed #15c0d1;
outline: ${({ $errorOutline }) => ($errorOutline ? " 2px solid red" : "")};

.add-block-btn {
  width: 54px;
  height: 54px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.slotsBox {
  position: relative;
  height: 52px;
  width: calc(100% - 64px);
}

.header-times-box{
  display: flex;
  margin-top: -99px;
  min-width: calc(100% - 64px);
}
`;

export const ActionsBox = styled.div`
  clear: both;
  display: flex;
  justify-content: center;
  column-gap: 20px;
  padding: 10px;

  &.slotActions {
    position: absolute;
    right: 2px;
  }
`;

export const HeaderBox = styled.div`
  width: calc(100% - 64px);
  display: flex;
`;
