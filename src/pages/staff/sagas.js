import { call, put, takeEvery, takeLatest } from "redux-saga/effects";
import moment from "moment";

import * as api from "api/endpoints";
import { handleRequestFail, sendRequest } from "api/axios";
import { getAccountBranches } from "sharedStore/actions";
import * as types from "./constants";
import { getAccountSpecializations } from "./actions";

function* getCompanyStaff({ callback }) {
  try {
    const { data } = yield call(sendRequest, {
      method: "GET",
      endpoint: `${api.COMPANY_ACCOUNTS}?PageSize=0`,
    });
    yield put({ type: types.COMPANY_STAFF_SUCCESS, payload: data });
    if (callback) {
      callback(data);
    }
  } catch (err) {
    handleRequestFail(err, types.COMPANY_STAFF_REQUEST, { callback });
  }
}

function* getCompanyInvitations() {
  try {
    const { data } = yield call(sendRequest, {
      method: "GET",
      endpoint: api.INVITATIONS,
    });

    yield put({ type: types.COMPANY_INVITATIONS_SUCCESS, payload: data });
  } catch (err) {
    handleRequestFail(err, types.COMPANY_INVITATIONS_REQUEST);
  }
}

function* inviteUser({ payload, callback }) {
  try {
    const requestConfig = {
      method: "POST",
      endpoint: api.INVITATIONS,
      data: payload,
    };
    const { data } = yield call(sendRequest, requestConfig);
    yield put({
      type: types.INVITE_USER_TO_COMPANY_SUCCESS,
      payload: data,
    });

    if (callback) {
      callback();
    }
  } catch (err) {
    handleRequestFail(err, types.INVITE_USER_TO_COMPANY, { payload, callback });
  }
}

function* reInviteUser({ payload, callback }) {
  try {
    const requestConfig = {
      method: "POST",
      endpoint: api.INVITATIONS,
      data: { email: payload.email, accountTypeId: payload.accountTypeId },
    };
    yield call(sendRequest, requestConfig);
    yield put({
      type: types.REINVITE_USER_SUCCESS,
      payload,
    });

    if (callback) {
      callback();
    }
  } catch (err) {
    handleRequestFail(err, types.REINVITE_USER_REQUEST, { payload, callback });
  }
}

function* updateCompanyUser({ payload, callback }) {
  try {
    const requestConfig = {
      method: "PUT",
      endpoint: `${api.COMPANY_ACCOUNTS}/${payload.id}`,
      data: payload.accountTypeId,
    };
    yield call(sendRequest, requestConfig);
    yield put({
      type: types.UPDATE_COMPANY_USER_SUCCESS,
      payload,
    });

    if (callback) {
      callback();
    }
  } catch (err) {
    handleRequestFail(err, types.UPDATE_COMPANY_USER, { payload, callback });
  }
}

function* updateCompanyInvitedUser({ payload, callback }) {
  try {
    const requestConfig = {
      method: "PUT",
      endpoint: `${api.INVITATIONS}/${payload.id}`,
      data: { accountTypeId: payload.accountTypeId, email: payload.email },
    };
    yield call(sendRequest, requestConfig);
    yield put({
      type: types.UPDATE_COMPANY_INVITED_USER_SUCCESS,
      payload,
    });

    if (callback) {
      callback();
    }
  } catch (err) {
    handleRequestFail(err, types.UPDATE_COMPANY_INVITED_USER, {
      payload,
      callback,
    });
  }
}

function* deleteStaffMember({ payload, callback }) {
  try {
    const requestConfig = {
      method: "DELETE",
      endpoint: `${api.COMPANY_ACCOUNTS}/${payload.id}`,
    };
    yield call(sendRequest, requestConfig);
    yield put({ type: types.DELETE_STAFF_MEMBER_SUCCESS, payload });
    if (callback) {
      callback();
    }
  } catch (err) {
    handleRequestFail(err, types.DELETE_STAFF_MEMBER_REQUEST, {
      payload,
      callback,
    });
  }
}

function* deleteInvitedMember({ payload, callback }) {
  try {
    const requestConfig = {
      method: "DELETE",
      endpoint: `${api.INVITATIONS}/${payload.id}`,
    };
    yield call(sendRequest, requestConfig);
    yield put({ type: types.DELETE_INVITED_MEMBER_SUCCESS, payload });
    if (callback) {
      callback();
    }
  } catch (err) {
    handleRequestFail(err, types.DELETE_INVITED_MEMBER_REQUEST, {
      payload,
      callback,
    });
  }
}

function* getStaffMemberData({ payload }) {
  try {
    const requestConfig = {
      method: "GET",
      endpoint: `${api.COMPANY_ACCOUNTS}/${payload.accountId}`,
    };
    const result = yield call(sendRequest, requestConfig);
    yield put({
      type: types.STAFF_MEMBER_SUCCESS,
      payload: result.data,
    });
  } catch (err) {
    handleRequestFail(err, types.STAFF_MEMBER_REQUEST, {
      payload,
    });
  }
}

