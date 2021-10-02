import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { useDispatch } from "react-redux";

const LeftNav = (props) => {
  let queryString = window.location.pathname;
  const [userRole, setUserRole] = useState([]);

  useEffect(() => {
    let user = JSON.parse(localStorage.getItem("okta-token-storage"));
    let userRoles;
    if (user) {
      userRoles =
        user.accessToken &&
        user.accessToken.claims &&
        user.accessToken.claims &&
        user.accessToken.claims.groups;
    }
    setUserRole(userRoles);
  }, []);
  return (
    <nav id="sidebar" className="hide">
      <div className="sidebar-header">
        <h3>
          <Link to="/workshop-qa">Catalog Panel</Link>
        </h3>
      </div>
      <ul className="list-unstyled components">
        {userRole &&
          userRole.map((role) => {
            return (
              <>
                {role === "CATALOG_QA" && (
                  <>
                    <li
                      className={
                        window.location.pathname.indexOf("/workshop-qa") !== -1
                          ? "active"
                          : ""
                      }
                    >
                      <a href="/workshop-qa">Workshop QA</a>
                    </li>
                    <li
                      className={
                        window.location.pathname.indexOf("/yard-qa") !== -1
                          ? "active"
                          : ""
                      }
                    >
                      <a href="/yard-qa">Yard QA</a>
                    </li>
                    <li
                      className={
                        window.location.pathname.indexOf(
                          "/inspection-history-qa"
                        ) !== -1
                          ? "active"
                          : ""
                      }
                    >
                      <a href="/inspection-history-qa">Inspection History</a>
                    </li>
                  </>
                )}

                {(role === "CATALOG_WSM" || role === "CATALOG_TECH") && (
                  <>
                    <li
                      className={
                        window.location.pathname.indexOf("/estimate") !== -1
                          ? "active"
                          : ""
                      }
                    >
                      <a href="/estimate">Estimates</a>
                    </li>
                    <li
                      className={
                        window.location.pathname.indexOf("/work-order") !== -1
                          ? "active"
                          : ""
                      }
                    >
                      <a href="/work-order">Work Order</a>
                    </li>
                  </>
                )}
              </>
            );
          })}
      </ul>
    </nav>
  );
};

const mapStateToProps = (state) => ({
  uiRulesData: state,
});

export default connect(mapStateToProps)(LeftNav);
