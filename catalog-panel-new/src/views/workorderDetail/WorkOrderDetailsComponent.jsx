import React, {createRef, useEffect, useState} from "react";
import {Link} from "react-router-dom";
import Paper from "@mui/material/Paper";

import "./estimateDetailsStyles.css";
import {useReactToPrint} from "react-to-print";
import WorkorderPrintComponent from "./workorderPrintComponent";

const WorkOrderDetailsComponent = (props) => {
  const {
    workOrderDetailsProps: { inspectionDetails = [], masterData } = {},
    langTransObj,
    selectedLang
  } = props;


  const { labels = {}} = langTransObj  || {};

  const [nonAccImperfection, setNonAccImperfection] = useState("");
  const [accImperfection, setAccImperfection] = useState("");

  const {
    make = "",
    model = "",
    variant = "",
    fuelType = "",
    createdBy: { uid = "" } = {},
    loc: { name: locName = "" } = {},
    appointmentId = "",
    updatedAt = "",
    formatedUpdatedAt= "",
    data = {},
  } = inspectionDetails.length ? inspectionDetails[0] : {};

  useEffect(() => {
    let totalNonAcceptableImperfections = 0;
    let totalAcceptableImperfections = 0;
    if (inspectionDetails?.length && data.checkpoints) {
      Object.keys(data.qualityChecks).map((item) => {
        if (data.qualityChecks[item].invalidated === false) {
          if (data.checkpoints[item].ok === false) {
            totalNonAcceptableImperfections += 1;
          } else if (
            data.checkpoints[item].choices.length > 0
          ) {
            totalAcceptableImperfections += 1;
          }
        }
      });
    }
    setNonAccImperfection(totalNonAcceptableImperfections);
    setAccImperfection(totalAcceptableImperfections);
  }, [inspectionDetails]);


  return (
    <div className="wrapper">
          <Link to="/work-order"> Back </Link>
          <PrintComponent data={inspectionDetails[0]}  accImperfection={accImperfection} nonAccImperfection={nonAccImperfection} langTransObj={langTransObj}/>
          <Paper className="paper" elevation={3}>
            <div className="details-wrapper">
              <div className="desc-span">
                <span className="car-desc-title">
                  {make} {model}
                </span>{" "}
                    {variant} | {fuelType}
              </div>
              <div className="desc-span">
                <span className="desc-title">{labels['INSPECTION_BY']}</span>
                {uid}
              </div>
              <div className="desc-span">
                <span className="desc-title">{labels['WORKSHOP_NAME']}</span>
                {locName}
              </div>
              <div className="desc-span">
                <span className="desc-title">{labels['APPOINTMENT_ID']}</span>
                {appointmentId}
              </div>
              <div className="desc-span">
                <span className="desc-title">{labels['INSPECTION_DATE']}</span>
                {updatedAt}
              </div>
              <div className="desc-span">
                <span className="desc-title">{labels['ACCEPTABLE_IMPERFECTION']}</span>
                {accImperfection}
              </div>
              <div className="desc-span">
                <span className="desc-title">{labels['NON_ACCEPTABLE_IMPERFECTION']}</span>
                {nonAccImperfection}
              </div>

            </div>
            {/* photo section here -  */}
            {inspectionDetails.data?.qualityChecks ? Object.keys(inspectionDetails.data.qualityChecks).map((item, index) => {
              return (
                  <>
                    {inspectionDetails.data.qualityChecks[item]?.invalidated === false &&
                    inspectionDetails.data.checkpoints[item]?.ok === false &&
                    (inspectionDetails.data.qualityChecks[item]?.reason !== "NO_WORK_TO_BE_DONE" &&
                        inspectionDetails.data.qualityChecks[item]?.status === "APPROVED") &&
                    (
                        <div className="container-box-card mt-4">
                          <label className="label-top">{item + " "}</label>
                          <label className="label-top status-right-aligned">{inspectionDetails.data.qualityChecks[item].status.toLowerCase()}</label>
                          <div className="shaded-border"></div>
                          <div className="info-container">
                            <div className="row my-2 mx-2">
                              <div className="col-lg-6">
                                {inspectionDetails.data.checkpoints[item] && inspectionDetails.data.checkpoints[item].ok === false &&
                                inspectionDetails.data.checkpoints[item].choices.length  > 0 &&(
                                    <div className="col-lg-12 light-label dark-span">
                                      <h6>Unacceptable Imperfections</h6>
                                      {inspectionDetails.data.checkpoints[item].choices.map((choice)=>{
                                        return(!choice.acceptable ? choice.choice + ' | ' : '')
                                      })}
                                    </div>
                                )}

                                {inspectionDetails.data.checkpoints[item].refurbishmentChoices.length  > 0 && (
                                    <div className="col-lg-12 light-label dark-span">
                                      <h6 className="work-to-done">Work to be done</h6>
                                      {inspectionDetails.data.checkpoints[item].refurbishmentChoices.map((choice,index)=>{
                                        return(index+1 +". "+ choice.refurbishment + ' ')
                                      })}
                                    </div>
                                )}

                                <div className="col-lg-12 light-label dark-span">
                                  <h6 className="work-to-done">Estimated labour cost</h6>
                                  <input type="text" className="form-control"
                                         value={inspectionDetails.data.estimates && inspectionDetails.data.estimates[item] &&
                                         inspectionDetails.data.estimates[item].invalidated === false &&
                                         (inspectionDetails.data.estimates[item].labourCost ||
                                             inspectionDetails.data.estimates[item].labourCost === 0)?
                                             inspectionDetails.data.estimates[item].labourCost : null}
                                         disabled={inspectionDetails.data.qualityChecks[item].status === "APPROVED"}/>
                                </div>

                              </div>
                              <div className="col-lg-6">
                                {inspectionDetails.data.estimates && inspectionDetails.data.estimates[item] &&
                                inspectionDetails.data.estimates[item].invalidated === false &&
                                inspectionDetails.data.estimates[item].parts &&
                                inspectionDetails.data.estimates[item].parts.map((part,index2)=>{
                                  return(
                                      <div className="row">
                                        <div className="col-lg-6 light-label dark-span">
                                          <h6>Additional part name</h6>
                                          <input type="text" className="form-control"
                                                 value={part && part.name ? part.name : null}
                                                 disabled={inspectionDetails.data.qualityChecks[item].status === "APPROVED"}/>
                                        </div>
                                        <div className="col-lg-6 light-label dark-span">
                                          <h6>Additional part cost</h6>
                                          <input type="text" className="form-control"
                                                 value={part && (part.cost || part.cost === 0) ? part.cost : null}
                                                 disabled={inspectionDetails.data.qualityChecks[item].status === "APPROVED"}/>
                                        </div>
                                      </div>
                                  )
                                })}
                              </div>
                            </div>
                          </div>
                        </div>
                    )}
                  </>
                )
                })
                : (null)}
          </Paper>
    </div>
  );
};

export default WorkOrderDetailsComponent;

export const PrintComponent = (props) => {
  const [printData,setPrintData] = useState(false);
  const componentRef = createRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current
  });
  useEffect(()=>{
    if(props && props.data){
      setPrintData(true)
    }
    if(props && props.langTransObj) {

    }
  },[props]);
  return (
      <div align="right">
        <button onClick={handlePrint} className="print-button-work-order">Print{printData}</button>
        <div hidden={true}>
          <WorkorderPrintComponent ref={componentRef}
                                   data={props.data}
                                   accImperfection={props.accImperfection}
                                   nonAccImperfection={props.nonAccImperfection}
                                   langTransObj={props.langTransObj}/>
        </div>
      </div>
  );
};