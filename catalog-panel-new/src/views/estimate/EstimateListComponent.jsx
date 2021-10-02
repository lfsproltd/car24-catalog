import React, { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { debounce } from "../../utils/utils";
import ListComp from "../../common/Layouts/ListView";

const EstimateListComponent = (props) => {
  const {
    estimateProps = {},
    langTransObj,
    selectedLang,
    SearchAppointmentAction,
    estimateListCall,
  } = props;
  const { estimateList = [], totalEstimateListCount } = estimateProps;
  const [rows, setRows] = useState([]);
  const [headCells, setHeadCells] = useState([]);

  const { labels = {} } = langTransObj || {};

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
    estimateList.forEach((estimateData) => {
      const row_data = {
        appointmentId: estimateData["appointmentId"],
        make: estimateData["make"] + " " + estimateData["model"],
        createdAt: estimateData["createdAt"],
        loc: estimateData["loc"]?.name,
        version: estimateData["version"],
      };
      rows.push(row_data);
    });
    setRows(rows);
    setHeadCells(headCells);
  }, [estimateProps]);

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
  const _debouncedFunc = debounce(SearchAppointmentAction, 700);
  const searchItem = (value) => {
    let user = JSON.parse(localStorage.getItem("okta-token-storage"));
    let locationCode = user?.accessToken?.claims?.locations?.toString();
    _debouncedFunc(value + "%", selectedLang, locationCode);
  };

  const onPageChange = (pageNumber) => {
    estimateListCall({ pageNumber });
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        overflow: "hidden",
      }}
    >
      <input
        type="text"
        onChange={(e) => searchItem(e.target.value)}
        placeholder="Search for appointment ID"
        className="appointment-search-box"
      />
      <div
        style={{
          display: "flex",
          flex: 1,
          overflow: "hidden",
        }}
      >
        <ListComp
          rows={rows}
          totalRecords={totalEstimateListCount}
          headCells={headCells}
          langTransObj={langTransObj}
          createRowData={createRowData}
          orderByField={"appointmentId"}
          listData={estimateList}
          pageChangeCb={onPageChange}
        />
      </div>
    </div>
  );
};

export default EstimateListComponent;
