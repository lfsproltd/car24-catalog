import React, { useState } from "react";
import Button from "@mui/material/Button";

import "./estimateDetailsFormStyles.css";

export default function EstimateDetailsForm(props) {
  const {
    estimateDetails = {},
    data,
    item,
    rowIndex,
    setEstimatesFieldsInitial,
    estimatesFieldsInitial,
    SetEstimateFormDataAction,
    masterData,
  } = props;
  const [isEdit, setIsEdit] = useState(false);
  const [otherWorkToBeDoneFieldValue, setOtherWorkToBeDoneFieldValue] =
    useState("");
  const [possibleOptions, setPossibleOptions] = useState({});
  const onEditClick = () => {
    setIsEdit(true);
    let possibleData = {},
      availableData = {},
      filteredData = {};

    if (estimatesFieldsInitial?.[item]?.parts?.length === 0) {
      estimatesFieldsInitial[item].parts = [
        {
          name: estimatesFieldsInitial[item]?.parts[0]?.name
            ? estimatesFieldsInitial[item]?.parts[0]?.name
            : "",
          cost: estimatesFieldsInitial[item]?.parts[0]?.cost
            ? estimatesFieldsInitial[item]?.parts[0]?.cost
            : null,
        },
      ];
    }
    if (masterData?.checkpoints) {
      masterData.checkpoints.forEach((checkpoint) => {
        if (checkpoint.key === item) {
          if (checkpoint?.refurbishment?.choices) {
            possibleData[item] = {
              refurbishmentChoices: [],
            };
            checkpoint.refurbishment.choices.forEach((name) => {
              possibleData[item].refurbishmentChoices.push({
                other: false,
                refurbishment: name,
                checked: false,
              });
            });
          }
        }
        possibleData = { ...possibleData };
      });
    }
    if (data?.checkpoints[item]?.refurbishmentChoices) {
      availableData[item] = {
        refurbishmentChoices: [],
      };
      data.checkpoints[item].refurbishmentChoices.forEach((_choice) => {
        data.checkpoints[item].refurbishmentChoices.forEach((_choice) => {
          if (_choice?.other === true) {
            setOtherWorkToBeDoneFieldValue(_choice.refurbishment);
          }
        });
        availableData[item].refurbishmentChoices.push({
          other: _choice.other,
          refurbishment: _choice.refurbishment,
          checked: true,
        });
      });

      if (
        possibleData[item]?.refurbishmentChoices &&
        availableData[item]?.refurbishmentChoices
      ) {
        filteredData[item] = {
          refurbishmentChoices: [],
        };
        let combinedData = [
          ...possibleData[item].refurbishmentChoices,
          ...availableData[item].refurbishmentChoices,
        ];
        filteredData[item].refurbishmentChoices = [
          ...combinedData
            .reduce((map, obj) => map.set(obj.refurbishment, obj), new Map())
            .values(),
        ];
        possibleData = filteredData;
      }
    }
    setEstimatesFieldsInitial({ ...estimatesFieldsInitial });
    setPossibleOptions({ ...possibleData });
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
            {!isEdit ? (
              data?.checkpoints[item]?.refurbishmentChoices.length && (
                <div className="col-lg-12 light-label dark-span">
                  <h6 className="work-to-done">Work to be done</h6>
                  <div className="work-to-be-done-list">
                    {data?.checkpoints[item]?.refurbishmentChoices?.map(
                      (choice, index2) => {
                        return (
                          choice?.refurbishment && (
                            <span>
                              {`${index2 + 1}. ${choice.refurbishment}`}
                            </span>
                          )
                        );
                      }
                    )}
                  </div>
                </div>
              )
            ) : (
              <div className="edit-fields">
                {possibleOptions[item]?.refurbishmentChoices?.map(
                  (option, ind) => {
                    return option?.other === false ? (
                      <div>
                        <input
                          type="checkbox"
                          name={option.refurbishment}
                          checked={option.checked}
                          onClick={
                            (e) => {}
                            // editWorkToBeDone(item, option, ind, e.target)
                          }
                        />
                        <span>{" " + option.refurbishment}</span>
                      </div>
                    ) : null;
                  }
                )}
                <span>Other: </span>
                <input
                  className="form-control"
                  type="textbox"
                  name="otherWorkToBeDoneField"
                  value={otherWorkToBeDoneFieldValue}
                  onChange={(e) =>
                    setOtherWorkToBeDoneFieldValue(e.target.value)
                  }
                />
              </div>
            )}
            <h6 className="work-to-done">Estimated labour cost</h6>
            <input
              type="text"
              className="form-control"
              name={item}
              value={
                estimatesFieldsInitial[item]?.labourCost >= 0
                  ? estimatesFieldsInitial[item]?.labourCost
                  : ""
              }
              onChange={(e) => {}}
              disabled={
                !isEdit ||
                estimateDetails?.data?.qualityChecks[item].status === "APPROVED"
              }
            />
          </div>
        </div>
        <div className="action-buttons">
          <Button
            onClick={(_) => {
              !isEdit ? onEditClick() : setIsEdit(false);
            }}
            className="edit-button"
            variant="contained"
          >
            {isEdit ? "CANCEL" : "EDIT"}
          </Button>
        </div>
      </div>
    )
  );
}
