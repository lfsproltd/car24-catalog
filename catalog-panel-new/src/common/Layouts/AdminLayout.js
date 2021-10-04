import React from "react";
import Footer from "../Footer";
import Header from "../header/Header";
import loaderImg from "../../assets/img/loader.png";
import { lang as engLang } from "../../utils/constants/lang_en";
import { connect } from "react-redux";
import { SetErrorAlert } from "../../store/actions/globalActions";
import Alert from "@mui/material/Alert";
import LeftNav from "../LeftNav";

const CompWithLanguage = (props) => {
  const {
    LoadedComponent,
    currentLanguage,
    loading,
    errorMessage,
    SetErrorAlertAction,
    ...restProps
  } = props;
  let langTransObj = engLang;
  if (currentLanguage !== "en") {
    langTransObj = require("../../utils/constants/lang_"+currentLanguage).lang;
  }

  console.log("ssss", errorMessage);
  return (
    <div className="main-content-box">
      {loading ? (
        <div className="loaderSection">
          <img src={loaderImg} alt="loader" />
        </div>
      ) : null}
      {errorMessage ? (
        <div className="alert-modal">
          <Alert onClose={() => SetErrorAlertAction("")} severity="error">
            {errorMessage}
          </Alert>
        </div>
      ) : null}
      <LoadedComponent
        langTransObj={langTransObj}
        selectedLang={currentLanguage}
        {...restProps}
      />
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    currentLanguage: state.globalReducer.currentLanguage,
    loading: state.globalReducer.loading,
    errorMessage: state.globalReducer.errorMessage,
  };
};
const mapDispatchToProps = {
  SetErrorAlertAction: SetErrorAlert,
};
const ConnectedComp = connect(
  mapStateToProps,
  mapDispatchToProps
)(CompWithLanguage);

function AdminLayout(
  LoadedComponent,
  leftnav = true,
  header = true,
  footer = true
) {
  return (props) => {
    return (
      <>
        {leftnav ? <LeftNav /> : null}
        <div className="wrapper">
          <div id="content">
            {header ? <Header /> : null}
            <ConnectedComp LoadedComponent={LoadedComponent} {...props} />
            {footer ? <Footer /> : null}
          </div>
        </div>
      </>
    );
  };
}

export default AdminLayout;
