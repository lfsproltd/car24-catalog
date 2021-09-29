import { SET_LANGUAGE } from "../../types";

export const SetLanguage = (event) => async (dispatch) => {
  dispatch({ type: SET_LANGUAGE, payload: event.target.value });
};
