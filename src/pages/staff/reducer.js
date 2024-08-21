import * as types from "./constants";

const initialState = {
  staffList: [],
  invitations: [],
  staffMember: {},
  staffMemberBranches: [],
  staffMemberSpecializations: [],
  branchSpecializations: [],
  customScheduleTemplate: {},
  weeklyScheduleTemplate: [],
  customDayScheduleTemplate: [],
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case types.COMPANY_STAFF_SUCCESS:
      return {
        ...initialState,
        invitations: state.invitations,
        staffList: payload,
      };

    case types.DELETE_STAFF_MEMBER_SUCCESS:
      return {
        ...state,
        staffList: state.staffList.filter((item) => item.id !== payload.id),
      };
    case types.DELETE_INVITED_MEMBER_SUCCESS:
      return {
        ...state,
        invitations: state.invitations.filter((item) => item.id !== payload.id),
      };
    case types.STAFF_MEMBER_SUCCESS:
      return {
        ...state,
        staffMember: payload,
      };
    case types.ACCOUNT_BRANCHES_SUCCESS:
      return {
        ...state,
        staffMemberBranches: payload,
      };
    case types.ACCOUNT_SPECIALIZATIONS_SUCCESS:
      return {
        ...state,
        staffMemberSpecializations: payload,
      };
    case types.ADD_MEMBER_SPECIALIZATIONS_SUCCESS:
      return {
        ...state,
        staffMemberSpecializations: [
          ...state.staffMemberSpecializations,
          { ...payload },
        ],
        staffMemberBranches: state.staffMemberBranches.filter(
          ({ branchId }) => branchId !== payload.branchId,
        ),
      };
    case types.DELETE_MEMBER_SPECIALIZATIONS_SUCCESS:
      return {
        ...state,
        staffMemberSpecializations: state.staffMemberSpecializations.filter(
          ({ branchId }) => branchId !== payload.branchId,
        ),
        staffMemberBranches: [
          { branchId: payload.branchId, branchName: payload.branchName },
          ...state.staffMemberBranches,
        ],
      };
    case types.CUSTOM_SCHEDULE_TEMPLATE_SUCCESS:
    case types.ADD_CUSTOM_SCHEDULE_SUCCESS:
      return {
        ...state,
        customScheduleTemplate: payload,
      };
    case types.WEEKLY_SCHEDULE_TEMPLATE_SUCCESS:
      return {
        ...state,
        weeklyScheduleTemplate: payload.accountSchedules,
        customDayScheduleTemplate: payload.customDaySchedules,
      };
    case types.ADD_ACCOUNT_SCHEDULE_SUCCESS:
    case types.UPDAT_ACCOUNT_SCHEDULE_SUCCESS:
      return {
        ...state,
        weeklyScheduleTemplate: state.weeklyScheduleTemplate.map((item) => {
          if (item.weekday === payload.weekday) {
            return {
              ...payload.data,
            };
          }
          return item;
        }),
      };
    case types.DELETE_ACCOUNT_SCHEDULE_SUCCESS:
      return {
        ...state,
        weeklyScheduleTemplate: state.weeklyScheduleTemplate.map((item) => {
          if (item.weekday === payload.weekday) {
            return {
              ...item,
              scheduleTemplateId: payload.scheduleTemplateId,
              accountScheduleBlockTimes: [],
            };
          }
          return item;
        }),
      };
    case types.TOGGLE_CUSTOM_SCHEDULE_ACTIVITY_SUCCESS:
      return {
        ...state,
        customScheduleTemplate: {
          ...state.customScheduleTemplate,
          isActive: payload,
        },
      };
    case types.COMPANY_INVITATIONS_SUCCESS:
      return {
        ...state,
        invitations: payload,
      };
    case types.INVITE_USER_TO_COMPANY_SUCCESS:
      return {
        ...state,
        invitations: [...state.invitations, payload],
      };
    case types.UPDATE_COMPANY_USER_SUCCESS:
      return {
        ...state,
        staffList: state.staffList.map((member) => {
          if (member.id === payload.id) {
            return {
              ...member,
              accountTypeId: payload.accountTypeId,
              accountTypeName: payload.accountTypeName,
            };
          }
          return member;
        }),
      };
    case types.UPDATE_COMPANY_INVITED_USER_SUCCESS:
      return {
        ...state,
        invitations: state.invitations.map((member) => {
          if (member.id === payload.id) {
            return {
              ...member,
              email: payload.email,
              accountTypeId: payload.accountTypeId,
              accountTypeName: payload.accountTypeName,
            };
          }
          return member;
        }),
      };
    case types.REINVITE_USER_SUCCESS:
      return {
        ...state,
        invitations: state.invitations.map((member) => {
          if (member.email === payload.email) {
            return {
              ...member,
              status: payload.status,
            };
          }

          return member;
        }),
      };
    case types.BRANCH_SPECIALIZATIONS_SUCCESS:
      return {
        ...state,
        branchSpecializations: payload,
      };
    case types.CUSTOM_DAY_SCHEDULE_SUCCESS:
      return {
        ...state,
        customDayScheduleTemplate: payload,
      };
    case types.ADD_CUSTOM_DAY_SCHEDULE_SUCCESS:
      return {
        ...state,
        customDayScheduleTemplate: payload,
      };
    default:
      return state;
  }
};
