import React, {useEffect, useRef, useState} from "react";
import { Link } from "react-router-dom";
import Paper from "@mui/material/Paper";

import "./estimateDetailsStyles.css";
import AlertBox from "../../common/showAlert";
import loaderImg from "../../assets/img/loader.png";
import EstimateDetailsForm from "../estimateDetails/EstimateDetailsForm";
import {useReactToPrint} from "react-to-print";
import WorkorderPrintComponent from "./workorderPrintComponent";

const WorkOrderDetailsComponent = (props) => {
  const {
    workOrderDetailsProps: { workOrderDetails = [], masterData } = {},
    langTransObj,
    selectedLang
  } = props;


  const { labels = {}} = langTransObj  || {};

  const [nonAccImperfection, setNonAccImperfection] = useState("");
  const [accImperfection, setAccImperfection] = useState("");

  const [totalEstimates, setTotalEstimates] = useState("");
  const [remainingEstimates, setRemainingEstimates] = useState("");
  const [totalNoWorkToBeDone, setTotalNoWorkToBeDone] = useState("");
  const [acceptableImperfectionRejected, setAcceptableImperfectionRejected] =
    useState(false);
  const [estimatesFieldsInitial, setEstimatesFieldsInitial] = useState({});


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
  } = workOrderDetails.length ? workOrderDetails[0] : {};

  useEffect(() => {
    let totalNonAcceptableImperfections = 0;
    let totalAcceptableImperfections = 0;
    if (workOrderDetails?.length && data.checkpoints) {
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

    if (workOrderDetails?.length && workOrderDetails[0].data) {
      let totalEstimatesToBeFilled = 0,
        totalEstimatesFilled = 0,
        totalEstimatesRejected = 0,
        totalNoWorkToBeDone = 0,
        estimateFields = {};
      Object.keys(data.qualityChecks).forEach((item) => {
        if (
          data?.qualityChecks[item]?.invalidated ===
            false &&
          data.checkpoints[item]?.ok === false
        ) {
          if (
            data?.estimates[item]?.invalidated === false
          ) {
            estimateFields[item] = {
              labourCost:
                data.estimates[item].labourCost >= 0
                  ? data.estimates[item].labourCost
                  : null,
              parts: data.estimates[item].parts
                ? data.estimates[item].parts
                : [{ name: "", cost: null }],
            };
            if (
              !data?.checkpoints[item]?.refurbishmentChoices
            ) {
              estimateFields[item] = {
                labourCost: null,
                parts: [{ name: "", cost: null }],
              };
            }
          } else {
            estimateFields[item] = {
              labourCost: null,
              parts: [{ name: "", cost: null }],
            };
          }
        }
        if (estimateFields?.[item]?.parts?.length === 0) {
          estimateFields[item].parts = [
            {
              name: estimateFields[item]?.parts[0]?.name
                ? estimateFields[item]?.parts[0]?.name
                : "",
              cost: estimateFields[item]?.parts[0]?.cost
                ? estimateFields[item]?.parts[0]?.cost
                : null,
            },
          ];
        }
        //check whether acceptable imperfection is rejected
        if (
          data.qualityChecks[item]?.invalidated === false &&
          data.checkpoints[item]?.ok === true &&
          data.checkpoints[item]?.choices.length &&
          data.qualityChecks[item]?.status === "REJECTED"
        ) {
          setAcceptableImperfectionRejected(true);
        }

        //count of no work to be done
        if (
          data.checkpoints[item]?.ok === false &&
          data?.qualityChecks[item]?.reason ===
            "NO_WORK_TO_BE_DONE" &&
          data?.qualityChecks[item]?.status === "APPROVED"
        ) {
          totalNoWorkToBeDone += 1;
        }

        if (
          data.checkpoints[item]?.ok === false &&
          data?.qualityChecks[item]?.reason !==
            "NO_WORK_TO_BE_DONE"
        ) {
          totalEstimatesToBeFilled += 1;
        }

        if (
          data?.estimates[item] &&
          data?.estimates[item]?.invalidated === false
        ) {
          totalEstimatesFilled += 1;
        }

        if (
          data?.estimates[item] &&
          data?.estimates[item]?.invalidated === false &&
          data?.qualityChecks[item]?.status === "REJECTED"
        ) {
          totalEstimatesRejected += 1;
        }
      });
      setEstimatesFieldsInitial({ ...estimateFields });
      setTotalNoWorkToBeDone(totalNoWorkToBeDone);
      setTotalEstimates(totalEstimatesToBeFilled);
      setRemainingEstimates(
        totalEstimatesToBeFilled -
          +totalEstimatesFilled +
          totalEstimatesRejected
      );
    }
  }, [workOrderDetails]);


  return (
    <div className="wrapper">
          <Link to="/work-order"> Back </Link>
          <PrintComponent data={workOrderDetails[0]}  accImperfection={accImperfection} nonAccImperfection={nonAccImperfection}/>
          <Paper className="paper" elevation={3}>
            <div className="details-wrapper">
              <div className="desc-span">
            <span className="car-desc-title">
              {make} {model}
            </span>{" "}
                {variant} | {fuelType}
              </div>
              <div className="desc-span">
                <span className="desc-title">{labels['APP_ID']}</span>
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
              <div className="desc-span">
                <span className="desc-title">{labels['TOTAL_ESTIMATES']}</span>
                {totalEstimates}
              </div>
              <div className="desc-span">
                <span className="desc-title">{labels['REMAINING_ESTIMATES']}</span>
                {remainingEstimates}
              </div>
              <div className="desc-span">
                <span className="desc-title">{labels['NO_WORK_TO_BE_DONE']}</span>
                {totalNoWorkToBeDone}
              </div>
              <div className="last-div">
                {acceptableImperfectionRejected ? (
                    <span style={{ color: "#F34500" }}>
                {labels['ACCEPTABLE_IMPERFECTION_REJECT_TEXT']}
              </span>
                ) : null}
              </div>
            </div>
          </Paper>
    </div>
  );
};

export default WorkOrderDetailsComponent;

export const PrintComponent = (props) => {
  const [printData,setPrintData] = useState(false);
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current
  });
  useEffect(()=>{
    if(props && props.data){
      setPrintData(true)
    }
  },[props]);
  return (
      <div>
        <button onClick={handlePrint} className="print-button-work-order">Print{printData}</button>
        <div hidden={true}>
          <WorkorderPrintComponent ref={componentRef} data={props.data} accImperfection={props.accImperfection} nonAccImperfection={props.nonAccImperfection}/>
        </div>
      </div>
  );
};