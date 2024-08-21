import styled from "styled-components";
import { Cascader, Tabs } from "antd";
import { CustomSelect } from "shared/styles";

export const HeaderWrapper = styled.div`
  padding: 20px 17px;
  margin-top: 10px;
  background: #f7f9fb;
  border-radius: 6px;
  justify-content: space-between;

  &,
  & > div {
    display: flex;
    align-items: center;
    flex-wrap: wrap;

    @media (max-width: 980px) {
      justify-content: center;
      row-gap: 7px;
    }
  }

  .date-box {
    button:not([class*="today-btn"]) {
      width: 16px;
      margin-right: 12px;
    }

    .ant-picker-input input {
      color: #052642;
      font-size: 14px;
      line-height: 17px;
      cursor: pointer;
    }

    .today-btn {
      color: #13bccd;
      font-weight: bold;
      font-size: 14px;
      line-height: 17px;
      margin-left: 32px;

      @media (max-width: 980px) {
        margin-left: 10px;
      }
    }
  }

  .selects-box {
    column-gap: 12px;
  }
`;

export const StyledSelect = styled(CustomSelect)`
  max-width: 200px;
  width: 200px;
`;

export const StyledOption = styled(CustomSelect.Option)``;

export const StyledCascader = styled(CustomSelect).attrs({
  as: Cascader,
})`
  max-width: 200px;
  width: 200px;
`;

export const StyledTabs = styled(Tabs)`
  .ant-tabs-content-holder {
    max-height: 300px;
    min-height: 40px;
    overflow: auto;
  }
`;

export const ProfileBox = styled.div`
  padding: 10px 11px;
  column-gap: 14px;

  img {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background-color: #9cb6cb;
    object-fit: contain;
  }

  h3 {
    font-size: 14px;
    line-height: 17px;
    color: #052642;
    margin-bottom: 4px;
  }

  span {
    font-size: 10px;
    line-height: 12px;
    color: #69869e;
  }
`;

export const TimeintervalBox = styled.div`
  background: #fff;
  border-radius: 6px;
  padding: 0;

  button {
    background: #fff;
    padding: 11px 12px;
    color: #052642;
    border: none;
    box-sizing: border-box;

    &:first-child {
      border-radius: 6px 0 0 6px;
    }

    &:last-child {
      border-radius: 0 6px 6px 0;
    }

    &.active {
      background: linear-gradient(180deg, #1cc9db 0%, #07abbc 100%);
      color: #fff;
      border: 1px solid #1cc9db;
      border-radius: 6px;
    }
  }
`;

export const FilterWrapper = styled.div`
  padding: 4px 20px 20px;
  background-color: #f7f9fb;

  form {
    display: flex;
    align-items: center;

    .ant-form-item {
      margin: 0 24px 0 0;
    }
  }

  .providers-suggestion-list .ant-select-selector {
    overflow: auto;
    max-height: 78px;
    overflow-x: hidden;

    &::-webkit-scrollbar {
      width: 12px;
    }

    &::-webkit-scrollbar-thumb {
      background-color: #c4c4c4;
    }

    &::-webkit-scrollbar-thumb {
      min-height: 4em;
      background-color: #eee;
      border-radius: 10px;
      -webkit-border-radius: 10px;
      background-clip: padding-box;
      border: 2px solid transparent;
    }
  }
`;

export const AdvancedSearchButton = styled.div`
  width: 40px;
  height: 40px;
  display: flex;
  cursor: pointer;
  position: relative;
  border-radius: 6px;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
  border: 1px solid ${({ isActive }) => (isActive ? "#1CC9DB" : "#9cb6cb")};
`;

export const ClearButton = styled.p`
  margin: 0;
  color: #15becf;
  cursor: pointer;
  font-size: 14px;
  font-weight: 700;
  line-height: 16px;
`;

export const AppointmentsPagination = styled.div`
  display: flex;
  align-items: center;

  .count {
    color: #69869e;
    margin-right: 15px;
  }
`;

export const AppointmentsPaginationButtons = styled.div`
  width: 30px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  span {
    cursor: pointer;
  }
`;

export const LeftPaginationButton = styled.span`
  pointer-events: ${({ count }) => count === 1 && "none"};

  svg path {
    fill: ${({ count }) => count !== 1 && "#1CC9DB"};
  }
`;

export const RightPaginationButton = styled.span`
  pointer-events: ${({ count, maxCount }) => count === maxCount && "none"};

  svg path {
    fill: ${({ count, maxCount }) => count !== maxCount && "#1CC9DB"};
  }
`;
