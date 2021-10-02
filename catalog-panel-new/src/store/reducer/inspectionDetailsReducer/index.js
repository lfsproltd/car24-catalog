import {
  GET_INSPECTION_DETAIL,
  GET_MASTER_DATA_CHECKPOINTS,
} from "../../types";

const initialState = {
  inspectionDetails: [],
  masterData: {},
  isProcessing: true,
};

const inspectionDetailsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_INSPECTION_DETAIL:
      return {
        ...state,
        inspectionDetails: action.payload,
      };
    case GET_MASTER_DATA_CHECKPOINTS:
      return {
        ...state,
        masterData: action.payload,
      }
    default:
      return {
        ...state,
      };
  }
};

export default inspectionDetailsReducer;
