import { call, put, takeEvery } from "redux-saga/effects";

import * as api from "api/endpoints";
import { sendRequest, showErrorMessage } from "api/axios";
import { getItemFromLocalStorage, setItemsToLocalStorage } from "utils/helpers";
import * as types from "../constants";

function* refreshTokenSaga({ payload: { type, data } }) {
  try {
    const token = getItemFromLocalStorage("token");
    const refreshToken = getItemFromLocalStorage("refreshToken");

    const requestData = {
      method: "POST",
      endpoint: `${api.ACCOUNT}/refresh`,
      data: { token, refreshToken },
    };

    const { data: auth } = yield call(sendRequest, requestData);
    setItemsToLocalStorage({
      token: auth.token,
      refreshToken: auth.refreshToken,
    });
    yield put({ type, payload: data });
  } catch (err) {
    if (err.response?.status === 400) {
      showErrorMessage(err, "message");
      localStorage.clear();
      setTimeout(() => window.location.reload(), 3000);
    }
  }
}

export default function* watcher() {
  yield takeEvery(types.REFRESH_TOKEN_REQUEST, refreshTokenSaga);
}
