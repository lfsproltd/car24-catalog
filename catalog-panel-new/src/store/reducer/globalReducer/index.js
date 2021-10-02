import { LOADING, SET_LANGUAGE, SET_ERROR_ALERT } from "../../types";

const initialState = () => ({
  loading: false,
  currentLanguage: localStorage.getItem("currentLanguage") || "en",
  errorMessage: "",
});

const globalReducer = (state = initialState(), action) => {
  switch (action.type) {
    case LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    case SET_ERROR_ALERT:
      return {
        ...state,
        errorMessage: action.payload,
      };
    case SET_LANGUAGE: {
      localStorage.setItem("currentLanguage", action.payload);
      return {
        ...state,
        currentLanguage: action.payload,
      };
    }
    default:
      return {
        ...state,
      };
  }
};

export default globalReducer;
