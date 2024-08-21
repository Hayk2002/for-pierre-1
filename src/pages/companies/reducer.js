import * as types from "./constants";

const initialState = {
  timezones: [],
  selectedCompany: null,
  selectedBranch: {},
  companiesList: [],
  invitationsList: [],
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case types.GET_COMPANIES_SUCCESS:
      return {
        ...state,
        companiesList: payload.companies,
        invitationsList: payload.invitations,
      };
    case types.CREATE_COMPANY_SUCCESS:
      return {
        ...state,
        companiesList: [...state.companiesList, { ...payload }],
      };
    case types.GET_TIMEZONES_SUCCESS:
      return { ...state, timezones: payload };
    case types.SET_SELECTED_COMPANY_SUCCESS:
      return { ...state, selectedCompany: payload };
    case types.SET_SELECTED_BRANCH_SUCCESS:
      return { ...state, selectedBranch: payload };
    case types.REMOVE_SELECTED_COMPANY:
      return { ...state, selectedCompany: null };
    case types.EDIT_COMPANY_SUCCESS:
      return { ...state, companiesList: payload };
    case types.REMOVE_COMPANY_IMAGE_SUCCESS:
      return {
        ...state,
        selectedCompany: { ...state.selectedCompany, photoUrl: null },
      };
    default:
      return state;
  }
};
