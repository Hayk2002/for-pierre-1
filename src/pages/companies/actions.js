import * as types from "./constants";

export const getCompaniesList = () => ({
  type: types.GET_COMPANIES_REQUEST,
});

export const getCompanyProfile = (id) => ({
  type: types.GET_COMPANY_PROFILE_REQUEST,
  id,
});

export const setSelectedCompany = (payload) => ({
  type: types.SET_SELECTED_COMPANY_SUCCESS,
  payload,
});

export const setSelectedBranch = (payload) => ({
  type: types.SET_SELECTED_BRANCH_SUCCESS,
  payload,
});

export const removeSelectedCompany = () => ({
  type: types.REMOVE_SELECTED_COMPANY,
});

export const createCompany = (payload, callback) => ({
  type: types.CREATE_COMPANY_REQUEST,
  payload,
  callback,
});

export const getTimezonesList = (payload) => ({
  type: types.GET_TIMEZONES_REQUEST,
  payload,
});

export const changeInvitation = (payload) => ({
  type: types.CHANGE_INVITATION_REQUEST,
  payload,
});

export const editCompany = (payload, callback) => ({
  type: types.EDIT_COMPANY_REQUEST,
  payload,
  callback,
});

export const removeCompanyImage = () => ({
  type: types.REMOVE_COMPANY_IMAGE_REQUEST,
});

export const resubmitCompany = (id, callback) => ({
  type: types.RESUBMIT_COMPANY_REQUEST,
  id,
  callback,
});
