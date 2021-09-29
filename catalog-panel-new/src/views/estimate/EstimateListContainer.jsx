import React, { useEffect } from "react";
import { connect } from "react-redux";
import EstimateListComponent from "./EstimateListComponent";
import {
  GetEstimatesList,
  // getEstimatesListCount,
  // searchAppointment,
} from "../../store/actions/estimateActions";

const EstimateListContainer = (props) => {
  const { estimateProps = {}, GetEstimatesListAction, lang } = props;
  const { estimateList = [] } = estimateProps;
  useEffect((_) => {
    let user = JSON.parse(localStorage.getItem("okta-token-storage"));
    let locationCode = user?.accessToken?.claims?.locations?.toString();
    GetEstimatesListAction && GetEstimatesListAction({}, locationCode);
  }, []);
  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
      <EstimateListComponent lang={lang} listData={estimateList} />
    </div>
  );
};

// import React, { Component } from "react";
// import { connect } from "react-redux";
// import loaderImg from "../../assets/img/loader.png";
// // import AlertBox from "./../../common/showAlert";
// import { setToasterMessage } from "../../store/actions/commonAction/common.action";
// import EstimateListingComponent from "./estimateListingComponent";
// import {
//   getEstimatesListing,
//   getEstimatesListingCount,
//   searchAppointment,
// } from "../../store/actions/workshopQaManagement/workshopQaManagement.action";

// class EstimateListingContainer extends Component {
//   constructor(props) {
//     super(props);
//   }

//   componentDidMount() {
//     let user = JSON.parse(localStorage.getItem("okta-token-storage"));
//     let locationCode =
//       user.accessToken &&
//       user.accessToken.claims &&
//       user.accessToken.claims.locations &&
//       user.accessToken.claims.locations.toString();
//     this.props.getEstimatesListing({}, locationCode);
//     this.props.getEstimatesListingCount("", locationCode);
//   }

//   render() {
//     return (
//       <div>
//         {/* {this.props.showToaster && (
//         //   <AlertBox
//         //     ShowAlert={this.props.showToaster}
//         //     message={this.props.toasterMessage}
//         //     closeToaster={this.closeToaster}
//         //     type={this.props.toasterType}
//         //   />
//         )} */}
//         {this.props.isProcessing && (
//           <div className="loaderSection">
//             {/* <img src={loaderImg} alt="loader" /> */}
//           </div>
//         )}
//         <EstimateListingComponent
//           estimatesListing={this.props.estimatesListing}
//           getEstimatesListing={getEstimatesListing}
//           toasterType={this.props.toasterType}
//           toasterMessage={this.props.toasterMessage}
//           showToaster={this.props.showToaster}
//           qaListingCount={this.props.qaListingCount}
//           getEstimatesListingCount={getEstimatesListingCount}
//           searchAppointmentId={searchAppointment}
//         />
//       </div>
//     );
//   }
// }

const mapStateToProps = (state) => {
  return {
    isLoading: state.loadingReducer.isLoading,
    estimateProps: state.estimateReducer,
    // toasterType: state.commonReducer.toasterType,
    // toasterMessage: state.commonReducer.toasterMessage,
    // showToaster: state.commonReducer.showToaster,
    // estimatesListing: state.workshopReducer.estimatesListing,
    // qaListingCount: state.workshopReducer.qaListingCount,
  };
};
const mapDispatchToProps = {
  // setToasterMessage,
  GetEstimatesListAction: GetEstimatesList,
  // getEstimatesListingCount,
  // searchAppointment,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EstimateListContainer);