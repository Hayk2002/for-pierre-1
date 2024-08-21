import styled, { css } from "styled-components";
import { Checkbox, Form, Input, Select, Table, DatePicker, List } from "antd";

const { TextArea } = Input;

const formControlStyles = css`
  height: 100%;
  color: #052642;
  font-size: 14px;
  max-height: 40px;
  line-height: 17px;
  border-radius: 6px;
  padding: 0.4rem 1rem;
  border: 1px solid #9cb6cb;
  background-color: #ffffff;

  &::placeholder {
    color: #69869e;
    font-size: 14px;
    line-height: 17px;
  }

  &:hover,
  &:focus,
  &:active {
    border-color: #07abbc;
  }
`;

export const backgroundImageStyles = css`
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
`;

export const CustomForm = styled(Form).attrs(() => ({
  colon: false,
  requiredMark: false,
  labelCol: { span: 24 },
}))`
  width: 100%;
`;

export const CustomFormItem = styled(Form.Item)`
  margin-bottom: 20px;

  &:last-child {
    margin-top: ${({ sibling }) => (sibling ? "" : "40px")};
  }

  .ant-form-item-explain {
    font-size: 11px;
  }

  .ant-form-item-label {
    padding: 0;
    margin-bottom: 10px;

    label {
      height: auto;
      font-size: 14px;
      line-height: 17px;
      color: #2c4a62;
    }
  }
`;

export const CustomFormActions = styled.div`
  display: flex;
  align-items: center;
  flex-direction: ${({ row }) => (row ? "row" : "column")};
  justify-content: ${({ row }) => row && "space-between"};
  column-gap: 10px;
`;

export const CustomInput = styled(Input)`
  ${formControlStyles}
`;

export const StyledInput = styled(Input)`
  .ant-input-group {
    width: initial;
  }
  .ant-input-group-addon {
    background-color: transparent;
    border: none;
  }
`;

export const CustomTextArea = styled(TextArea)`
  ${formControlStyles}
`;

export const PasswordInput = styled(Input.Password)`
  ${formControlStyles}
`;

export const CustomSelect = styled(Select)`
  &.ant-select .ant-select-selector {
    ${formControlStyles};
    max-height: 100%;
    padding: 4px 0 4px 20px;

    .ant-select-selection-overflow {
      left: -18px;
    }
  }
`;

export const CustomDatePicker = styled(DatePicker)`
  ${formControlStyles};
`;

export const AuthenticatedViewWrapper = styled.div`
  height: 100%;
  display: flex;
  position: relative;
`;

export const TabsPageWrapper = styled.div`
  display: flex;
  flex-direction: column;

  .ant-tabs {
    overflow: auto;
  }

  .ant-tabs-nav {
    margin: 0;
  }

  .ant-tabs-tab:hover {
    color: #07abbc;
  }

  .ant-tabs-tab-active {
    border-bottom-color: #07abbc;

    .ant-tabs-tab-btn {
      color: #07abbc;
    }
  }

  .ant-tabs-tab-btn {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  &.staff-member {
    height: 100%;

    .ant-tabs-content-holder {
      min-height: auto;
    }

    .ant-tabs,
    .ant-tabs-content,
    .ant-tabs-tabpane {
      height: 100%;
    }
  }
`;

export const SearchInput = styled(CustomInput).attrs(() => ({
  allowClear: true,
}))`
  padding: 12px 15px;

  .ant-input-prefix {
    margin: 0;
  }

  .ant-input {
    margin-left: 10px;
  }
`;

export const CustomCheckbox = styled(Checkbox)`
  &.green-checkbox {
    .ant-checkbox-checked:after {
      border: none;
    }

    .ant-checkbox-inner {
      height: 24px;
      width: 24px;
      border-radius: 50%;

      &:after {
        width: 7px;
        height: 12px;
        margin-left: 2px;
      }
    }

    .ant-checkbox-checked .ant-checkbox-inner {
      background-color: #1ac23f;
      border-color: #1ac23f;
    }

    .ant-checkbox-wrapper:hover .ant-checkbox-inner,
    .ant-checkbox:hover .ant-checkbox-inner,
    .ant-checkbox-input:focus + .ant-checkbox-inner {
      border-color: #1ac23f;
    }
  }
`;

export const CustomTable = styled(Table)`
  .ant-table-thead th {
    color: #69869e;
    font-size: 14px;
    line-height: 17px;
    background: #ffffff;
    text-transform: uppercase;
  }

  .highlited {
    background: #ff0;
  }
`;

