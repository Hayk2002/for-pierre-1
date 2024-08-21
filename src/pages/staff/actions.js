import * as types from "./constants";

export const getCompanyStaff = (callback) => ({
  type: types.COMPANY_STAFF_REQUEST,
  callback,
});

export const getCompanyInvitations = () => ({
  type: types.COMPANY_INVITATIONS_REQUEST,
});

export const inviteUserToCompany = (payload, callback) => ({
  type: types.INVITE_USER_TO_COMPANY,
  payload,
  callback,
});

export const updateCompanyUser = (payload, callback) => ({
  type: types.UPDATE_COMPANY_USER,
  payload,
  callback,
});

export const updateInvitedUser = (payload, callback) => ({
  type: types.UPDATE_COMPANY_INVITED_USER,
  payload,
  callback,
});

export const reInviteUser = (payload, callback) => ({
  type: types.REINVITE_USER_REQUEST,
  payload,
  callback,
});

export const deleteStaffMember = (payload, callback) => ({
  type: types.DELETE_STAFF_MEMBER_REQUEST,
  payload,
  callback,
});

export const deleteInvitedMember = (payload, callback) => ({
  type: types.DELETE_INVITED_MEMBER_REQUEST,
  payload,
  callback,
});

export const getStaffMemberData = (payload) => ({
  type: types.STAFF_MEMBER_REQUEST,
  payload,
});

export const getAccountSpecializations = (payload) => ({
  type: types.ACCOUNT_SPECIALIZATIONS_REQUEST,
  payload,
});

export const assignMemberSpecializations = (payload, callback) => ({
  type: types.ADD_MEMBER_SPECIALIZATIONS_REQUEST,
  payload,
  callback,
});

export const editMemberSpecializations = (payload, callback) => ({
  type: types.EDIT_MEMBER_SPECIALIZATIONS_REQUEST,
  payload,
  callback,
});

export const deleteMemberSpecializations = (payload) => ({
  type: types.DELETE_MEMBER_SPECIALIZATIONS_REQUEST,
  payload,
});

export const getCustomScheduleTemplate = (payload) => ({
  type: types.CUSTOM_SCHEDULE_TEMPLATE,
  payload,
});

export const getWeeklyScheduleTemplate = (payload) => ({
  type: types.WEEKLY_SCHEDULE_TEMPLATE_REQUEST,
  payload,
});

export const addCustomScheduleTemplate = (payload, callback) => ({
  type: types.ADD_CUSTOM_SCHEDULE_REQUEST,
  payload,
  callback,
});

export const toggleCustomScheduleActivity = (payload, callback) => ({
  type: types.TOGGLE_CUSTOM_SCHEDULE_ACTIVITY,
  payload,
  callback,
});

export const addAccountSchedule = (payload, callback) => ({
  type: types.ADD_ACCOUNT_SCHEDULE_REQUEST,
  payload,
  callback,
});

export const editAccountSchedule = (payload, callback) => ({
  type: types.UPDAT_ACCOUNT_SCHEDULE,
  payload,
  callback,
});

export const deleteAccountSchedule = (payload, callback) => ({
  type: types.DELETE_ACCOUNT_SCHEDULE,
  payload,
  callback,
});

export const getBranchSpecializations = (payload) => ({
  type: types.BRANCH_SPECIALIZATIONS_REQUEST,
  payload,
});

export const getCustomDaySchedule = (payload) => ({
  type: types.CUSTOM_DAY_SCHEDULE_REQUEST,
  payload,
});

export const addCustomDaySchedule = (payload, callback) => ({
  type: types.ADD_CUSTOM_DAY_SCHEDULE_REQUEST,
  payload,
  callback,
});

export const deleteCustomDayPattern = (payload, callback) => ({
  type: types.DELETE_CUSTOM_DAY_SCHEDULE_PATTERN,
  payload,
  callback,
});
