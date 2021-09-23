import React, { useState, useEffect } from "react";
import { Grid, GridColumn } from "@progress/kendo-react-grid";
import "./workshopQa.css";
import { Tooltip } from "@progress/kendo-react-tooltip";
import GridCustomCell from "../../common/GridCustomCell";
import { useDispatch } from "react-redux";
import { dateFormat,timeFormat } from "./../../utils/utils";
import AppointmentIdCell from "../../common/Tooltip/AppointmentIdCell";
import MakeModelCell from "../../common/Tooltip/makeModelCell";
import InspectionTimeCell from "../../common/Tooltip/inspectionTimeCell";
import WorkshopNameCell from "../../common/Tooltip/workshopNameCell";
import AssignedToCell from "../../common/Tooltip/assignedToCell";

const WorkshopQaComponent = (props) => {
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
        dispatch(props.getWorkshopListing({ page: event.page.skip ? event.page.skip / 10 : 0, size: event.page.take}))
    }

    useEffect(()=>{
        props.qaListing.map(item => {
            if(item && item.updatedAt){
                item["formatedInspectionTime"] = dateFormat(item.updatedAt) + " - " + timeFormat(item.updatedAt)
            }            
        });
        setQaListingData(props.qaListing);
        setQaListingCount(props.qaListingCount);
    },[props.qaListing]);

    const inputSearchHandler = (value)=>{
        dispatch(props.searchAppointmentId(value+"%"));
        dispatch(props.getWorkshopListingCount("",value+"%"))
    }


    const appointmentIdCell = (props) => <GridCustomCell dataLink={'/workshop-qa/' + `${props.dataItem.appointmentId}/${props.dataItem.version}`} dataText={props.dataItem?.appointmentId} />
    
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
                    title="Workshop Name"
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

export default WorkshopQaComponent;