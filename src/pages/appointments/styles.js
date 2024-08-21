import styled from "styled-components";
import { TransparentButton } from "shared/buttons/styles";

export const AppointmentWrapper = styled.div`
  width: calc(100% - 20px);
  position: relative;
  display: flex;
  & > div {
    position: relative;
    &.main-box {
      height: 100vh;
      overflow: auto;
      padding: 0 10px;
    }
  }
`;

export const MinifiedIconBox = styled.div`
  position: absolute !important;
  bottom: 3px;
  right: 0;
  cursor: pointer;
`;

export const ZoomerBox = styled.div`
  position: absolute !important;
  bottom: 2%;
  right: ${({ $right }) => $right};

  .ant-select-selector {
    border-radius: 6px !important;
  }
`;

export const CalendarWrapper = styled.div`
  width: ${({ $width }) => $width}%;
  position: relative;

  @media (max-width: 1380px) {
    width: ${({ $width, sidebarIsOpen }) =>
      sidebarIsOpen ? $width - 10 : $width}%;
  }

  @media (max-width: 1045px) {
    width: ${({ $width, sidebarIsOpen }) =>
      sidebarIsOpen ? $width - 20 : $width}%;
  }

  @media (max-width: 835px) {
    width: 100%;
  }
`;

export const SidebarWrapper = styled.div`
  visibility: ${({ $visibility }) => $visibility};
  width: ${({ $width }) =>
    $width ? `calc(${$width}% - 20px)` : `${$width}px`};

  @media (max-width: 1380px) {
    width: ${({ $width }) =>
      $width ? `calc(${$width + 10}% - 20px)` : `${$width}px`};
  }

  @media (max-width: 1045px) {
    width: ${({ $width }) =>
      $width ? `calc(${$width + 20}% - 20px)` : `${$width}px`};
  }

  @media (max-width: 835px) {
    width: ${({ $width }) => ($width ? `calc(100% - 20px)` : `${$width}px`)};
    position: absolute !important;
    z-index: 320;
  }
`;

export const BackBtn = styled(TransparentButton).attrs(() => ({
  type: "button",
}))`
  padding: 12px 0 6px;
  margin: 0;
  display: flex;
  align-items: center;
  span {
    margin-left: 11px;
    margin-top: 1px;
    color: #69869e;
    vertical-align: text-bottom;
  }
`;

export const PrintBtn = styled(TransparentButton).attrs(() => ({
  type: "button",
}))`
  padding: 12px 0 6px;
  margin: 0;
  position: absolute;
  top: 0;
  right: 10px;
  color: #69869e;
  svg {
    height: 25px;
    width: 25px;
  }
`;

export const PrintBodyWrapper = styled.div`
  width: 0px;
  height: 0px;
  overflow: hidden;
`;
