import * as types from "./constants";

const initialState = {
  isFetching: false,
  error: null,
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case types.SHOW_LOADER:
      return { ...state, isFetching: true };
    case types.HIDE_LOADER:
      return { ...state, isFetching: false };
    case types.SHOW_ERROR:
      return { ...state, error: { ...payload } };
    case types.HIDE_ERROR:
      return { ...state, error: null };
    default:
      return state;
  }
};
