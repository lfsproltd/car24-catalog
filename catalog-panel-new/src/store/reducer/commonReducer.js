import {
  ACTION_COMMON_START,
  ACTION_COMMON_END,
  SET_TOASTER_MESSAGE,
} from "../actions/commonAction/common.actiontype";

const initialState = {
  isProcessing: false,
  showToaster: false,
  toasterMessage: "",
  toasterType: "",
  statusCode: "",
};

const Common = (state = initialState, action) => {
  switch (action.type) {
    case ACTION_COMMON_START:
      return {
        ...state,
        isProcessing: true,
      };
    case ACTION_COMMON_END: {
      return {
        ...state,
        isProcessing: false,
      };
    }
    case SET_TOASTER_MESSAGE: {
      return {
        ...state,
        showToaster: action.payload.showToaster,
        toasterMessage: action.payload.toasterMessage,
        toasterType: action.payload.toasterType,
        statusCode: action.payload.statusCode,
      };
    }
    default:
      return state;
  }
};
export default Common;
