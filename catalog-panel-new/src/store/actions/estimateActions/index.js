import axiosCall from "../../../inits/axios";
import { config } from "./../../../utils/constants/api.constants";
import { GET_ESTIMATE_LIST } from "../../types";

export const GetEstimatesList =
  (params = {}, locations) =>
  async (dispatch) => {
    let url =
      config.api.workshop.host +
      config.api.workshop.inspection +
      "/" +
      config.api.workshop.estimates +
      "&locationCode=" +
      locations +
      `${
        params && params.page && params.size
          ? "&offset=" + +params.page * +params.size + "&limit=" + params.size
          : ""
      }`;
    axiosCall({ url, dispatch, method: "get", type: GET_ESTIMATE_LIST });
  };
