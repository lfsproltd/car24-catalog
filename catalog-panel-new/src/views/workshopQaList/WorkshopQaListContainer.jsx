import React, { useEffect } from "react";
import { connect } from "react-redux";
import WorkshopQaListComponent from "./WorkshopQaListComponent";
import { LIST_PAGE_SIZE } from "../../utils/constants/values.constants";
import { getWorkshopListing, getWorkshopListingCount, SearchWorkshopQaList } from "../../store/actions/qaManagement/qa.management.actions"



const WorkshopQaListContainer = (props) => {
  const {
    workshopQaReducerProps,
    langTransObj,
    selectedLang,
    SearchWorkshopQaList,
    GetWorkshopListingAction
  } = props;

const listCall = ({ pageNumber, callCount }) => {
  let user = JSON.parse(localStorage.getItem("okta-token-storage"));
  let locationCode = user?.accessToken?.claims?.locations?.toString();
  
  GetWorkshopListingAction &&
  GetWorkshopListingAction(
      { size: LIST_PAGE_SIZE, page: pageNumber, callCount },
    //  locationCode,
      selectedLang
    );
};

useEffect(() => {
  listCall({ pageNumber: 0, callCount: true });
}, [selectedLang]);

return (
    <WorkshopQaListComponent
      workshopQaReducerProps={workshopQaReducerProps}
      langTransObj={langTransObj}
      selectedLang={selectedLang}
      SearchItemAction={SearchWorkshopQaList}
      listCall={listCall}
    />
  );
};

const mapStateToProps = (state) => {
  return {
    workshopQaReducerProps: state.workshopQaReducer,
  };
};
const mapDispatchToProps = {
  GetWorkshopListingAction: getWorkshopListing,
  SearchWorkshopQaList: SearchWorkshopQaList,
 
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WorkshopQaListContainer);
