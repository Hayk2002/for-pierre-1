import * as types from "./constants";

export const addTemplate = (payload, callback) => ({
  type: types.ADD_TEMPLATE_REQUEST,
  payload,
  callback,
});

export const getTemplate = (payload, callback) => ({
  type: types.GET_TEMPLATE_DATA_REQUEST,
  payload,
  callback,
});

export const editTemplate = (payload, callback) => ({
  type: types.EDIT_TEMPLATE_REQUEST,
  payload,
  callback,
});

export const deleteTemplate = (payload, callback) => ({
  type: types.DELETE_TEMPLATE_REQUEST,
  payload,
  callback,
});

export const accountScheduleListRequest = (payload) => ({
  type: types.SCHEDULE_LIST_REQUEST,
  payload,
});

export const resetScheduleList = () => ({
  type: types.RESET_SCHEDULE_LIST,
});
