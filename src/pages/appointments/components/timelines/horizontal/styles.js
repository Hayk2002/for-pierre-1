import styled from "styled-components";
import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";

export const HeaderSection = styled.div`
  display: flex;
  position: sticky;
  top: 0;
  z-index: 1;
  background: #fff;
  border-bottom: 2px solid #e3ebef;
  min-width: fit-content;

  .search-box {
    width: 20%;
    min-width: 200px;
    overflow: hidden;
    padding: 10px 11px;
    box-shadow: 1px 0px 8px #e3ebef;
    position: sticky;
    left: 0;
    z-index: 1;
    background: #fff;
  }

  .hours-section {
    display: flex;
    width: 80%;
    position: relative;
    border-left: 2px solid #e3ebef;
    min-width: ${({ wrapperMinWidth }) => wrapperMinWidth}px;
  }
`;

export const BodySection = styled.div`
  min-width: max-content;
  .appointment-row {
    display: flex;
    height: 55px;
    border-bottom: 2px solid #e3ebef;
    min-width: max-content;

    .blocks-box {
      width: 80%;
      display: flex;
      min-width: ${({ wrapperMinWidth }) => wrapperMinWidth}px;
      background-size: auto auto;
        background-color: rgba(227, 235, 239, 1);
        background-image: repeating-linear-gradient(
          125deg,
          transparent,
          transparent 10px,
          rgba(208, 222, 233, 1) 10px,
          rgba(208, 222, 233, 1) 11px
        );
    }
  }
`;

export const HeaderHourBlock = styled.div`
  position: relative;
  width: ${({ $width }) => $width}%;
  min-width: ${({ $minWidth }) => $minWidth}px;
  span {
    color: #69869e;
    font-size: 12px;
    line-height: 14px;
    position: absolute;
    bottom: 7px;
    left: -15px;
  }

  p {
    width: 1px;
    height: 7px;
    background: #69869e;
    position: absolute;
    bottom: -17px;
    left: -1px;
  }

  &:last-child {
    width: 0;
    span,
    p {
      display: none;
    }
  }
`;

export const StyledProfileBox = styled.div`
  width: 20%;
  min-width: 200px;
  position: sticky;
  left: 0;
  z-index: 301;
  & > div {
    cursor: pointer;
  }
`;

export const BodyHourBlock = styled.div`
  display: flex;
  width: ${({ $width }) => $width}%;
  min-width: max-content;
  border-left: 2px solid rgba(223, 230, 239, 0.7);
  box-sizing: border-box;
`;

export const StyledSearch = styled(Input).attrs(() => ({
  prefix: <SearchOutlined />,
  bordered: false,
}))`
  border: none;
`;

export const CurrentTimeBlock = styled.div`
  height: ${({ $height }) => $height}px;
  background: #fcb813;
  width: 1px;
  position: absolute;
  top: 101%;
  left: ${({ $left }) => $left};
  z-index: 400;
`;
