import { LOADING } from "../../types";

export const setLoading = ({dispatch, data}) => {
  dispatch({ type: LOADING, payload: data });
};
