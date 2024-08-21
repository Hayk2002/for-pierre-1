import { Link } from "react-router-dom";

import styled from "styled-components";

export const ForgotPasswordLink = styled(Link)`
  color: #07abbc;
  font-weight: bold;
`;

export const AccountPageSwitcher = styled.span`
  margin-top: 20px;

  a {
    color: #07abbc;
    font-weight: bold;
  }
`;

export const PolicyInfo = styled.span`
  color: #2c4a62;
  font-size: 12px;
  line-height: 14px;
  text-align: center;
  margin-bottom: 20px;

  a {
    color: #07abbc;
    font-weight: bold;
  }
`;

export const EmailVerificationContent = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;

  p {
    color: #2c4a62;
    font-size: 14px;
    line-height: 17px;
    text-align: center;
    margin: 10px 0 30px;
  }
`;

export const PasswordResetSuccessContent = styled(EmailVerificationContent)`
  p {
    font-size: 16px;
    line-height: 18px;
    margin: 15px 0 20px;
  }
`;
