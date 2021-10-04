import {
  ASSIGN_APPOINTMENT_ID,
  GET_YARD_LISITNG_DETAILS_DATA,
  GET_MASTER_DATA_CHECKPOINTS,
  LOADER_HANDLER,
  GET_YARD_QA_LIST,
  GET_MASTER_DATA_QC_IMAGES_KEYS,
  GET_LAST_INSPECTION_DATA,
  APPROVE_REJECT_QUALITY_CHECK,
  GET_WORKSHOP_QA_LISTING,
  GET_WORKSHOP_QA_LISTING_COUNT,
  GET_WORKSHOP_QA_LISTING_DETAILS,
  GET_INSPECTION_SUMMARY
} from "../../types";

import { AlertType } from "../../../utils/constants/values.constants";

import { axiosService } from "../../../inits/axios";
import axiosCall from "../../../inits/axios";
import { convertObjectToParams } from "./../../../utils/utils";
import { config } from "./../../../utils/constants/api.constants";
import { setToasterMessage } from "./../commonAction/common.action";
import { SetErrorAlert } from "../../actions/globalActions";

export const getYardQaListDetailsOLd =
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
      type: GET_YARD_LISITNG_DETAILS_DATA,
    }).then((data) => {
      const { data: apiRes } = data;
      const { schemaVersion = "" } = apiRes?.[0] || {};
      GetMasterDataQaImageKeysWithVersion(
        schemaVersion,
        selectedLang
      )(dispatch);
    });
  };


export const getYardQaListDetails = (params = {}, selectedLang) =>

  async (dispatch) => {

    dispatch({
      type: "LOADING",
      payload: true
    });

    let url =
    config.api.workshop.host +
    config.api.workshop.inspection +
    "/" +
    convertObjectToParams(params) +
    "&lang=" +
    selectedLang;

    const data = await axiosService.get(url);
    dispatch({
      type: GET_YARD_LISITNG_DETAILS_DATA,
      payload: data && data.data,
    });

    const { data: apiRes } = data;
    const { schemaVersion = "" } = apiRes?.[0] || {};

    dispatch(
      GetMasterDataQaImageKeysWithVersion(
        schemaVersion,
        selectedLang
      )
    )

    dispatch({
      type: "LOADING",
      payload: false
    });

  };

export const getYardQaLisDetails_OLDCODE =
  (params = {}, lang) =>
  async (dispatch) => {
    dispatch({ type: LOADER_HANDLER });
    let url =
      config.api.workshop.host +
      config.api.workshop.inspection +
      "/" +
      convertObjectToParams(params) +
      "&lang=" +
      lang;
    try {
      const data = await axiosService.get(url);
      dispatch({
        type: GET_YARD_QA_LIST,
        payload: data && data.data,
      });
    } catch (e) {
      dispatch(
        setToasterMessage({
          toasterMessage: "Something went wrong",
          showToaster: true,
          toasterType: AlertType.ERROR,
        })
      );
    }
  };


export const approveQualityChecks =
  (dataObj, appointmentId, msg, requestFor) => async (dispatch) => {
    dispatch({ type: LOADER_HANDLER });
    let url =
      config.api.workshop.host +
      config.api.workshop.inspection +
      "/" +
      appointmentId;
    try {
      const data = await axiosService.post(url, dataObj);
      dispatch({
        type: APPROVE_REJECT_QUALITY_CHECK,
        payload: data && data.data,
      });
      if (data.status === 200) {
        //TODO: why?
        if (localStorage.getItem("estimatesData")) {
          localStorage.removeItem("estimatesData");
        }
        dispatch(
          setToasterMessage({
            toasterMessage: msg ? msg : "Approved successfully",
            showToaster: true,
            toasterType: AlertType.SUCCESS,
          })
        );
        if (requestFor && requestFor === "submit all qc workshopQA") {
          window.location.pathname = "workshop-qa";
        }
        if (requestFor && requestFor === "submit all qc yardQA") {
          window.location.pathname = "yard-qa";
        }
      }
    } catch (e) {
      dispatch(
        setToasterMessage({
          toasterMessage:
            e && e.response && e.response.data && e.response.data.message
              ? e.response.data.message
              : "Something went wrong",
          showToaster: true,
          toasterType: AlertType.ERROR,
        })
      );
    }
  };

