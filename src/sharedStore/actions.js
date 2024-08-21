import * as types from "./constants";

export const getBranchesList = (callback) => ({
  type: types.GET_BRANCHES_REQUEST,
  callback,
});

export const createBranch = (payload, callback) => ({
  type: types.CREATE_BRANCH_REQUEST,
  payload,
  callback,
});

export const editBranch = (payload, callback) => ({
  type: types.EDIT_BRANCH_REQUEST,
  payload,
  callback,
});

export const deleteBranch = (id, callback) => ({
  type: types.DELETE_BRANCH_REQUEST,
  id,
  callback,
});

export const getSpecializationList = (payload, callback) => ({
  type: types.GET_SPECIALIZATIONS_REQUEST,
  payload,
  callback,
});

export const resetSpecializationsList = () => ({
  type: types.RESET_SPECIALIZATIONS_LIST,
});

export const getTimeBlocksList = () => ({
  type: types.TIME_BLOCKS_REQUEST,
});

export const getTemplates = (payload) => ({
  type: types.TEMPLATES_LIST_REQUEST,
  payload,
});

export const getBlockTypesList = () => ({
  type: types.GET_BLOCK_TYPES_LIST,
});

export const setServiceProvider = (payload) => ({
  type: types.SET_SERVICE_PROVIDER,
  payload,
});

export const getAccountBranches = (payload, callback) => ({
  type: types.ACCOUNT_BRANCHES_REQUEST,
  payload,
  callback,
});
