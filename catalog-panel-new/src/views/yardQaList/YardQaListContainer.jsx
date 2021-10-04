import React, { useEffect } from "react";
import { connect } from "react-redux";
import YardQaListComponent from "./YardQaListComponent";
import { LIST_PAGE_SIZE } from "../../utils/constants/values.constants";
import { getYardQaList , searchYardQaList} from "../../store/actions/qaManagement/yard.actions";


const YardQaListContainer = (props) => {
  const {
    yardQaListReducerProps,
    langTransObj,
    selectedLang,
    SearchYardQaListAction,
    GetYardQaListAction
  } = props;

  const listCall = ({ pageNumber, callCount }) => {
    
    let user = JSON.parse(localStorage.getItem("okta-token-storage"));
    let locationCode = user?.accessToken?.claims?.locations?.toString();
    
    GetYardQaListAction &&
    GetYardQaListAction(
        { size: LIST_PAGE_SIZE, page: pageNumber, callCount },
        selectedLang
      );
  };

  useEffect(() => {

    listCall({ pageNumber: 0, callCount: true });

  }, [selectedLang]);
  

  return (
    <YardQaListComponent
      yardQaListReducerProps={yardQaListReducerProps}
      langTransObj={langTransObj}
      selectedLang={selectedLang}
      SearchItemAction={SearchYardQaListAction}
      listCall={listCall}
    />
    
  );
};

const mapStateToProps = (state) => {
  return {
    yardQaListReducerProps: state.qaReducer,
  };
};
const mapDispatchToProps = {
  GetYardQaListAction: getYardQaList,
  SearchYardQaListAction: searchYardQaList,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(YardQaListContainer);
