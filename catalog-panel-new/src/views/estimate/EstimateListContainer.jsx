import React, { Fragment, useEffect, useState } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import ListComp from "../../common/Layouts/ListView";
import {
  GetEstimatesList,
  // getEstimatesListCount,
  // searchAppointment,
} from "../../store/actions/estimateActions";

const EstimateListContainer = (props) => {
  const { estimateProps = {}, GetEstimatesListAction, lang } = props;
  const { estimateList = [] } = estimateProps;
  const [rows, setRows] = useState([]);
  const [headCells, setHeadCells] = useState([]);
  useEffect((_) => {
    let user = JSON.parse(localStorage.getItem("okta-token-storage"));
    let locationCode = user?.accessToken?.claims?.locations?.toString();
    GetEstimatesListAction && GetEstimatesListAction({}, locationCode);
  }, []);

  useEffect(() => {
    const rows = [],
      headCells = [
        {
          id: "appointmentId",
          numeric: false,
          disablePadding: false,
          label: lang.estimatePage["APP_ID"],
        },
        {
          id: "make",
          numeric: true,
          disablePadding: false,
          label: lang.estimatePage["MAKE_MODEL"],
        },
        {
          id: "createdAt",
          numeric: true,
          disablePadding: false,
          label: lang.estimatePage["INSPECTION_TIME"],
        },
        {
          id: "loc",
          numeric: true,
          disablePadding: false,
          label: lang.estimatePage["WORKSHOP_NAME"],
        },
      ];

    for (let i = 0; i < estimateList.length; i++) {
      const { appointmentId, make, model, createdAt, loc, version } =
        estimateList[i];
      rows.push({
        appointmentId,
        make: `${make} ${model}`,
        createdAt,
        loc: loc.name,
        version,
      });
    }
    setRows(rows);
    setHeadCells(headCells);
  }, [estimateList]);

  const createRowData = (TableCell, row, labelId) => {
    return (
      <Fragment>
        <TableCell component="th" id={labelId} scope="row" padding="normal">
          <Link to={`/estimate-detail/${row.appointmentId}/${row.version}`}>
            {row.appointmentId}
          </Link>
        </TableCell>
        <TableCell align="left">{row.make}</TableCell>
        <TableCell align="left">{row.createdAt}</TableCell>
        <TableCell align="left">{row.loc}</TableCell>
      </Fragment>
    );
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
      <ListComp
        rows={rows}
        headCells={headCells}
        lang={lang}
        createRowData={createRowData}
        orderByField={"appointmentId"}
        listData={estimateList}
      />
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    isLoading: state.loadingReducer.isLoading,
    estimateProps: state.estimateReducer,
    // toasterType: state.commonReducer.toasterType,
    // toasterMessage: state.commonReducer.toasterMessage,
    // showToaster: state.commonReducer.showToaster,
    // estimatesListing: state.workshopReducer.estimatesListing,
    // qaListingCount: state.workshopReducer.qaListingCount,
  };
};
const mapDispatchToProps = {
  // setToasterMessage,
  GetEstimatesListAction: GetEstimatesList,
  // getEstimatesListingCount,
  // searchAppointment,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EstimateListContainer);
