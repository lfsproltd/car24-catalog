import React, { useState, useEffect } from "react";
import { Grid, GridColumn } from "@progress/kendo-react-grid";
import "../workshopQa/workshopQa.css";
import { Tooltip } from "@progress/kendo-react-tooltip";
import GridCustomCell from "../../common/GridCustomCell";
import { useDispatch } from "react-redux";
import { dateFormat, timeFormat } from "./../../utils/utils";
import MakeModelCell from "../../common/Tooltip/makeModelCell";
import InspectionTimeCell from "../../common/Tooltip/inspectionTimeCell";
import WorkshopNameCell from "../../common/Tooltip/workshopNameCell";

const WorkorderListingComponent = (props) => {
  const dispatch = useDispatch();
  const [paginationData, setPaginationData] = useState({ skip: 0, take: 10 });
  const [currentPage, setCurrentPage] = useState("");
  const [qaListingData, setQaListingData] = useState([]);
  const [qaListingCount, setQaListingCount] = useState(0);
  const pageChange = (event) => {
    setPaginationData({
      skip: event.page.skip,
      take: event.page.take,
    });
    setCurrentPage(event.page.skip ? event.page.skip / 10 : 0);
    let user = JSON.parse(localStorage.getItem("okta-token-storage"));
    let locationCode =
      user.accessToken &&
      user.accessToken.claims &&
      user.accessToken.claims.locations &&
      user.accessToken.claims.locations.toString();
    dispatch(
      props.getEstimatesListing(
        {
          page: event.page.skip ? event.page.skip / 10 : 0,
          size: event.page.take,
        },
        locationCode
      )
    );
  };

  useEffect(() => {
    props.estimatesListing.map((item) => {
      if (item && item.updatedAt) {
        item["formatedInspectionTime"] =
          dateFormat(item.updatedAt) + " - " + timeFormat(item.updatedAt);
      }
    });
    setQaListingData(props.estimatesListing);
    setQaListingCount(props.qaListingCount);
  }, [props]);

  const inputSearchHandler = (value) => {
    let user = JSON.parse(localStorage.getItem("okta-token-storage"));
    let locationCode =
      user.accessToken &&
      user.accessToken.claims &&
      user.accessToken.claims.locations &&
      user.accessToken.claims.locations.toString();
    dispatch(props.searchAppointmentId(value + "%", "workorder"));
    dispatch(props.getEstimatesListingCount(value + "%", locationCode));
  };
  const appointmentIdCell = (props) => (
    <GridCustomCell
      dataLink={
        "/work-order/" +
        `${props.dataItem.appointmentId}/${props.dataItem.version}`
      }
      dataText={props.dataItem.appointmentId}
    />
  );

  return (
    <div className="col-lg-12">
      <div className="gridData">
        <div className="middleContent">
          <div className="search-box">
            <input
              type="text"
              onChange={(e) => inputSearchHandler(e.target.value)}
              placeholder="Search for appointment ID"
            />
          </div>
          <Tooltip openDelay={100} position="right" anchorElement="element">
            <Grid
              data={qaListingData}
              pageable={true}
              skip={paginationData.skip}
              take={paginationData.take}
              onPageChange={(e) => pageChange(e)}
              total={qaListingCount}
            >
              <GridColumn
                field="appointmentId"
                cell={(e) => appointmentIdCell(e)}
                title="App. ID"
              />

              <GridColumn
                field="makeModel"
                title="Make/Model"
                cell={MakeModelCell}
              />

              <GridColumn
                field="inspectionTime"
                cell={InspectionTimeCell}
                title="Inspection Time"
              />

              <GridColumn
                field="workshopName"
                title="Workshop/Yard Name"
                cell={WorkshopNameCell}
              />
            </Grid>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

export default WorkorderListingComponent;
