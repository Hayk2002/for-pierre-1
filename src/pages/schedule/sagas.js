import { put, call, takeLatest } from "redux-saga/effects";

import * as api from "api/endpoints";
import { sendRequest, handleRequestFail } from "api/axios";
import * as types from "./constants";

function* addTemplate({ payload, callback }) {
  try {
    const requestConfig = {
      method: "POST",
      endpoint: api.ScheduleTemplates,
      data: payload,
    };
    yield call(sendRequest, requestConfig);
    if (callback) {
      callback();
    }
  } catch (err) {
    handleRequestFail(err, types.ADD_TEMPLATE_REQUEST, { payload, callback });
  }
}

function* getTemplateData({ payload, callback }) {
  try {
    const requestConfig = {
      method: "GET",
      endpoint: `${api.ScheduleTemplates}/${payload.templateId}`,
    };
    const { data } = yield call(sendRequest, requestConfig);
    yield put({ type: types.GET_TEMPLATE_DATA_SUCCESS, payload: data });
    if (callback) {
      callback();
    }
  } catch (err) {
    handleRequestFail(err, types.GET_TEMPLATE_DATA_REQUEST, {
      payload,
      callback,
    });
  }
}

function* editTemplate({ payload, callback }) {
  try {
    const requestConfig = {
      method: "PUT",
      endpoint: `${api.ScheduleTemplates}/${payload.templateId}`,
      data: payload.body,
    };
    const result = yield call(sendRequest, requestConfig);
    if (result.status === 204) {
      yield put({ type: types.EDIT_TEMPLATE_SUCCESS });
      callback();
    }
  } catch (err) {
    handleRequestFail(err, types.EDIT_TEMPLATE_REQUEST, { payload, callback });
  }
}

function* deleteTemplate({ payload, callback }) {
  try {
    const requestConfig = {
      method: "DELETE",
      endpoint: `${api.ScheduleTemplates}/${payload.id}`,
    };
    yield call(sendRequest, requestConfig);
    yield put({
      type: types.DELETE_TEMPLATE_SUCCESS,
      payload,
    });
    callback();
  } catch (err) {
    handleRequestFail(err, types.DELETE_TEMPLATE_REQUEST, {
      payload,
      callback,
    });
  }
}

function* scheduleList({ payload }) {
  try {
    const requestConfig = {
      method: "POST",
      endpoint: `${api.ACCOUNT_SCHEDULE}/GetBranchAccountScheduleTemplate`,
      data: payload,
    };
    const { data } = yield call(sendRequest, requestConfig);
    yield put({ type: types.SCHEDULE_LIST_SUCCESS, payload: data });
  } catch (err) {
    handleRequestFail(err, types.ADD_TEMPLATE_REQUEST, { payload });
  }
}

export default function* watcher() {
  yield takeLatest(types.ADD_TEMPLATE_REQUEST, addTemplate);
  yield takeLatest(types.GET_TEMPLATE_DATA_REQUEST, getTemplateData);
  yield takeLatest(types.EDIT_TEMPLATE_REQUEST, editTemplate);
  yield takeLatest(types.DELETE_TEMPLATE_REQUEST, deleteTemplate);
  yield takeLatest(types.SCHEDULE_LIST_REQUEST, scheduleList);
}
