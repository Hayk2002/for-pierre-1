import styled from "styled-components";
import { Table } from "antd";

export const StyledPrintTable = styled(Table)`
  td,
  th {
    word-break: break-word;
    padding-top: 10px !important;
    padding-bottom: 10px !important;
  }

  td:nth-child(1),
  th:nth-child(1) {
    width: 42px;
    padding: 10px 4px;
    text-align: center;
  }

  td:nth-child(2),
  th:nth-child(2) {
    padding: 10px 0;
    text-align: center;
    width: 12%;
  }

  th:nth-child(3) {
    width: 15%;
  }

  th:nth-child(4) {
    width: 15%;
  }

  th:nth-child(5) {
    width: 15%;
  }

  th:nth-child(6) {
    width: 18%;
  }
`;

export const StyledBox = styled.div`
  padding: 0 20px;
  display: flex;
  columngap: 5px;

  &.mt-20 {
    margin-top: 20px;
  }

  &.mb-10 {
    margin-bottom: 10px;
  }

  .styled-txt {
    color: "#6a7989";
  }
`;
