import { takeLatest, call, put } from "redux-saga/effects";

import { sendRequest, handleRequestFail } from "api/axios";
import {
  APPOINTMENT,
  TIME_SLOTS,
  REPORT,
  COMPANY_ACCOUNTS,
} from "api/endpoints";
import * as types from "./constants";

function* getAppointmentList({ payload, isServiceProvider, callback }) {
  yield put({ type: types.CALENDAR_LOADING, payload: true });

  let ep = `${APPOINTMENT}?branchId=${payload.branchId}&date=${payload.date}`;
  if (isServiceProvider) {
    ep = `${APPOINTMENT}/GetUserAppointments?branchId=${payload.branchId}&date=${payload.date}`;
  }
  if (payload.accountId) {
    ep += `&accountId=${payload.accountId}&timeInterval=${payload.timeInterval}`;
  }

  if (payload.specializationId) {
    ep += `&specializationId=${payload.specializationId}`;
  }

  const data = {
    method: "GET",
    endpoint: ep,
  };

  try {
    const result = yield call(sendRequest, data);
    yield put({
      type: types.USER_APPOINTMENT_LIST_SUCCESS,
      payload: {
        appointments: result.data,
      },
    });
    yield put({
      type: types.APPOINTMENT_LIST_SIGNALR_START,
      payload: {
        appointments: result.data,
        branchId: payload.branchId,
        date: payload.date,
        page: 0,
      },
    });

    if (callback) {
      callback();
    }
  } catch (err) {
    yield put({
      type: types.USER_APPOINTMENT_LIST_SUCCESS,
      payload: {
        appointments: [],
      },
    });
    handleRequestFail(err, types.USER_APPOINTMENT_LIST_REQUEST, {
      payload,
      isServiceProvider,
      callback,
    });
  } finally {
    yield put({ type: types.CALENDAR_LOADING, payload: false });
  }
}

function* getResourceAppointments({ payload, callback }) {
  yield put({ type: types.CALENDAR_LOADING, payload: true });

  const data = {
    method: "GET",
    endpoint: `${APPOINTMENT}/GetResourceAppointments?branchId=${payload.branchId}&date=${payload.date}
    `,
  };

  try {
    const result = yield call(sendRequest, data);

    yield put({
      type: types.RESOURCE_APPOINTMENT_LIST_SUCCESS,
      payload: result.data,
    });
    yield put({
      type: types.APPOINTMENT_LIST_SIGNALR_START,
      payload: {
        appointments: result.data,
        branchId: payload.branchId,
        date: payload.date,
        page: 1,
      },
    });

    if (callback) {
      callback();
    }
  } catch (err) {
    handleRequestFail(err, types.RESOURCE_APPOINTMENT_LIST_REQUEST, {
      payload,
      callback,
    });
  } finally {
    yield put({ type: types.CALENDAR_LOADING, payload: false });
  }
}

function* getAppointmentTimeSlots({ payload, callback }) {
  const data = {
    method: "GET",
    endpoint: `${TIME_SLOTS}?branchId=${payload.branchId}&accountId=${
      payload.accountId
    }${payload.serviceId ? `&serviceId=${payload.serviceId}` : ""}&date=${
      payload.date
    }&duration=${payload.duration}${
      payload.resourceId ? `&resourceId=${payload.resourceId}` : ""
    }${payload.stepId ? `&stepId=${payload.stepId}` : ""}`,
    companyId: payload.companyId,
  };
  try {
    const result = yield call(sendRequest, data);
    yield put({
      type: types.TIME_SLOTS_SUCCESS,
      payload: result.data,
    });

    if (callback) {
      callback(result.data);
    }
  } catch (err) {
    handleRequestFail(err, types.TIME_SLOTS_REQUEST, {
      payload,
      callback,
    });
  }
}

function* addAppointment({ payload, callback }) {
  yield put({ type: types.CALENDAR_LOADING, payload: true });
  yield put({ type: types.DISABLE_BUTTON, payload: true });

  const data = {
    method: "POST",
    endpoint: APPOINTMENT,
    data: payload,
  };

  try {
    yield call(sendRequest, data);
    if (callback) {
      callback();
    }
  } catch (err) {
    handleRequestFail(err, types.ADD_USER_APPOINTMENT_REQUEST, {
      payload,
    });
  } finally {
    yield put({ type: types.CALENDAR_LOADING, payload: false })
    yield put({ type: types.DISABLE_BUTTON, payload: false });
  }
}

