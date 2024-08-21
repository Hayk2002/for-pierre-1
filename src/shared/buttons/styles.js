import styled, { css } from "styled-components";
import { Button } from "antd";

const buttonStyles = css`
  padding: 0;
  width: 100%;
  height: 40px;
  border: none;
  color: #ffffff;
  cursor: pointer;
  font-size: 14px;
  max-width: 200px;
  max-height: 40px;
  font-weight: bold;
  line-height: 17px;
  border-radius: 6px;

  &:hover,
  &:active,
  &:focus {
    color: #ffffff;
  }

  span {
    margin: 0;
  }
`;

const defaultButtonStyles = css`
  background: linear-gradient(180deg, #c8d8e9 0%, #e8eef2 100%);
  color: #052642;

  &:hover,
  &:active,
  &:focus {
    background: linear-gradient(180deg, #e8eef2 0%, #c8d8e9 100%);
    color: #052642;
  }
`;

const CustomButton = styled(Button)`
  ${buttonStyles}
`;

export const PrimaryButton = styled(CustomButton)`
  background: linear-gradient(180deg, #1cc9db 0%, #07abbc 100%);
  &:hover,
  &:active,
  &:focus {
    background: linear-gradient(180deg, #07abbc 0%, #1cc9db 100%);
  }
`;

export const RedButton = styled(CustomButton)`
  background: linear-gradient(180deg, #f25d78 0%, #ed143b 100%);

  &:hover,
  &:active,
  &:focus {
    background: linear-gradient(180deg, #ed143b 0%, #f25d78 100%);
  }
`;

export const DefaultButton = styled(CustomButton)`
  color: #052642;
  background: linear-gradient(180deg, #c8d8e9 0%, #e8eef2 100%);

  &:hover,
  &:active,
  &:focus {
    color: #052642;
    background: linear-gradient(180deg, #e8eef2 0%, #c8d8e9 100%);
  }
`;

export const UploadButton = styled.label`
  ${buttonStyles};
  ${defaultButtonStyles};

  line-height: 40px;
  text-align: center;
`;

export const AddBranchButton = styled.button`
  padding: 0;
  width: 100%;
  height: 205px;
  display: flex;
  cursor: pointer;
  border-radius: 6px;
  align-items: center;
  justify-content: center;
  border: 1px solid #07abbc;
  transition: 0.3s ease-in-out;
  background-color: transparent;

  &:hover {
    background-color: rgba(7, 171, 188, 0.08);
  }

  span {
    display: flex;
    align-items: center;

    p {
      color: #07abbc;
      font-size: 14px;
      font-weight: 700;
      line-height: 17px;
      margin: 0 0 0 15px;
    }
  }
`;

export const TransparentButton = styled.button`
  border: none;
  outline: none;
  background: transparent;
  cursor: pointer;
`;
