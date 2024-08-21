import styled from "styled-components";

export const ScheduleSwitcherWrapper = styled.div`
  position: absolute;
  right: 0;
  top: 10px;

  span {
    color: #052642;
    font-weight: 400;
    font-size: 14px;
    line-height: 17px;
    margin-right: 13px;
  }
`;

export const TemplateWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 24px 0;

  .ant-form {
    width: 100%;
  }

  .ant-list {
    border-top: 1px solid #e3ebef;
    margin-top: 32px;
  }

  .ant-list-item {
    width: max-content;
    height: 80px;
    padding: 0 24px !important;
    &,
    .ant-list-item-meta {
      display: flex !important;
      align-items: center;
      justify-content: flex-start;
    }

    .ant-list-item-meta-content {
      width: max-content;
      min-width: 50px;
      margin: auto;
    }

    .ant-list-item-meta-title {
      color: #07abbc;
      font-weight: 600;
      margin: 0;
    }
    .ant-form-item {
      margin: 0;
    }
  }

  .ant-form-item-label {
    color: #052642;
    font-weight: 700;
    font-size: 14px;
    line-height: 17px;
    text-transform: uppercase;
    padding-right: 32px;
  }

  .header-hours {
    width: calc(100% - 270px);
    min-width: ${({ minsCount }) => 7 * minsCount}px !important;
    display: flex;
    position: absolute;
    top: -32px;
    left: 238px;
    width: 100%;
    margin-left: 14px;
    font-size: 12px;
    border-bottom: 1px solid #e3ebef;

    div {
      color: #69869e;
    }
  }

  .blocks-div {
    height: 100%;
    width: calc(100% - 270px);
    min-width: ${({ minsCount }) => 7 * minsCount}px !important;
    margin-left: 14px;
    border-left: 1px solid #e3ebef;
    display: flex;
    align-items: center;
    position: relative;
    overflow: hidden;
  }

  .form-part {
    width: 70%;
    .ant-select {
      width: 200px;
      min-width: max-content;
    }

    .ant-space {
      position: relative;
      .ant-space-item {
        max-width: 170px;
      }
    }

    .ant-select {
      width: 100px;
    }

    .ant-form-item-control-input {
      input {
        max-width: max-content;
        width: 100px;
      }
    }

    .ant-col-24 {
      padding: 0;
    }
  }

  .calendar-part {
    .ant-picker {
      visibility: hidden;
    }
  }

  .add-pattern {
    svg {
      vertical-align: middle;
      margin-right: 8px;
    }

    font-weight: 700;
    font-size: 14px;
    color: #07abbc;
  }
`;

export const PatternBlock = styled.div`
  .remove-pattern {
    float: right;
    clear: both;
    visibility: hidden;
    cursor: pointer;
    path {
      fill: #9cb6cb;
    }
  }

  &:hover {
    .remove-pattern {
      visibility: visible;
    }
  }

  .flexed-box {
    display: flex;
    column-gap: 10px;
  }

  border: 1px solid #e3ebef;
  border-left: ${({ $borderLeft }) => $borderLeft};
  border-radius: 6px;
  padding: 24px;
  margin-top: 24px;
  min-width: 890px;

  .range-block:hover {
    .remove-icon {
      visibility: visible;
    }
  }

  && .ant-form-item-label {
    color: #2c4a62;
    font-weight: 400;
    font-size: 14px;
    line-height: 17px;
    text-transform: capitalize;

    svg {
      vertical-align: middle;
      margin-left: 8px;
      cursor: pointer;
    }
  }

  .to-right-icon-box {
    svg {
      margin-top: 40px;
    }
  }

  .error-box {
    color: red;
    margin: 10px 0;
  }
`;

export const ActionBox = styled.div`
  display: inline-flex;
  height: 100%;
  position: absolute;
  top: 41%;

  svg {
    cursor: pointer;
  }

  .remove-icon {
    margin: 0 8px;
    visibility: hidden;
  }
`;

export const ScheduleBlockBox = styled.div`
  position: absolute;
  height: 52px;
  width: ${({ $width }) => $width}px !important;
  left: ${({ $left }) => $left + 14}px;
  border-radius: 6px;
  background: linear-gradient(180deg, #ffffff 0%, #f1f6fa 100%);
  border: 1px solid #e3ebef;
  box-sizing: border-box;
  display: flex;
  align-items: center;

  div:first-child {
    border-radius: 6px 0 0 6px;
    width: 4px;
    height: 100%;
    background: ${({ isWorking }) =>
      isWorking
        ? "linear-gradient(180deg, #2F93E8 0%, #0A5DA4 100%)"
        : "linear-gradient(180deg, #FF8863 0%, #ED493E 100%)"};
  }

  div:last-child {
    width: calc(100% - 4px);
    height: 100%;
  }
`;

export const AddCustomDayBlockWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 8px;
  border 1px dashed #15c0d1;

  .add-block-btn {
    width: 54px;
    height: 54px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }

  .slotsBox {
    display: flex;
    width: calc(100% - 64px);
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
