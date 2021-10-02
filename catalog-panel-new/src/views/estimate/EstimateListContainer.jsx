import React, { useEffect } from "react";
import { connect } from "react-redux";
import EstimateListComponent from "./EstimateListComponent";
import { LIST_PAGE_SIZE } from "../../utils/constants/values.constants";
import {
  GetEstimatesList,
  SearchAppointment,
  // searchAppointment,
} from "../../store/actions/estimateActions";

const EstimateListContainer = (props) => {
  const {
    estimateProps = {},
    GetEstimatesListAction,
    langTransObj,
    selectedLang,
    SearchAppointmentAction,
  } = props;

  const estimateListCall = ({ pageNumber, callCount }) => {
    let user = JSON.parse(localStorage.getItem("okta-token-storage"));
    let locationCode = user?.accessToken?.claims?.locations?.toString();
    GetEstimatesListAction &&
      GetEstimatesListAction(
        { size: LIST_PAGE_SIZE, page: pageNumber, callCount },
        locationCode,
        selectedLang
      );
  };

  useEffect(() => {
    estimateListCall({ pageNumber: 0, callCount: true });
  }, [selectedLang]);

  return (
    <EstimateListComponent
      estimateProps={estimateProps}
      langTransObj={langTransObj}
      estimateListCall={estimateListCall}
      selectedLang={selectedLang}
      SearchAppointmentAction={SearchAppointmentAction}
    />
  );
};

const mapStateToProps = (state) => {
  return {
    estimateProps: state.estimateReducer,
  };
};
const mapDispatchToProps = {
  // setToasterMessage,
  GetEstimatesListAction: GetEstimatesList,
  // getEstimatesListingCount,
  SearchAppointmentAction: SearchAppointment,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EstimateListContainer);
