import styled from "styled-components";

export const SettingsTableHeader = styled.div`
  display: flex;
  padding: 20px;
  align-items: center;
  background-color: #f7f9fb;
  justify-content: space-between;
`;

export const ServiceAdditionWrapper = styled.div`
  .scrollable {
    height: 340px;
  }
`;

export const ServiceAdditionList = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 20px;
  justify-content: space-between;
  border-bottom: 1px solid #e3ebef;

  p {
    margin: 0;
    color: #052642;
    font-size: 14px;
    font-weight: 400;
    line-height: 16px;
  }
`;

export const SelectedServicesList = styled.div`
  height: 80px;
  display: flex;
  flex-wrap: wrap;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #e3ebef;
`;

export const SelectedService = styled.div`
  display: flex;
  padding: 10px 16px;
  border-radius: 6px;
  align-items: center;
  margin: 0 10px 10px 0;
  background: linear-gradient(180deg, #f1f6fa 0%, #e8eef2 100%);

  span {
    color: #052642;
    font-size: 14px;
    line-height: 16px;
    margin-right: 14px;
  }
`;
