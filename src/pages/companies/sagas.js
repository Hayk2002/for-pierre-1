import { put, call, takeEvery, select } from "redux-saga/effects";

import { sendRequest, handleRequestFail } from "api/axios";
import * as api from "api/endpoints";
import { INVITATIONS } from "api/endpoints";
import { getItemFromLocalStorage } from "utils/helpers";
import { selectActiveCompany, selectCompaniesList } from "store/selectors";
import * as types from "./constants";
import { setSelectedCompany } from "./actions";

function* getCompanies() {
  const { pathname } = window.location;
  const isCompaniesPage = pathname === "/companies";
  const companyId = getItemFromLocalStorage("companyId");

  try {
    const requestConfig = {
      method: "GET",
      endpoint: api.COMPANIES,
    };
    const { data } = yield call(sendRequest, requestConfig);
    yield put({
      type: types.GET_COMPANIES_SUCCESS,
      payload: data,
    });
    if (companyId && !isCompaniesPage) {
      const selectedCompany = data.companies.find(
        (company) => company.id === companyId,
      );
      yield put(setSelectedCompany(selectedCompany));
    }
  } catch (err) {
    handleRequestFail(err, types.GET_COMPANIES_REQUEST, {});
  }
}

function* getCompanyProfile({ id }) {
  try {
    const requestConfig = {
      method: "GET",
      endpoint: `${api.COMPANIES}/${id}`,
    };
    const { data } = yield call(sendRequest, requestConfig);
    yield put({ type: types.SET_SELECTED_COMPANY_SUCCESS, payload: data });
    yield put({ type: types.GET_COMPANIES_REQUEST });
  } catch (err) {
    handleRequestFail(err, types.GET_COMPANY_PROFILE_REQUEST, { id });
  }
}

function* createCompany({ payload, callback }) {
  try {
    const requestConfig = {
      method: "POST",
      endpoint: api.COMPANIES,
      data: payload,
    };
    const { data } = yield call(sendRequest, requestConfig);
    yield put({ type: types.CREATE_COMPANY_SUCCESS, payload: data });
    callback();
  } catch (err) {
    handleRequestFail(err, types.CREATE_COMPANY_REQUEST, { payload, callback });
  }
}

function* getTimezones({ payload }) {
  try {
    const requestConfig = {
      method: "GET",
      endpoint: api.TIMEZONES,
      data: payload,
    };
    const { data } = yield call(sendRequest, requestConfig);
    yield put({
      type: types.GET_TIMEZONES_SUCCESS,
      payload: data,
    });
  } catch (err) {
    handleRequestFail(err, types.GET_TIMEZONES_REQUEST, { payload });
  }
}

function* changeInvitation({ payload }) {
  try {
    const requestConfig = {
      method: "PUT",
      endpoint: `${INVITATIONS}/Respond/${payload.id}`,
      data: `${payload.status}`,
    };
    yield call(sendRequest, requestConfig);
    yield put({ type: types.GET_COMPANIES_REQUEST });
  } catch (err) {
    handleRequestFail(err, types.CHANGE_INVITATION_REQUEST, { payload });
  }
}

function* editCompany({ payload, callback }) {
  const activeCompany = yield select(selectActiveCompany);
  const companiesList = yield select(selectCompaniesList);
  const companyId = getItemFromLocalStorage("companyId") || activeCompany.id;
  try {
    const requestConfig = {
      method: "PUT",
      endpoint: `${api.COMPANIES}/${companyId}`,
      data: payload,
    };
    const { data } = yield call(sendRequest, requestConfig);
    data.accountTypeId = activeCompany?.accountTypeId;
    yield put(setSelectedCompany(data));
    const updatedCompaniesList = companiesList.map((company) => {
      if (company.id === companyId) {
        return data;
      }

      return company;
    });
    yield put({
      type: types.EDIT_COMPANY_SUCCESS,
      payload: updatedCompaniesList,
    });
    callback();
  } catch (err) {
    handleRequestFail(err, types.EDIT_COMPANY_REQUEST, { payload, callback });
  }
}

function* removeCompanyImage() {
  try {
    const requestConfig = {
      method: "DELETE",
      endpoint: `${api.COMPANIES}/RemoveImage`,
    };
    yield call(sendRequest, requestConfig);
    yield put({ type: types.REMOVE_COMPANY_IMAGE_SUCCESS });
  } catch (err) {
    handleRequestFail(err, types.REMOVE_COMPANY_IMAGE_REQUEST, {});
  }
}

function* resubmitCompanyApproval({ id, callback }) {
  try {
    const requestConfig = {
      method: "POST",
      endpoint: `${api.COMPANIES}/RequestCompanyApprove?companyId=${id}`,
    };
    yield call(sendRequest, requestConfig);
    callback();
    yield put({ type: types.GET_COMPANIES_REQUEST });
  } catch (err) {
    handleRequestFail(err, types.RESUBMIT_COMPANY_REQUEST, { id, callback });
  }
}

export default function* watcher() {
  yield takeEvery(types.GET_COMPANIES_REQUEST, getCompanies);
  yield takeEvery(types.CREATE_COMPANY_REQUEST, createCompany);
  yield takeEvery(types.GET_TIMEZONES_REQUEST, getTimezones);
  yield takeEvery(types.CHANGE_INVITATION_REQUEST, changeInvitation);
  yield takeEvery(types.EDIT_COMPANY_REQUEST, editCompany);
  yield takeEvery(types.REMOVE_COMPANY_IMAGE_REQUEST, removeCompanyImage);
  yield takeEvery(types.RESUBMIT_COMPANY_REQUEST, resubmitCompanyApproval);
  yield takeEvery(types.GET_COMPANY_PROFILE_REQUEST, getCompanyProfile);
}
