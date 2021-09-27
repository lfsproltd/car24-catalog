import React, { Component } from "react";
import { connect } from "react-redux";
import { setToasterMessage } from "./../../store/actions/commonAction/common.action";
import loaderImg from "../../assets/img/loader.png";
import AlertBox from "./../../common/showAlert";
import EstimateDetailsComponent from "./estimateDetailsComponent";
import {
  getEstimateDetails,
  approveQualityChecks,
  getLastInspectionData,
  getMasterDataQaImageKeys,
} from "../../store/actions/workshopQaManagement/workshopQaManagement.action";
class EstimateDetailContainer extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    let appointmentId =
      this.props.match &&
      this.props.match.params &&
      this.props.match.params.appointmentId;
    let version =
      this.props.match &&
      this.props.match.params &&
      this.props.match.params.version;
    let params = {
      appointmentId: appointmentId,
      inspectionType: "CATALOG",
      version: version,
    };
    this.props.getEstimateDetails(params);
    this.props.getMasterDataQaImageKeys();
  }
  render() {
    return (
      <div>
        {this.props.showToaster && (
          <AlertBox
            ShowAlert={this.props.showToaster}
            message={this.props.toasterMessage}
            closeToaster={this.closeToaster}
            type={this.props.toasterType}
          />
        )}
        {this.props.isProcessing && (
          <div className="loaderSection">
            {" "}
            <img src={loaderImg} alt="loader" />
          </div>
        )}
        <EstimateDetailsComponent
          listingDetails={this.props.listingDetails}
          toasterType={this.props.toasterType}
          toasterMessage={this.props.toasterMessage}
          showToaster={this.props.showToaster}
          inspectionHistoryListingDetails={getEstimateDetails}
          approveQualityChecks={approveQualityChecks}
          setToasterMessage={setToasterMessage}
          qaTopImagesKeys={this.props.qaTopImagesKeys}
          masterData={this.props.masterData}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isProcessing: state.workshopReducer.isProcessing,
    showToaster: state.commonReducer.showToaster,
    toasterMessage: state.commonReducer.toasterMessage,
    toasterType: state.commonReducer.toasterType,
    listingDetails: state.workshopReducer.estimatesListingDetail,
    masterData: state.workshopReducer.masterData,
  };
};
const mapDispatchToProps = {
  setToasterMessage,
  getEstimateDetails,
  approveQualityChecks,
  getMasterDataQaImageKeys,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EstimateDetailContainer);
