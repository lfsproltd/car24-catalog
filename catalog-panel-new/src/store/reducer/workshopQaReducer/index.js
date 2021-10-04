import {GET_WORKSHOP_QA_LISTING, GET_WORKSHOP_QA_LISTING_COUNT, GET_WORKSHOP_QA_LISTING_DETAILS, GET_INSPECTION_SUMMARY}  from "../../types";

const initialState = {
    //New Added        
    workshopQaListingCount: 0,
    workshopQaListing: [],
    workshopQaListingDetails: [],
    inspectionSummary:[]

};

const WorkshopQaReducer = (state = initialState, action) =>{
    switch(action.type) {

        case GET_WORKSHOP_QA_LISTING:
            return {
                ...state,
                workshopQaListing:action.payload,
                isProcessing:true
            }
        case GET_WORKSHOP_QA_LISTING_COUNT :
            return {
                ...state,
                workshopQaListingCount:action.payload
            }
        case GET_WORKSHOP_QA_LISTING_DETAILS:
            return {
                ...state,
                workshopQaListingDetails:action.payload,
                isProcessing:false
            }
        case GET_INSPECTION_SUMMARY:{
            return {
                ...state,
                isProcessing:true,
                inspectionSummary:action.payload,
                isProcessing:false
            }
        }
        default:
            return {
                ...state,
                isProcessing:false
            }
    }
}
        
export default WorkshopQaReducer;
        