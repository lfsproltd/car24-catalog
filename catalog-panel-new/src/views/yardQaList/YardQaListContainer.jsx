import React, { useEffect } from "react";
import { connect } from "react-redux";
import YardQaListComponent from "./YardQaListComponent";
import { GetYardQaList } from "../../store/actions/qaManagement/yard.actions";

import { SearchAppointment } from "../../store/actions/estimateActions";

const YardQaListContainer = (props) => {
  const {
    yardQaList = [],
    GetYardQaListAction,
    langTransObj,
    selectedLang,
    SearchAppointmentAction,
  } = props;

  useEffect(() => {
    let user = JSON.parse(localStorage.getItem("okta-token-storage"));
    let locationCode = user?.accessToken?.claims?.locations?.toString();
    // https://refurbishment-service.qac24svc.dev/inspection/?inspectionType=YARD&inspectionStatus=ESTIMATED,QC_DONE&sort=createdAt,asc&additionalEstimatesPDI=false
    GetYardQaListAction && GetYardQaListAction({}, locationCode, selectedLang);
  }, [selectedLang]);

  return (
    <YardQaListComponent
      yardQaList={yardQaList}
      GetYardQaListAction={GetYardQaListAction}
      langTransObj={langTransObj}
      selectedLang={selectedLang}
      SearchAppointmentAction={SearchAppointmentAction}
    />
  );
};

const mapStateToProps = (state) => {
  return {
    yardQaList: state.qaReducer.yardQaList,
  };
};
const mapDispatchToProps = {
  GetYardQaListAction: GetYardQaList,
  SearchAppointmentAction: SearchAppointment,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(YardQaListContainer);
