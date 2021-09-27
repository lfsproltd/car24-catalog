import { Hidden } from "@mui/material";
import React from "react";
import Footer from "../Footer";
import Header from "../Header";
import LeftNav from "../LeftNav";

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
            <LoadedComponent {...props} />
            {footer ? <Footer /> : null}
          </div>
        </div>
      </>
    );
  };
}

export default AdminLayout;
