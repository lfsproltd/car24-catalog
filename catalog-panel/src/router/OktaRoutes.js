import React from 'react';
import { useHistory } from 'react-router-dom';
import { OktaAuth } from '@okta/okta-auth-js';
import { Switch, Route, Redirect } from 'react-router-dom';
import AdminLayout from '../common/Layouts/AdminLayout';
import asyncComponent from './../AsyncComponent';
import config from './../utils/okta/config';
import { Security, SecureRoute, LoginCallback } from '@okta/okta-react';

const oktaAuth = new OktaAuth(config.oidc);

const accountContainer = asyncComponent(() =>
  import('../views/account/AccountContainer').then(module => module.default)
);

const unAuthComp = asyncComponent(() =>
  import('../views/account/UnAuthAccessComponent').then(module => module.default)
);

const workshopQaContainer = asyncComponent(() => 
  import('../views/workshopQa/workshopQaContainer').then(module => module.default)
);

const workshopQaDetailsContainer = asyncComponent(() => 
  import('../views/workshopQaDetail/workshopQaDetailsContainer').then(module => module.default)
);

const yardQaContainer = asyncComponent(()=> 
  import('../views/yardQa/yardQaContainer').then(module=> module.default)
);

const yardQaDetailsContainer = asyncComponent(()=> 
  import('../views/yardQaDetail/yardQaDetailsContainer').then(module=> module.default)
);

const inspectionHistoryContainer = asyncComponent(()=>
  import('../views/inspectionHistory/inspectionHistoryContainer').then(module=> module.default)
);

const inspectionHistoryListingDetailsContainer = asyncComponent(()=>
  import('../views/inspectionHistoryDetail/inspectionHistoryDetailContainer').then(module=> module.default)
)

const estimateListingContainer = asyncComponent(()=>
  import('../views/estimate/estimateListingContainer').then(module=> module.default)
);

const estimateDetailContainer = asyncComponent(()=>
  import('../views/estimateDetails/estimateDetailsContainer').then(module=> module.default)
);

const workorderListingContainer = asyncComponent(()=>
  import('../views/workorder/workorderListingContainer').then(module=> module.default)
);

const workorderDetailContainer = asyncComponent(()=>
  import('../views/workorderDetail/workorderListingDetailContainer').then(module=> module.default)
);

function OktaRoutes() {
  const history = useHistory();

  const onAuthRequired = function () {
    history.push('/')
  }

  return (
    <Security oktaAuth={oktaAuth} onAuthRequired={onAuthRequired}>
      <Switch>
        <Route exact path="/" component={accountContainer} />
        <Route path="/implicit/callback" component={LoginCallback} />
        <Route exact path="/workshop-qa" component={AdminLayout(workshopQaContainer)} />
        <Route exact path="/yard-qa" component={AdminLayout(yardQaContainer)} />
        <Route exact path="/yard-qa/:appointmentId/:version" component={AdminLayout(yardQaDetailsContainer)} />
        <Route exact path="/inspection-history-qa" component={AdminLayout(inspectionHistoryContainer)} />
        <Route exact path="/inspection-history-qa/:appointmentId/:version" component={AdminLayout(inspectionHistoryListingDetailsContainer)} />
        <Route exact path="/workshop-qa/:appointmentId/:version" component={AdminLayout(workshopQaDetailsContainer)} />
        <Route exact path="/estimate" component={AdminLayout(estimateListingContainer)} />
        <Route exact path="/estimate-detail/:appointmentId/:version" component={AdminLayout(estimateDetailContainer)} />        
        <Route exact path="/work-order" component={AdminLayout(workorderListingContainer)} />
        <Route exact path="/work-order/:appointmentId/:version" component={AdminLayout(workorderDetailContainer)} />  
        <Route exact path="/unauthorized" component={unAuthComp} />
        <Redirect to="/" />
      </Switch>
    </Security>
  );
}

export default OktaRoutes;