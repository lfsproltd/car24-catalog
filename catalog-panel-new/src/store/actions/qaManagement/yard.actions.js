import axiosCall from "../../../inits/axios";
import { config } from "./../../../utils/constants/api.constants";
import { GET_YARD_QA_LIST } from "../../types";

export const GetYardQaList =
  (params = {}, locations, lang) =>
  async (dispatch) => {
    let url =
      config.api.workshop.host +
      config.api.workshop.inspection +
      "/" +
      config.api.workshop.inspectionTypeYard +
      `${
        params && params.page && params.size
          ? "&offset=" + +params.page * +params.size + "&limit=" + params.size
          : ""
      }&lang=${lang}`;
    axiosCall({ url, dispatch, method: "get", type: GET_YARD_QA_LIST });
  };

  
