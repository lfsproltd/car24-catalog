import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import ClearIcon from "@mui/icons-material/Clear";

// import "./estimateDetailsFormStyles.css";

export default function InspectionDetailsForm(props) {
  const {
    estimateDetails = {},
    data,
    item,
    rowIndex,
    setEstimatesFieldsInitial,
    estimatesFieldsInitial,
    SetEstimateFormDataAction,
    masterData,
    SaveEstimates,
  } = props;
  const [isEdit, setIsEdit] = useState(false);
  let estimatesFinalData = {
    inspectionType: "CATALOG",
    schemaVersion: "IN_CAR_CATALOG_V1",
    data: {
      action: "estimation",
      estimates: {},
    },
  };
  const [otherWorkToBeDoneFieldValue, setOtherWorkToBeDoneFieldValue] =
    useState("");
  const [possibleOptions, setPossibleOptions] = useState({});
  const [formTitle, setFormTitle] = useState("");

  useEffect(() => {
    if (masterData) {
      const { checkpoints = [] } = masterData;
      for (let i = 0; i < checkpoints.length; i++) {
        if (checkpoints[i].key === item) {
          setFormTitle(checkpoints[i].title);
          break;
        }
      }
    }
  }, [masterData]);

  const onEditClick = () => {
    setIsEdit(true);
    let possibleData = {},
      availableData = {},
      filteredData = {};

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
    setPossibleOptions({ ...possibleData });
  };

  const editWorkToBeDone = (item, option, i, value) => {
    let updateWorkToBeDone = {};
    updateWorkToBeDone = { ...possibleOptions };
    if (option?.refurbishment === value.name) {
      updateWorkToBeDone[item].refurbishmentChoices[i].checked =
        !updateWorkToBeDone[item].refurbishmentChoices[i].checked;
    }
    setPossibleOptions(updateWorkToBeDone);
  };

  const checkIfAddMoreDisabled = () => {
    let { parts } = estimatesFieldsInitial[item];
    for (let i = 0; i < parts.length; i++) {
      let { name, cost } = parts[i];
      if (!name || (!cost && String(cost) !== "0")) {
        return true;
      }
    }
  };

  const removeIndex = (partIndex) => {
    let { parts } = estimatesFieldsInitial[item];
    parts = [...parts];
    parts.splice(partIndex, 1);
    estimatesFieldsInitial[item] = {
      ...estimatesFieldsInitial[item],
      parts,
    };
    setEstimatesFieldsInitial({
      ...estimatesFieldsInitial,
    });
  };

  const addMoreParts = () => {
    let { parts } = estimatesFieldsInitial[item];
    parts = [...parts];
    parts.push({ cost: "", name: "" });
    estimatesFieldsInitial[item] = {
      ...estimatesFieldsInitial[item],
      parts,
    };
    setEstimatesFieldsInitial({ ...estimatesFieldsInitial });
  };

  const editParts = (e, partIndex) => {
    let { parts } = estimatesFieldsInitial[item];
    parts = [...parts];
    const { name, value } = e.target;
    parts[partIndex][name] = value;
    estimatesFieldsInitial[item] = {
      ...estimatesFieldsInitial[item],
      parts,
    };
    setEstimatesFieldsInitial({
      ...estimatesFieldsInitial,
    });
  };

  const saveEstimates = () => {
    let editedRefurbs = [];
    if (possibleOptions?.[item]?.refurbishmentChoices) {
      possibleOptions[item].refurbishmentChoices.forEach((row) => {
        if (row.checked === true && row.other === false) {
          editedRefurbs.push({
            other: row.other,
            refurbishment: row.refurbishment,
          });
        }
      });
    }
    if (!!otherWorkToBeDoneFieldValue) {
      editedRefurbs.push({
        refurbishment: otherWorkToBeDoneFieldValue,
        other: true,
      });
    }

    let objSubmit = {};
    objSubmit = { ...estimatesFieldsInitial };
    let sendSingleEstimate = { ...estimatesFieldsInitial };
    if (!!sendSingleEstimate[item].labourCost) {
      estimatesFinalData.data.estimates[item] = {
        labourCost: +sendSingleEstimate[item].labourCost,
      };
    }
    if (
      sendSingleEstimate[item].parts &&
      sendSingleEstimate[item].parts.length
    ) {
      sendSingleEstimate[item].parts.map((part, i, arr) => {
        if (!!part.name && part.cost >= 0) {
          part.cost = +part.cost;
          return arr;
        } else return arr.splice(i, 1);
      });

      estimatesFinalData.data.estimates[item] = objSubmit[item];
      if (
        estimatesFinalData.data.estimates[item] &&
        !!estimatesFinalData.data.estimates[item].labourCost
      )
        estimatesFinalData.data.estimates[item].labourCost =
          +estimatesFinalData.data.estimates[item].labourCost;
    }

    if (editedRefurbs?.length) {
      let uniqRefurbs = [
        ...editedRefurbs
          .reduce((map, obj) => map.set(obj.refurbishment, obj), new Map())
          .values(),
      ];
      estimatesFinalData.data.estimates[item]["refurbishmentChoices"] =
        uniqRefurbs;
    }
    console.log(estimatesFinalData, props);
    // debugger; // disabled
    SaveEstimates(estimatesFinalData, estimateDetails.appointmentId);
  };

  return (
    data.qualityChecks[item]?.invalidated === false &&
    data.checkpoints[item]?.ok === false && (
      <div className="detail-form-section-wrapper">
        <div className="form-title-wrapper">
          <span className="form-title">{formTitle}</span>
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
                          onClick={(e) => {
                            editWorkToBeDone(item, option, ind, e.target);
                          }}
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
            <h6 className="labour-cost-text">Estimated labour cost</h6>
            <input
              type="number"
              className="form-control"
              name={item}
              value={
                estimatesFieldsInitial[item]?.labourCost >= 0
                  ? estimatesFieldsInitial[item]?.labourCost
                  : ""
              }
              onChange={(e) => {
                let { labourCost } = estimatesFieldsInitial[item];
                labourCost = e.target.value;
                estimatesFieldsInitial[item] = {
                  ...estimatesFieldsInitial[item],
                  labourCost,
                };
                setEstimatesFieldsInitial({ ...estimatesFieldsInitial });
              }}
              disabled={
                !isEdit ||
                estimateDetails?.data?.qualityChecks[item].status === "APPROVED"
              }
            />
          </div>
          {/* additional parts section*/}
          <div className="part-cost-wrapper">
            {estimatesFieldsInitial?.[item]?.parts.map(
              (partData, partIndex) => (
                <div className="part-cost-row">
                  <div>
                    <h6 className="work-to-done">Additional part name</h6>
                    <input
                      type="text"
                      className="form-control"
                      name={"name"}
                      value={partData.name ? partData.name : ""}
                      onChange={(e) => editParts(e, partIndex)}
                      disabled={
                        !isEdit ||
                        data.qualityChecks[item].status === "APPROVED"
                      }
                    />
                  </div>
                  <div className="add-part-cost-wrapper">
                    <h6 className="work-to-done">Additional part cost</h6>
                    <input
                      type="number"
                      className="form-control"
                      name={"cost"}
                      value={partData.cost ? partData.cost : ""}
                      onChange={(e) => editParts(e, partIndex)}
                      disabled={
                        !isEdit ||
                        data.qualityChecks[item].status === "APPROVED"
                      }
                    />
                  </div>
                  {partIndex > 0 && isEdit ? (
                    <ClearIcon
                      onClick={() => removeIndex(partIndex)}
                      className="remove-icon"
                    />
                  ) : null}
                </div>
              )
            )}
            {isEdit ? (
              <Button
                onClick={addMoreParts}
                className="add-more-button"
                variant="contained"
                disabled={checkIfAddMoreDisabled()}
              >
                Add More
              </Button>
            ) : null}
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
          {isEdit ? (
            <Button
              onClick={saveEstimates}
              className="save-button"
              variant="contained"
            >
              SAVE
            </Button>
          ) : null}
        </div>
      </div>
    )
  );
}