export const getLastInspectionData =
  (params = {}) =>
  async (dispatch) => {
    let url =
      config.api.workshop.host +
      config.api.workshop.inspection +
      "/" +
      convertObjectToParams(params);
    try {
      const data = await axiosService.get(url);
      dispatch({ type: GET_LAST_INSPECTION_DATA, payload: data.data });
    } catch (e) {
      dispatch(
        setToasterMessage({
          toasterMessage: "Something went wrong",
          showToaster: true,
          toasterType: AlertType.ERROR,
        })
      );
    }
  };

export const GetMasterDataQaImageKeysWithVersion =
(version, selectedLang)  =>
async (dispatch) => {
  dispatch({ type: LOADER_HANDLER });
  let url =
    config.api.workshop.host +
    config.api.workshop.catalog +
    config.api.workshop.master +
    "?schemaVersion=" +
    version +
    "&lang=" +
    selectedLang;;
  try {
    const data = await axiosService.get(url);
    dispatch({
      type: GET_MASTER_DATA_QC_IMAGES_KEYS,
      payload: data.data.qaTopImages,
    });
    dispatch({ type: GET_MASTER_DATA_CHECKPOINTS, payload: data.data });
  } catch (e) {
    dispatch(
      setToasterMessage({
        toasterMessage: "No images found",
        showToaster: true,
        toasterType: AlertType.ERROR,
      })
    );
  }
};

//Duplicate
export const GetMasterDataQaImageKeysWithVersionNotUsed =
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

export const addTagging =
  (dataObj, appointmentId, msg, type, currentTag) => async (dispatch) => {
    dispatch({ type: LOADER_HANDLER });
    let url =
      config.api.workshop.host +
      config.api.workshop.inspection +
      "/" +
      appointmentId;
    try {
      if (type && type === "carTagging") {
        let carTagUrl =
          config.api.workshop.host +
          config.api.workshop.catalog +
          config.api.workshop.carTagging +
          "/" +
          appointmentId +
          "/" +
          currentTag;
        const data = await axiosService.put(carTagUrl);
        dispatch({
          type: APPROVE_REJECT_QUALITY_CHECK,
          payload: data && data.data,
        });
        if (data.status === 200) {
          dispatch(
            setToasterMessage({
              toasterMessage: msg ? msg : "Success",
              showToaster: true,
              toasterType: AlertType.SUCCESS,
            })
          );
          setTimeout(() => {
            window.location.pathname = "yard-qa";
          }, 500);
        } else {
          window.location.pathname = "yard-qa";
        }
      }

      if (!type || type !== "carTagging") {
        const data = await axiosService.post(url, dataObj);
        dispatch({
          type: APPROVE_REJECT_QUALITY_CHECK,
          payload: data && data.data,
        });
        if (data.status === 200) {
          dispatch(
            setToasterMessage({
              toasterMessage: msg ? msg : "Success",
              showToaster: true,
              toasterType: AlertType.SUCCESS,
            })
          );
        }
      }
    } catch (e) {
      dispatch(
        SetErrorAlert(
          e?.response?.data?.message
            ? e.response.data.message
            : "Something went wrong"
        )
      );
      dispatch(
        setToasterMessage({
          toasterMessage:
            e && e.response && e.response.data && e.response.data.message
              ? e.response.data.message
              : "Something went wrong",
          showToaster: true,
          toasterType: AlertType.ERROR,
        })
      );
    }
  };


  export const assignAppointmentId =
  (appointmentId, version, path) => async (dispatch) => {
    dispatch({ type: LOADER_HANDLER });
    let url =
      config.api.workshop.host +
      config.api.workshop.catalog +
      config.api.workshop.assign +
      "/" +
      appointmentId +
      "?inspectionType=CATALOG";
    try {
      const data = await axiosService.put(url);
      if (data.status === 200) {
        dispatch({ type: ASSIGN_APPOINTMENT_ID, payload: "assigned" });
        dispatch(
          setToasterMessage({
            toasterMessage: "Assigned Successfully",
            showToaster: true,
            toasterType: AlertType.SUCCESS,
          })
        );
        setTimeout(() => {
          window.location.pathname = path + "/" + appointmentId + "/" + version;
        }, 1000);
      }
    } catch (data) {
      dispatch(
        setToasterMessage({
          toasterMessage:
            data.response.data && data.response.data.message
              ? data.response.data.message
              : "Already Assigned, please refresh page",
          showToaster: true,
          toasterType: AlertType.ERROR,
        })
      );
    }
  };


  // WorkshopQA section

