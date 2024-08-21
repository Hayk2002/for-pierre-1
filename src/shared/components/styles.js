import styled from "styled-components";
import { Avatar, Modal } from "antd";

export const CardWrapper = styled.div`
  width: 100%;
  display: flex;
  max-width: 500px;
  border-radius: 6px;
  flex-direction: column;
  background-color: #ffffff;
  box-shadow: 0 3px 20px rgba(5, 38, 66, 0.1);
`;

export const CardHeader = styled.div`
  padding: 19px 0;
  text-align: center;
  border-bottom: 1px solid #e3ebef;

  div {
    color: #052642;
    font-size: 18px;
    margin-bottom: 0;
    line-height: 22px;
    font-weight: normal;
  }
`;

export const CardBody = styled.div`
  padding: ${({ small }) => (small ? "20px 50px 30px" : "50px")};
  
  .assignable-items-content & {
      padding: 0 0 30px;
    }
  }
  @media (max-width: 480px) {
    padding: 30px 16px
  }
`;

export const CardInfo = styled.p`
  color: #052642;
  font-size: 20px;
  text-align: center;
  margin-bottom: 23px;
`;

export const ErrorNotificationContent = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;

  h3 {
    font-size: 20px;
    margin-bottom: 10px;
  }
`;

export const CustomModal = styled(Modal).attrs(() => ({
  width: 500,
  footer: null,
}))`
  .ant-modal-close {
    display: none;
  }

  .ant-modal-content {
    border-radius: 6px;
  }

  .ant-modal-body {
    padding: 0;
  }
`;

export const UploadViewContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: ${({ isProfile }) => (isProfile ? "0" : "40px")};
  flex-direction: ${({ isProfile }) => (isProfile ? "column" : "unset")};

  input#upload {
    display: none;
  }
`;

export const UserImageUploadActions = styled.div`
  display: flex;
  margin: 24px 0 32px;

  & * {
    cursor: pointer;
    font-weight: 700;
  }

  button {
    border: none;
    background: none;
  }

  label {
    color: #07abbc;
    margin-right: 32px;
  }
`;

export const CompanyImageUploadActions = styled.div`
  display: flex;
  margin-left: 30px;
  flex-direction: column;

  button {
    border: none;
    cursor: pointer;
    margin-top: 10px;
    background: none;
    font-weight: 700;
  }
`;

export const CustomAvatar = styled(Avatar)`
  background-color: #cbd9e4;
  border-radius: ${({ $isSquare }) => ($isSquare ? "10px" : "none")};
`;

export const StepsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const StepItem = styled.div`
  display: flex;
  position: relative;
  align-items: center;

  div {
    z-index: 99;
    display: flex;
    align-items: center;
    flex-direction: column;

    span {
      z-index: 9;
      width: 44px;
      height: 44px;
      display: flex;
      font-size: 18px;
      border-radius: 50%;
      align-items: center;
      justify-content: center;
      color: ${({ active }) => (active ? "#052642" : "#ffffff")};
      background-color: ${({ active }) => (active ? "#CBD9E4" : "#e1e1e1")};
    }
  }

  p {
    font-size: 14px;
    margin: 4px 0 0;
    color: ${({ active }) => (active ? "#052642" : "#DBDBDB")};
  }

  & > span {
    top: 23px;
    left: 40px;
    width: 100px;
    height: 1px;
    border: none;
    position: absolute;
    background-color: ${({ active }) => (active ? "#CBD9E4" : "#e1e1e1")};
  }

  &:last-child > span {
    display: none;
  }

  &:first-child {
    margin-right: 70px;
  }
`;

export const RenderEmptyContent = styled.div`
  text-align: center;
  margin: 5% 0;

  p {
    color: #052642;
    font-size: 14px;
    margin-top: 8px;
  }
`;

export const ProfileCard = styled.div`
  width: 100%;
  display: flex;
  border-radius: 6px;
  flex-direction: column;
  background-color: #ffffff;
  max-width: ${({ small }) => (small ? "100%" : "460px")};
  margin: ${({ small }) => (small ? "0 0 20px 0" : "0 auto")};
`;

export const ProfileCardHeader = styled.div`
  display: flex;
  align-items: center;
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
  padding: ${({ small }) => `16px 16px ${small ? "12px" : "32px"}`};
  background-color: ${({ small }) => (small ? "#ffffff" : "#052642")};

  div {
    display: flex;
    margin-left: auto;
    align-items: center;

    & * {
      cursor: pointer;
    }
  }

  h4 {
    margin: 0;
    color: #052642;
    font-size: 20px;
    font-weight: 700;
    line-height: 24px;
  }
`;

export const ProfileCardContent = styled.div`
  display: flex;
  justify-content: center;

  .user-info {
    display: flex;
    margin-top: -20px;
    align-items: center;
    flex-direction: column;

    h4 {
      color: #052642;
      font-size: 24px;
      font-weight: 700;
      line-height: 28px;
      text-align: center;
      margin: 20px 16px 30px;
      word-break: break-word;
    }

    p {
      margin: 0;
      color: #2c4a62;
      font-size: 16px;
      line-height: 19px;
    }

    & > div {
      display: flex;
      margin: 20px 0 50px;
      align-items: center;
      flex-direction: row;

      p {
        font-size: 14px;
        margin: 0 0 0 12px;
      }
    }

    &_edit > div {
      margin: 0;
      display: flex;
      flex-direction: column;
    }
  }
`;

export const ProfileCardFooter = styled.div`
  display: flex;
  padding: 25px 30px;
  flex-direction: column;
  border-top: 1px solid #e3ebef;

  div {
    display: flex;
    align-items: center;
    margin-bottom: 15px;

    &:last-child {
      margin-bottom: 0;
    }

    span {
      display: flex;
      margin-right: 22px;
    }

    p {
      margin: 0;
      color: #2c4a62;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
`;

export const ColorPickerWrapper = styled.div`
  .colorPicker-frame {
    width: 72px;
    height: 40px;
    display: flex;
    border-radius: 6px;
    align-items: center;
    justify-content: space-around;
    border: 1px solid #9cb6cb;
    background-color: #ffffff;
    padding: 5px;
    cursor: pointer;

    .label-for-picker {
      background: ${({ $bgColor }) => $bgColor };
      height: 29px;
      width: 29px;
    }
  };
`;

export const CustomTimelineContent = styled.div`
  top: -28px;
  width: 100%;
  display: flex;
  position: absolute;
  justify-content: space-between;
`;

export const CustomTimelineItem = styled.div`
  position: relative;
  top: -4px;
  font-size: 10px;
  line-height: 30px;
  color: #69869e;

  &:before {
    content: "";
    position: absolute;
    top: 22px;
    left: 12px;
    width: 1px;
    height: 5px;
    background-color: #69869e;
  }
`;

export const LanguageLabel = styled.div`
  display: flex;
  cursor: pointer;
  align-items: center;

  p {
    color: #ffffff;
    font-size: 16px;
    font-weight: 500;
    margin: 0 9px 0 12px;
  }

  span.anticon svg {
    fill: white;
    height: inherit;
  }
`;