function* getSpecializationsList({ payload }) {
  try {
    const requestConfig = {
      method: "GET",
      endpoint: `${api.ACCOUNT_SPECIALIZATION}/GetAccountAllSpecialization/${payload.accountId}`,
    };
    const result = yield call(sendRequest, requestConfig);
    yield put({
      type: types.ACCOUNT_SPECIALIZATIONS_SUCCESS,
      payload: result.data,
    });
  } catch (err) {
    handleRequestFail(err, types.ACCOUNT_SPECIALIZATIONS_REQUEST, {
      payload,
    });
  }
}

function* addMemberSpecializations({ payload, callback }) {
  try {
    const requestConfig = {
      method: "POST",
      endpoint: api.ACCOUNT_SPECIALIZATION,
      data: payload,
    };
    const { data } = yield call(sendRequest, requestConfig);
    yield put({
      type: types.ADD_MEMBER_SPECIALIZATIONS_SUCCESS,
      payload: data,
    });
    callback();
  } catch (err) {
    handleRequestFail(err, types.ADD_MEMBER_SPECIALIZATIONS_REQUEST, {
      payload,
      callback,
    });
  }
}

function* editMemberSpecializations({ payload, callback }) {
  try {
    const requestConfig = {
      method: "PUT",
      endpoint: api.ACCOUNT_SPECIALIZATION,
      data: payload,
    };
    yield call(sendRequest, requestConfig);
    yield put(getAccountSpecializations(payload));
    yield put(getAccountBranches(payload));
    callback();
  } catch (err) {
    handleRequestFail(err, types.EDIT_MEMBER_SPECIALIZATIONS_REQUEST, {
      payload,
      callback,
    });
  }
}

function* deleteMemberSpecializations({ payload }) {
  try {
    const requestConfig = {
      method: "DELETE",
      endpoint: `${api.ACCOUNT_SPECIALIZATION}/${payload.accountId}/${payload.branchId}`,
    };
    yield call(sendRequest, requestConfig);
    yield put({
      type: types.DELETE_MEMBER_SPECIALIZATIONS_SUCCESS,
      payload,
    });
  } catch (err) {
    handleRequestFail(err, types.DELETE_MEMBER_SPECIALIZATIONS_REQUEST, {
      payload,
    });
  }
}

function* getCustomScheduleTemplate({ payload }) {
  try {
    const requestConfig = {
      method: "GET",
      endpoint: `${api.ScheduleTemplates}/GetCustomScheduleTemplate?branchId=${payload.branchId}&accountId=${payload.accountId}`,
    };
    const result = yield call(sendRequest, requestConfig);
    if (result.status === 200) {
      yield put({
        type: types.CUSTOM_SCHEDULE_TEMPLATE_SUCCESS,
        payload: {
          ...result.data,
          patterns: JSON.parse(result.data.patterns),
          nonWorkingDays: JSON.parse(result.data.nonWorkingDays),
        },
      });
    } else {
      yield put({
        type: types.CUSTOM_SCHEDULE_TEMPLATE_SUCCESS,
        payload: {},
      });
    }
  } catch (err) {
    handleRequestFail(err, types.CUSTOM_SCHEDULE_TEMPLATE, {
      payload,
    });
  }
}

function* addCustomScheduleTemplate({ payload, callback }) {
  try {
    const requestConfig = {
      method: "POST",
      endpoint: `${api.ScheduleTemplates}/SaveCustomScheduleTemplate`,
      data: payload,
    };
    const { data } = yield call(sendRequest, requestConfig);
    yield put({
      type: types.ADD_CUSTOM_SCHEDULE_SUCCESS,
      payload: {
        ...data,
        patterns: JSON.parse(data.patterns),
        nonWorkingDays: JSON.parse(data.nonWorkingDays),
      },
    });

    if (callback) {
      callback();
    }
  } catch (err) {
    handleRequestFail(err, types.ADD_CUSTOM_SCHEDULE_REQUEST, {
      payload,
      callback,
    });
  }
}

function* toggleCustomScheduleActivity({ payload, callback }) {
  try {
    const requestConfig = {
      method: "POST",
      endpoint: `${api.ScheduleTemplates}/ToggleCustomScheduleActivity?customScheduleTemplateId=${payload.customScheduleTemplateId}&isActivate=${payload.isActivate}`,
    };
    yield call(sendRequest, requestConfig);
    yield put({
      type: types.TOGGLE_CUSTOM_SCHEDULE_ACTIVITY_SUCCESS,
      payload: payload.isActivate,
    });

    if (callback) {
      callback(true);
    }
  } catch (err) {
    if (callback) {
      callback();
    }
    handleRequestFail(err, types.TOGGLE_CUSTOM_SCHEDULE_ACTIVITY, {
      payload,
      callback,
    });
  }
}