function* addStep({ payload, callback}) {
  yield put({ type: types.CALENDAR_LOADING, payload: true });
  yield put({ type: types.DISABLE_BUTTON, payload: true });

  const { requestData, userDetails } = payload;

  const data = {
    method: "POST",
    endpoint: `${APPOINTMENT}/AddSteps`,
    data: requestData,
  };

  try {
    yield call(sendRequest, data);
    
    yield put({
      type: types.UPDATE_USER_DETAILS_SUCCESS,
      payload: userDetails,
    });

    if (callback) {
      callback();
    }
    
  } catch (err) {
    handleRequestFail(err, types.ADD_STEP_REQUEST, {
      payload,
    });
  }finally {
    yield put({ type: types.CALENDAR_LOADING, payload: false })
    yield put({ type: types.DISABLE_BUTTON, payload: false });
  }
}

function* deleteAppointment({ payload: { id, isOnlyStep = false }, callback }) {
  yield put({ type: types.DISABLE_BUTTON, payload: true });

  const data = {
    method: "DELETE",
    endpoint: `${APPOINTMENT}?id=${id}&deleteOnlyStep=${isOnlyStep}`,
  };
  try {
    yield call(sendRequest, data);
    if (callback) {
      callback();
    }
  } catch (err) {
    handleRequestFail(err, types.DELETE_APPOINTMENT_REQUEST, {
      payload: { id, isOnlyStep },
    });
  }finally {
    yield put({ type: types.DISABLE_BUTTON, payload: false });
  }
}

function* updateUserDetails({ payload }) {
  yield put({ type: types.DISABLE_BUTTON, payload: true });

  const { appointmentId, phoneNumber, userName } = payload;
  const data = {
    method: "PUT",
    endpoint: `${APPOINTMENT}/UserDetails`,
    data: {
      appointmentId,
      phoneNumber,
      userName,
    },
  };

  try {
    yield call(sendRequest, data);
    yield put({
      type: types.UPDATE_USER_DETAILS_SUCCESS,
      payload,
    });
  } catch (err) {
    handleRequestFail(err, types.UPDATE_USER_DETAILS_REQUEST, {
      payload,
    });
  }finally {
    yield put({ type: types.DISABLE_BUTTON, payload: false })
  }
}

function* updateAppointmentStep({ payload }) {
  yield put({ type: types.DISABLE_BUTTON, payload: true });

  const { branchId, date, appointmentSteps } = payload;

  const data = {
    method: "PUT",
    endpoint: `${APPOINTMENT}/EditStep`,
    data: {
      branchId,
      date,
      appointmentSteps,
    },
  };
  try {
    yield call(sendRequest, data);
    if (payload.customerDetails) {
      const { phoneNumber, userName } = payload.customerDetails;
      yield put({
        type: types.UPDATE_USER_DETAILS_SUCCESS,
        payload: {
          phoneNumber,
          userName,
          appointmentId: payload.appointmentId        
        },
      });
    }
  } catch (err) {
    handleRequestFail(err, types.UPDATE_APPOINTMENT_STEP_REQUEST, {
      payload,
    });
  }finally {
    yield put({ type: types.DISABLE_BUTTON, payload: false });
  }
}

function* updateTimeBlocker({ payload }) {
  yield put({ type: types.DISABLE_BUTTON, payload: true });

  const data = {
    method: "PUT",
    endpoint: `${TIME_SLOTS}/EditTimeBlocker`,
    data: payload,
  };
  try {
    yield call(sendRequest, data);
    
  } catch (err) {
    handleRequestFail(err, types.UPDATE_TIME_BLOCKER_REQUEST, {
      payload,
    });
  }finally {
    yield put({ type: types.DISABLE_BUTTON, payload: false });

  }
}

function* deleteTimeBlocker({ payload, callback }) {
  const data = {
    method: "DELETE",
    endpoint: `${TIME_SLOTS}/DeleteTimeBlocker?id=${payload.id}`,
  };
  try {
    yield call(sendRequest, data);
    if (callback) {
      callback();
    }
  } catch (err) {
    handleRequestFail(err, types.DELETE_TIME_BLOCKER_REQUEST, {
      payload,
    });
  }
}

