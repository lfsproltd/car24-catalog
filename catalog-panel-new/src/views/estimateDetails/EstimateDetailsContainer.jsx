import React, { useEffect } from "react";
import { connect } from "react-redux";
import EstimateDetailsComponent from "./EstimateDetailsComponent";
import {
  GetEstimateDetails,
  GetMasterDataQaImageKeys,
  SetEstimateFormData,
} from "../../store/actions/estimateDetailsActions";

function EstimateDetailsContainer(props) {
  const {
    GetEstimateDetailsAction,
    GetMasterDataQaImageKeysAction,
    estimateDetailsProps,
    SetEstimateFormDataAction,
  } = props;
  useEffect((_) => {
    let appointmentId = props?.match?.params?.appointmentId;
    let version = props?.match?.params?.version;
    let params = {
      appointmentId: appointmentId,
      inspectionType: "CATALOG",
      version: version,
    };
    GetEstimateDetailsAction && GetEstimateDetailsAction(params);
    GetMasterDataQaImageKeysAction && GetMasterDataQaImageKeysAction();
  }, []);

  return (
    <EstimateDetailsComponent
      SetEstimateFormDataAction={SetEstimateFormDataAction}
      estimateDetailsProps={estimateDetailsProps}
    />
  );
}

const mapStateToProps = (state) => {
  return {
    estimateDetailsProps: state.estimateDetailsReducer,
    isProcessing: state.workshopReducer.isProcessing,
    showToaster: state.commonReducer.showToaster,
    toasterMessage: state.commonReducer.toasterMessage,
    toasterType: state.commonReducer.toasterType,
    listingDetails: state.workshopReducer.estimatesListingDetail,
    masterData: state.workshopReducer.masterData,
  };
};
const mapDispatchToProps = {
  GetEstimateDetailsAction: GetEstimateDetails,
  GetMasterDataQaImageKeysAction: GetMasterDataQaImageKeys,
  SetEstimateFormDataAction: SetEstimateFormData,
  //   setToasterMessage,
  //   getEstimateDetails,
  //   approveQualityChecks,
  //   getMasterDataQaImageKeys,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EstimateDetailsContainer);