function* getWeeklyScheduleTemplate({ payload }) {
  try {
    const requestConfig = {
      method: "GET",
      endpoint: `${api.ACCOUNT_SCHEDULE}/${payload.branchId}/${payload.userId}`,
    };
    const result = yield call(sendRequest, requestConfig);
    const sortedWeeklyData = result.data.accountSchedules.sort(
      (a, b) => a.weekday - b.weekday,
    );
    const data = sortedWeeklyData.shift();
    sortedWeeklyData.push(data);
    yield put({
      type: types.WEEKLY_SCHEDULE_TEMPLATE_SUCCESS,
      payload: {
        ...result.data,
        accountSchedules: sortedWeeklyData,
      },
    });
  } catch (err) {
    handleRequestFail(err, types.WEEKLY_SCHEDULE_TEMPLATE_REQUEST, {
      payload,
    });
  }
}

function* addAccountSchedule({ payload, callback }) {
  try {
    const requestConfig = {
      method: "POST",
      endpoint: `${api.ACCOUNT_SCHEDULE}`,
      data: payload,
    };
    const { data } = yield call(sendRequest, requestConfig);
    yield put({
      type: types.ADD_ACCOUNT_SCHEDULE_SUCCESS,
      payload: { weekday: payload.weekday, data },
    });

    if (callback) {
      callback();
    }
  } catch (err) {
    handleRequestFail(err, types.ADD_ACCOUNT_SCHEDULE_REQUEST, {
      payload,
      callback,
    });
  }
}

function* updateAccountSchedule({ payload, callback }) {
  try {
    const requestConfig = {
      method: "PUT",
      endpoint: `${api.ACCOUNT_SCHEDULE}/${payload.id}`,
      data: payload.body,
    };
    const { data } = yield call(sendRequest, requestConfig);
    yield put({
      type: types.UPDAT_ACCOUNT_SCHEDULE_SUCCESS,
      payload: { weekday: payload.body.weekday, data },
    });
    if (callback) {
      callback();
    }
  } catch (err) {
    handleRequestFail(err, types.UPDAT_ACCOUNT_SCHEDULE, {
      payload,
      callback,
    });
  }
}

function* deleteAccountSchedule({ payload, callback }) {
  try {
    const requestConfig = {
      method: "DELETE",
      endpoint: `${api.ACCOUNT_SCHEDULE}/${payload.id}`,
    };
    yield call(sendRequest, requestConfig);
    yield put({
      type: types.DELETE_ACCOUNT_SCHEDULE_SUCCESS,
      payload,
    });
    if (callback) {
      callback();
    }
  } catch (err) {
    handleRequestFail(err, types.DELETE_ACCOUNT_SCHEDULE, {
      payload,
      callback,
    });
  }
}

function* getBranchSpecializations({ payload }) {
  try {
    const requestConfig = {
      method: "GET",
      endpoint: `${api.SPECIALIZATIONS}/GetEligbleSpecializations?branchId=${payload.branchId}&accountId=${payload.accountId}`,
    };
    const { data } = yield call(sendRequest, requestConfig);
    yield put({
      type: types.BRANCH_SPECIALIZATIONS_SUCCESS,
      payload: data,
    });
  } catch (err) {
    handleRequestFail(err, types.BRANCH_SPECIALIZATIONS_REQUEST, {
      payload,
    });
  }
}

function* getCustomDaySchedule({ payload }) {
  try {
    const requestConfig = {
      method: "GET",
      endpoint: `${api.CUSTOMDAYSCHEDULE}/${payload.branchId}/${payload.accountId}`,
    };
    const { data } = yield call(sendRequest, requestConfig);
    yield put({
      type: types.CUSTOM_DAY_SCHEDULE_SUCCESS,
      payload: data,
    });
  } catch (err) {
    handleRequestFail(err, types.CUSTOM_DAY_SCHEDULE_REQUEST, {
      payload,
    });
  }
}

