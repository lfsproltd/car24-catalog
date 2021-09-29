import { SET_LANGUAGE } from "../../types";

const initialState = {
  currentLanguage: "eng",
};

const languageReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_LANGUAGE:
      return {
        ...state,
        currentLanguage: action.payload,
      };
    default:
      return {
        ...state,
      };
  }
};

export default languageReducer;
