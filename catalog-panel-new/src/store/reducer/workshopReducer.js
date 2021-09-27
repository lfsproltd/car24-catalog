import {GET_WORKSHOP_QA_LISTING, GET_WORKSHOP_QA_LISTING_DETAILS,
    GET_WORKSHOP_QA_LISTING_COUNT,GET_APPOINTMENT_SEARCH_RESULT,
    APPROVE_REJECT_QUALITY_CHECK,LOADER_HANDLER,ASSIGN_APPOINTMENT_ID,
    GET_LAST_INSPECTION_DATA,GET_MASTER_DATA_QC_IMAGES_KEYS,
    GET_YARD_LISITNG_DATA,GET_YARD_LISITNG_DETAILS_DATA,
    GET_INSPECTION_HISTORY_LISTING,GET_INSPECTION_HISTORY_LISTING_DETAILS,
    GET_MASTER_DATA_CHECKPOINTS,GET_ESTIMATE_LISTING,GET_ESTIMATE_LISTING_DETAIL,
    GET_INSPECTION_SUMMARY
    } from "./../actions/workshopQaManagement/workshopQaManagement.actionType";

const initialState = {
    showToaster: false,
    toasterMessage: '',
    toasterType: '',
    isProcessing: true,
    qaListing:[],
    yardListing:[],
    qaListingDetails:[],
    yardListingDetails:[],
    qaListingCount:0,
    lastInspectionData:[],
    qaTopImagesKeys:[],
    inspectionHistoryListing:[],
    inspectionHistoryListingDetails:[],
    masterData:[],
    estimatesListing:[],
    estimatesListingDetail:[],
    inspectionSummary:[]
};

const WorkshopManagement = (state = initialState, action) =>{
    switch(action.type){
        case GET_INSPECTION_SUMMARY:{
            return {
                ...state,
                isProcessing:true,
                inspectionSummary:action.payload,
                isProcessing:false
            }
        }
        case GET_ESTIMATE_LISTING_DETAIL:{
            return {
                ...state,
                isProcessing:true,
                estimatesListingDetail:action.payload,
                isProcessing:false
            }
        }
        case GET_ESTIMATE_LISTING: {
            return {
                ...state,
                estimatesListing:action.payload,
                isProcessing:false
            }
        }
        case GET_MASTER_DATA_CHECKPOINTS: 
            return {
                ...state,
                masterData:action.payload
            }
        case GET_INSPECTION_HISTORY_LISTING_DETAILS:
            return {
                ...state,
                inspectionHistoryListingDetails:action.payload,
                isProcessing:false
            }
        case GET_INSPECTION_HISTORY_LISTING:
            return {
                ...state,
                inspectionHistoryListing:action.payload,
                isProcessing:false
            }
        case GET_YARD_LISITNG_DETAILS_DATA:
            return {
                ...state,
                yardListingDetails:action.payload,
                isProcessing:false
            }
        case GET_YARD_LISITNG_DATA:
            return {
                ...state,
                yardListing:action.payload,
                isProcessing:false
            }
        case GET_MASTER_DATA_QC_IMAGES_KEYS:
            return {
                ...state,
                qaTopImagesKeys:action.payload,
                isProcessing:false
            }
        case GET_APPOINTMENT_SEARCH_RESULT:
            return {
                ...state,
                qaListing:action.payload,
                isProcessing:false
            }
        case GET_LAST_INSPECTION_DATA:
            return {
                ...state,
                lastInspectionData:action.payload,
                isProcessing:false
            }
        case ASSIGN_APPOINTMENT_ID:
            return{
                ...state,
                assignedResponse:action.payload,
                isProcessing:false
            }
        case GET_WORKSHOP_QA_LISTING:
        return {
            ...state,
            qaListing:action.payload,
            isProcessing:false
        }
        case GET_WORKSHOP_QA_LISTING_COUNT :
            return {
                ...state,
                qaListingCount:action.payload
            }
        case APPROVE_REJECT_QUALITY_CHECK:
            return {
                ...state,
                approveRejectQc:action.payload,
                isProcessing:false
            }
        case GET_WORKSHOP_QA_LISTING_DETAILS:
            return {
                ...state,
                qaListingDetails:action.payload,
                isProcessing:false
            }
        case LOADER_HANDLER:
            return {
                ...state,
                isProcessing:true
            }
        default:
            return {
                ...state,
                isProcessing:false
            }
    }
}

export default WorkshopManagement;