export const TableActionsWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-left: auto;
  width: ${({ isServiceProvider }) => (isServiceProvider ? "108px" : "72px")};

  & * {
    cursor: pointer;
  }
`;

export const TableDescriptionWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  column-gap: 35px;
  width: 250px;
  margin-left: auto;
`;

export const AssignableItemsWrapper = styled.div`
  .scrollable {
    height: 340px;
  }
`;

export const AssignableItemsActions = styled.div`
  display: flex;
  margin-top: 16px;
  justify-content: space-evenly;
`;

export const AssignableItemsSearch = styled(SearchInput)`
  width: 100%;
  border: none;
  outline: none;
  box-shadow: none;
  border-radius: unset;
  border-bottom: 1px solid #e3ebef;

  &:not(.atn-input-affix-wrapper-disabled):hover,
  &:not(.atn-input-affix-wrapper-disabled):active,
  &:not(.atn-input-affix-wrapper-disabled):focus {
    border-color: #e3ebef;
  }
`;

export const AssignableItemsList = styled.div`
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

export const CustomTextarea = styled(CustomInput.TextArea)`
  ${formControlStyles};
  max-height: 80px;
`;

export const ScheduleBlockBox = styled.div`
  position: absolute;
  height: 52px;
  width: ${({ $width }) => $width}px;
  left: ${({ $left }) => $left}px;
  border-radius: 6px;
  background: linear-gradient(180deg, #ffffff 0%, #f1f6fa 100%);
  border: 1px solid #e3ebef;
  box-sizing: border-box;

  .slot-content {
    height: 100%;
    display: flex;
    justify-content: space-between;
    div:first-child {
      border-radius: 6px 0 0 6px;
      width: 4px;
      height: 100%;
      background: ${({ isWorking }) =>
        isWorking
          ? "linear-gradient(180deg, #2F93E8 0%, #0A5DA4 100%)"
          : "linear-gradient(180deg, #FF8863 0%, #ED493E 100%)"};
    }

    .slot-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      column-gap: 10px;

      svg {
        cursor: pointer;
      }
    }
  }

  &:hover {
    svg path {
      fill: #69869e;
    }
  }
`;

export const StyledHourBlock = styled.div`
  position: relative;
  display: flex;
  justify-content: flex-end;
  width: ${({ $width }) => $width}px;
  color: #69869e;
  font-size: 12px;

  span {
    display: block;
    position: absolute;
    width: 1px;
    height: 6px;
    right: 0;
    bottom: -1px;
    background: #69869e;
  }

  p {
    margin-right: -14px;
  }
`;

export const StyledTableHeader = styled.div`
  display: flex;
  padding: 20px;
  align-items: center;
  background-color: #f7f9fb;
  justify-content: space-between;
`;

export const CustomList = styled(List)`
  padding: 0 20px;

  &.companies-list,
  &.invitations-list {
    .ant-list-item {
      cursor: pointer;
      padding: 10px 25px 10px 10px;
    }
  }

  &.companies-list {
    padding-top: 20px;
    border-top: 1px solid rgb(227, 235, 239);

    .ant-list-item-action li {
      &:nth-child(2),
      &:nth-child(3) {
        display: none;
      }
    }
  }

  &.invitations-list .ant-list-item {
    background: #ffffff;
  }

  .invitations-list-content {
    display: flex;
    align-items: center;
    justify-content: center;

    div {
      margin: 0 30px;
    }
  }

  .ant-list-pagination {
    margin-bottom: 24px;
  }

  .ant-list-item {
    padding: 20px 25px;
    border-radius: 6px;
    margin-bottom: 10px;
    border: 1px solid #e3ebef;
    background: linear-gradient(180deg, #ffffff 0%, #f1f6fa 100%);

    &:hover svg path {
      fill: #69869e;
    }

    &.list-content {
      max-width: 300px;
    }
  }

  &.ant-list-split .ant-list-item:last-child {
    border-bottom: 1px solid #e3ebef;
  }

  .ant-list-item-meta {
    flex: unset;
    display: flex;
    margin-right: 30px;
    align-items: center;

    &-title {
      color: #000000;
      font-size: 18px;
      max-width: 220px;
      margin-bottom: 0;
      overflow: hidden;
      line-height: 21px;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    &-content {
      width: auto;
    }
  }

  .ant-list-item-action {
    display: flex;
    align-items: center;

    li {
      display: flex;
      cursor: pointer;

      &:last-child {
        padding: 0 0 0 14px;
      }
    }

    em {
      display: none;
    }
  }
`;
