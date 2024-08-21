import * as types from "./constants";
import { RESET_ADVANCED_SEARCH_VALUES } from "./constants";

export const getUserAppointments = (payload, isServiceProvider, callback) => ({
  type: types.USER_APPOINTMENT_LIST_REQUEST,
  payload,
  isServiceProvider,
  callback,
});

export const getResourceAppointments = (payload, callback) => ({
  type: types.RESOURCE_APPOINTMENT_LIST_REQUEST,
  payload,
  callback,
});

export const getAppointmentTimeSlots = (payload, callback) => ({
  type: types.TIME_SLOTS_REQUEST,
  payload,
  callback,
});

export const addAppointmentRequest = (payload, callback) => ({
  type: types.ADD_USER_APPOINTMENT_REQUEST,
  payload,
  callback
});

export const addStepRequest = (payload, callback) => ({
  type: types.ADD_STEP_REQUEST,
  payload,
  callback
});

export const deleteAppointment = (payload, callback) => ({
  type: types.DELETE_APPOINTMENT_REQUEST,
  payload,
  callback,
});

export const deleteAppoinmentSuccess = (payload) => ({
  type: types.DELETE_USER_APPOINTMENT_SUCCESS,
  payload,
});

export const signalRConnectionClose = () => ({
  type: types.APPOINTMENT_LIST_SIGNALR_CLOSE,
});

export const updateUserDetails = (payload) => ({
  type: types.UPDATE_USER_DETAILS_REQUEST,
  payload,
});

export const updateStep = (payload) => ({
  type: types.UPDATE_APPOINTMENT_STEP_REQUEST,
  payload,
});

export const updateBlocker = (payload, callback) => ({
  type: types.UPDATE_TIME_BLOCKER_REQUEST,
  payload,
  callback,
});

export const deleteTimeBlocker = (payload, callback) => ({
  type: types.DELETE_TIME_BLOCKER_REQUEST,
  payload,
  callback,
});

export const getAppointmentById = (id, callback) => ({
  type: types.APPOINTMENT_BY_ID_REQUEST,
  payload: { id },
  callback,
});

export const addBlockTime = (payload, callback) => ({
  type: types.ADD_BLOCK_TIME_REQUEST,
  payload,
  callback,
});

export const getPrintData = (payload, callback) => ({
  type: types.CALENDAR_PRINT_DATA_REQUEST,
  payload,
  callback,
});

export const getProvidersSuggestionsList = (payload) => ({
  type: types.GET_PROVIDERS_SUGGESTIONS_LIST,
  payload,
});

export const triggerAdvancedSearch = (payload, callback) => ({
  type: types.SEARCH_USER_APPOINTMENTS,
  payload,
  callback,
});

export const filterUserAppointments = (payload) => ({
  type: types.FILTER_USER_APPOINTMENTS,
  payload,
});

export const resetAdvancedSearchValues = () => ({
  type: types.RESET_ADVANCED_SEARCH_VALUES,
});

export const resetUserAppointmentsList = () => ({
  type: types.RESET_USER_APPOINTMENTS_LIST,
});
