import { takeLatest, call, put, takeEvery } from "redux-saga/effects";

import { sendRequest, handleRequestFail } from "api/axios";
import * as api from "api/endpoints";
import { GET_TEMPLATE_PAGINATION } from "pages/schedule/constants";
import { getItemFromLocalStorage } from "utils/helpers";
import * as types from "./constants";

function* getBranches({ callback }) {
  try {
    const requestConfig = {
      method: "GET",
      endpoint: `${api.BRANCHES}`,
    };
    const { data } = yield call(sendRequest, requestConfig);
    yield put({
      type: types.GET_BRANCHES_SUCCESS,
      payload: data,
    });

    if (callback && data.length) {
      callback(data[0], data);
    }
  } catch (err) {
    handleRequestFail(err, types.GET_BRANCHES_REQUEST, { callback });
  }
}

function* createBranch({ payload, callback }) {
  try {
    const requestConfig = {
      method: "POST",
      endpoint: api.BRANCHES,
      data: { ...payload, hasReception: false },
    };
    const { data } = yield call(sendRequest, requestConfig);
    yield put({
      type: types.CREATE_BRANCH_SUCCESS,
      payload: data,
    });
    callback();
  } catch (err) {
    handleRequestFail(err, types.CREATE_BRANCH_REQUEST, { payload, callback });
  }
}

function* editBranch({ payload, callback }) {
  const branchId = getItemFromLocalStorage("branchId");
  try {
    const requestConfig = {
      method: "PUT",
      endpoint: `${api.BRANCHES}/${branchId}`,
      data: { ...payload, hasReception: false },
    };
    yield call(sendRequest, requestConfig);
    callback();
  } catch (err) {
    handleRequestFail(err, types.EDIT_BRANCH_REQUEST, { payload, callback });
  }
}

function* deleteBranch({ id, callback }) {
  try {
    const requestConfig = {
      method: "DELETE",
      endpoint: `${api.BRANCHES}/${id}`,
    };
    yield call(sendRequest, requestConfig);
    yield put({ type: types.DELETE_BRANCH_SUCCESS, payload: { id } });
    callback();
  } catch (err) {
    handleRequestFail(err, types.DELETE_BRANCH_REQUEST, {
      id,
      callback,
    });
  }
}

function* getTimeBlocks() {
  try {
    const requestConfig = {
      method: "GET",
      endpoint: `${api.TIME_BLOCKS}`,
    };
    const { data } = yield call(sendRequest, requestConfig);
    yield put({
      type: types.TIME_BLOCKS_SUCCESS,
      payload: data,
    });
  } catch (err) {
    handleRequestFail(err, types.TIME_BLOCKS_REQUEST);
  }
}

function* getTemplates({ payload }) {
  const pageSize = payload?.pageSize ?? 10;
  const pageNumber = payload?.pageNumber ?? 1;

  try {
    const requestConfig = {
      method: "GET",
      endpoint: `${api.ScheduleTemplates}?pageSize=${pageSize}&&pageNUmber=${pageNumber}`,
    };
    const { headers, data } = yield call(sendRequest, requestConfig);
    yield put({
      type: GET_TEMPLATE_PAGINATION,
      payload: JSON.parse(headers["x-pagination"]),
    });
    yield put({
      type: types.TEMPLATES_LIST_SUCCESS,
      payload: data,
    });
  } catch (err) {
    handleRequestFail(err, types.TEMPLATES_LIST_REQUEST, { payload });
  }
}

function* getBlockTypes() {
  try {
    const requestConfig = {
      method: "GET",
      endpoint: api.BLOCK_TYPES,
    };
    const { data } = yield call(sendRequest, requestConfig);
    yield put({
      type: types.GET_BLOCK_TYPES_LIST_SUCCESS,
      payload: data,
    });
  } catch (err) {
    handleRequestFail(err, types.GET_BLOCK_TYPES_LIST, {});
  }
}

function* getSpecializationsList({ payload, callback }) {
  const pageSize = payload?.pageSize || 0;
  const pageNumber = payload?.pageNumber || 1;

  try {
    const requestConfig = {
      method: "GET",
      endpoint: `${api.SPECIALIZATIONS}?PageSize=${pageSize}&PageNumber=${pageNumber}`,
    };
    const { headers, data } = yield call(sendRequest, requestConfig);
    data.sort((a,b) => a.name.localeCompare(b.name));
    
    yield put({
      type: types.GET_SPECIALIZATIONS_SUCCESS,
      payload: data,
    });
    yield put({
      type: types.GET_SPECIALIZATION_PAGINATION,
      payload: JSON.parse(headers["x-pagination"]),
    });

    if (callback && data.length) {
      callback(data[0].id);
    }
  } catch (err) {
    handleRequestFail(err, types.GET_SPECIALIZATIONS_REQUEST, {
      payload,
    });
  }
}

function* getAccountBranchesList({ payload, callback }) {
  try {
    const requestConfig = {
      method: "GET",
      endpoint: `${api.ACCOUNT_SPECIALIZATION}/GetAccountSpecializationBranches/${payload.accountId}`,
    };
    const { data } = yield call(sendRequest, requestConfig);
    yield put({
      type: types.ACCOUNT_BRANCHES_SUCCESS,
      payload: data,
    });

    if (callback) {
      callback(data[0], data);
    }
  } catch (err) {
    handleRequestFail(err, types.ACCOUNT_BRANCHES_REQUEST, {
      payload,
      callback,
    });
  }
}

export default function* watcher() {
  yield takeLatest(types.GET_BRANCHES_REQUEST, getBranches);
  yield takeLatest(types.CREATE_BRANCH_REQUEST, createBranch);
  yield takeEvery(types.DELETE_BRANCH_REQUEST, deleteBranch);
  yield takeEvery(types.EDIT_BRANCH_REQUEST, editBranch);
  yield takeLatest(types.TIME_BLOCKS_REQUEST, getTimeBlocks);
  yield takeLatest(types.TEMPLATES_LIST_REQUEST, getTemplates);
  yield takeLatest(types.GET_BLOCK_TYPES_LIST, getBlockTypes);
  yield takeLatest(types.GET_SPECIALIZATIONS_REQUEST, getSpecializationsList);
  yield takeLatest(types.ACCOUNT_BRANCHES_REQUEST, getAccountBranchesList);
}
