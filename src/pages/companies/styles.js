import styled from "styled-components";

export const InvitationsWrapper = styled.div`
  display: flex;
  height: 70px;
  margin: 20px;
  cursor: pointer;
  padding: 25px 25px;
  border-radius: 6px;
  border: 1px solid #e3ebef;
  justify-content: space-between;
  background: linear-gradient(180deg, #ffffff 0%, #f1f6fa 100%);
`;

export const InvitationsWrapperItems = styled.div`
  display: flex;
  color: #000000;
  font-size: 18px;
  line-height: 21px;
  align-items: center;
`;

export const InvitationsWrapperTitle = styled.h4`
  color: #000000;
  font-size: 18px;
  margin: 0 18px 0 22px;
`;

export const CustomBadge = styled.div`
  width: 22px;
  height: 22px;
  color: #ffffff;
  font-size: 10px;
  margin-left: 5px;
  border-radius: 50%;
  text-align: center;
  background-color: ${({ disabled }) => (disabled ? "#CBD9E4" : "#1ac23f")};
`;

export const ToggleArrowIcon = styled.div`
`;

export const ListItemAction = styled.span`
  width: 18px;
  height: 18px;
  cursor: pointer;
  margin-left: 28px;

  &:first-child {
    margin-left: 0;
  }

  img {
    width: 100%;
    height: 100%;
  }
`;

export const ActiveCompanyWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

export const BranchesWrapper = styled.div`
  margin-top: 20px;
`;

export const DeleteBranchInfo = styled.div`
  p {
    margin-bottom: 0;
  }

  .warning {
    display: flex;
    justify-content: center;

    & > p {
      color: #fcb813;
      font-size: 14px;
      font-weight: 600;
      line-height: 16px;
      margin-left: 10px;
    }
  }

  .content {
    flex-direction: column;

    .ant-checkbox-group {
      padding: 16px 0 32px;

      label {
        margin: 16px 0;
      }
    }

    span {
      color: #052642;
      font-size: 16px;
      font-weight: 400;
      line-height: 19px;
    }
  }
`;

export const EditPageWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

export const WorkingHoursWrapper = styled.div`
  display: flex;
  flex-direction: column;

  label {
    height: auto;
    color: #2c4a62;
    font-size: 14px;
    line-height: 17px;
    margin-bottom: 10px;
  }
`;

export const WorkingHoursInputs = styled.div`
  display: flex;
  flex-wrap: wrap;
  .middle-line {
    display: flex;
    padding: 0 8px;
    align-items: center;
    margin-bottom: 20px;
  }
`;

export const CompanyApprovalActions = styled.div`
  display: flex;
  align-items: center;

  div {
    display: flex;
    margin-right: 8px;
    align-items: center;

    p {
      color: #07abbc;
      font-size: 14px;
      font-weight: 700;
      line-height: 16px;
      margin: 0 0 0 8px;
    }
  }
`;
