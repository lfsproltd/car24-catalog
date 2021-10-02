import React, { useEffect } from "react";
import { connect } from "react-redux";
import EstimateDetailsComponent from "./EstimateDetailsComponent";
import {
  GetEstimateDetails,
  GetMasterDataQaImageKeys,
  SetEstimateFormData,
  SaveEstimates as SaveEstimatesAction,
} from "../../store/actions/estimateDetailsActions";

function EstimateDetailsContainer(props) {
  const {
    GetEstimateDetailsAction,
    GetMasterDataQaImageKeysAction,
    estimateDetailsProps,
    SetEstimateFormDataAction,
    langTransObj,
    selectedLang,
    SaveEstimatesAction,
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
      GetEstimateDetailsAction &&
        GetEstimateDetailsAction(params, selectedLang);
    },
    [selectedLang]
  );

  const SaveEstimates = (data, appointmentId) => {
    SaveEstimatesAction &&
      SaveEstimatesAction(data, appointmentId, selectedLang);
  };

  return (
    <EstimateDetailsComponent
      SaveEstimates={SaveEstimates}
      SetEstimateFormDataAction={SetEstimateFormDataAction}
      estimateDetailsProps={estimateDetailsProps}
      langTransObj={langTransObj}
      selectedLang={selectedLang}
    />
  );
}

const mapStateToProps = (state) => {
  return {
    estimateDetailsProps: state.estimateDetailsReducer,
    isProcessing: state.estimateDetailsReducer.isProcessing,
    showToaster: state.commonReducer.showToaster,
    toasterMessage: state.commonReducer.toasterMessage,
    toasterType: state.commonReducer.toasterType,
    listingDetails: state.qaReducer.estimatesListingDetail,
    masterData: state.estimateDetailsReducer.masterData,
  };
};
const mapDispatchToProps = {
  GetEstimateDetailsAction: GetEstimateDetails,
  GetMasterDataQaImageKeysAction: GetMasterDataQaImageKeys,
  SetEstimateFormDataAction: SetEstimateFormData,
  SaveEstimatesAction,
  //   setToasterMessage,
  //   getEstimateDetails,
  //   approveQualityChecks,
  //   getMasterDataQaImageKeys,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EstimateDetailsContainer);
