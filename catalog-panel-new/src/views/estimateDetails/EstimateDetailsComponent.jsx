import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Paper from "@mui/material/Paper";
import EstimateDetailsForm from "./EstimateDetailsForm";

import "./estimateDetailsStyles.css";

const EstimateDetailsComponent = (props) => {
  const {
    estimateDetailsProps: { estimateDetails = [], masterData } = {},
    SetEstimateFormDataAction,
  } = props;

  const [nonAccImperfection, setNonAccImperfection] = useState("");
  const [accImperfection, setAccImperfection] = useState("");

  const [totalEstimates, setTotalEstimates] = useState("");
  const [remainingEstimates, setRemainingEstimates] = useState("");
  const [totalNoWorkToBeDone, setTotalNoWorkToBeDone] = useState("");
  const [acceptableImperfectionRejected, setAcceptableImperfectionRejected] =
    useState(false);

  const {
    make = "",
    model = "",
    variant = "",
    fuelType = "",
    createdBy: { uid = "" } = {},
    loc: { name: locName = "" } = {},
    appointmentId = "",
    updatedAt = "",
    data = {},
  } = estimateDetails.length ? estimateDetails[0] : {};

  useEffect(() => {
    let totalNonAcceptableImperfections = 0;
    let totalAcceptableImperfections = 0;
    if (estimateDetails?.length && estimateDetails[0].data.checkpoints) {
      Object.keys(estimateDetails[0].data.qualityChecks).map((item) => {
        if (estimateDetails[0].data.qualityChecks[item].invalidated === false) {
          if (estimateDetails[0].data.checkpoints[item].ok === false) {
            totalNonAcceptableImperfections += 1;
          } else if (
            estimateDetails[0].data.checkpoints[item].choices.length > 0
          ) {
            totalAcceptableImperfections += 1;
          }
        }
      });
    }
    setNonAccImperfection(totalNonAcceptableImperfections);
    setAccImperfection(totalAcceptableImperfections);

    if (estimateDetails?.length && estimateDetails[0].data) {
      let totalEstimatesToBeFilled = 0;
      let totalEstimatesFilled = 0;
      let totalEstimatesRejected = 0;
      let totalNoWorkToBeDone = 0;
      Object.keys(estimateDetails[0].data.qualityChecks).forEach((item) => {
        //check whether acceptable imperfection is rejected
        if (
          estimateDetails[0].data.qualityChecks[item]?.invalidated === false &&
          estimateDetails[0].data.checkpoints[item]?.ok === true &&
          estimateDetails[0].data.checkpoints[item]?.choices.length &&
          estimateDetails[0].data.qualityChecks[item]?.status === "REJECTED"
        ) {
          setAcceptableImperfectionRejected(true);
        }

        //count of no work to be done
        if (
          estimateDetails[0].data.checkpoints[item]?.ok === false &&
          estimateDetails[0].data?.qualityChecks[item]?.reason ===
            "NO_WORK_TO_BE_DONE" &&
          estimateDetails[0].data?.qualityChecks[item]?.status === "APPROVED"
        ) {
          totalNoWorkToBeDone += 1;
        }

        if (
          estimateDetails[0].data.checkpoints[item]?.ok === false &&
          estimateDetails[0].data?.qualityChecks[item]?.reason !==
            "NO_WORK_TO_BE_DONE"
        ) {
          totalEstimatesToBeFilled += 1;
        }

        if (
          estimateDetails[0].data?.estimates[item] &&
          estimateDetails[0].data?.estimates[item]?.invalidated === false
        ) {
          totalEstimatesFilled += 1;
        }

        if (
          estimateDetails[0].data?.estimates[item] &&
          estimateDetails[0].data?.estimates[item]?.invalidated === false &&
          estimateDetails[0].data?.qualityChecks[item]?.status === "REJECTED"
        ) {
          totalEstimatesRejected += 1;
        }
      });
      setTotalNoWorkToBeDone(totalNoWorkToBeDone);
      setTotalEstimates(totalEstimatesToBeFilled);
      setRemainingEstimates(
        totalEstimatesToBeFilled -
          +totalEstimatesFilled +
          totalEstimatesRejected
      );
    }
  }, [estimateDetails]);

  console.log("sssssss", estimateDetails);

  return (
    <div className="wrapper">
      <Link to="/estimate">BACK</Link>
      <Paper className="paper" elevation={3}>
        <div className="details-wrapper">
          <div className="desc-span">
            <span className="car-desc-title">
              {make} {model}
            </span>{" "}
            {variant} | {fuelType}
          </div>
          <div className="desc-span">
            <span className="desc-title">Inspected By:</span>
            {uid}
          </div>
          <div className="desc-span">
            <span className="desc-title">WorkShop Name:</span>
            {locName}
          </div>
          <div className="desc-span">
            <span className="desc-title">Appointment ID:</span>
            {appointmentId}
          </div>
          <div className="desc-span">
            <span className="desc-title">Inspection Date:</span>
            {updatedAt}
          </div>
          <div className="desc-span">
            <span className="desc-title">Acceptable Imperfection:</span>
            {accImperfection}
          </div>
          <div className="desc-span">
            <span className="desc-title">Non-Acceptable Imperfection:</span>
            {nonAccImperfection}
          </div>
          <div className="desc-span">
            <span className="desc-title">Total Estimates:</span>
            {totalEstimates}
          </div>
          <div className="desc-span">
            <span className="desc-title">Remaining estimates:</span>
            {remainingEstimates}
          </div>
          <div className="desc-span">
            <span className="desc-title">No work to be done:</span>
            {totalNoWorkToBeDone}
          </div>
          <div className="last-div">
            {acceptableImperfectionRejected ? (
              <span style={{ color: "#F34500" }}>
                Acceptable imperfections have been rejected for this appointment
                id. Please re inspect them through mobile app.
              </span>
            ) : null}
          </div>
        </div>
        {/* photo section here -  */}
        {data && data.qualityChecks
          ? Object.keys(data.qualityChecks).map((item, index) => (
              <EstimateDetailsForm
                key={index + "key"}
                estimateDetails={estimateDetails}
                data={data}
                rowIndex={index}
                item={item}
                SetEstimateFormDataAction={SetEstimateFormDataAction}
                masterData={masterData}
              />
            ))
          : null}
      </Paper>
    </div>
  );
};

export default EstimateDetailsComponent;
