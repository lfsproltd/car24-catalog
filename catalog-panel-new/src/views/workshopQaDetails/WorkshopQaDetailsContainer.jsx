import React, { useEffect } from "react";
import { connect } from "react-redux";
import loaderImg from "../../assets/img/loader.png";
import AlertBox from './../../common/showAlert';

import WorkshopQaDetailsComponent from "./WorkshopQaDetailsComponent";

import {
    getWorkshopQaListingDetails,
    approveQualityChecks,
    getLastInspectionData,
    getInspectionSummary,
    GetMasterDataQaImageKeysWithVersion,

  } from "../../store/actions/qaManagement/qa.management.actions";
  
  import { setToasterMessage } from "../../store/actions/commonAction/common.action";


const WorkshopQaDetailsContainer = (props) => {
    //Actions
    const {
      GetWorkshopQaListingDetailsAction,
      ApproveQualityChecksAction,
      GetLastInspectionDataAction,
      SetToasterMessageAction,
      langTransObj,
      selectedLang,
      GetInspectionSummaryAction
    } = props;


    const getWorkshopQaDetailsCall = () => {
        let appointmentId = props?.match?.params?.appointmentId;
        let params = {
        appointmentId: appointmentId,
        inspectionType: "CATALOG",
        version: "all",
        limit: 2,
        sort: 'createdAt,desc'
        };
        
        GetWorkshopQaListingDetailsAction &&
        GetWorkshopQaListingDetailsAction(params, selectedLang)
        // GetInspectionSummaryActions has called inside GetWorkshopQaListingDetailsAction
    };


    useEffect(
        (_) => {
        getWorkshopQaDetailsCall();
        },
        [selectedLang]
    );

    
        return (
            
            <div className='wrapper'>
                {/* {this.props.showToaster && <AlertBox ShowAlert={this.props.showToaster} message={this.props.toasterMessage} closeToaster={this.closeToaster} type={this.props.toasterType} />}
                {this.props.isProcessing && <div className="loaderSection"> <img src={loaderImg} alt="loader" /></div>} */}
                <WorkshopQaDetailsComponent 
                listingDetails={props.listingDetails}
                toasterType={props.toasterType}
                toasterMessage={props.toasterMessage}
                showToaster={props.showToaster}
                lastInspectionData={props.lastInspectionData}
                qaTopImagesKeys={props.qaTopImagesKeys}
                masterData={props.masterData}
                inspectionSummary={props.inspectionSummary} // need to check if can pass only once
  
                GetWorkshopQaListingDetailsAction = {GetWorkshopQaListingDetailsAction}
                ApproveQualityChecksAction={ApproveQualityChecksAction}
                GetLastInspectionDataAction={GetLastInspectionDataAction}
                GetInspectionSummaryAction={GetInspectionSummaryAction}
                SetToasterMessageAction={SetToasterMessageAction}
                

                langTransObj = {langTransObj}
                selectedLang = {selectedLang}

                    />

            </div>
        )
    
}


const mapStateToProps = (state) => {
    return {
      isProcessing: state.qaReducer.isProcessing,
      showToaster: state.commonReducer.showToaster,
      toasterMessage: state.commonReducer.toasterMessage,
      toasterType: state.commonReducer.toasterType,
      listingDetails: state.workshopQaReducer.workshopQaListingDetails,
      lastInspectionData: state.qaReducer.lastInspectionData, // TODO
      qaTopImagesKeys: state.qaReducer.qaTopImagesKeys,
      masterData: state.qaReducer.masterData,
      inspectionSummary:state.workshopQaReducer.inspectionSummary
    };
  };
  const mapDispatchToProps = {
    SetToasterMessageAction: setToasterMessage,
    GetWorkshopQaListingDetailsAction: getWorkshopQaListingDetails,
    ApproveQualityChecksAction: approveQualityChecks,
    GetLastInspectionDataAction: getLastInspectionData,
    GetMasterDataQaImageKeysAction: GetMasterDataQaImageKeysWithVersion,
    GetInspectionSummaryAction: getInspectionSummary
  };



export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(WorkshopQaDetailsContainer);