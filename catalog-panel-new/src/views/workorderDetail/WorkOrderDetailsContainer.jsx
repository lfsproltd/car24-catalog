import React, { useEffect } from "react";
import { connect } from "react-redux";
import WorkOrderDetailsComponent from "./WorkOrderDetailsComponent";
import {
  GetInspectionDetails,
  GetMasterDataQaImageKeys
} from "../../store/actions/inspection";

function WorkOrderDetailsContainer(props) {
  const {
    GetWorkOrderDetailsAction,
    GetMasterDataQaImageKeysAction,
    workOrderDetailsProps,
    langTransObj,
    selectedLang,
  } = props;
  useEffect(
    (_) => {
      let appointmentId = props?.match?.params?.appointmentId;
      let version = props?.match?.params?.version;
      let params = {
        appointmentId: appointmentId,
        inspectionType: "CATALOG",
        version: version,
      };
      GetWorkOrderDetailsAction &&
      GetWorkOrderDetailsAction(params, selectedLang);
    },
    [selectedLang]
  );


  return (
    <WorkOrderDetailsComponent
      workOrderDetailsProps={workOrderDetailsProps}
      langTransObj={langTransObj}
      selectedLang={selectedLang}
    />
  );
}

const mapStateToProps = (state) => {
  return {
    workOrderDetailsProps: state.inspectionReducer,
    isProcessing: state.inspectionDetailsReducer.isProcessing,
    showToaster: state.commonReducer.showToaster,
    toasterMessage: state.commonReducer.toasterMessage,
    toasterType: state.commonReducer.toasterType,
    masterData: state.inspectionReducer.masterData,
  };
};
const mapDispatchToProps = {
  GetWorkOrderDetailsAction: GetInspectionDetails,
  GetMasterDataQaImageKeysAction: GetMasterDataQaImageKeys
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WorkOrderDetailsContainer);
