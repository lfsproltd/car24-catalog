import React from "react";
import Footer from "../Footer";
import Header from "../Header";
import { lang as engLang } from "../../utils/constants/english_lang";
import { connect } from "react-redux";
import LeftNav from "../LeftNav";

const CompWithLanguage = (props) => {
  const { LoadedComponent, currentLanguage, ...restProps } = props;
  let lang = engLang;
  if (currentLanguage === "thai") {
    lang = require("../../utils/constants/thai_lang").lang;
  }
  return <LoadedComponent lang={lang} {...restProps} />;
};

const mapStateToProps = (state) => {
  return {
    currentLanguage: state.languageReducer.currentLanguage,
  };
};
const mapDispatchToProps = {};
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
        <div style={{ display: "flex", flex: "1" }} className="wrapper">
          <div
            style={{
              display: "flex",
              flex: "1",
              flexDirection: "column",
              overflow: "hidden",
            }}
            id="content"
          >
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
