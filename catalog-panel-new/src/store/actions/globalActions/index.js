import { LOADING, SET_LANGUAGE, SET_ERROR_ALERT } from "../../types";

export const setLoading = ({ dispatch, data }) => {
  dispatch({ type: LOADING, payload: data });
};

export const SetLanguage = (event) => async (dispatch) => {
  dispatch({ type: SET_LANGUAGE, payload: event.target.value });
};

export const SetErrorAlert = (payload) => async (dispatch) => {
  dispatch({ type: SET_ERROR_ALERT, payload });
};
