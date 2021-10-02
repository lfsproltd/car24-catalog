import axiosCall from "../../../inits/axios";
import { config } from "./../../../utils/constants/api.constants";
import { GET_ESTIMATE_LIST, GET_ESTIMATE_LIST_COUNT } from "../../types";

export const GetEstimatesList =
  (params = {}, locations, lang) =>
  async (dispatch) => {
    let url =
      config.api.workshop.host +
      config.api.workshop.inspection +
      "/" +
      config.api.workshop.estimates +
      "&locationCode=" +
      locations +
      `${
        params.hasOwnProperty("page") && params.hasOwnProperty("size")
          ? "&offset=" + +params.page * +params.size + "&limit=" + params.size
          : ""
      }&lang=${lang}`;
    axiosCall({ url, dispatch, method: "get", type: GET_ESTIMATE_LIST }).then(
      () => {
        if (params.callCount) {
          GetEstimatesListCount("", locations)(dispatch);
        }
      }
    );
  };

export const SearchAppointment =
  (searchValue, lang, locations) => async (dispatch) => {
    let url =
      config.api.workshop.host +
      config.api.workshop.inspection +
      "/" +
      config.api.workshop.estimates +
      "&appointmentIdRegex=" +
      encodeURIComponent(searchValue) +
      `&lang=${lang}`;
    axiosCall({ url, dispatch, method: "get", type: GET_ESTIMATE_LIST }).then(
      () => {
        GetEstimatesListCount(searchValue, locations)(dispatch);
      }
    );
  };

export const GetEstimatesListCount =
  (searchValue = "", locations = "") =>
  async (dispatch) => {
    let url =
      config.api.workshop.host +
      config.api.workshop.inspection +
      config.api.workshop.count +
      `${
        "?inspectionType=CATALOG&inspectionStatus=DONE,REJECTED&locationCode=" +
        locations
      }` +
      `${
        searchValue !== "%" && searchValue !== ""
          ? "&appointmentIdRegex=" + encodeURIComponent(searchValue)
          : ""
      }`;
    axiosCall({ url, dispatch, method: "get", type: GET_ESTIMATE_LIST_COUNT });
    // dispatch({ type: GET_WORKSHOP_QA_LISTING_COUNT, payload: data.data });
  };
