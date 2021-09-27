import axiosCall from "../../../inits/axios";
import { config } from "./../../../utils/constants/api.constants";
import {
  GET_ESTIMATE_LIST_DETAIL,
  GET_MASTER_DATA_CHECKPOINTS,
  SET_ESTIMATE_FORM_DATA,
} from "../../types";
import { convertObjectToParams } from "../../../utils/utils";

export const GetEstimateDetails =
  (params = {}) =>
  (dispatch) => {
    let url =
      config.api.workshop.host +
      config.api.workshop.inspection +
      "/" +
      convertObjectToParams(params);

    axiosCall({ url, dispatch, method: "get", type: GET_ESTIMATE_LIST_DETAIL });
  };

export const GetMasterDataQaImageKeys =
  (params = {}) =>
  async (dispatch) => {
    let url =
      config.api.workshop.host +
      config.api.workshop.catalog +
      config.api.workshop.master;
    axiosCall({
      url,
      dispatch,
      method: "get",
      type: GET_MASTER_DATA_CHECKPOINTS,
    });
  };

export const SetEstimateFormData =
  ({ key, data }) =>
  (dispatch) => {
    dispatch({ type: SET_ESTIMATE_FORM_DATA, payload: { key, data } });
  };
