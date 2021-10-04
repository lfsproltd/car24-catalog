import axiosCall from "../../../inits/axios";
import { config } from "./../../../utils/constants/api.constants";
import {
  GET_ESTIMATE_LIST_DETAIL,
  GET_MASTER_DATA_CHECKPOINTS,
  SET_ESTIMATE_FORM_DATA,
  SAVE_ESTIMATES,
} from "../../types";
import { convertObjectToParams } from "../../../utils/utils";

export const SaveEstimates =
  (dataToSend, appointmentId, selectedLang) => (dispatch) => {
    let url =
      config.api.workshop.host +
      config.api.workshop.inspection +
      "/" +
      appointmentId;

    axiosCall({
      url,
      dispatch,
      method: "post",
      type: SAVE_ESTIMATES,
      dataToSend,
    });
  };

export const GetEstimateDetails =
  (params = {}, selectedLang) =>
  (dispatch) => {
    let url =
      config.api.workshop.host +
      config.api.workshop.inspection +
      "/" +
      convertObjectToParams(params) +
      "&lang=" +
      selectedLang;

    axiosCall({
      url,
      dispatch,
      method: "get",
      type: GET_ESTIMATE_LIST_DETAIL,
    }).then((data) => {
      const { data: apiRes } = data;
      const { schemaVersion = "" } = apiRes?.[0] || {};
      GetMasterDataQaImageKeys(schemaVersion, selectedLang)(dispatch);
    });
  };

export const GetMasterDataQaImageKeys =
  (version, selectedLang) => async (dispatch) => {
    let url =
      config.api.workshop.host +
      config.api.workshop.catalog +
      config.api.workshop.master +
      "?schemaVersion=" +
      version +
      "&lang=" +
      selectedLang;
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
