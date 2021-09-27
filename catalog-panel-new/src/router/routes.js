import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import history from "./../inits/history";
import OktaRoutes from "./OktaRoutes";

const RenderRoutes = () => {
  return (
    <Router history={history}>
      <OktaRoutes />
    </Router>
  );
};

export default RenderRoutes;
