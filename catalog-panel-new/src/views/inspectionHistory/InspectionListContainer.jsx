import React, { Fragment, useCallback, useEffect, useState } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import ListComp from "../../common/Layouts/ListView";
import { GetInspectionList } from "../../store/actions/inspectionAction";

const InspectionListContainer = (props) => {
  const {
    inspectionProps = {},
    GetInspectionListAction,
    langTransObj,
    selectedLang,
  } = props;
  const { inspectionList = [] } = inspectionProps;
  const [rows, setRows] = useState([]);
  const [headCells, setHeadCells] = useState([]);
  useEffect(() => {
    let user = JSON.parse(localStorage.getItem("okta-token-storage"));
    let locationCode = user?.accessToken?.claims?.locations?.toString();
    GetInspectionListAction &&
      GetInspectionListAction({}, locationCode, selectedLang);
  }, [selectedLang]);

  useEffect(() => {
    const rows = [],
      headCells = [
        {
          id: "appointmentId",
          numeric: false,
          disablePadding: false,
          label: langTransObj.labels["APP_ID"],
        },
        {
          id: "make",
          numeric: false,
          disablePadding: false,
          label: langTransObj.labels["MAKE_MODEL"],
        },
        {
          id: "createdAt",
          numeric: false,
          disablePadding: false,
          label: langTransObj.labels["INSPECTION_TIME"],
        },
        {
          id: "loc",
          numeric: false,
          disablePadding: false,
          label: langTransObj.labels["LOCATION_NAME"],
        },
        {
          id: "locationType",
          numeric: true,
          disablePadding: false,
          label: langTransObj.labels["LOCATION_TYPE"],
        },
      ];

    for (let i = 0; i < inspectionList.length; i++) {
      const {
        appointmentId,
        make,
        model,
        createdAt,
        loc,
        locationType,
        inspectionType,
        version,
      } = inspectionList[i];
      rows.push({
        appointmentId,
        make: `${make} ${model}`,
        createdAt,
        loc: loc?.name,
        locationType,
        inspectionType,
        version,
      });
    }
    setRows(rows);
    setHeadCells(headCells);
  }, [inspectionList, langTransObj.labels]);

  const handleSearch = useCallback(
    (searchedVal) => {
      let user = JSON.parse(localStorage.getItem("okta-token-storage"));
      let locationCode = user?.accessToken?.claims?.locations?.toString();
      GetInspectionListAction &&
        GetInspectionListAction({ searchedVal }, locationCode, selectedLang);
    },
    [GetInspectionListAction, selectedLang]
  );

  const createRowData = (TableCell, row, labelId) => {
    return (
      <Fragment>
        <TableCell component="th" id={labelId} scope="row" padding="normal">
          <Link
            to={`/inspection-history-qa/${row.appointmentId}/${row.version}/${row.inspectionType}`}
          >
            {row.appointmentId}
          </Link>
        </TableCell>
        <TableCell align="left">{row.make}</TableCell>
        <TableCell align="left">{row.createdAt}</TableCell>
        <TableCell align="left">{row.loc}</TableCell>
        <TableCell align="left">{row.locationType}</TableCell>
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
        onSearch={handleSearch}
      />
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    //isLoading: state.loadingReducer.isLoading,
    inspectionProps: state.inspectionReducer,
  };
};
const mapDispatchToProps = {
  GetInspectionListAction: GetInspectionList,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InspectionListContainer);
