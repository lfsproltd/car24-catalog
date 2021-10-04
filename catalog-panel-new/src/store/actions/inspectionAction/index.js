import axiosCall from "../../../inits/axios";
import { config } from "./../../../utils/constants/api.constants";
import { GET_INSPECTION_LIST } from "../../types";

export const GetInspectionList =
  (params = {}, locationCode, lang) =>
  async (dispatch) => {
    let url =
      config.api.workshop.host +
      config.api.workshop.inspection +
      "/?" +
      `${
        params && params.page && params.size
          ? "&offset=" + +params.page * +params.size + "&limit=" + params.size
          : "q"
      }&lang=${lang}&appointmentIdRegex=${params.searchedVal ?? ""}%25`;
    axiosCall({ url, dispatch, method: "get", type: GET_INSPECTION_LIST });
  };
