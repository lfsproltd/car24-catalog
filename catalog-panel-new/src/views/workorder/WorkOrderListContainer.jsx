import React, { Fragment, useEffect, useState } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import ListComp from "../../common/Layouts/ListView";
import { config } from "../../utils/constants/api.constants";
import {
  GetInspectionList
} from "../../store/actions/inspection";

const WorkOrderListContainer = (props) => {
  const {
    workOrderProps = {},
    GetWorkOrderListAction,
    langTransObj,
    selectedLang,
  } = props;
  const { inspectionList = [] } = workOrderProps;
  const [rows, setRows] = useState([]);
  const [headCells, setHeadCells] = useState([]);
  const { labels = {}} = langTransObj  || {};
  useEffect(() => {
    let user = JSON.parse(localStorage.getItem("okta-token-storage"));
    let locationCode = user?.accessToken?.claims?.locations?.toString();
    GetWorkOrderListAction &&
    GetWorkOrderListAction({}, locationCode, config.api.workshop.workorder, selectedLang);
  }, [GetWorkOrderListAction, selectedLang]);

  useEffect(() => {
    const rows = [],
      headCells = [
        {
          id: "appointmentId",
          numeric: false,
          disablePadding: false,
          label: labels["APP_ID"],
        },
        {
          id: "make",
          numeric: true,
          disablePadding: false,
          label: labels["MAKE_MODEL"],
        },
        {
          id: "createdAt",
          numeric: true,
          disablePadding: false,
          label: labels["INSPECTION_TIME"],
        },
        {
          id: "loc",
          numeric: true,
          disablePadding: false,
          label: labels["WORKSHOP_NAME"],
        },
      ];

    for (let i = 0; i < inspectionList.length; i++) {
      const { appointmentId, make, model, createdAt, loc, version } =
          inspectionList[i];
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
  }, [inspectionList, langTransObj.workOrderPage]);

  const createRowData = (TableCell, row, labelId) => {
    return (
      <Fragment>
        <TableCell component="th" id={labelId} scope="row" padding="normal">
          <Link to={`/work-order-detail/${row.appointmentId}/${row.version}`}>
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
        langTransObj={langTransObj}
        createRowData={createRowData}
        orderByField={"appointmentId"}
        listData={inspectionList}
      />
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    workOrderProps: state.inspectionReducer,
  };
};
const mapDispatchToProps = {
  GetWorkOrderListAction: GetInspectionList,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WorkOrderListContainer);
