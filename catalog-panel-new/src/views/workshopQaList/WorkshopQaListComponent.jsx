import React, { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { debounce } from "../../utils/utils";
import ListComp from "../../common/Layouts/ListView";
import AssignedToCell from "../../common/Tooltip/assignedToCell";

const WorkshopQaListComponent = (props) => {
  const {
    workshopQaReducerProps,
    langTransObj,
    selectedLang,
    SearchItemAction,
    listCall
  } = props;


  const { workshopQaListing = [], workshopQaListingCount  } = workshopQaReducerProps

  const [rows, setRows] = useState([]);
  const [headCells, setHeadCells] = useState([]);

  const { labels = {}} = langTransObj  || {}

  useEffect(() => {
    const rows = [],
      headCells = [
        {
          id: "appointmentId",
          numeric: true,
          disablePadding: false,
          label: labels["APP_ID"],
        },
        {
          id: "make",
          numeric: false,
          disablePadding: false,
          label: labels["MAKE_MODEL"],
        },
        {
          id: "createdAt",
          numeric: false,
          disablePadding: false,
          label: labels["INSPECTION_TIME"],
        },
        {
          id: "loc",
          numeric: false,
          disablePadding: false,
          label: labels["WORKSHOP_NAME"],
        },
        {
          id: "assignedTo",
          numeric: false,
          disablePadding: false,
          label: labels["ASSIGNED_TO"],
        },
        
      ];
      workshopQaListing.map((data) => {
      const row_data = {
        appointmentId: data["appointmentId"],
        make: data["make"] + " " + data["model"],
        createdAt: data["createdAt"],
        loc: data["loc"]?.name,
        version: data["version"],
        assignedTo: data["assignedTo"]
      };
      rows.push(row_data);
    });
    setRows(rows);
    setHeadCells(headCells);
  },[workshopQaListing]);

  const createRowData = (TableCell, row, labelId) => {
    return (
      <Fragment>
        <TableCell component="th" id={labelId} scope="row" padding="normal">
          <Link to={`/workshop-qa/${row.appointmentId}/${row.version}`}>
            {row.appointmentId}
          </Link>
        </TableCell>
        <TableCell align="left">{row.make}</TableCell>
        <TableCell align="left">{row.createdAt}</TableCell>
        <TableCell align="left">{row.loc}</TableCell>
        <TableCell align="left">
            <AssignedToCell
              dataItem = {row}
            />
        </TableCell>
      </Fragment>
    );
  };
  const _debouncedFunc = debounce(SearchItemAction, 700);
  const searchItem = (value) => {
    let user = JSON.parse(localStorage.getItem("okta-token-storage"));
    let locationCode = user?.accessToken?.claims?.locations?.toString();
    _debouncedFunc(value + "%", selectedLang, locationCode);
  };

  const onPageChange = (pageNumber) => {
    listCall({ pageNumber });
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
      <input
        type="text"
        onChange={(e) => searchItem(e.target.value)}
        placeholder="Search for appointment ID"
        className="appointment-search-box"
      />
      <ListComp
        rows={rows}
        totalRecords={workshopQaListingCount}
        headCells={headCells}
        langTransObj={langTransObj}
        createRowData={createRowData}
        orderByField={"appointmentId"}
        listData={workshopQaListing}
        pageChangeCb={onPageChange}
      />
    </div>
  );
};

export default WorkshopQaListComponent;