export const getWorkshopListing =
(params = {}, lang) =>
async (dispatch) => {
  dispatch({ type: LOADER_HANDLER });
  let url =
    config.api.workshop.host +
    config.api.workshop.inspection +
    "/" +
    config.api.workshop.inspectionType +
    `${
      params.hasOwnProperty("page") && params.hasOwnProperty("size")
        ? "&offset=" + +params.page * +params.size + "&limit=" + params.size
        : ""
    }&lang=${lang}`;
  // `${params && params.page && params.size ? "inspectionStatus=ESTIMATED,INSPECTED&offset="+params.page+"&limit="+params.size : ''}`; // for production
  try {
    const data = await axiosService.get(url);
    
    dispatch({ type: GET_WORKSHOP_QA_LISTING, payload: data.data });

    dispatch(getWorkshopListingCount("workshop",  "", lang))

  } catch (e) {
    dispatch(
      setToasterMessage({
        toasterMessage: "Something went wrong",
        showToaster: true,
        toasterType: AlertType.ERROR,
      })
    );
  }
};


export const getWorkshopListingCount =
  (inspectionTypeCount = "", searchValue = "", lang) =>
  async (dispatch) => {
    dispatch({ type: LOADER_HANDLER });
    let url =
      config.api.workshop.host +
      config.api.workshop.inspection +
      config.api.workshop.count +
      `${
        inspectionTypeCount === "yard"
          ? "?inspectionType=CATALOG&inspectionStatus=ESTIMATED&locationType=FULFILLMENT_CENTER"
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
      dispatch({ type: GET_WORKSHOP_QA_LISTING_COUNT, payload: data.data });
    } catch (e) {
      dispatch(
        setToasterMessage({
          toasterMessage: "Something went wrong",
          showToaster: true,
          toasterType: AlertType.ERROR,
        })
      );
    }
  };

export const SearchWorkshopQaList =
(searchValue, lang) => async (dispatch) => {
  let url =
    config.api.workshop.host +
    config.api.workshop.inspection +
    "/" +
    config.api.workshop.inspectionType +
    "&appointmentIdRegex=" +
    encodeURIComponent(searchValue) +
    `&lang=${lang}`;
   axiosCall({ url, dispatch, method: "get", type: GET_WORKSHOP_QA_LISTING }).then(
    () => {
      getWorkshopListingCount("workshop", searchValue, lang)(dispatch);
    }
  );
};


export const getWorkshopQaListingDetails =
  (params = {}, selectedLang) =>
  async (dispatch) => {
    dispatch({ type: LOADER_HANDLER });

    dispatch({
      type: "LOADING",
      payload: true
    });

    let url =
      config.api.workshop.host +
      config.api.workshop.inspection +
      "/" +
      convertObjectToParams(params);
    try {
      const data = await axiosService.get(url);
      dispatch({
        type: GET_WORKSHOP_QA_LISTING_DETAILS,
        payload: data && data.data,
      });

    const { data: apiRes } = data;
    const { schemaVersion = "", version = 0} = apiRes?.[0] || {};

    dispatch(
      GetMasterDataQaImageKeysWithVersion(
        schemaVersion,
        selectedLang
      )
    )


    let paramsForInspectionsummary = {
      appointmentId: params['appointmentId'],
      version: version,
      lang: selectedLang
    };

    dispatch(getInspectionSummary(paramsForInspectionsummary))


    dispatch({ type: GET_LAST_INSPECTION_DATA, payload: apiRes?.[1] });


    dispatch({
      type: "LOADING",
      payload: false
    });


    } catch (e) {
      dispatch(
        setToasterMessage({
          toasterMessage: "Something went wrong",
          showToaster: true,
          toasterType: AlertType.ERROR,
        })
      );
    }
  };


  export const getInspectionSummary =
  (params = {}) =>
  async (dispatch) => {

    dispatch({ type: LOADER_HANDLER });

    let url =
      config.api.workshop.host +
      config.api.workshop.inspectionSummary +
      "/" +
      convertObjectToParams(params);
    try {
      const data = await axiosService.get(url);

      dispatch({ type: GET_INSPECTION_SUMMARY, payload: data.data });

    } catch (e) {
      dispatch(
        setToasterMessage({
          toasterMessage:
            e && e.response && e.response.data && e.response.data.message
              ? e.response.data.message
              : "No images found",
          showToaster: true,
          toasterType: AlertType.ERROR,
        })
      );
    }
  };

