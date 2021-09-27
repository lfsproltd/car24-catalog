import { GET_ESTIMATE_LIST } from "../../types";

const initialState = {
  estimateList: [],
};

const estimateReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ESTIMATE_LIST:
      return {
        ...state,
        estimateList: action.payload,
      };
    default:
      return {
        ...state,
      };
  }
};

export default estimateReducer;
