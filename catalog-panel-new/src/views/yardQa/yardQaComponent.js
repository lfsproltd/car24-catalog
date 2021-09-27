import React, { useState, useEffect } from "react";
import { Grid, GridColumn } from "@progress/kendo-react-grid";
import "../workshopQa/workshopQa.css";
import { Tooltip } from "@progress/kendo-react-tooltip";
import GridCustomCell from "../../common/GridCustomCell";
import { useDispatch } from "react-redux";
import { dateFormat, timeFormat } from "./../../utils/utils";
import AssignedToCell from "../../common/Tooltip/assignedToCell";
import MakeModelCell from "../../common/Tooltip/makeModelCell";
import InspectionTimeCell from "../../common/Tooltip/inspectionTimeCell";
import WorkshopNameCell from "../../common/Tooltip/workshopNameCell";

const YardQaComponent = (props) => {
    const dispatch = useDispatch();
    const [paginationData, setPaginationData] = useState({ skip: 0, take: 10 });
    const [currentPage, setCurrentPage] = useState("");
    const [qaListingData, setQaListingData] = useState([]);
    const [qaListingCount, setQaListingCount] = useState(0);
    const pageChange = (event) => {
        setPaginationData({
          skip: event.page.skip,
          take: event.page.take
        });
        setCurrentPage(event.page.skip ? event.page.skip / 10 : 0);
        dispatch(props.getYardListing({ page: event.page.skip ? event.page.skip / 10 : 0, size: event.page.take}))
    }

    useEffect(()=>{
        props.yardListing.map(item => {
            if(item && item.updatedAt){
                item["formatedInspectionTime"] = dateFormat(item.updatedAt) + " - " + timeFormat(item.updatedAt);
            }          
        });
        setQaListingData(props.yardListing);
        setQaListingCount(props.qaListingCount);
    },[props]);

    const inputSearchHandler = (value)=>{
        dispatch(props.searchAppointmentId(value+"%","yard"));
        dispatch(props.getWorkshopListingCount("yard",value+"%"));
    }


    const appointmentIdCell = (props) => <GridCustomCell dataLink={'/yard-qa/' + `${props.dataItem.appointmentId}/${props.dataItem.version}`} dataText={props.dataItem.appointmentId} />
    
    return(
        <div className="col-lg-12">
            <div className="gridData">
                <div className="middleContent">
                    <div className="search-box">
                        <input type="text" onChange={(e)=>inputSearchHandler(e.target.value)} placeholder="Search for appointment ID" />
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
                    cell={(e)=> appointmentIdCell(e)}
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

                <GridColumn
                    field="assignedTo"
                    title="Assigned To"
                    cell={AssignedToCell}
                />

            </Grid>
          </Tooltip>
                </div>
            </div>
        </div>
    )
}

export default YardQaComponent;