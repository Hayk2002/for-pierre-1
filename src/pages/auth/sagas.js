import { call, put, takeEvery } from "redux-saga/effects";

import {
  sendRequest,
  insertTokenInHeader,
  showErrorMessage,
  handleRequestFail,
} from "api/axios";
import * as api from "api/endpoints";
import { getItemFromLocalStorage, setItemsToLocalStorage } from "utils/helpers";
import * as types from "./constants";

function* login({ payload, callback }) {
  try {
    const requestConfig = {
      method: "POST",
      endpoint: `${api.ACCOUNT}/login`,
      data: payload,
    };
    const { data } = yield call(sendRequest, requestConfig);
    yield put({ type: types.SET_USER_DATA, payload: data });
    setItemsToLocalStorage({
      user: data,
      token: data.token,
      refreshToken: data.refreshToken,
    });
    callback(data);
  } catch (err) {
    showErrorMessage(err, "message");
  }
}

function* register({ payload, callback }) {
  try {
    const requestConfig = {
      method: "POST",
      endpoint: `${api.ACCOUNT}/register`,
      data: payload,
    };
    const { data } = yield call(sendRequest, requestConfig);
    callback(data || payload);
  } catch (err) {
    showErrorMessage(err, "message");
  }
}

function* forgotPassword({ payload, callback }) {
  try {
    const requestConfig = {
      method: "POST",
      endpoint: `${api.ACCOUNT}/forgotPassword`,
      data: payload,
    };
    yield call(sendRequest, requestConfig);
    callback(payload);
  } catch (err) {
    showErrorMessage(err, "message");
  }
}

function* resendEmail({ payload, callback }) {
  try {
    const requestConfig = {
      method: "POST",
      endpoint: `${api.ACCOUNT}/resendEmail`,
      data: payload,
    };
    yield call(sendRequest, requestConfig);
    callback();
  } catch (err) {
    showErrorMessage(err, "message");
  }
}

function* resetPassword({ payload, callback }) {
  try {
    const requestConfig = {
      method: "PUT",
      endpoint: `${api.ACCOUNT}/resetPassword`,
      data: payload,
    };
    yield call(sendRequest, requestConfig);
    callback();
  } catch (err) {
    showErrorMessage(err, "message");
  }
}

function* verifyRegistration({ payload, callback }) {
  try {
    const requestConfig = {
      method: "PUT",
      endpoint: `${api.ACCOUNT}/verify`,
      data: payload,
    };
    const { data } = yield call(sendRequest, requestConfig);
    setItemsToLocalStorage({
      token: data.token,
      refreshToken: data.refreshToken,
    });
    insertTokenInHeader(data.token);
    callback();
  } catch (err) {
    showErrorMessage(err, "message");
  }
}

function* completeProfile({ payload, callback }) {
  try {
    const requestConfig = {
      method: "POST",
      endpoint: api.USER_PROFILE,
      data: payload,
    };
    const { data } = yield call(sendRequest, requestConfig);
    yield put({ type: types.SET_USER_DATA, payload: data });
    setItemsToLocalStorage({ user: data });
    callback();
  } catch (err) {
    handleRequestFail(err, types.COMPLETE_PROFILE_REQUEST, {
      payload,
      callback,
    });
  }
}

function* removeProfileImage() {
  try {
    const requestConfig = {
      method: "DELETE",
      endpoint: `${api.USER_PROFILE}/RemoveImage`,
    };
    yield call(sendRequest, requestConfig);
    yield put({ type: types.REMOVE_IMAGE_SUCCESS });
  } catch (err) {
    handleRequestFail(err, types.REMOVE_IMAGE_REQUEST, {});
  }
}

function* editUserProfile({ payload, callback }) {
  const { id } = getItemFromLocalStorage("user");
  try {
    const requestConfig = {
      method: "PUT",
      endpoint: `${api.USER_PROFILE}/${id}`,
      data: payload,
    };
    const { data } = yield call(sendRequest, requestConfig);
    setItemsToLocalStorage({ user: data });
    yield put({ type: types.SET_USER_DATA, payload: data });
    callback();
  } catch (err) {
    handleRequestFail(err, types.EDIT_PROFILE_REQUEST, { payload, callback });
  }
}

function* changeUserPassword({ payload, callback }) {
  try {
    const requestConfig = {
      method: "POST",
      endpoint: `${api.ACCOUNT}/changePassword`,
      data: payload,
    };
    yield call(sendRequest, requestConfig);
    callback();
  } catch (err) {
    handleRequestFail(err, types.CHANGE_PASSWORD_REQUEST, {
      payload,
      callback,
    });
  }
}

function* logout({ callback }) {
  const token = getItemFromLocalStorage("token");
  const selectedLanguage = getItemFromLocalStorage("language");
  try {
    const requestConfig = {
      method: "POST",
      endpoint: `${api.ACCOUNT}/logout`,
    };
    if (token !== null) {
      yield call(sendRequest, requestConfig);
      localStorage.clear();
      insertTokenInHeader(null);
      setItemsToLocalStorage({ language: selectedLanguage });
    }
    callback();
  } catch (err) {
    handleRequestFail(err, types.LOGOUT_REQUEST, { callback });
  }
}

export default function* watcher() {
  yield takeEvery(types.LOGIN_REQUEST, login);
  yield takeEvery(types.REGISTER_REQUEST, register);
  yield takeEvery(types.RESEND_EMAIL_REQUEST, resendEmail);
  yield takeEvery(types.RESET_PASS_REQUEST, resetPassword);
  yield takeEvery(types.FORGOT_PASS_REQUEST, forgotPassword);
  yield takeEvery(types.COMPLETE_PROFILE_REQUEST, completeProfile);
  yield takeEvery(types.VERIFY_REGISTRATION_REQUEST, verifyRegistration);
  yield takeEvery(types.REMOVE_IMAGE_REQUEST, removeProfileImage);
  yield takeEvery(types.EDIT_PROFILE_REQUEST, editUserProfile);
  yield takeEvery(types.CHANGE_PASSWORD_REQUEST, changeUserPassword);
  yield takeEvery(types.LOGOUT_REQUEST, logout);
}