function* addCustomDaySchedule({ payload, callback }) {
  try {
    const requestConfig = {
      method: "POST",
      endpoint: `${api.CUSTOMDAYSCHEDULE}`,
      data: payload,
    };
    const { data } = yield call(sendRequest, requestConfig);
    const repeatedDays = [];
    const filteredData = payload.customDays.map((customDay) => {
      const succeeded = data.succeeded.find(
        ({ date }) =>
          moment(date, "YYYY-MM-DD").format("YYYY-MM-DD") ===
          moment(customDay.date, "YYYY-MM-DD").format("YYYY-MM-DD"),
      );
      const failed = data.failed.find(
        ({ key }) =>
          moment(key, "YYYY-MM-DD").format("YYYY-MM-DD") ===
          moment(customDay.date, "YYYY-MM-DD").format("YYYY-MM-DD"),
      );

      if (failed) {
        if (
          succeeded &&
          repeatedDays.includes(
            moment(customDay.date, "YYYY-MM-DD").format("YYYY-MM-DD"),
          )
        ) {
          return {
            ...customDay,
            error: true,
            msg: failed.value,
          };
        }

        repeatedDays.push(
          moment(customDay.date, "YYYY-MM-DD").format("YYYY-MM-DD"),
        );
        return {
          ...succeeded,
          error: false,
          msg: true,
        };
      }

      return {
        ...succeeded,
        error: false,
        msg: null,
      };
    });

    yield put({
      type: types.ADD_CUSTOM_DAY_SCHEDULE_SUCCESS,
      payload: filteredData,
    });
    if (callback) {
      callback();
    }
  } catch (err) {
    handleRequestFail(err, types.ADD_CUSTOM_DAY_SCHEDULE_REQUEST, {
      payload,
      callback,
    });
  }
}

function* deleteCustomDayPattern({ payload, callback }) {
  try {
    const requestConfig = {
      method: "DELETE",
      endpoint: `${api.CUSTOMDAYSCHEDULE}/${payload.id}`,
    };
    yield call(sendRequest, requestConfig);
    yield put({
      type: types.DELETE_CUSTOM_DAY_SCHEDULE_PATTERN_SUCCESS,
      payload,
    });

    if (callback) {
      callback();
    }
  } catch (err) {
    handleRequestFail(err, types.DELETE_CUSTOM_DAY_SCHEDULE_PATTERN, {
      payload,
      callback,
    });
  }
}

export default function* watcher() {
  yield takeLatest(types.COMPANY_STAFF_REQUEST, getCompanyStaff);
  yield takeLatest(types.COMPANY_INVITATIONS_REQUEST, getCompanyInvitations);
  yield takeLatest(types.INVITE_USER_TO_COMPANY, inviteUser);
  yield takeLatest(types.UPDATE_COMPANY_USER, updateCompanyUser);
  yield takeLatest(types.UPDATE_COMPANY_INVITED_USER, updateCompanyInvitedUser);
  yield takeLatest(types.REINVITE_USER_REQUEST, reInviteUser);
  yield takeLatest(types.DELETE_STAFF_MEMBER_REQUEST, deleteStaffMember);
  yield takeLatest(types.DELETE_INVITED_MEMBER_REQUEST, deleteInvitedMember);
  yield takeLatest(types.STAFF_MEMBER_REQUEST, getStaffMemberData);
  yield takeLatest(types.CUSTOM_DAY_SCHEDULE_REQUEST, getCustomDaySchedule);
  yield takeLatest(types.ADD_CUSTOM_DAY_SCHEDULE_REQUEST, addCustomDaySchedule);
  yield takeLatest(
    types.ACCOUNT_SPECIALIZATIONS_REQUEST,
    getSpecializationsList,
  );

  yield takeEvery(
    types.ADD_MEMBER_SPECIALIZATIONS_REQUEST,
    addMemberSpecializations,
  );
  yield takeEvery(
    types.EDIT_MEMBER_SPECIALIZATIONS_REQUEST,
    editMemberSpecializations,
  );
  yield takeEvery(
    types.DELETE_MEMBER_SPECIALIZATIONS_REQUEST,
    deleteMemberSpecializations,
  );
  yield takeLatest(types.CUSTOM_SCHEDULE_TEMPLATE, getCustomScheduleTemplate);
  yield takeLatest(
    types.ADD_CUSTOM_SCHEDULE_REQUEST,
    addCustomScheduleTemplate,
  );
  yield takeLatest(
    types.TOGGLE_CUSTOM_SCHEDULE_ACTIVITY,
    toggleCustomScheduleActivity,
  );
  yield takeLatest(
    types.WEEKLY_SCHEDULE_TEMPLATE_REQUEST,
    getWeeklyScheduleTemplate,
  );
  yield takeLatest(types.ADD_ACCOUNT_SCHEDULE_REQUEST, addAccountSchedule);
  yield takeLatest(types.UPDAT_ACCOUNT_SCHEDULE, updateAccountSchedule);
  yield takeLatest(types.DELETE_ACCOUNT_SCHEDULE, deleteAccountSchedule);
  yield takeLatest(
    types.BRANCH_SPECIALIZATIONS_REQUEST,
    getBranchSpecializations,
  );
  yield takeLatest(
    types.DELETE_CUSTOM_DAY_SCHEDULE_PATTERN,
    deleteCustomDayPattern,
  );
}
