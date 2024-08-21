import axios from "axios";
import { message } from "antd";

import * as types from "store/constants";
import { REFRESH_TOKEN_REQUEST } from "pages/auth/constants";
import store from "store/configureStore";
import { getItemFromLocalStorage } from "utils/helpers";
import i18n from "i18next";
import { BASE_URL } from "./endpoints";

axios.defaults.baseURL = BASE_URL;
axios.defaults.headers = {
  "Content-Type": "application/json",
};

export const sendRequest = async ({
  method = "GET",
  endpoint,
  data = null,
}) => {
  const token = getItemFromLocalStorage("token");
  const companyId = getItemFromLocalStorage("companyId");

  if (companyId) {
    insertCompanyIdInHeader(companyId);
  }

  if (token) {
    insertTokenInHeader(token);
  }

  store.dispatch({ type: types.SHOW_LOADER });
  const response = await axios({
    method,
    url: endpoint,
    data,
  });
  store.dispatch({ type: types.HIDE_LOADER });

  return response;
};

export const showErrorMessage = (error, type) => {
  let errorMessage;

  store.dispatch({ type: types.HIDE_LOADER });

  if (typeof error.response.data === "string") {
    errorMessage = { title: error.response.data };
  } else {
    errorMessage = error.response.data;
  }

  if (type === "message") {
    message.error(i18n.t(errorMessage.title));
  } else {
    store.dispatch({ type: types.SHOW_ERROR, payload: errorMessage });
  }
};

export const handleRequestFail = (error, type, data = {}) => {
  store.dispatch({ type: types.HIDE_LOADER });

  if (error.response.status === 401) {
    store.dispatch({
      type: REFRESH_TOKEN_REQUEST,
      payload: { type, ...data },
    });
  } else {
    showErrorMessage(error, "message");
  }
};

export const insertCompanyIdInHeader = (id) =>
  (axios.defaults.headers.CompanyId = id ?? 0);

export const insertTokenInHeader = (token) =>
  (axios.defaults.headers.Authorization = token ? `Bearer ${token}` : "");
