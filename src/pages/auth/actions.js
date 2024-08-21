import * as types from "./constants";

export const loginUser = (payload, callback) => ({
  type: types.LOGIN_REQUEST,
  payload,
  callback,
});

export const registerUser = (payload, callback) => ({
  type: types.REGISTER_REQUEST,
  payload,
  callback,
});

export const forgotPassword = (payload, callback) => ({
  type: types.FORGOT_PASS_REQUEST,
  payload,
  callback,
});

export const resendEmail = (payload, callback) => ({
  type: types.RESEND_EMAIL_REQUEST,
  payload,
  callback,
});

export const resetPassword = (payload, callback) => ({
  type: types.RESET_PASS_REQUEST,
  payload,
  callback,
});

export const verifyRegistration = (payload, callback) => ({
  type: types.VERIFY_REGISTRATION_REQUEST,
  payload,
  callback,
});

export const completeProfile = (payload, callback) => ({
  type: types.COMPLETE_PROFILE_REQUEST,
  payload,
  callback,
});

export const editUserProfile = (payload, callback) => ({
  type: types.EDIT_PROFILE_REQUEST,
  payload,
  callback,
});

export const removeProfileImage = () => ({
  type: types.REMOVE_IMAGE_REQUEST,
});

export const setUserDataObject = (payload) => ({
  type: types.SET_USER_DATA,
  payload,
});

export const changeProfilePassword = (payload, callback) => ({
  type: types.CHANGE_PASSWORD_REQUEST,
  payload,
  callback,
});

export const logoutUser = (callback) => ({
  type: types.LOGOUT_REQUEST,
  callback,
});
