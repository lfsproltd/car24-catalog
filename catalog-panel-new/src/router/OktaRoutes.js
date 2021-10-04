import React from "react";
import { useHistory } from "react-router-dom";
import { OktaAuth, toRelativeUrl } from "@okta/okta-auth-js";
import { Switch, Route, Redirect } from "react-router-dom";
import AdminLayout from "../common/Layouts/AdminLayout";
import asyncComponent from "../AsyncComponent";
import config from "../utils/okta/config";
import { Security, LoginCallback } from "@okta/okta-react";

const oktaAuth = new OktaAuth(config.oidc);

const accountContainer = asyncComponent(() =>
  import("../views/account/AccountContainer").then((module) => module.default)
);

const unAuthComp = asyncComponent(() =>
  import("../views/account/UnAuthAccessComponent").then(
    (module) => module.default
  )
);

const EstimatePage = asyncComponent(() =>
  import("../views/estimate/EstimateListContainer").then(
    (module) => module.default
  )
);

const EstimateDetailPage = asyncComponent(() =>
  import("../views/estimateDetails/EstimateDetailsContainer").then(
    (module) => module.default
  )
);

const InspectionHistoryPage = asyncComponent(() =>
  import("../views/inspectionHistory/InspectionListContainer").then(
    (module) => module.default
  )
);

const YardQaListPage = asyncComponent(() =>
  import("../views/yardQaList/YardQaListContainer").then(
    (module) => module.default
  )
);

const inspectionHistoryDetailPage = asyncComponent(() =>
  import("../views/inspectionHistoryDetail/InspectionDetailsContainer").then(
    (module) => module.default
  )
);

const YardQaDetailsPage = asyncComponent(() =>
  import("../views/yardQaDetails/YardQaDetailsContainer").then(
    (module) => module.default
  )
);

const WorkOrderPage = asyncComponent(() =>
  import("../views/workorder/WorkOrderListContainer").then(
    (module) => module.default
  )
);

const WorkOrderDetailPage = asyncComponent(() =>
  import("../views/workorderDetail/WorkOrderDetailsContainer").then(
    (module) => module.default
  )
);


const WorkshopQaListPage = asyncComponent(() =>
  import("../views/workshopQaList/WorkshopQaListContainer").then(
    (module) => module.default
  )
);

const WorkshopQaDetailsPage = asyncComponent(() =>
  import("../views/workshopQaDetails/WorkshopQaDetailsContainer").then(
    (module) => module.default
  )
);




// const inspectionHistoryContainer = asyncComponent(()=>
//   import('../views/inspectionHistory/inspectionHistoryContainer').then(module=> module.default)
// );

// const inspectionHistoryListingDetailsContainer = asyncComponent(()=>
//   import('../views/inspectionHistoryDetail/inspectionHistoryDetailContainer').then(module=> module.default)
// )

function OktaRoutes() {
  const history = useHistory();

  const onAuthRequired = function () {
    history.push("/");
  };

  const restoreOriginalUri = async (_oktaAuth, originalUri) => {
    history.replace(toRelativeUrl(originalUri || "/", window.location.origin));
  };

  return (
    <Security
      oktaAuth={oktaAuth}
      restoreOriginalUri={restoreOriginalUri}
      onAuthRequired={onAuthRequired}
    >
      <Switch>
        <Route exact path="/" component={accountContainer} />
        <Route path="/implicit/callback" component={LoginCallback} />
        <Route exact path="/estimate" component={AdminLayout(EstimatePage)} />
        <Route exact path="/yard-qa" component={AdminLayout(YardQaListPage)} />

        <Route
          exact
          path="/work-order"
          component={AdminLayout(WorkOrderPage)}
        />
        <Route
          exact
          path="/estimate-detail/:appointmentId/:version"
          component={AdminLayout(EstimateDetailPage)}
        />

        <Route
          exact
          path="/yard-qa/:appointmentId/:version"
          component={AdminLayout(YardQaDetailsPage)}
        />
        <Route
          exact
          path="/work-order-detail/:appointmentId/:version"
          component={AdminLayout(WorkOrderDetailPage)}
        />
        <Route
          exact
          path="/workshop-qa"
          component={AdminLayout(WorkshopQaListPage)}
        />

        <Route
          exact
          path="/workshop-qa/:appointmentId/:version" component={AdminLayout(WorkshopQaDetailsPage)}
        />


        <Route
            exact
            path="/inspection-history-qa"
            component={AdminLayout(InspectionHistoryPage)}
        />
        <Route
            exact
            path="/inspection-history-qa/:appointmentId/:version/:inspectionType?"
            component={AdminLayout(inspectionHistoryDetailPage)}
        />

        <Route exact path="/unauthorized" component={unAuthComp} />
        <Redirect to="/estimate" />
      </Switch>
    </Security>
  );
}

export default OktaRoutes;
