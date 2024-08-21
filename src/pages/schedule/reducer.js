import * as types from "./constants";

const initialState = {
  scheduleList: [],
  template: {},
  activeTab: null,
  templatesPagination: {},
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case types.SCHEDULE_LIST_SUCCESS:
      return {
        ...state,
        scheduleList: payload,
      };
    case types.GET_TEMPLATE_DATA_SUCCESS:
      return {
        ...state,
        template: payload,
      };
    case types.SET_ACTIVE_TAB:
      return {
        ...state,
        activeTab: payload,
      };
    case types.GET_TEMPLATE_PAGINATION:
      return { ...state, templatesPagination: payload };
    case types.RESET_SCHEDULE_LIST:
      return { ...state, scheduleList: [] };
    default:
      return state;
  }
};
