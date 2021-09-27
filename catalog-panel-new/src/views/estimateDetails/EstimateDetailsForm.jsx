import React, { useState } from "react";
import Button from "@mui/material/Button";

import "./estimateDetailsFormStyles.css";

export default function EstimateDetailsForm(props) {
  const {
    estimateDetails = {},
    data,
    item,
    rowIndex,
    SetEstimateFormDataAction,
    masterData,
  } = props;

  const [isEdit, setIsEdit] = useState(-1);
  const [possibleOptions, setPossibleOptions] = useState({});

  const onEditClick = (editIndex) => {
    setIsEdit(editIndex);
  };

  return (
    data.qualityChecks[item]?.invalidated === false &&
    data.checkpoints[item]?.ok === false && (
      <div className="detail-form-section-wrapper">
        <div className="form-title-wrapper">
          <span className="form-title">{item}</span>
          <span className="form-title-status">
            {data.qualityChecks[item]?.reason === "NO_WORK_TO_BE_DONE" &&
            data.qualityChecks[item]?.status === "APPROVED"
              ? "No work to be done"
              : data.qualityChecks[item]?.status?.toLowerCase()}
          </span>
        </div>

        {/* images section*/}
        {data.checkpoints[item]?.images?.map((image, _index) => (
          <div key={"item" + _index} className="photos-slider">
            <img
              className="photo-slider-image"
              src={image.path}
              alt={image.label}
            />
          </div>
        ))}
        <div className="fields-wrapper">
          <div>
            {/* unacceptable imperfections */}
            {data?.checkpoints[item]?.ok === false &&
              data.checkpoints[item].choices.length && (
                <div className="col-lg-12 light-label dark-span">
                  <h6>Unacceptable Imperfections</h6>
                  {data?.checkpoints[item]?.choices.map((choice) => {
                    return !choice.acceptable ? choice.choice + " | " : "";
                  })}
                </div>
              )}
            {/* work to be done */}
            {isEdit !== rowIndex ? (
              <>
                {data?.checkpoints[item]?.refurbishmentChoices.length && (
                  <div className="col-lg-12 light-label dark-span">
                    <h6 className="work-to-done">Work to be done</h6>
                    {data?.checkpoints[item]?.refurbishmentChoices?.map(
                      (choice, index2) => {
                        return (
                          choice &&
                          choice.refurbishment && (
                            <>
                              <span>
                                {index2 + 1 + ". " + choice.refurbishment + " "}
                              </span>
                              <br />
                            </>
                          )
                        );
                      }
                    )}
                  </div>
                )}
              </>
            ) : null}
          </div>
        </div>
        <div className="action-buttons">
          <Button
            onClick={(_) => {
              onEditClick(rowIndex);
            }}
            className="edit-button"
            variant="contained"
          >
            EDIT
          </Button>
        </div>
      </div>
    )
  );
}
