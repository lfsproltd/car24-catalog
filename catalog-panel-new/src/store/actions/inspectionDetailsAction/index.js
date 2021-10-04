import axiosCall from "../../../inits/axios";
import { config } from "./../../../utils/constants/api.constants";
import {
  GET_INSPECTION_LIST_DETAIL,
  GET_INSPECTION_CATALOG_SUMMARY,
  GET_INSPECTION_CATALOG_MASTER,
} from "../../types";
import { convertObjectToParams } from "../../../utils/utils";

export const GetInspectionListDetail =
  (appointmentId, inspectionType, version, selectedLang) => (dispatch) => {
    const url =
      config.api.workshop.host +
      config.api.workshop.inspection +
      "/?appointmentId="+appointmentId+"&inspectionType="+inspectionType+"&version="+version+"&lang=" +selectedLang;

    axiosCall({
      url,
      dispatch,
      method: "get",
      type: GET_INSPECTION_LIST_DETAIL,
    });
  };

export const GetInspectionCatalogSummary =
  (appointmentId, version, selectedLang) => (dispatch) => {
    const url =
      config.api.workshop.host +
      config.api.workshop.catalog +
      config.api.workshop.summary +
        "/?appointmentId="+appointmentId+"&version="+version+"&lang=" +selectedLang;
    axiosCall({
      url,
      dispatch,
      method: "get",
      type: GET_INSPECTION_CATALOG_SUMMARY,
    });
  };

export const GetInspectionCatalogMaster = (selectedLang) => (dispatch) => {
  const url =
    config.api.workshop.host +
    config.api.workshop.catalog +
    config.api.workshop.master +
    "/" +
    convertObjectToParams({ lang: selectedLang });
  axiosCall({
    url,
    dispatch,
    method: "get",
    type: GET_INSPECTION_CATALOG_MASTER,
  });
};
