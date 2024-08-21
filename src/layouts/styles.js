import styled from "styled-components";

export const HeaderWrapper = styled.header`
  display: flex;
  padding: 12px 20px;
  align-items: center;
  background-color: #ffffff;
  justify-content: flex-start;

  img {
    width: 100%;
    height: 100%;
    max-width: 152px;
    max-height: 40px;
    object-fit: contain;
  }
`;

export const ContentWrapper = styled.main`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f1f5f7;
  width: ${({ isCollapsed, isInPublicRoute }) =>
    isCollapsed
      ? "calc(100% - 80px)"
      : `${isInPublicRoute ? "100%" : "calc(100% - 240px)"}`};

  @media (max-width: 520px) {
    ${({ isInPublicRoute }) =>
      !isInPublicRoute
        ? ` 
      width: calc(100% - 80px);
      margin-left: 80px;`
        : ""}
   
    opacity:0.5;
    ${({ isCollapsed, isInPublicRoute }) =>
      !isCollapsed && !isInPublicRoute
        ? `z-index: -1;
        opacity: 0.5 `
        : "opacity: 1"}};
}
`;

export const CustomSidebar = styled.aside`
  display: flex;
  padding: 0 12px;
  position: relative;
  flex-direction: column;
  background-color: #052642;
  transition: 0.5s cubic-bezier(0, 0.96, 0.4, 1.02);
  min-width: ${({ collapsed }) => (collapsed ? "80px" : "240px")};

  .ant-menu {
    border: none;
    background-color: transparent;

    li.ant-menu-item {
      height: unset;
      padding: 0 16px;
      margin: 0 0 36px;
      line-height: unset;

      &-active p {
        color: #ffffff;
      }

      &:active {
        background: transparent;
      }

      &:first-child {
        margin-top: 22px;
      }

      &:last-child {
        padding-bottom: 0;
      }

      &.ant-menu-item-selected {
        background-color: transparent;
      }
    }

    .ant-menu-title-content {
      display: flex;
      align-items: center;

      .icon {
        margin-right: ${({ collapsed }) => (collapsed ? "0" : "32px")};
      }
    }
  }

  @media (max-width: 520px) {
    position: absolute;
    height: 100vh;
  }
`;

export const CustomSidebarHeader = styled.div`
  width: 100%;
  display: flex;
  padding: 10px 0;
  cursor: pointer;
  position: relative;
  align-items: center;
  border-bottom: 1px solid #2c4a62;
  justify-content: ${({ collapsed }) => collapsed && "center"};
  flex-direction: ${({ company }) => (company ? "column" : "row")};

  p {
    color: #ffffff;
    font-size: 14px;
    font-weight: 700;
    margin: 0 8px 0 12px;
  }

  svg {
    fill: #ffffff;
  }
`;

export const CustomSidebarContent = styled.div`
  display: flex;
  flex-direction: column;

  p {
    margin: 0;
    color: #cbd9e4;

    &:hover {
      color: #ffffff;
    }
  }
`;

export const CustomSidebarFooter = styled.div`
  display: flex;
  margin-top: auto;
  padding: 20px 8px 20px;
  justify-content: ${({ collapsed }) =>
    collapsed ? "center" : "space-between"};
  flex-direction: ${({ collapsed }) => collapsed && "column"};
  text-align: ${({ collapsed }) => (collapsed ? "center" : "right")};
  align-items: ${({ collapsed }) => (collapsed ? "center" : "flex-end")};

  span {
    width: 20px;
    height: 20px;
    cursor: pointer;
    object-fit: cover;
  }
`;

export const LayoutWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  padding: 20px 17px;
  flex-direction: column;
`;

export const BackButton = styled.div`
  display: flex;
  max-width: max-content;
  cursor: pointer;
  align-items: center;
  margin-bottom: 22px;

  p {
    color: #69869e;
    margin: 0 0 0 10px;
  }
`;

export const LayoutHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  h4 {
    color: #052642;
    font-size: 20px;
  }
`;

export const LayoutContent = styled.div`
  width: 100%;
  border-radius: 6px;
  margin: ${({ isProfile, noMargin }) =>
    isProfile ? "60px auto 26px" : `${!noMargin ? "30px auto 26px" : "0"}`};
  background-color: ${({ isProfile }) =>
    isProfile ? "transparent" : "#ffffff"};
  box-shadow: ${({ isProfile }) =>
    isProfile ? "none" : "0 3px 20px rgba(5, 38, 66, 0.1)"};
`;
