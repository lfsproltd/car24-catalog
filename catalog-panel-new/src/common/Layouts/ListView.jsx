import * as React from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import  Pagination from "@mui/material/Pagination";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Paper from "@mui/material/Paper";
import { LIST_PAGE_SIZE } from "../../utils/constants/values.constants";
import { visuallyHidden } from "@mui/utils";

import Stack from '@mui/material/Stack';


function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

function EnhancedTableHead(props) {
  const { order, orderBy, onRequestSort, headCells } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={"left"}
            padding={"normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  onRequestSort: PropTypes.func.isRequired,
  headCells: PropTypes.array.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
};

export default function ListComp(props) {
  const {
    rows = [],
    headCells,
    orderByField,
    createRowData,
    totalRecords,
    pageChangeCb,
  } = props;
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState(orderByField);
  const [page, setPage] = React.useState(0);

  const onPageChange = (args, pageNumber) => {
    if (pageNumber !== page) {
      setPage(pageNumber);
      pageChangeCb && pageChangeCb(pageNumber);
    }
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const addPaginationText = (text) => {
   //document.getElementsByClassName(".MuiPagination-root").appendChild(text);
  }


  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * LIST_PAGE_SIZE - rows.length) : 0;

  return (
    <Box sx={{ display: "flex", flex: 1 }}>
      <Paper sx={{ display: "flex", flex: 1, flexDirection: "column", mb: 2 }}>
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={"small"}
            stickyHeader
            aria-label="sticky table"
          >
            <EnhancedTableHead
              order={order}
              headCells={headCells}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
            />
            <TableBody>
              {stableSort(rows, getComparator(order, orderBy))
                // .slice(
                //   page * LIST_PAGE_SIZE,
                //   page * LIST_PAGE_SIZE + LIST_PAGE_SIZE
                // )
                .map((row, index) => {
                  const labelId = `enhanced-table-checkbox-${index}`;
                  return (
                    <TableRow hover tabIndex={-1} key={row.name}>
                      {createRowData(TableCell, row, labelId)}
                    </TableRow>
                  );
                })}
              {/* {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: 53 * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )} */}
            </TableBody>
          </Table>
        </TableContainer>

        {/* <Stack spacing={2}>
            <Pagination
            onChange={onPageChange}
            count={Math.ceil(totalRecords / LIST_PAGE_SIZE)}
            page={page + 1}
            showFirstButton
            showLastButton
            />
           <p>  {Math.ceil(page * LIST_PAGE_SIZE) + 1} - {Math.ceil(totalRecords / LIST_PAGE_SIZE) } of {totalRecords} </p>

      </Stack> */}

      <TablePagination
      component="p"
      count={totalRecords}
      page={page}
      onPageChange={onPageChange}
      rowsPerPage={LIST_PAGE_SIZE}
      onRowsPerPageChange={onPageChange}
      rowsPerPageOptions={[]}
    />


        {/* <Pagination
          onChange={onPageChange}
          count={Math.ceil(totalRecords / LIST_PAGE_SIZE)}
          page={page + 1}
        /> */}




      </Paper>
    </Box>
  );
}
