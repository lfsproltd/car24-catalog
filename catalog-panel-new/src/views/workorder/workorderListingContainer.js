import React, { Component } from "react";
import { connect } from "react-redux";
import loaderImg from "../../assets/img/loader.png";
import AlertBox from "./../../common/showAlert";
import { setToasterMessage } from "../../store/actions/commonAction/common.action";
import { getUserToken } from "../../utils/utils";
import WorkorderListingComponent from "./workorderListingComponent";
import {
  getWorkorderListing,
  getWorkorderListingCount,
  searchAppointment,
} from "./../../store/actions/workshopQaManagement/workshopQaManagement.action";

class WorkorderListingContainer extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    let user = JSON.parse(localStorage.getItem("okta-token-storage"));
    let locationCode =
      user.accessToken &&
      user.accessToken.claims &&
      user.accessToken.claims.locations &&
      user.accessToken.claims.locations.toString();
    this.props.getWorkorderListing({}, locationCode);
    this.props.getWorkorderListingCount("", locationCode);
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
            <img src={loaderImg} alt="loader" />
          </div>
        )}
        <WorkorderListingComponent
          estimatesListing={this.props.estimatesListing}
          getEstimatesListing={getWorkorderListing}
          toasterType={this.props.toasterType}
          toasterMessage={this.props.toasterMessage}
          showToaster={this.props.showToaster}
          qaListingCount={this.props.qaListingCount}
          getEstimatesListingCount={getWorkorderListingCount}
          searchAppointmentId={searchAppointment}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isProcessing: state.workshopReducer.isProcessing,
    toasterType: state.commonReducer.toasterType,
    toasterMessage: state.commonReducer.toasterMessage,
    showToaster: state.commonReducer.showToaster,
    estimatesListing: state.workshopReducer.estimatesListing,
    qaListingCount: state.workshopReducer.qaListingCount,
  };
};
const mapDispatchToProps = {
  setToasterMessage,
  getWorkorderListing,
  getWorkorderListingCount,
  searchAppointment,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WorkorderListingContainer);
