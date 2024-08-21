import { call, put, takeEvery, select } from "redux-saga/effects";

import * as api from "api/endpoints";
import { handleRequestFail, sendRequest } from "api/axios";
import { selectResourcesList } from "store/selectors";
import * as types from "./constants";

function* createSpecialization({ payload, callback }) {
  try {
    const requestConfig = {
      method: "POST",
      endpoint: api.SPECIALIZATIONS,
      data: payload,
    };
    const { data } = yield call(sendRequest, requestConfig);
    
    yield put({ type: types.CREATE_SPECIALIZATION_SUCCESS, payload: data });
    callback();
  } catch (err) {
    handleRequestFail(err, types.CREATE_SPECIALIZATION_REQUEST, {
      payload,
      callback,
    });
  }
}

function* editSpecialization({ id, payload, updatedServices, callback }) {
  try {
    const requestConfig = {
      method: "PUT",
      endpoint: `${api.SPECIALIZATIONS}/${id}`,
      data: payload,
    };
    yield call(sendRequest, requestConfig);
    yield put({
      type: types.EDIT_SPECIALIZATION_SUCCESS,
      payload: { ...payload, services: updatedServices, id },
    });
    callback();
  } catch (err) {
    handleRequestFail(err, types.DELETE_SPECIALIZATION_REQUEST, {
      id,
      payload,
      updatedServices,
      callback,
    });
  }
}

function* deleteSpecialization({ id, callback }) {
  try {
    const requestConfig = {
      method: "DELETE",
      endpoint: `${api.SPECIALIZATIONS}/${id}`,
    };
    yield call(sendRequest, requestConfig);
    yield put({
      type: types.DELETE_SPECIALIZATION_SUCCESS,
      payload: { id },
    });
    callback();
  } catch (err) {
    handleRequestFail(err, types.DELETE_SPECIALIZATION_REQUEST, {
      id,
      callback,
    });
  }
}

function* getServicesList({ payload }) {
  const pageSize = payload?.pageSize || 0;
  const pageNumber = payload?.pageNumber || 1;

  try {
    const requestConfig = {
      method: "GET",
      endpoint: `${api.SERVICES}?PageSize=${pageSize}&PageNumber=${pageNumber}`,
    };
    const result = yield call(sendRequest, requestConfig);
    yield put({
      type: types.GET_SERVICES_SUCCESS,
      payload: result.data,
    });
    yield put({
      type: types.GET_SERVICE_PAGINATION,
      payload: JSON.parse(result.headers["x-pagination"]),
    });
  } catch (err) {
    handleRequestFail(err, types.GET_SERVICES_REQUEST, {
      payload,
    });
  }
}

function* createService({ payload, callback }) {
  try {
    const requestConfig = {
      method: "POST",
      endpoint: api.SERVICES,
      data: payload,
    };
    const { data } = yield call(sendRequest, requestConfig);
    yield put({ type: types.CREATE_SERVICE_SUCCESS, payload: data });
    callback();
  } catch (err) {
    handleRequestFail(err, types.CREATE_SERVICE_REQUEST, {
      payload,
      callback,
    });
  }
}

function* editService({ id, payload, callback }) {
  try {
    const requestConfig = {
      method: "PUT",
      endpoint: `${api.SERVICES}/${id}`,
      data: payload,
    };
    yield call(sendRequest, requestConfig);
    yield put({
      type: types.EDIT_SERVICE_SUCCESS,
      payload: { ...payload, id },
    });
    callback();
  } catch (err) {
    handleRequestFail(err, types.EDIT_SERVICE_REQUEST, {
      id,
      payload,
      callback,
    });
  }
}

function* deleteService({ id, callback }) {
  try {
    const requestConfig = {
      method: "DELETE",
      endpoint: `${api.SERVICES}/serviceId?serviceId=${id}`,
    };
    yield call(sendRequest, requestConfig);
    yield put({
      type: types.DELETE_SERVICE_SUCCESS,
      payload: { id },
    });
    callback();
  } catch (err) {
    handleRequestFail(err, types.DELETE_SERVICE_REQUEST, {
      id,
      callback,
    });
  }
}