function* getAppointmentById({ payload: { id }, callback }) {
  const data = {
    method: "GET",
    endpoint: `${APPOINTMENT}/${id}`,
  };
  try {
    const result = yield call(sendRequest, data);
    yield put({
      type: types.APPOINTMENT_BY_ID_SUCCESS,
      payload: result.data,
    });

    if (callback) {
      callback(result.data);
    }
  } catch (err) {
    handleRequestFail(err, types.APPOINTMENT_BY_ID_REQUEST, {
      payload: { id },
    });
  }
}

function* addTimeBlock({ payload, callback }) {
  yield put({ type: types.DISABLE_BUTTON, payload: true });

  const data = {
    method: "POST",
    endpoint: `${TIME_SLOTS}/SetTimeBlocker`,
    data: payload,
  };
  try {
    yield call(sendRequest, data);
    if (callback) {
      callback();
    }
  } catch (err) {
    handleRequestFail(err, types.ADD_BLOCK_TIME_REQUEST, { payload });
  }finally {
    yield put({ type: types.DISABLE_BUTTON, payload: false });
  }
}

function* getPrintData({ payload, callback }) {
  const data = {
    method: "POST",
    endpoint: `${REPORT}/GetPrintFormData`,
    data: payload,
  };
  try {
    const result = yield call(sendRequest, data);
    yield put({
      type: types.CALENDAR_PRINT_DATA_SUCCESS,
      payload: result.data,
    });
    if (callback) {
      callback();
    }
  } catch (err) {
    handleRequestFail(err, types.CALENDAR_PRINT_DATA_REQUEST, {
      payload,
      callback,
    });
  }
}

function* getProvidersSuggestionsList({ payload }) {
  const requestConfig = {
    method: "GET",
    endpoint: `${COMPANY_ACCOUNTS}/GetServiceProviders?branchId=${payload.branchId}`,
  };

  try {
    const { data } = yield call(sendRequest, requestConfig);
    yield put({
      type: types.GET_PROVIDERS_SUGGESTIONS_LIST_SUCCESS,
      payload: data,
    });
  } catch (err) {
    handleRequestFail(err, types.GET_PROVIDERS_SUGGESTIONS_LIST, { payload });
  }
}

function* searchUserAppointmentsHistory({ payload, callback }) {
  const requestConfig = {
    method: "POST",
    endpoint: `${APPOINTMENT}/AdvancedSearch`,
    data: payload,
  };

  try {
    const { data } = yield call(sendRequest, requestConfig);
    yield put({ type: types.SEARCH_USER_APPOINTMENTS_SUCCESS, payload: data });
    callback();
  } catch (err) {
    handleRequestFail(err, types.SEARCH_USER_APPOINTMENTS, {
      payload,
      callback,
    });
  }
}

export default function* watcher() {
  yield takeLatest(types.USER_APPOINTMENT_LIST_REQUEST, getAppointmentList);
  yield takeLatest(
    types.RESOURCE_APPOINTMENT_LIST_REQUEST,
    getResourceAppointments,
  );
  yield takeLatest(types.TIME_SLOTS_REQUEST, getAppointmentTimeSlots);
  yield takeLatest(types.ADD_USER_APPOINTMENT_REQUEST, addAppointment);
  yield takeLatest(types.ADD_STEP_REQUEST, addStep);
  yield takeLatest(types.APPOINTMENT_BY_ID_REQUEST, getAppointmentById);
  yield takeLatest(types.DELETE_APPOINTMENT_REQUEST, deleteAppointment);
  yield takeLatest(types.UPDATE_USER_DETAILS_REQUEST, updateUserDetails);
  yield takeLatest(
    types.UPDATE_APPOINTMENT_STEP_REQUEST,
    updateAppointmentStep,
  );
  yield takeLatest(types.UPDATE_TIME_BLOCKER_REQUEST, updateTimeBlocker);
  yield takeLatest(types.DELETE_TIME_BLOCKER_REQUEST, deleteTimeBlocker);
  yield takeLatest(types.ADD_BLOCK_TIME_REQUEST, addTimeBlock);
  yield takeLatest(types.CALENDAR_PRINT_DATA_REQUEST, getPrintData);
  yield takeLatest(
    types.GET_PROVIDERS_SUGGESTIONS_LIST,
    getProvidersSuggestionsList,
  );
  yield takeLatest(
    types.SEARCH_USER_APPOINTMENTS,
    searchUserAppointmentsHistory,
  );
}
