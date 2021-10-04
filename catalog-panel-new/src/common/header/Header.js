import React, { Component } from "react";
import { withOktaAuth } from "@okta/okta-react";
import { getUserData } from "../../utils/utils";
import { connect } from "react-redux";
// import { DropDownList } from '@progress/kendo-react-dropdowns';
import { redirectPage } from "../../utils/utils";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import { SetLanguage } from "../../store/actions/globalActions";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import { config } from "../../utils/constants/api.constants";
import { Redirect } from "react-router-dom";

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userData: {},
      claims: {},
      country: "",
      vehicleType: "",
      redirect: null,
    };
    this.logout = this.logout.bind(this);
  }

  componentDidMount() {
    let user = JSON.parse(localStorage.getItem("okta-token-storage"));
    let userRole;
    if (user) {
      userRole = user?.accessToken?.claims?.groups;
    }
    let redirectLocation = window.location.pathname;
    if (userRole) {
      if (
        userRole.includes("CATALOG_QA") &&
        redirectLocation &&
        (redirectLocation === "/workshop-qa" ||
          redirectLocation === "/yard-qa" ||
          redirectLocation === "/yard-qa/" + redirectLocation.split("/")[2] ||
          redirectLocation === "/inspection-history-qa" ||
          redirectLocation ===
            "/inspection-history-qa/" + redirectLocation.split("/")[2] ||
          redirectLocation === "/workshop-qa/" + redirectLocation.split("/")[2])
      ) {
        this.setState({
          redirect: redirectLocation,
        });
      }

      if (
        userRole.includes("CATALOG_QA") &&
        redirectLocation.split("/")[1] === "estimate"
      ) {
        this.setState({
          redirect: "/workshop-qa",
        });
      }
      if (
        (userRole.includes("CATALOG_WSM") ||
          userRole.includes("CATALOG_TECH")) &&
        redirectLocation.split("/")[1] === "workshop-qa"
      ) {
        this.setState({
          redirect: "/estimate",
        });
      }

      if (
        (userRole.includes("CATALOG_WSM") ||
          userRole.includes("CATALOG_TECH")) &&
        redirectLocation &&
        (redirectLocation === "/estimate" ||
          redirectLocation ===
            "/estimate-detail/" + redirectLocation.split("/")[2] ||
          redirectLocation === "/work-order" ||
          redirectLocation === "/work-order/" + redirectLocation.split("/")[2])
      ) {
        this.setState({
          redirect: redirectLocation,
        });
      }
    }

    if (getUserData()) {
      this.googleApi();
      this.setState({
        userData: getUserData(),
      });
    } else {
      this.logout();
    }
    let oktaStorageData = JSON.parse(
      localStorage.getItem("okta-token-storage")
    );
    const country = localStorage.getItem("country");
    const vehicleType = localStorage.getItem("vehicleType");
    if (oktaStorageData) {
      this.setState({ claims: oktaStorageData?.accessToken?.claims });
      if (!country) {
        this.setState({
          country: oktaStorageData?.accessToken?.claims?.country[0],
        });
        localStorage.setItem(
          "country",
          oktaStorageData?.accessToken?.claims?.country[0]
        );
      } else {
        this.setState({ country });
      }
      if (!vehicleType) {
        this.setState({
          vehicleType: oktaStorageData?.accessToken?.claims?.vehicleType[0],
        });
        localStorage.setItem(
          "vehicleType",
          oktaStorageData?.accessToken?.claims?.vehicleType[0]
        );
      } else {
        this.setState({ vehicleType });
      }
    }
  }
  googleApi = () => {
    const googleMapScript = document.createElement("script");
    googleMapScript.src = `https://maps.googleapis.com/maps/api/js?key=${config.api.google.googleKey}&libraries=places`;
    googleMapScript.async = true;
    window.document.body.appendChild(googleMapScript);
    googleMapScript.addEventListener("load", () => {
      //getLatLng();
    });
  };
  changeCountry = (e) => {
    let newCountry = e.value;
    localStorage.setItem("country", newCountry);
    sessionStorage.removeItem("searchLocations");
    sessionStorage.removeItem("searchMasterData");
    sessionStorage.removeItem("searchCity");
    sessionStorage.removeItem("searchState");
    sessionStorage.removeItem("searchZone");
    sessionStorage.removeItem("searchInventories");
    sessionStorage.removeItem("inventoryLocation");
    var currentQueryString = window.location.search;
    redirectPage(currentQueryString);
  };

  changeVehicleType = (e) => {
    let newVehicleType = e.value;
    localStorage.setItem("vehicleType", newVehicleType);
    sessionStorage.removeItem("searchLocations");
    sessionStorage.removeItem("searchMasterData");
    sessionStorage.removeItem("searchCity");
    sessionStorage.removeItem("searchState");
    sessionStorage.removeItem("searchZone");
    sessionStorage.removeItem("searchInventories");
    sessionStorage.removeItem("inventoryLocation");
    // window.location.reload(false);
    var currentQueryString = window.location.search;
    redirectPage(currentQueryString);
  };

  async logout() {
    this.props.oktaAuth.signOut("/");
    localStorage.clear();
    sessionStorage.clear();
  }

  render() {
    const { currentLanguage, SetLanguageAction } = this.props;
    return (
      <header className="headerSection">
        <div className="container-fluid">
          <div className="row language-select">
            {this.state.redirect && <Redirect to={this.state.redirect} />}
            <div className="col-lg-2 col-sm-2  col-2 d-md-none">
              <i class="fa fa-bars"></i>
            </div>
            <div className="col-lg-2 col-sm-3 col-4">
              <FormControl fullWidth>
                {/* <InputLabel id="demo-simple-select-label">
                    Language
                  </InputLabel> */}
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={currentLanguage}
                  label="Language"
                  onChange={SetLanguageAction}
                >
                  <MenuItem value={"en"}>English</MenuItem>
                  <MenuItem value={"th"}>Thai</MenuItem>
                </Select>
              </FormControl>
              {/* <div className="col-lg-3">
                                    <DropDownList
                                        data={this.state.claims.country}
                                        onChange={(e) => this.changeCountry(e)}
                                        defaultValue={this.state.country}
                                        className="dropDownForHeader"
                                    />
                                </div> 
                                <div className="col-lg-3">
                                    <DropDownList
                                        data={this.state.claims.vehicleType}
                                        className="dropDownForHeader"
                                        onChange={(e) => this.changeVehicleType(e)}
                                        defaultValue={this.state.vehicleType}
                                    />
                                </div>  */}

            </div>
            <div className="col-lg-10 col-sm-7 col-6">
              <div className="userName">
                {this.state.userData && this.state.userData.name}{" "}
                <span className="k-icon k-i-arrow-chevron-down"></span>
                <ul className="userDropdown">
                  <li onClick={this.logout}>Logout</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </header>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    currentLanguage: state.globalReducer.currentLanguage,
  };
};
const mapDispatchToProps = {
  SetLanguageAction: SetLanguage,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withOktaAuth(Header));
