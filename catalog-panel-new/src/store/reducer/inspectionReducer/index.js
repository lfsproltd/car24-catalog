import { GET_INSPECTION_LIST } from "../../types";

const initialState = {
  inspectionList: [],
};

const inspectionReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_INSPECTION_LIST:
      return {
        ...state,
        inspectionList: action.payload,
      };
    default:
      return state;
  }
};

export default inspectionReducer;
