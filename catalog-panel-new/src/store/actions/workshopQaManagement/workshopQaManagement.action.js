import {
  GET_WORKSHOP_QA_LISTING,
  GET_WORKSHOP_QA_LISTING_DETAILS,
  GET_WORKSHOP_QA_LISTING_COUNT,
  GET_APPOINTMENT_SEARCH_RESULT,
  ASSIGN_APPOINTMENT_ID,
  LOADER_HANDLER,
  APPROVE_REJECT_QUALITY_CHECK,
  GET_LAST_INSPECTION_DATA,
  GET_MASTER_DATA_QC_IMAGES_KEYS,
  GET_YARD_LISITNG_DATA,
  GET_YARD_LISITNG_DETAILS_DATA,
  GET_INSPECTION_HISTORY_LISTING,
  GET_INSPECTION_HISTORY_LISTING_DETAILS,
  GET_MASTER_DATA_CHECKPOINTS,
  GET_ESTIMATE_LISTING,
  GET_ESTIMATE_LISTING_DETAIL,
  GET_INSPECTION_SUMMARY,
} from "./workshopQaManagement.actionType";
import axiosService from "../../../inits/axios";
import { convertObjectToParams } from "./../../../utils/utils";
import { config } from "./../../../utils/constants/api.constants";
import { setToasterMessage } from "./../commonAction/common.action";
import { AlertType } from "./../../../utils/constants/values.constants";

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

