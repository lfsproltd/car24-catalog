import {
  GET_ESTIMATE_LIST_DETAIL,
  GET_MASTER_DATA_CHECKPOINTS,
  SET_ESTIMATE_FORM_DATA,
} from "../../types";

const initialState = {
  estimateDetails: [],
  masterData: {},
};

const estimateDetailsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ESTIMATE_LIST_DETAIL:
      return {
        ...state,
        estimateDetails: action.payload,
      };
    case GET_MASTER_DATA_CHECKPOINTS:
      return {
        ...state,
        masterData: action.payload,
      };
    case SET_ESTIMATE_FORM_DATA:
      return {
        ...state,
        [action.payload.key]: action.payload.data,
      };
    default:
      return {
        ...state,
      };
  }
};

export default estimateDetailsReducer;
