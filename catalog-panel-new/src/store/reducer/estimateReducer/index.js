import { GET_ESTIMATE_LIST, GET_ESTIMATE_LIST_COUNT } from "../../types";

const initialState = {
  estimateList: [],
  totalEstimateListCount: 1,
};

const estimateReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ESTIMATE_LIST:
      return {
        ...state,
        estimateList: action.payload,
      };
    case GET_ESTIMATE_LIST_COUNT:
      return {
        ...state,
        totalEstimateListCount: action.payload,
      };
    default:
      return {
        ...state,
      };
  }
};

export default estimateReducer;
