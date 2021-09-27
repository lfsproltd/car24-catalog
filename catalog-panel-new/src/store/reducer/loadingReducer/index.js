import { LOADING } from "../../types";

const initialState = {};

const loadingReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOADING:
      return {
        loading: action.payload,
      };
    default:
      return {
        ...state,
      };
  }
};

export default loadingReducer;
