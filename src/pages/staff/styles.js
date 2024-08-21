import styled from "styled-components";

export const InvitationStateActions = styled.div`
  display: flex;
  cursor: pointer;
  align-items: center;
  
  p {
    margin: 0 8px;
    color: #07abbc;
    font-size: 14px;
    font-weight: 700;
    line-height: 16px;
  }
`;

export const StaffMemberInfo = styled.div`
  display: flex;
  align-items: center;

  div {
    margin-left: 12px;

    .highlighter {
      color: #052642;
      font-size: 14px;
      display: block;
    }

    .highlighter-title {
      color: #9cb6cb;
      font-size: 10px;
    }
  }
`;

export const MemberViewWrapper = styled.div`
  height: 100%;
  display: flex;
`;

export const MemberDetailsView = styled.div`
  display: flex;
  font-size: 14px;
  line-height: 16px;
  align-items: center;
  padding: 30px 26px 0;
  flex-direction: column;
  background-color: #f7f9fb;

  p {
    margin: 0;
  }

  div {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    padding: 15px 0 25px;
    flex-direction: column;
    justify-content: center;
    border-bottom: 1px solid #8b8b8b;

    h4 {
      color: #052642;
      font-size: 16px;
      font-weight: 700;
      line-height: 19px;
      margin-bottom: 6px;
    }
  }

  & > p {
    display: flex;
    align-items: center;
  }
`;

export const MemberSpecializationsWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

export const MemberSpecializationsHeader = styled.div`
  display: flex;
  padding: 20px 20px 0;
  align-items: center;
  justify-content: space-between;

  h4 {
    margin: 0;
    font-size: 20px;
    font-weight: 700;
    line-height: 24px;
  }
`;

export const InvitationCheckboxWrapper = styled.div`
  display: flex;
  margin-top: 20px;
  align-items: center;

  p {
    color: #2c4a62;
    font-size: 14px;
    line-height: 17px;
    margin: 0 0 0 12px;
  }
`;

export const SpecializationsCollection = styled.div`
  width: 100%;
  display: flex;
  padding: 20px 0;
  flex-direction: column;

  & > div {
    margin-top: 30px;

    &:first-child {
      margin-top: 0;
    }
  }

  h4,
  p {
    margin: 0;
  }
`;

export const SpecializationsCollectionHeader = styled.div`
  display: flex;
  padding: 10px 22px 10px 30px;
  justify-content: space-between;

  h4 {
    color: #052642;
    font-size: 14px;
  }
`;

export const SpecializationsCollectionActions = styled.div`
  width: 72px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  & * {
    cursor: pointer;
  }
`;

export const SpecializationItem = styled.div`
  width: 100%;
  display: flex;

  h4 {
    color: #052642;
    font-size: 14px;
    font-weight: bold;
  }

  & div {
    width: 50%;
    padding: 20px 26px;
    border-top: 1px solid #e3ebef;
    border-right: 1px solid #e3ebef;

    &:last-child {
      padding: 20px;
      border-right: none;

      .ant-typography {
        color: #052642;
      }
    }
  }

  &:last-child > div {
    border-bottom: 1px solid #e3ebef;
  }
`;

export const LocationAdditionWrapper = styled.div`
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid #e3ebef;

  p {
    color: #2c4a62;
    font-size: 14px;
    line-height: 16px;
    margin: 0 14px 0 0;
  }
`;

export const ProfileScheduleWrapper = styled.div`
  padding: 22px 20px;
`;

export const CustomTabsWrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .ant-tabs-nav-list {
    border: 1px solid #9cb6cb;
    border-radius: 6px;
  }

  .ant-tabs {
    padding: 0;
    width: 100%;
    overflow: auto;

    .ant-tabs-nav::before {
      border: none;
    }

    .ant-tabs-tab {
      width: 146px;
      padding: 13px 20px;
      margin: 0;
      border-radius: 6px;
      div {
        width: max-content;
        margin: auto;
        font-weight: 400;
        font-size: 14px;
        line-height: 17px;
      }
    }

    .ant-tabs-tab-active {
      border-bottom: 0 !important;
      border-radius: 6px;
      background: linear-gradient(180deg, #1cc9db 0%, #07abbc 100%);
      div {
        font-weight: 700;
        color: #fff;
      }
    }
    .ant-tabs-ink-bar-animated {
      display: none;
    }
  }
`;
