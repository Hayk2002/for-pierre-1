import styled, { css } from "styled-components";
import { CursorCell } from "assets/images";

const blocksSharedStyle = css`
  position: relative;
  cursor: ${({ $disabled }) =>
    $disabled ? "not-allowed" : `url(${CursorCell}), auto`};
  &.working-hour {
    background: white;
  }
`;

export const StyledMinuteBlock = styled.div`
  ${blocksSharedStyle};
  min-width: 7px;
  width: ${({ $width }) => $width}%;
  height: 100%;
  &.bordered-min {
    border-left: 2px solid rgba(223, 230, 239, 0.7);
    box-sizing: ${({ $borderBox }) => $borderBox};
  }
`;

export const StyledUserMinuteBlock = styled.div`
  ${blocksSharedStyle};
  display: block;
  min-height: 7px;
  height: ${({ $width }) => $width}%;
  width: 100%;
  &.bordered-min {
    border-top: 1px solid rgba(223, 230, 239, 0.7);
    box-sizing: ${({ $borderBox }) => $borderBox};
  }
`;

export const StyledStepBlock = styled.div`
  width: ${({ $userCalendar, $width, diff }) =>
    $userCalendar ? "100%" : `calc(${$width * 100}% + ${diff}px)`};
  position: absolute;
  left: -2px;
  margin: 0;
  top: 0;
  z-index: 300;
  height: ${({ $userCalendar, $width, diff }) =>
    $userCalendar ? `calc(${$width * 100}% + ${diff / 2}px)` : "45px"};
  background: ${({ $boxBgColor }) => $boxBgColor ?? "#8994A5"};
  border: 1px solid #ffffff;
  margin-top: ${({ $userCalendar }) => ($userCalendar ? "0px" : "4px")};
  top: ${({ $userCalendar }) => ($userCalendar ? "-1px" : "unset")};
  box-sizing: border-box;
  border-radius: 8px;
  cursor: pointer;
  opacity: ${({ $pastStep }) => (!$pastStep ? "" : "40%")};

  &.non-working {
    background: repeating-linear-gradient(
      125deg,
      rgba(255, 255, 255, 1),
      rgba(255, 255, 255, 1) 17px,
      rgb(204 211 217) 22px,
      rgba(202, 221, 250, 0.31) 20px
    );
  }
`;

export const StyledWrapper = styled.div`
  width: 100%;
  height: fit-content;
  overflow-x: auto;
  overflow-y: hidden;
  background: #fff;
  position: relative;

  .ant-input:focus,
  .ant-input-affix-wrapper {
    border: none;
    outline: 0;
  }

  &::-webkit-scrollbar {
    width: 10px !important;
    height: 5px !important;
  }

  &::-webkit-scrollbar-track {
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background: #9cb6cb;
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #69869e;
  }

  @media (max-width: 800px) {
    min-width: 500px;
  }
`;

export const ProfileBox = styled.div`
  padding: 10px 11px;
  background: #fff;
  display: flex;
  column-gap: 14px;
  box-shadow: 0 3px 8px #e3ebef;

  img {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background-color: #9cb6cb;
    object-fit: contain;
    cursor: pointer;
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

  &.resource-box {
    height: 100%;

    div {
      display: flex;
      align-items: center;
    }
  }
`;

export const InfoRow = styled.p`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  svg {
    width: 16px;
    height: 16px;
    margin-right: 10px;

    path {
      fill: #fff;
    }
  }
`;

export const TicketInfo = styled.div`
  display: flex;
  justify-content: space-between;
  color: #fff;
  column-gap: 30px;
  border-bottom: ${({ $isTimeBlock }) =>
    $isTimeBlock ? "none" : "0.5px solid rgba(255, 255, 255, 0.4)"};
  padding-top: 6px;

  & p {
    margin-bottom: 4px;
  }
`;
