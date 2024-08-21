import * as types from "./constants";

const initialState = {
  userInfo: {},
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case types.SET_USER_DATA:
      return { ...state, userInfo: payload };
    case types.REMOVE_IMAGE_SUCCESS:
      return { ...state, userInfo: { ...state.userInfo, photoUrl: null } };
    default:
      return state;
  }
};