function* getResourcesList({ payload }) {
  const pageSize = payload?.pageSize || 0;
  const pageNumber = payload?.pageNumber || 1;

  try {
    const requestConfig = {
      method: "GET",
      endpoint: `${api.RESOURCES}?PageSize=${pageSize}&PageNumber=${pageNumber}`,
    };
    const result = yield call(sendRequest, requestConfig);
    yield put({
      type: types.GET_RESOURCES_SUCCESS,
      payload: result.data,
    });
    yield put({
      type: types.GET_RESOURCE_PAGINATION,
      payload: JSON.parse(result.headers["x-pagination"]),
    });
  } catch (err) {
    handleRequestFail(err, types.GET_RESOURCES_REQUEST, {
      payload,
    });
  }
}

function* createResource({ payload, callback }) {
  try {
    const requestConfig = {
      method: "POST",
      endpoint: api.RESOURCES,
      data: payload,
    };
    const { data } = yield call(sendRequest, requestConfig);
    yield put({ type: types.CREATE_RESOURCE_SUCCESS, payload: data });
    callback();
  } catch (err) {
    handleRequestFail(err, types.CREATE_RESOURCE_REQUEST, {
      payload,
      callback,
    });
  }
}

function* editResource({ id, payload, updatedServices, callback }) {
  try {
    const requestConfig = {
      method: "PUT",
      endpoint: `${api.RESOURCES}/${id}`,
      data: payload,
    };
    yield call(sendRequest, requestConfig);
    yield put({
      type: types.EDIT_RESOURCE_SUCCESS,
      payload: { ...payload, services: updatedServices, id },
    });
    callback();
  } catch (err) {
    handleRequestFail(err, types.DELETE_RESOURCE_REQUEST, {
      id,
      payload,
      callback,
    });
  }
}

function* deleteResource({ id, callback }) {
  const resources = yield select(selectResourcesList);
  try {
    const requestConfig = {
      method: "DELETE",
      endpoint: `${api.RESOURCES}/${id}`,
    };
    yield call(sendRequest, requestConfig);
    const filteredResources = resources.filter((item) => item.id !== id);
    yield put({
      type: types.DELETE_RESOURCE_SUCCESS,
      payload: filteredResources,
    });
    callback();
  } catch (err) {
    handleRequestFail(err, types.DELETE_RESOURCE_REQUEST, {
      id,
      callback,
    });
  }
}

function* getSpecializationServicesList() {
  try {
    const requestConfig = {
      method: "GET",
      endpoint: `${api.SPECIALIZATIONS}/GetSpecializationServices`,
    };
    const { data } = yield call(sendRequest, requestConfig);
    yield put({
      type: types.GET_SPEC_SERVICES_SUCCESS,
      payload: data,
    });
  } catch (err) {
    handleRequestFail(err, types.GET_SPEC_SERVICES_REQUEST, {});
  }
}

export default function* watcher() {
  yield takeEvery(types.CREATE_SPECIALIZATION_REQUEST, createSpecialization);
  yield takeEvery(types.EDIT_SPECIALIZATION_REQUEST, editSpecialization);
  yield takeEvery(types.DELETE_SPECIALIZATION_REQUEST, deleteSpecialization);
  yield takeEvery(types.GET_SERVICES_REQUEST, getServicesList);
  yield takeEvery(types.CREATE_SERVICE_REQUEST, createService);
  yield takeEvery(types.EDIT_SERVICE_REQUEST, editService);
  yield takeEvery(types.DELETE_SERVICE_REQUEST, deleteService);
  yield takeEvery(types.GET_RESOURCES_REQUEST, getResourcesList);
  yield takeEvery(types.CREATE_RESOURCE_REQUEST, createResource);
  yield takeEvery(types.EDIT_RESOURCE_REQUEST, editResource);
  yield takeEvery(types.DELETE_RESOURCE_REQUEST, deleteResource);
  yield takeEvery(
    types.GET_SPEC_SERVICES_REQUEST,
    getSpecializationServicesList,
  );
}