export const getMasterDataQaImageKeys =
  (params = {}) =>
  async (dispatch) => {
    dispatch({ type: LOADER_HANDLER });
    let url =
      config.api.workshop.host +
      config.api.workshop.catalog +
      config.api.workshop.master;
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

export const searchAppointment =
  (searchValue, inspectionTypeSearch = "") =>
  async (dispatch) => {
    dispatch({ type: LOADER_HANDLER });
    let url =
      config.api.workshop.host +
      config.api.workshop.inspection +
      "/" +
      `${
        inspectionTypeSearch === "inspectionhistory"
          ? config.api.workshop.inspectionTypeInspectionHistory + "&version=all"
          : [
              inspectionTypeSearch === "yard"
                ? config.api.workshop.inspectionTypeYard
                : [
                    inspectionTypeSearch === "estimate"
                      ? config.api.workshop.estimates
                      : [
                          inspectionTypeSearch === "workorder"
                            ? config.api.workshop.workorder
                            : config.api.workshop.inspectionType,
                        ],
                  ],
            ]
      }` +
      "&appointmentIdRegex=" +
      encodeURIComponent(searchValue);
    try {
      const data = await axiosService.get(url);
      if (inspectionTypeSearch === "yard") {
        dispatch({ type: GET_YARD_LISITNG_DATA, payload: data.data });
      } else if (inspectionTypeSearch === "inspectionhistory") {
        dispatch({ type: GET_INSPECTION_HISTORY_LISTING, payload: data.data });
      } else if (inspectionTypeSearch === "estimate") {
        dispatch({ type: GET_ESTIMATE_LISTING, payload: data.data });
      } else if (inspectionTypeSearch === "workorder") {
        dispatch({ type: GET_ESTIMATE_LISTING, payload: data.data });
      } else {
        dispatch({ type: GET_APPOINTMENT_SEARCH_RESULT, payload: data.data });
      }
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

export const getYardListing =
  (params = {}) =>
  async (dispatch) => {
    dispatch({ type: LOADER_HANDLER });
    let url =
      config.api.workshop.host +
      config.api.workshop.inspection +
      "/" +
      config.api.workshop.inspectionTypeYard +
      `${
        params && params.page && params.size
          ? "&offset=" + +params.page * +params.size + "&limit=" + params.size
          : ""
      }`;
    // `${params && params.page && params.size ? "inspectionStatus=ESTIMATED&offset="+params.page+"&limit="+params.size : ''}`; // for production
    try {
      const data = await axiosService.get(url);
      dispatch({ type: GET_YARD_LISITNG_DATA, payload: data.data });
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

export const getInspectionHistoryListing =
  (params = {}) =>
  async (dispatch) => {
    dispatch({ type: LOADER_HANDLER });
    let url =
      config.api.workshop.host +
      config.api.workshop.inspection +
      "/" +
      config.api.workshop.inspectionTypeInspectionHistory +
      "&version=all" +
      `${
        params && params.page && params.size
          ? "&offset=" + +params.page * +params.size + "&limit=" + params.size
          : ""
      }`;
    // `${params && params.page && params.size ? "inspectionStatus=ESTIMATED&offset="+params.page+"&limit="+params.size : ''}`; // for production
    try {
      const data = await axiosService.get(url);
      dispatch({ type: GET_INSPECTION_HISTORY_LISTING, payload: data.data });
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

export const getEstimatesListing =
  (params = {}, locations) =>
  async (dispatch) => {
    dispatch({ type: LOADER_HANDLER });
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
    try {
      const data = await axiosService.get(url);
      dispatch({ type: GET_ESTIMATE_LISTING, payload: data.data });
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

export const getEstimatesListingCount =
  (searchValue = "", locations = "") =>
  async (dispatch) => {
    dispatch({ type: LOADER_HANDLER });
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

export const getWorkorderListingCount =
  (searchValue = "", locations = "") =>
  async (dispatch) => {
    dispatch({ type: LOADER_HANDLER });
    let url =
      config.api.workshop.host +
      config.api.workshop.inspection +
      config.api.workshop.count +
      `${
        "?inspectionType=CATALOG&inspectionStatus=APPROVED&locationCode=" +
        locations
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

export const getWorkorderListing =
  (params = {}, locations) =>
  async (dispatch) => {
    dispatch({ type: LOADER_HANDLER });
    let url =
      config.api.workshop.host +
      config.api.workshop.inspection +
      "/" +
      config.api.workshop.workorder +
      "&locationCode=" +
      locations +
      `${
        params && params.page && params.size
          ? "&offset=" + +params.page * +params.size + "&limit=" + params.size
          : ""
      }`;
    try {
      const data = await axiosService.get(url);
      dispatch({ type: GET_ESTIMATE_LISTING, payload: data.data });
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

export const getInspectionHistoryListingDetail =
  (params = {}) =>
  async (dispatch) => {
    dispatch({ type: LOADER_HANDLER });
    let url =
      config.api.workshop.host +
      config.api.workshop.inspection +
      "/" +
      convertObjectToParams(params);
    try {
      const data = await axiosService.get(url);
      dispatch({
        type: GET_INSPECTION_HISTORY_LISTING_DETAILS,
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

export const getYardListingDetails =
  (params = {}) =>
  async (dispatch) => {
    dispatch({ type: LOADER_HANDLER });
    let url =
      config.api.workshop.host +
      config.api.workshop.inspection +
      "/" +
      convertObjectToParams(params);
    try {
      const data = await axiosService.get(url);
      dispatch({
        type: GET_YARD_LISITNG_DETAILS_DATA,
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

export const getEstimateDetails =
  (params = {}) =>
  async (dispatch) => {
    dispatch({ type: LOADER_HANDLER });
    let url =
      config.api.workshop.host +
      config.api.workshop.inspection +
      "/" +
      convertObjectToParams(params);
    try {
      const data = await axiosService.get(url);
      dispatch({
        type: GET_ESTIMATE_LISTING_DETAIL,
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

export const getWorkorderDetails =
  (params = {}) =>
  async (dispatch) => {
    dispatch({ type: LOADER_HANDLER });
    let url =
      config.api.workshop.host +
      config.api.workshop.inspection +
      "/" +
      convertObjectToParams(params);
    try {
      const data = await axiosService.get(url);
      dispatch({
        type: GET_ESTIMATE_LISTING_DETAIL,
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

export const getWorkshopListing =
  (params = {}) =>
  async (dispatch) => {
    dispatch({ type: LOADER_HANDLER });
    let url =
      config.api.workshop.host +
      config.api.workshop.inspection +
      "/" +
      config.api.workshop.inspectionType +
      `${
        params && params.page && params.size
          ? "&offset=" + +params.page * +params.size + "&limit=" + params.size
          : ""
      }`;
    // `${params && params.page && params.size ? "inspectionStatus=ESTIMATED,INSPECTED&offset="+params.page+"&limit="+params.size : ''}`; // for production
    try {
      const data = await axiosService.get(url);
      dispatch({ type: GET_WORKSHOP_QA_LISTING, payload: data.data });
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

export const getWorkshopListingCount =
  (inspectionTypeCount = "", searchValue = "") =>
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

export const getWorkshopListingDetails =
  (params = {}) =>
  async (dispatch) => {
    dispatch({ type: LOADER_HANDLER });
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
