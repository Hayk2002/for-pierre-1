import * as types from "./constants";

const initialState = {
  specializations: [],
  branches: [],
  timeBlocks: [],
  templates: [],
  blockTypes: [],
  serviceProvider: null,
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case types.GET_BRANCHES_SUCCESS:
      return {
        ...state,
        branches: payload,
      };
    case types.CREATE_BRANCH_SUCCESS:
      return { ...state, branches: [...state.branches, { ...payload }] };
    case types.DELETE_BRANCH_SUCCESS:
      return {
        ...state,
        branches: state.branches.filter(({ id }) => id !== payload.id),
      };
    case types.GET_SPECIALIZATIONS_SUCCESS:
      return {
        ...state,
        specializations: payload,
      };
    case types.RESET_SPECIALIZATIONS_LIST:
      return {
        ...state,
        specializations: [],
      };
    case types.TIME_BLOCKS_SUCCESS:
      return {
        ...state,
        timeBlocks: payload,
      };
    case types.TEMPLATES_LIST_SUCCESS:
      return {
        ...state,
        templates: payload,
      };
    case types.GET_BLOCK_TYPES_LIST_SUCCESS:
      return {
        ...state,
        blockTypes: payload,
      };
    case types.SET_SERVICE_PROVIDER:
      return {
        ...state,
        serviceProvider: payload,
      };
    case types.DELETE_TEMPLATE_SUCCESS:
      return {
        ...state,
        templates: state.templates.filter(({ id }) => id !== payload.id),
      };
    default:
      return state;
  }
};
