import React, { useEffect } from "react";
import { connect } from "react-redux";
import YardQaDetailsComponent from "./YardQaDetailsComponent";
import {
  getYardQaListDetails,
  approveQualityChecks,
  getLastInspectionData,
  GetMasterDataQaImageKeysWithVersion,
  addTagging,
} from "../../store/actions/qaManagement/qa.management.actions";
import { setToasterMessage } from "../../store/actions/commonAction/common.action";
import AlertBox from "./../../common/showAlert";
import loaderImg from "../../assets/img/loader.png";
import "./yardQaDetailsStyles.css";

const YardQaDetailsContainer = (props) => {
  //Actions
  const {
    GetYardListingDetailsAction,
    ApproveQualityChecksAction,
    GetLastInspectionDataAction,
    GetMasterDataQaImageKeysWithVersionAction,
    SetToasterMessageAction,
    langTransObj,
    selectedLang,
    AddTaggingAction,
  } = props;

  const  getYardDetailsCall = () => {
    let appointmentId = props?.match?.params?.appointmentId;

    let params = {
      appointmentId: appointmentId,
      inspectionType: "YARD",
      version: "all", //TODO: Check on version
    };
    GetYardListingDetailsAction && GetYardListingDetailsAction(params, selectedLang);
  };

  useEffect(
    (_) => {    
      getYardDetailsCall();
    },
    [selectedLang]
  );

  // useEffect(
  //   (_) => {
  //     const {
  //       schemaVersion = "",        
  //     } = props.listingDetails.length ? props.listingDetails[0] : {};

  //     schemaVersion!= "" && GetMasterDataQaImageKeysWithVersionAction &&
  //       GetMasterDataQaImageKeysWithVersionAction(schemaVersion, selectedLang) //TODO: Check if Version is required here
     
  //   },
  //   [props.listingDetails]
  // );

  //TODO: Change Alert Box and remove dependancy of KendoUI
  return (
    
    <div className="wrapper">
      
      {/* { {props.showToaster && <AlertBox ShowAlert={props.showToaster} message={props.toasterMessage} closeToaster={props.closeToaster} type={props.toasterType} />}
    {props.isProcessing && <div className="loaderSection"> <img src={loaderImg} alt="loader" /></div>}
     } */}

      <YardQaDetailsComponent
        // Only send required props to Component
        listingDetails={props.listingDetails}
        toasterType={props.toasterType}
        toasterMessage={props.toasterMessage}
        showToaster={props.showToaster}
        lastInspectionData={props.lastInspectionData}
        qaTopImagesKeys={props.qaTopImagesKeys}
        masterData={props.masterData}
        ApproveQualityChecksAction={ApproveQualityChecksAction}
        GetLastInspectionDataAction={GetLastInspectionDataAction}
        GetYardListingDetailsAction={GetYardListingDetailsAction}
        SetToasterMessageAction={SetToasterMessageAction}
        GetMasterDataQaImageKeysAction={GetMasterDataQaImageKeysWithVersionAction}
        langTransObj={langTransObj}
        selectedLang={selectedLang}
        AddTaggingAction={AddTaggingAction}
      />
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    isProcessing: state.qaReducer.isProcessing,
    showToaster: state.commonReducer.showToaster,
    toasterMessage: state.commonReducer.toasterMessage,
    toasterType: state.commonReducer.toasterType,
    listingDetails: state.qaReducer.yardListingDetails,
    lastInspectionData: state.qaReducer.lastInspectionData,
    qaTopImagesKeys: state.qaReducer.qaTopImagesKeys,
    masterData: state.qaReducer.masterData,
  };
};
const mapDispatchToProps = {
  SetToasterMessageAction: setToasterMessage,
  AddTaggingAction: addTagging,
  GetYardListingDetailsAction: getYardQaListDetails,
  ApproveQualityChecksAction: approveQualityChecks,
  GetLastInspectionDataAction: getLastInspectionData,
  GetMasterDataQaImageKeysWithVersionAction: GetMasterDataQaImageKeysWithVersion,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(YardQaDetailsContainer);
