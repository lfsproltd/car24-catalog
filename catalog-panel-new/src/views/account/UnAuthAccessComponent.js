import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useOktaAuth } from "@okta/okta-react";
import { getUserData } from "./../../utils/utils";

const UnAuthAccessComponent = (props) => {
  const historyLink = useHistory();
  const { authState, oktaAuth } = useOktaAuth();
  const [userData, setUserData] = useState({});

  useEffect(() => {
    if (getUserData()) {
      setUserData(getUserData());
    } else {
      historyLink.push("/");
    }
  }, []);

  const logout = () => {
    oktaAuth.signOut("/");
    localStorage.clear();
    sessionStorage.clear();
  };

  return (
    <>
      <header className="headerSection unAuthHeader">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-2">
              <div className="sidebar-header">
                <h3>Catalog Panel</h3>
              </div>
            </div>
            <div className="col-lg-10">
              <div className="userName">
                {userData && userData.name}{" "}
                <span className="k-icon k-i-arrow-chevron-down"></span>
                <ul className="userDropdown">
                  <li onClick={logout}>Logout</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="unAuthriseContent">
        <h3 style={{ color: "#EB3B2C" }}>Unauthorized Access</h3>
        <p>
          You are trying to access a page for which you are not authorized,
          please contact administrator.
        </p>
      </div>

      <div className="col-lg-12">
        <div className="footer unauthFooter">
          Copyright © 2020 CARS24. All rights reserved.
        </div>
      </div>
    </>
  );
};

export default UnAuthAccessComponent;
