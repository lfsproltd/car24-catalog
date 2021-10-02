import axiosCall from "../../../inits/axios";
import { config } from "./../../../utils/constants/api.constants";
import {
    GET_MASTER_DATA_CHECKPOINTS,
    GET_INSPECTION_DETAIL, GET_INSPECTION_LIST,
} from "../../types";
import { convertObjectToParams } from "../../../utils/utils";


export const GetInspectionList =
    (params = {}, locations, query, lang) =>
        async (dispatch) => {
            let url =
                config.api.workshop.host +
                config.api.workshop.inspection +
                "/" +
                query +
                "&locationCode=" +
                locations +
                `${
                    params && params.page && params.size
                        ? "&offset=" + +params.page * +params.size + "&limit=" + params.size
                        : ""
                }&lang=${lang}`;
            axiosCall({ url, dispatch, method: "get", type: GET_INSPECTION_LIST });
        };

export const GetInspectionDetails =
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
      type: GET_INSPECTION_DETAIL,
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
