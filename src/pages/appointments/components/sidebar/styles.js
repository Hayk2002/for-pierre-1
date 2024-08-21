import styled from "styled-components";

export const SidebarWrapper = styled.div`
  width: ${"calc(100% + 20px)"};
  height: ${"calc(100vh - 10px)"};
  position: absolute;
  right: -20px;
  background: #f0f2f5;
  z-index: 1;
  box-shadow: -2px 0px 10px 3px #e0e9ef;
  overflow: auto;

  .ant-form-item {
    margin-bottom: 10px;
    margin-top: 0;
  }

  .ant-form-item-label {
    margin-bottom: 0;
    label {
      height: max-content;
    }
  }

  .ant-tabs-nav-list {
    width: 100%;
    justify-content: center;

    .ant-tabs-tab {
      width: 40%;
      text-align: center;
      justify-content: center;
      margin: 0;

      &:hover {
        color: #07abbc;
      }

      &.ant-tabs-tab-active {
        .ant-tabs-tab-btn {
          color: #07abbc;
        }
      }
    }

    .ant-tabs-ink-bar {
      background: linear-gradient(90deg, #1cc9db 0%, #07abbc 100%);
      border-top-left-radius: 50px;
      border-top-right-radius: 50px;
      height: 3px;
    }
  }

  .header-actions {
    display: flex;
    justify-content: ${({ $justifyContent }) => $justifyContent};
    padding: 10px;

    .actionsDiv svg {
      cursor: pointer;
      margin-left: 15px;
    }

    .backBox {
      cursor: pointer;
      margin-bottom: 14px;
    }

    .hiddenBackBox {
      visibility: hidden;
    }

    span {
      color: #69869e;
      font-weight: 600;
      font-size: 16px;
      line-height: 19px;
      margin-left: 14px;
    }

    p {
      color: #2c4a62;
      font-size: 14px;
      margin: 0;
    }
  }

  form {
    position: relative;
    height: calc(100% - 44px);
    background: #f0f2f5;
  }

  .ant-tabs {
    height: calc(100% - 45px);
    overflow: auto;
    .ant-tabs-content,
    form {
      height: 100%;
    }

    .ant-tabs-nav {
      border-bottom: 1px solid #cbd9e4;
    }
  }
`;

export const ClientInfo = styled.div`
  border-bottom: 1px solid #cbd9e4;
  padding: 0 30px;
  background: linear-gradient(180deg, #edf2f7 0%, #dae4eb 100%);

  .cascader-header {
    padding: 10px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;

    h4 {
      color: #052642;
      font-weight: bold;
      font-size: 16px;
      line-height: 19px;
    }
  }

  .cascader-body {
    display: ${({ bodyDisplay }) => bodyDisplay};
  }
`;

export const AppointmentInfo = styled.div`
  padding: 16px 30px;

  .duration {
    display: flex;
    justify-content: space-between;
    column-gap: 10px;

    .ant-row {
      width: 50%;

      .ant-col {
        height: 36px;
        text-align: left;
        width: 100%;
      }
    }
  }

  h4 {
    color: #052642;
    font-weight: bold;
    font-size: 16px;
    line-height: 19px;
  }

  .provider-box {
    display: flex;
    padding: 15px 0px;

    img {
      border-radius: 50%;
      width: 40px;
      height: 40px;
      margin-right: 20px;
      background-color: #9cb6cb;
    }

    h5 {
      color: #052642;
      font-size: 16px;
      line-height: 19px;
    }

    p {
      font-size: 12px;
      line-height: 14px;
      color: #69869e;
    }
  }
`;

export const ActionsBox = styled.div`
  width: 100%;
  padding: 10px 30px;
  display: flex;
  justify-content: space-between;

  .apt-footer-actions {
    display: flex;
    flex-direction: column;
    width: 100%;
    row-gap: 12px;

    button {
      cursor: pointer
    }
  }
`;

export const StyledBtn = styled.button.attrs(({ type }) => ({
  type: type ?? "button",
}))`
  background: ${({ $bg }) => $bg};
  padding: 11px 16px;
  border-radius: 6px;
  color: ${({ $color }) => $color};
  font-weight: bold;
  font-size: 14px;
  width: fit-content;
  border: none;
`;

export const StyledChartBox = styled.div`
  width: 100%;
  border-radius: 5px;
  display: flex;
  justify-content: space-between;

  svg {
    cursor: pointer;
  }

  span {
    font-size: 14px;
    line-height: 17px;
    color: #052642;
  }

  div {
    display: flex;
    justify-content: space-between;
    align-items: center;
    column-gap: 16px;
    span {
      color: #fff;
      padding: 2px 8px;
      background: #1ac23f;
      border-radius: 40px;
    }
  }
`;

export const StyledCard = styled.div`
  padding: 7px 16px 16px;
  background: #ffffff;
  box-shadow: 0px 3px 20px rgba(5, 38, 66, 0.1);
  border-radius: 6px;
  position: relative;
  width: 90%;
  margin: 10px auto;
  display: flex;
  flex-direction: column;
  row-gap: 5px;

  .actions {
    display: flex;
    width: 100%;
    justify-content: flex-end;
  }

  .actions > svg {
    cursor: pointer;
  }

  .client-data {
    display:flex;
    flex-direction:column;

    > span {
      display: flex;
      align-items:center;
      column-gap: 5px;

      #user-mobile, #user-name {
        width: 90%;
        text-overflow: ellipsis;
        overflow: hidden; 
        white-space: nowrap;
        margin-bottom: 0
      }

      >p {
        word-wrap: break-word;
        overflow-x: hidden;
        max-width:280px;
        margin-bottom: 0
      }

      svg {
        width:16px;

        path {
          fill: #2c4a62
        }
      }
    }
  }

  &.userPart span {
    svg {
      margin: 0 4px 0 0;
    }

    &.phone {
      color: #2f93e8;
      display: flex;
      align-items:center
    }
  }

  .actions span {
    margin-top: 25px;
  }

  & > div {
    display: flex;
    justify-content: space-between;

    svg {
      color: #9cb6cb;
    }

    h4 {
      font-size: 20px;
      color: #052642;
      font-weight: bold;
    }

    span,
    b {
      font-size: 16px;
      color: #052642;
    }

    &.note {
      color: #69869e;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2; /* number of lines to show */
      line-clamp: 2;
      -webkit-box-orient: vertical;
    }

    .block-time-reason {
      max-height: 50vh;
      overflow-y: auto;
    }
  }
`;

export const StyledChartBtn = styled(StyledBtn)`
  width: 100%;
  margin: auto;
`;

export const StyledDateBlock = styled.div`
  position: absolute;
  top: 0;
  left: 16px;
  padding: 5px 11px;
  background: #07abbc;
  border-radius: 0 0 6px 6px;
  font-weight: bold;
  color: #ffffff;
`;

export const StyledMobileIconBox = styled.span`
  position: absolute;
  top: 6px;
  right: -20px;
`;

export const StyledStepsListWrapper = styled.div`
  position: relative;
  height: calc(100% - 102px);
  overflow: auto;
`;
