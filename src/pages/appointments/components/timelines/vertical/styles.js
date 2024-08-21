import styled from "styled-components";

export const HeaderSection = styled.div`
  width: 7%;
  display: inline-flex;
  flex-direction: column;
  z-index: 1;
  background: #fff;
  border-right: 2px solid #e3ebef;
  min-width: fit-content;
`;

export const HeaderHourBlock = styled.div`
  border-bottom: 2px solid #fff;
  & > div {
    display: flex;
    justify-content: center;
    height: ${({ $height }) => $height}%;
    min-height: 7px;
  }
  span {
    color: #69869e;
    font-size: 12px;
    line-height: 7px;
    margin-top: -3px;
  }

  &:last-child {
    width: 0;
    span {
      display: none;
    }
  }
`;

export const BodySection = styled.div`
  display: inline-flex;
  flex-direction: column;
  width: 93%;
  height: 100%;
  right: 0;

  .blocks-box {
    background-size: auto auto;
    background-color: rgba(227, 235, 239, 1);
    background-image: repeating-linear-gradient(
      125deg,
      transparent,
      transparent 10px,
      rgba(208, 222, 233, 1) 10px,
      rgba(208, 222, 233, 1) 11px
    );  };
  
  &.weekly {
    position: relative;
    flex-direction: row;

    .box-body {
      width: calc(100% / 7);
      background-size: auto auto;
      background-color: rgba(227, 235, 239, 1);
      background-image: repeating-linear-gradient(
        125deg,
        transparent,
        transparent 10px,
        rgba(208, 222, 233, 1) 10px,
        rgba(208, 222, 233, 1) 11px
      );    
      & > div {
        border-right: 2px solid #e3ebef;
      }
    }
  }

  &,
  .box-body {
    height: 100%;
    position: relative;
  }

  .disabled-column {
    pointer-events: none;
    opacity: 0.4
  }

  @media (max-width: 800px) {
    width: 90%;
  }
`;

export const BodyHourBlock = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-bottom: 2px solid #e3ebef;
  box-sizing: border-box;
  width: 100%;
  min-height: ${({ $height }) => $height}%;
`;

export const TopHeader = styled.div`
  display: flex;
  justify-content: flex-end;
  border-bottom: 1px solid #e3ebef;
  margin-bottom: -5px;
  & > div:first-child {
    width: 7%;
    border-right: 2px solid #e3ebef;
  }
  & > div:last-child {
    width: 93%;
    display: flex;
    justify-content: space-between;
    box-sizing: border-box;
    div {
      width: calc(100% / 7);
      text-align: center;
      padding: 17px 0;
    }
  }
`;

export const CurrentTimeBlock = styled.div`
  background: #fcb813;
  height: 1px;
  width: ${({ weekly }) => (weekly ? "calc(100%/7)" : "100%")};
  position: absolute;
  top: ${({ $top }) => $top};
  left: ${({ dayOfWeek }) =>
    dayOfWeek ? `calc((100%/7)*${dayOfWeek - 1})` : ""};
  z-index: 301;
`;
