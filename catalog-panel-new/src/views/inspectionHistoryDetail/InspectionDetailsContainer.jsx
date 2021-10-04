import React, { useEffect } from "react";
import { connect } from "react-redux";
import InspectionDetailsComponent from "./InspectionDetailsComponent";
import {
  GetInspectionCatalogMaster,
  GetInspectionCatalogSummary,
  GetInspectionListDetail,
} from "../../store/actions/inspectionDetailsAction";

function InspectionDetailsContainer(props) {
  const {
    inspectionDetailsProps,
    GetInspectionCatalogMasterAction,
    GetInspectionCatalogSummaryAction,
    GetInspectionListDetailAction,
    langTransObj,
    selectedLang,
  } = props;
  useEffect(() => {
    const appointmentId = props?.match?.params?.appointmentId;
    const version = props?.match?.params?.version;
    const inspectionType = props?.match?.params?.inspectionType ?? "CATALOG";

    GetInspectionCatalogMasterAction?.(selectedLang);
    GetInspectionCatalogSummaryAction?.(appointmentId, version, selectedLang);
    GetInspectionListDetailAction?.(
      appointmentId,
      inspectionType,
      version,
      selectedLang
    );
  }, [
    GetInspectionCatalogMasterAction,
    GetInspectionCatalogSummaryAction,
    GetInspectionListDetailAction,
    props.match,
    selectedLang,
  ]);

  return (
    <InspectionDetailsComponent
      langTransObj={langTransObj}
      selectedLang={selectedLang}
      inspectionDetailsProps={inspectionDetailsProps}
    />
  );
}

const mapStateToProps = (state) => {
  return {
    inspectionDetailsProps: state.inspectionDetailsReducer,
  };
};
const mapDispatchToProps = {
  GetInspectionCatalogMasterAction: GetInspectionCatalogMaster,
  GetInspectionCatalogSummaryAction: GetInspectionCatalogSummary,
  GetInspectionListDetailAction: GetInspectionListDetail,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InspectionDetailsContainer);
