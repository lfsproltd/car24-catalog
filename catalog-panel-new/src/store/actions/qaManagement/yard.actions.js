
import { config } from "./../../../utils/constants/api.constants";
import { GET_YARD_QA_LIST, GET_YARD_QA_LIST_COUNT, LOADER_HANDLER} from "../../types";
import { setToasterMessage } from "./../commonAction/common.action";
import { AlertType } from "./../../../utils/constants/values.constants";

import axiosCall from "../../../inits/axios";

import { axiosService } from "../../../inits/axios";

import { convertObjectToParams } from "./../../../utils/utils";
import { SetErrorAlert } from "../../actions/globalActions";


export const getYardQaList =
(params = {}, lang) =>
async (dispatch) => {
    debugger;
   // dispatch({ type: LOADER_HANDLER });

      try {
        let url =
        config.api.workshop.host +
        config.api.workshop.inspection +
        "/" +
        config.api.workshop.inspectionTypeYard +
        `${
          params.hasOwnProperty("page") && params.hasOwnProperty("size")
            ? "&offset=" + +params.page * +params.size + "&limit=" + params.size
            : ""
        }&lang=${lang}`;
      

        console.log(url);

        const data = await axiosService.get(url);
        
        debugger
        dispatch({ type: GET_YARD_QA_LIST, payload: data.data });
    
          dispatch(getYardQaListingCount("yard", "", lang))
    
      } catch (e) {
        console.log(e)
        dispatch(
          setToasterMessage({
            toasterMessage: "Something went wrong",
            showToaster: true,
            toasterType: AlertType.ERROR,
          })
        );
      }
  };

  export const getYardQaListingCount =
  (inspectionTypeCount = "", searchValue = "", lang) =>
  async (dispatch) => {
    dispatch({ type: LOADER_HANDLER });
    let url =
      config.api.workshop.host +
      config.api.workshop.inspection +
      config.api.workshop.count +
      `${
        inspectionTypeCount === "yard"
          ? "?inspectionType=YARD&inspectionStatus=ESTIMATED&locationType=FULFILLMENT_CENTER"
          : [
              inspectionTypeCount === "inspectionhistory"
                ? "?inspectionType=CATALOG&inspectionStatus=DONE,ESTIMATED,APPROVED,REJECTED&version=all"
                : "?inspectionType=CATALOG&inspectionStatus=ESTIMATED&locationType=SERVICE_CENTER",
            ]
      }` +
      `${
        searchValue !== "%" && searchValue !== ""
          ? "&appointmentIdRegex=" + encodeURIComponent(searchValue)
          : ""
      }`;

    try {
      const data = await axiosService.get(url);

      dispatch({ type: GET_YARD_QA_LIST_COUNT, payload: data.data });
    
    } catch (e) {
      console.log('error');
      dispatch(
        setToasterMessage({
          toasterMessage: "Something went wrong",
          showToaster: true,
          toasterType: AlertType.ERROR,
        })
      );
    }
  };


export const searchYardQaList =
(searchValue, lang) => async (dispatch) => {
  let url =
  config.api.workshop.host +
  config.api.workshop.inspection +
  "/" +
  config.api.workshop.inspectionTypeYard +
    "&appointmentIdRegex=" +
    encodeURIComponent(searchValue) +
    `&lang=${lang}`;
    axiosCall({ url, dispatch, method: "get", type: GET_YARD_QA_LIST }).then(
    () => {
      getYardQaListingCount("yard", searchValue, lang)(dispatch);
    }
  );
};


