import React, { useState, useEffect } from "react";
// import { useDispatch } from "react-redux";
import loaderImg from "../../assets/img/loader.png";
import AlertBox from "./../../common/showAlert";
import "./yardQaDetailsFormStyles.css";
import { useHistory } from "react-router-dom";
import { dateFormat, setLocationType, timeFormat } from "../../utils/utils";
import { AlertType } from "../../utils/constants/values.constants";
import { Link } from "react-router-dom";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { connect } from "react-redux";
import {
  getYardListingDetails,
  approveQualityChecks,
  addTagging,
} from "../../store/actions/workshopQaManagement/workshopQaManagement.action";
import CustomDialog from "./../dialog/customDialog";
import Question from "../../assets/img/question.svg";
import Popup from "../../common/popup/";
import QuestionMarkPopUp from "../../components/question-mark-pop-up";
import SummaryList from "../summaryListDetail/summaryListComponent";

const YardQaDetailsComponent = (props) => {
  // Actions
  const {
    ApproveQualityChecksAction,
    GetYardListingDetailsAction,
    GetMasterDataQaImageKeysAction,
    SetToasterMessageAction,
    AddTaggingAction,
    langTransObj,
    selectedLang,
    masterData,
  } = props;

  const {
    make = "",
    model = "",
    variant = "",
    fuelType = "",
    schemaVersion = "",
    //createdBy: { uid = "" } = {},
    loc: { name: locName = "" } = {},
    appointmentId = "",
    updatedAt = "",
    data = {},
    assignedTo: { assignedTo = "" } = {},
    
  } = props.listingDetails.length ? props.listingDetails[0] : {};

  

  // This is for label in Different language
  const { labels = {} } = langTransObj || {};

  // const dispatch = useDispatch();
  let imperfectionActionsData = {
    inspectionType: "CATALOG",
    locationType: "",
    schemaVersion: "IN_CAR_CATALOG_V1",
    data: {
      action: "qa",
      qualityChecks: {},
    },
  };
  const [allocateOpen, setAllocateOpen] = useState(false);
  const [hintData, setHintData] = useState({});

  const onAllocateOpen = (item) => {
    masterData &&
      masterData.checkpoints.map((data) => {
        if (data.key === item) {
          setHintData(data);
        }
      });

    setAllocateOpen(true);
  };

  const onAllocateClose = () => {
    setAllocateOpen(false);
  };

  useEffect(() => {
    if (
      props.listingDetails &&
      props.listingDetails[0] &&
      props.listingDetails[0].inspectionStatus === "QC_DONE"
    ) {
      setIsSummaryList(true);
    }

    if (
      props.listingDetails &&
      props.listingDetails[0] &&
      props.listingDetails[0].inspectionStatus !== "ESTIMATED" &&
      props.listingDetails[0].inspectionStatus !== "QC_DONE"
    ) {
      window.location.pathname = "yard-qa";
    }
  }, [props.listingDetails]);

  const [appointmentDetails, setAppointmentDetails] = useState({});
  const [showHideToggler, setShowHideToggler] = useState(false);
  const [imperfectionCount, setImperfectionCount] = useState("");
  const [nonAccImperfection, setNonAccImperfection] = useState("");
  const [accImperfection, setAccImperfection] = useState("");
  const [isRejected, setRejectAction] = useState("");
  const [comment, setComment] = useState("");
  const [toggleViewHandlerFlag, setToggleViewHandler] = useState("");
  let [qcActionData, setQcActionData] = useState(imperfectionActionsData);
  const [allImages, setAllImages] = useState([]);
  const [allVideos, setAllVideos] = useState([]);
  const [actionArray, setActionArray] = useState([]);
  const [lastInspectionData, setInspectionData] = useState([]);
  const [toggleLastInspection, setToggleLastInspection] = useState("");
  const [mediaType, setMediaType] = useState("image");
  const [magnifyImg, setMagnifier] = useState("");
  const [showOnRejectSubmitError, setShowOnRejectSubmitError] = useState(false);
  const [qcPendingStatusLength, setQcPendingStatusLength] = useState(0);
  const [qcPendingStatusAcceptableImp, setQcPendingStatusAcceptableImp] =
    useState(0);
  const [qcActionCompletedStatus, setQcActionCompletedStatus] = useState(0);
  const [iscorrectAssigned, setIscorrectAssigned] = useState(false);
  const [reEdit, setReEdit] = useState("");
  //For editing checkpoints data starts
  //const [masterData, setMasterData] = useState({});
  const [isCheckpointEdit, setIsEditCheckpoint] = useState("");
  const [stateToBeUpdated, setStateToBeUpdated] = useState({});
  const [isOkNoImperfSelected, setIsOkNoImperfectionSelected] = useState("");
  const [otherImperfectionEntered, setOtherImperfectionEntered] = useState("");
  const [otherWorkToBeDone, setOtherWorkToBeDone] = useState("");
  const [disableWhenAcceptableImperf, setDisableWhenAcceptableImperf] =
    useState(false);

  const [isConfirmationDialog, setIsConfirmationDialog] = useState(false);
  const [getConfirmation, setGetConfirmation] = useState(false);
  const [dataKey, setDataKey] = useState("");
  const [confirmationForOnSubmitReject, setConfirmationForOnSubmitReject] =
    useState({
      item: "",
      index: "",
      comment: "",
      optional: false,
      isConfirm: false,
    });

  //For editing checkpoints data ends

  // Tag summarry code starts here
  const [isSummaryList, setIsSummaryList] = useState(false);

  useEffect(() => {
    let totlaNonAcceptableImperfections = 0;
    let totlalAcceptableImperfections = 0;
    let searchParams = {
      appointmentId: "",
      inspectionType: "YARD",
      version: "all",
      lang: selectedLang
    };
    let allImages = [];
    let allVideos = [];
    if (appointmentId) {
      searchParams.appointmentId = appointmentId;
      props.GetLastInspectionDataAction(searchParams);
      setInspectionData(props.lastInspectionData[1]);
    }
    if (data.checkpoints) {
      Object.keys(data.checkpoints).map((item) => {
        props.qaTopImagesKeys.map((itemTop) => {
          if (itemTop === item) {
            data.checkpoints[itemTop].images.map((item, index) => {
              allImages.push(item);
            });
            data.checkpoints[itemTop].videos.map((item, index) => {
              allVideos.push(item);
            });
          }
        });
        setAllImages(allImages);
        setAllVideos(allVideos);
      });

      Object.keys(data.qualityChecks).map((item) => {
        if (data.qualityChecks[item].invalidated === false) {
          if (data.checkpoints[item].ok === false) {
            totlaNonAcceptableImperfections += 1;
          } else if (data.checkpoints[item].choices.length > 0) {
            totlalAcceptableImperfections += 1;
          }
        }
      });
    }
    setNonAccImperfection(totlaNonAcceptableImperfections);
    setAccImperfection(totlalAcceptableImperfections);
    let totalQCheck = 0;
    if (data.qualityChecks) {
      Object.keys(data.qualityChecks).map((item) => {
        Object.keys(data.qualityChecks[item]).map((invalidated) => {
          if (
            invalidated &&
            invalidated === "invalidated" &&
            data.qualityChecks[item][invalidated] === false
          ) {
            totalQCheck += 1;
          }
        });
      });

      setImperfectionCount(totalQCheck);

      let lengthQc = 0;
      let acceptableImp = 0;
      if (data.qualityChecks) {
        Object.keys(data.qualityChecks).map((item) => {
          if (
            data.qualityChecks[item].status === "PENDING" &&
            data.qualityChecks[item].invalidated === false
          ) {
            lengthQc += 1;
          }
        });
        setQcPendingStatusLength(lengthQc);
      }

      if (data.checkpoints) {
        Object.keys(data.checkpoints).map((item) => {
          if (
            data.qualityChecks[item]?.status === "APPROVED" ||
            data.checkpoints[item]?.ok === true
          ) {
            acceptableImp += 1;
          }
        });
      }
      setQcPendingStatusAcceptableImp(acceptableImp);
    }
  }, [props.listingDetails]);

  useEffect(() => {
    let userData = JSON.parse(localStorage.getItem("userData"));

    if (userData && userData.email && assignedTo) {
      setIscorrectAssigned(userData.email === assignedTo.uid);
    }
    //TODO: What is this?
    props &&
      props.listingDetails.map((item) => {
        if (item && item.updatedAt) {
          item.formatedUpdatedAt = dateFormat(item.updatedAt);
        }
      });
    //TODO: Where is it using
    setAppointmentDetails(props.listingDetails[0]);
  }, [props.listingDetails]);

  useEffect(() => {
    props &&
      props.lastInspectionData.map((item) => {
        if (item && item.updatedAt) {
          item.formatedUpdatedAt = dateFormat(item.updatedAt);
          item.formatedUpdateAtTime = timeFormat(item.updatedAt);
        }
      });
    if (
      props &&
      props.lastInspectionData &&
      props.lastInspectionData.length > 1
    ) {
      props.lastInspectionData.sort((a, b) => {
        return b.version - a.version;
      });
      setInspectionData(props.lastInspectionData[1]);
    }
  }, [props.lastInspectionData]);

  // useEffect(()=>{
  //   if(props && props.masterData){
  //     setMasterData(props.masterData);
  //   }
  // },[props.masterData]);

  const handleRejectionComment = (event) => {
    setComment(event.target.value);
  };

  useEffect(() => {
    if (getConfirmation && confirmationForOnSubmitReject.isConfirm) {
      onSubmitReject(
        confirmationForOnSubmitReject.item,
        confirmationForOnSubmitReject.index,
        confirmationForOnSubmitReject.comment,
        confirmationForOnSubmitReject.optional
      );
    }
  }, [getConfirmation]);

  const rejectHandler = (item) => {
    let obj = {};
    obj = { ...qcActionData };
    obj.data.qualityChecks = {};
    setQcActionData({ ...obj });
    setConfirmationForOnSubmitReject({
      item: "",
      index: "",
      comment: "",
      optional: false,
      isConfirm: false,
    });
  };

  const onSubmitReject = (item, index, comment, optional) => {
    setReEdit("");
    if (!comment || comment === "") {
      setShowOnRejectSubmitError(true);
      return false;
    }
    setConfirmationForOnSubmitReject({
      item: item,
      index: index,
      comment: comment,
      optional: optional,
      isConfirm: true,
    });
    setIsConfirmationDialog(true);
    setShowOnRejectSubmitError(false);
    let obj = {};
    obj = { ...qcActionData };
    obj.data.qualityChecks[item] = { status: "REJECTED", comment: comment };
    setQcActionData({ ...obj });

    let newActionArray = [];
    newActionArray = [...actionArray];
    newActionArray.push(index);
    setActionArray([...newActionArray]);
    if (optional === false) {
      let qcActionCompletedStatus = 0;
      if (appointmentDetails?.data?.qualityChecks) {
        Object.keys(appointmentDetails.data.qualityChecks).map((key) => {
          if (qcActionData.data.qualityChecks[key]) {
            qcActionCompletedStatus += 1;
            setQcActionCompletedStatus(qcActionCompletedStatus);
          }
        });
      }
    }

    // Submitting single request
    if (getConfirmation && confirmationForOnSubmitReject.isConfirm) {
      if (
        appointmentDetails &&
        appointmentDetails.inspectionStatus === "ESTIMATED"
      ) {
        let appointmentId = window.location.pathname.split("/")[2];
        qcActionData.locationType = appointmentDetails.locationType;
        ApproveQualityChecksAction(
          qcActionData,
          appointmentId,
          "Rejected successfully"
        );
        setQcActionData(imperfectionActionsData);
        setActionArray([]);
        setComment("");
        setRejectAction("");
        // Refreshing list details
        let params = {
          appointmentId: appointmentDetails.appointmentId,
          inspectionType: "CATALOG",
        };
        setTimeout(() => {
          //TODO: Why Duplicate
          GetYardListingDetailsAction(params);
          GetYardListingDetailsAction(params);
        }, 1000);
        setGetConfirmation(false);
        setIsConfirmationDialog(false);
        setConfirmationForOnSubmitReject({
          item: "",
          index: "",
          comment: "",
          optional: false,
          isConfirm: false,
        });
      } else {
        props.SetToasterMessageAction({
          toasterMessage: "Something went wrong",
          showToaster: true,
          toasterType: AlertType.ERROR,
        });
      }
    }
  };

  const onSubmitApprove = (item, index, optional) => {
    setReEdit("");
    let obj = {};
    obj = { ...qcActionData };
    obj.data.qualityChecks[item] = { status: "APPROVED" };
    setQcActionData({ ...obj });

    let newActionArray = [];
    newActionArray = [...actionArray];
    newActionArray.push(index);
    setActionArray([...newActionArray]);
    if (optional === false) {
      let qcActionCompletedStatus = 0;
      if (appointmentDetails?.data?.qualityChecks) {
        Object.keys(appointmentDetails.data.qualityChecks).map((key) => {
          if (qcActionData.data.qualityChecks[key]) {
            qcActionCompletedStatus += 1;
            setQcActionCompletedStatus(qcActionCompletedStatus);
          }
        });
      }
    }

    if (
      appointmentDetails &&
      appointmentDetails.inspectionStatus === "ESTIMATED"
    ) {
      let appointmentId = window.location.pathname.split("/")[2];
      qcActionData.locationType = appointmentDetails.locationType;
      ApproveQualityChecksAction(
        qcActionData,
        appointmentId,
        "Approved successfully"
      );
      setQcActionData(imperfectionActionsData);
      setActionArray([]);

      // Refreshing list details
      let params = {
        appointmentId: appointmentDetails.appointmentId,
        inspectionType: "CATALOG",
      };
      setTimeout(() => {
        GetYardListingDetailsAction(params);
        GetYardListingDetailsAction(params);
      }, 1000);
    } else {
      SetToasterMessageAction({
        toasterMessage: "Something went wrong",
        showToaster: true,
        toasterType: AlertType.ERROR,
      });
    }
  };

  const qcActionResetHandler = (item, index, optional) => {
    setReEdit(index);
    setActionArray(actionArray.filter((item) => item !== index));
    let obj = {};
    obj = { ...qcActionData };
    delete obj.data.qualityChecks[item];
    setQcActionData({ ...obj });
    if (optional === false) {
      let qcActionCompletedCount = 1;
      setQcActionCompletedStatus(
        qcActionCompletedStatus - qcActionCompletedCount
      );
    }
  };



  const submitAllQcAction = () => {
    let params = {
      appointmentId: appointmentDetails.appointmentId,
      inspectionType: "CATALOG",
    };
    if (
      appointmentDetails &&
      appointmentDetails.inspectionStatus === "QC_DONE"
    ) {
      setIsSummaryList(true);
      return;
    } else {
      setIsSummaryList(false);
    }
    if (
      appointmentDetails &&
      appointmentDetails.inspectionStatus === "ESTIMATED"
    ) {
      let appointmentId = window.location.pathname.split("/")[2];
      let payload = {
        inspectionType: "CATALOG",
        schemaVersion: "IN_CAR_CATALOG_V1",
        data: {
          action: "submitQa",
        },
      };
      ApproveQualityChecksAction(
        payload,
        appointmentId,
        "Submitted successfully",
        "no redirect -- submit all qc yardQA"
      );
      setQcActionData(imperfectionActionsData);
      setActionArray([]);
    } else {
      props.SetToasterMessageAction({
        toasterMessage: "Something went wrong",
        showToaster: true,
        toasterType: AlertType.ERROR,
      });
    }

    setTimeout(() => {
      //TODO: Why duplicate
      GetYardListingDetailsAction(params);
      GetYardListingDetailsAction(params);
    }, 1000);
  };

  const toggleVideoHandler = (index) => {
    setToggleViewHandler(index);
  };

  const toggleVideoHandler2 = (index, type) => {
    setMediaType(type);
  };

  const toggleImageHandler = (index) => {
    setToggleViewHandler("");
  };

  const toggleImageHandler2 = (index, type) => {
    setMediaType(type);
  };

  const toggleLastInspectionHandler = (index) => {
    setToggleLastInspection(index);
    setShowHideToggler(!showHideToggler);
  };

  const imageMagnifier = (data) => {
    setMagnifier(data);
  };

  // Handlers to update checkpoints data starts here
  const editCheckpointClicked = (index, checkpointName) => {
    setConfirmationForOnSubmitReject({
      item: "",
      index: "",
      comment: "",
      optional: false,
      isConfirm: false,
    });
    setIsConfirmationDialog(false);
    setIsEditCheckpoint(index);
    setReEdit("");
    setRejectAction("");
    setIsOkNoImperfectionSelected("");
    setOtherImperfectionEntered("");
    setStateToBeUpdated({});
    let prevCondition = {
      acceptImpChoices: {},
      nonAcceptImpChoices: {},
    };

    if (
      appointmentDetails &&
      appointmentDetails.data &&
      appointmentDetails.data.checkpoints &&
      appointmentDetails.data.checkpoints[checkpointName]
    ) {
      masterData &&
        masterData.checkpoints &&
        masterData.checkpoints.map((masterData) => {
          if (checkpointName === masterData.key) {
            masterData &&
              masterData.noImperfectionChoices &&
              masterData.noImperfectionChoices.map((option) => {
                if (
                  appointmentDetails.data.checkpoints[
                    checkpointName
                  ].noImperfectionChoices.includes(option.name)
                ) {
                  setIsOkNoImperfectionSelected(option.name);
                }
              });
          }
        });

      //Imperfections
      if (appointmentDetails.data.checkpoints[checkpointName]) {
        prevCondition.nonAcceptImpChoices["choices"] =
          appointmentDetails.data.checkpoints[checkpointName].choices;
        prevCondition.nonAcceptImpChoices["choices"].map((choice, index) => {
          if (choice.other === true) {
            setOtherImperfectionEntered(choice.choice);
          }
          choice.selected = true;
          return choice;
        });
      }

      // Possible options
      if (masterData && masterData.checkpoints) {
        let addPossibleChoices = [];
        masterData.checkpoints.map((item) => {
          if (item.key === checkpointName) {
            if (item && item.choices) {
              item.choices.map((choice) => {
                addPossibleChoices.push({
                  acceptable: choice?.type === "absolute" ? false : true,
                  choice: choice.name,
                  other: false,
                  selected: false,
                });
              });
            }
          }
        });
        if (
          prevCondition.nonAcceptImpChoices["choices"] &&
          addPossibleChoices
        ) {
          prevCondition.nonAcceptImpChoices["choices"] = [
            ...addPossibleChoices,
            ...prevCondition.nonAcceptImpChoices["choices"],
          ];
          prevCondition.nonAcceptImpChoices["choices"] = [
            ...prevCondition.nonAcceptImpChoices["choices"]
              .reduce((map, obj) => map.set(obj.choice, obj), new Map())
              .values(),
          ];
        } else if (
          !prevCondition.nonAcceptImpChoices["choices"] &&
          addPossibleChoices
        ) {
          prevCondition.nonAcceptImpChoices["choices"] = [
            ...addPossibleChoices,
          ];
          prevCondition.nonAcceptImpChoices["choices"] = [
            ...prevCondition.nonAcceptImpChoices["choices"]
              .reduce((map, obj) => map.set(obj.choice, obj), new Map())
              .values(),
          ];
        }
      }
      setStateToBeUpdated({ ...prevCondition });
    }
  };

  const changeChoicesHandler = (type, index, value) => {
    if (type === "modify") {
      stateToBeUpdated.nonAcceptImpChoices.choices[index].choice = value;
    }
    if (type === "nonAccept") {
      setIsOkNoImperfectionSelected("");
      stateToBeUpdated.nonAcceptImpChoices.choices[index].selected =
        !stateToBeUpdated.nonAcceptImpChoices.choices[index].selected;
    }
    if (type === "accept") {
      setIsOkNoImperfectionSelected("");
      stateToBeUpdated.acceptImpChoices.choices[index].selected =
        !stateToBeUpdated.acceptImpChoices.choices[index].selected;
    }
    setStateToBeUpdated({ ...stateToBeUpdated });
  };

  const changeImperfectionType = (choice, index, imperfectionType) => {
    stateToBeUpdated.nonAcceptImpChoices.choices[index].acceptable =
      !stateToBeUpdated.nonAcceptImpChoices.choices[index].acceptable;
    setStateToBeUpdated({ ...stateToBeUpdated });
  };

  const isNotApplicableSelected = (value) => {
    setOtherImperfectionEntered("");
    setOtherWorkToBeDone("");
    setDisableWhenAcceptableImperf(false);
    setIsOkNoImperfectionSelected(value);
    if (
      stateToBeUpdated.nonAcceptImpChoices &&
      stateToBeUpdated.nonAcceptImpChoices.choices
    ) {
      stateToBeUpdated.nonAcceptImpChoices.choices.map((data) => {
        data.selected = false;
        return data;
      });
    }
  };

  const otherImperfection = (value) => {
    setIsOkNoImperfectionSelected("");
    setDisableWhenAcceptableImperf(false);
    setOtherImperfectionEntered(value);
  };

  const checkpointEditCancled = (item) => {
    let params = {
      appointmentId: appointmentDetails.appointmentId,
      inspectionType: "CATALOG",
    };
    setTimeout(() => {
      GetYardListingDetailsAction(params);
    }, 100);
  };

  useEffect(() => {
    if (dataKey && getConfirmation) {
      updateCheckpointDataHandler(dataKey);
    }
  }, [getConfirmation]);

  const updateCheckpointDataHandler = (dataKey) => {
    setDataKey(dataKey);
    setIsConfirmationDialog(true);
    if (getConfirmation && dataKey) {
      let payload = {
        inspectionType: "CATALOG",
        schemaVersion: "IN_CAR_CATALOG_V1",
        data: {
          action: "checkpointsQa",
          checkpoints: {},
        },
      };
      payload.data.checkpoints[dataKey] = {};
      let selectedChoices;
      let noImperfectionChoices = [];
      if (
        stateToBeUpdated.nonAcceptImpChoices &&
        stateToBeUpdated.nonAcceptImpChoices.choices
      ) {
        selectedChoices = stateToBeUpdated.nonAcceptImpChoices.choices.map(
          (item) => {
            if (item.selected === true && item.other === false) {
              return {
                acceptable: item.acceptable,
                choice: item.choice,
                other: item.other,
              };
            }
          }
        );

        selectedChoices = selectedChoices.filter(function (element) {
          return element !== undefined;
        });

        if (!!otherImperfectionEntered) {
          selectedChoices.push({
            acceptable: false,
            choice: otherImperfectionEntered,
            other: true,
          });
        }
      }
      if (!!isOkNoImperfSelected) {
        noImperfectionChoices.push(isOkNoImperfSelected);
      }

      if (selectedChoices?.length) {
        payload.data.checkpoints[dataKey]["choices"] = selectedChoices;
      }
      if (noImperfectionChoices?.length) {
        payload.data.checkpoints[dataKey]["noImperfectionChoices"] =
          noImperfectionChoices;
      }

      if (
        appointmentDetails &&
        appointmentDetails.data &&
        appointmentDetails.data.checkpoints &&
        appointmentDetails.data.checkpoints[dataKey] &&
        appointmentDetails.data.checkpoints[dataKey].images &&
        appointmentDetails.data.checkpoints[dataKey].images.length
      ) {
        payload.data.checkpoints[dataKey]["images"] =
          appointmentDetails.data.checkpoints[dataKey].images;
      }

      if (
        appointmentDetails &&
        appointmentDetails.data &&
        appointmentDetails.data.checkpoints &&
        appointmentDetails.data.checkpoints[dataKey] &&
        appointmentDetails.data.checkpoints[dataKey].videos &&
        appointmentDetails.data.checkpoints[dataKey].videos.length
      ) {
        payload.data.checkpoints[dataKey]["videos"] =
          appointmentDetails.data.checkpoints[dataKey].videos;
      }

      console.log(payload);
      ApproveQualityChecksAction(payload, appointmentDetails.appointmentId);
      setIsEditCheckpoint("");
      setTimeout(() => {
        let params = {
          appointmentId: appointmentDetails.appointmentId,
          inspectionType: "CATALOG",
        };
        GetYardListingDetailsAction(params);
        GetYardListingDetailsAction(params);
      }, 1000);
      setGetConfirmation(false);
      setDataKey("");
      setIsConfirmationDialog(false);
    }
  };
  // Handlers to update checkpoints data ends here

  //Tagging part starts here
  const addTagHandler = (tagName, item) => {
    if (
      appointmentDetails.data.qualityChecks[item] &&
      appointmentDetails.data.qualityChecks[item].status === "REJECTED"
    ) {
      return;
    }
    let payload = {
      inspectionType: "YARD",
      schemaVersion: "IN_CAR_CATALOG_V1",
      data: {
        action: "tagging",
        qualityChecks: {},
      },
    };
    if (item && tagName) {
      payload.data.qualityChecks[item] = { tag: tagName.toUpperCase() };
    }
    AddTaggingAction(payload, appointmentDetails.appointmentId, "Tag applied");
    setTimeout(() => {
      let params = {
        appointmentId: appointmentDetails.appointmentId,
        inspectionType: "CATALOG",
      };
      GetYardListingDetailsAction(params);
    }, 1000);
  };

  const togglePageRedirect = () => {
    setIsSummaryList(!isSummaryList);
  };

  return (
    <>
      {isConfirmationDialog ? (
        <CustomDialog
          setGetConfirmation={setGetConfirmation}
          setIsConfirmationDialog={setIsConfirmationDialog}
        />
      ) : null}

      {magnifyImg && magnifyImg.path && (
        <div className="background-shadow">
          <div>
            <TransformWrapper
              defaultScale={1}
              defaultPositionX={200}
              defaultPositionY={100}
            >
              {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
                <>
                  <div className="row m-0">
                    <div className="col-4"></div>
                    <div className="col-5">
                      <button
                        className="btn btn-primary p-1 px-3 text-white"
                        onClick={() => zoomIn()}
                      >
                        {" "}
                        +{" "}
                      </button>
                      <button
                        className="btn mx-1 my-1 p-1 btn-primary text-white"
                        onClick={() => resetTransform()}
                      >
                        {" "}
                        {labels["RESET"]}
                      </button>
                      <button
                        className="btn btn-primary p-1 px-3 text-white"
                        onClick={() => zoomOut()}
                      >
                        {" "}
                        -{" "}
                      </button>
                      <TransformComponent>
                        <img src={magnifyImg.path} width="550" />
                      </TransformComponent>
                    </div>
                    <div className="col-3">
                      <span
                        className="close-image-preview"
                        onClick={() => setMagnifier("")}
                      >
                        X
                      </span>
                    </div>
                  </div>
                </>
              )}
            </TransformWrapper>
          </div>
        </div>
      )}

      {props.showToaster && (
        <AlertBox
          ShowAlert={props.showToaster}
          message={props.toasterMessage}
          type={props.toasterType}
        />
      )}
      {props && props.isProcessing && (
        <div className="loaderSection">
          {" "}
          <img src={loaderImg} alt="loader" />
        </div>
      )}
      <div className="col-lg-12">
        {isSummaryList ? (
          <a
            className="back"
            role="button"
            onClick={(e) => togglePageRedirect()}
            style={{ cursor: "pointer" }}
          >
            {" "}
            {labels["BACK_BUTTON"]}:{" "}
          </a>
        ) : (
          <Link to="/yard-qa" className="back">
            {" "}
            {labels["BACK_BUTTON"]}:{" "}
          </Link>
        )}
        <div className="middleContent">
          <div className="row contentWrapper">
            {appointmentDetails && appointmentDetails.make && (
              <div className="col-lg-3">
                <div className="form-group">
                  <h5>
                    {appointmentDetails.make + " " + appointmentDetails.model}
                  </h5>
                  <span>
                    {appointmentDetails.variant
                      ? appointmentDetails.variant + " | "
                      : ""}
                  </span>
                  <span>
                    {appointmentDetails.fuelType
                      ? appointmentDetails.fuelType
                      : ""}
                  </span>
                </div>
              </div>
            )}

            <div className="col-lg-3">
              <div className="form-group  bolder-label">
                <label>{labels["INSPECTED_BY"]}:</label>
                {appointmentDetails?.createdBy?.uid
                  ? " " + appointmentDetails.createdBy.uid
                  : " N/A"}
              </div>
            </div>

            <div className="col-lg-3">
              <div className="form-group bolder-label">
                <label>{labels["YARD_NAME"]}:</label>
                {appointmentDetails?.loc?.name
                  ? " " + appointmentDetails?.loc?.name
                  : " N/A"}
              </div>
            </div>

            <div className="col-lg-3">
              <div className="form-group bolder-label">
                <label>{labels["ASSIGNED_TO"]}:</label>
                <span>
                  {appointmentDetails?.assignedTo?.uid
                    ? " " + appointmentDetails.assignedTo.uid
                    : " None"}
                </span>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-3">
              <div className="form-group bolder-span">
                <label>{labels["APPOINTMENT_ID"]}:</label>
                <span>
                  {appointmentDetails?.appointmentId
                    ? " " + appointmentDetails.appointmentId
                    : " N/A"}
                </span>
              </div>
            </div>

            <div className="col-lg-3">
              <div className="form-group bolder-span">
                <label>{labels["INSPECTION_DATE"]}:</label>
                <span>
                  {appointmentDetails?.formatedUpdatedAt
                    ? " " + appointmentDetails.formatedUpdatedAt
                    : " N/A"}
                </span>
              </div>
            </div>

            <div className="col-lg-3">
              <div className="form-group bolder-span">
                <label>{labels["ACCEPTABLE_IMPERFECTION"]}:</label>
                <span> {accImperfection}</span>
              </div>
            </div>

            <div className="col-lg-3">
              <div className="form-group bolder-span">
                <label>{labels["NON_ACCEPTABLE_IMPERFECTION"]}:</label>
                <span> {nonAccImperfection}</span>
              </div>
            </div>
          </div>
          {!isSummaryList ? (
            <>
              {/* Photo slider starts here*/}
              <div className="row titleWrapper">
                <div className="col-lg-12">
                  <div className="photos-row align-items-center d-flex justify-content-between">
                    <label>{labels["PHOTOS"]}</label>{" "}
                    <span>
                      {labels["TOTAL"]} <strong>{allImages.length}</strong>{" "}
                      {labels["PHOTOS"]}
                    </span>
                  </div>
                  {allImages && allImages.length > 0 && (
                    <div className="row">
                      <div className="photo-container-horiz">
                        {allImages.map((image, index) => (
                          <div className="col-lg-4 photos-slider" key={index}>
                            <img
                              src={image.path}
                              alt={image.label}
                              onClick={() => {
                                imageMagnifier(image);
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              {/* Photo slider ends here*/}
              <div className="row">
                <div className="col-lg-12">
                  {appointmentDetails && appointmentDetails.data && (
                    <div className="cardWrapper">
                      <span className="list-header">
                        Imperfections List{" "}
                        {" " + (accImperfection + nonAccImperfection)}
                      </span>
                      {appointmentDetails.data.checkpoints &&
                        Object.keys(appointmentDetails.data.checkpoints).map(
                          (item, index) => {
                            return (
                              <>
                                {appointmentDetails.data.checkpoints[item]
                                  ?.choices.length ? (
                                  <div
                                    className="container-box-card"
                                    key={index}
                                  >
                                    <label className="label-top">{item}</label>
                                    <span
                                      className={
                                        appointmentDetails.data.qualityChecks[
                                          item
                                        ]?.tag === "NONE"
                                          ? "greyLabel"
                                          : appointmentDetails.data
                                              .qualityChecks[item]?.tag ===
                                            "GREEN"
                                          ? "greenLabel"
                                          : appointmentDetails.data
                                              .qualityChecks[item]?.tag ===
                                            "YELLOW"
                                          ? "yellowLabel"
                                          : appointmentDetails.data
                                              .qualityChecks[item]?.tag ===
                                            "RED"
                                          ? "redLabel"
                                          : ""
                                      }
                                    >
                                      {
                                        appointmentDetails.data.qualityChecks[
                                          item
                                        ]?.tag
                                      }
                                    </span>
                                    {appointmentDetails.data.qualityChecks[
                                      item
                                    ] &&
                                      appointmentDetails.data.qualityChecks[
                                        item
                                      ].status && (
                                        <button
                                          className="checkpoint-edit-button"
                                          onClick={(e) => {
                                            editCheckpointClicked(index, item);
                                            setRejectAction("");
                                            setIsConfirmationDialog(false);
                                            setDataKey("");
                                          }}
                                          disabled={
                                            isCheckpointEdit === index ||
                                            !iscorrectAssigned
                                          }
                                        >
                                          {labels["EDIT"]}
                                        </button>
                                      )}
                                    {isCheckpointEdit !== index && (
                                      <div className="info-container">
                                        <div className="row">
                                          <div className="col-lg-6">
                                            <div className="row">
                                              <div className="col-lg-12 image-container">
                                                {toggleViewHandlerFlag ===
                                                index ? (
                                                  <video
                                                    width="100%"
                                                    height="300"
                                                    controls
                                                  >
                                                    {appointmentDetails.data
                                                      .checkpoints[item] &&
                                                      appointmentDetails.data.checkpoints[
                                                        item
                                                      ].videos.map(
                                                        (video, index) => {
                                                          return (
                                                            <source
                                                              src={video.path}
                                                              type="video/mp4"
                                                              key={index}
                                                            />
                                                          );
                                                        }
                                                      )}
                                                  </video>
                                                ) : (
                                                  <>
                                                    {appointmentDetails.data
                                                      .checkpoints[item] &&
                                                      appointmentDetails.data.checkpoints[
                                                        item
                                                      ].images.map(
                                                        (image, index) => {
                                                          return (
                                                            <img
                                                              src={image.path}
                                                              alt={image.label}
                                                              key={index}
                                                              onClick={() => {
                                                                imageMagnifier(
                                                                  image
                                                                );
                                                              }}
                                                            />
                                                          );
                                                        }
                                                      )}
                                                  </>
                                                )}
                                              </div>
                                            </div>
                                            {appointmentDetails.data
                                              .checkpoints[item] &&
                                              appointmentDetails.data
                                                .checkpoints[item].images &&
                                              appointmentDetails.data
                                                .checkpoints[item].images
                                                .length > 0 && (
                                                <button
                                                  className="toggle-view-button"
                                                  onClick={() => {
                                                    toggleImageHandler(index);
                                                  }}
                                                >
                                                  {labels["IMAGE_VIEW"]}
                                                </button>
                                              )}
                                            {appointmentDetails.data
                                              .checkpoints[item] &&
                                              appointmentDetails.data
                                                .checkpoints[item].videos &&
                                              appointmentDetails.data
                                                .checkpoints[item].videos
                                                .length > 0 && (
                                                <button
                                                  className="toggle-view-button"
                                                  onClick={() => {
                                                    toggleVideoHandler(index);
                                                  }}
                                                >
                                                  {labels["VIDEO_VIEW"]}
                                                </button>
                                              )}
                                          </div>
                                          <div className="col-lg-6">
                                            <div className="row">
                                              {appointmentDetails.data
                                                .checkpoints[item] &&
                                                appointmentDetails.data
                                                  .checkpoints[item].ok ===
                                                  true &&
                                                appointmentDetails.data
                                                  .checkpoints[item].choices
                                                  .length > 0 && (
                                                  <div className="col-lg-12  light-label dark-span textTitle">
                                                    <h6>
                                                      Acceptable Imperfections
                                                      (not shown to customer)
                                                    </h6>
                                                    {appointmentDetails.data.checkpoints[
                                                      item
                                                    ].choices.map((choice) => {
                                                      return choice.acceptable
                                                        ? choice.choice + " | "
                                                        : "";
                                                    })}
                                                  </div>
                                                )}

                                              {appointmentDetails.data
                                                .checkpoints[item] &&
                                                appointmentDetails.data
                                                  .checkpoints[item].ok ===
                                                  false &&
                                                appointmentDetails.data
                                                  .checkpoints[item].choices
                                                  .length > 0 && (
                                                  <>
                                                    <div className="col-lg-12 light-label dark-span textTitle">
                                                      <h6>
                                                        {
                                                          labels[
                                                            "UNACCEPTABLE_IMPERFECTION_SHOW_TO_CUSTOMER"
                                                          ]
                                                        }
                                                      </h6>
                                                      {appointmentDetails.data.checkpoints[
                                                        item
                                                      ].choices.map(
                                                        (choice) => {
                                                          return !choice.acceptable
                                                            ? choice.choice +
                                                                " | "
                                                            : "";
                                                        }
                                                      )}
                                                    </div>

                                                    <div className="col-lg-12 light-label dark-span textTitle">
                                                      <h6>
                                                        {
                                                          labels[
                                                            "ACCEPTABLE_IMPERFECTION_NOT_SHOWN_TO_CUSTOMER"
                                                          ]
                                                        }
                                                      </h6>
                                                      {appointmentDetails.data.checkpoints[
                                                        item
                                                      ].choices.map(
                                                        (choice) => {
                                                          return choice.acceptable
                                                            ? choice.choice +
                                                                " | "
                                                            : "";
                                                        }
                                                      )}
                                                    </div>
                                                  </>
                                                )}
                                              {appointmentDetails.data
                                                .estimates &&
                                                appointmentDetails.data
                                                  .estimates[item] &&
                                                appointmentDetails.data
                                                  .estimates[item] &&
                                                appointmentDetails.data
                                                  .estimates[item]
                                                  .invalidated === false && (
                                                  <div className="col-lg-6">
                                                    <div className="row">
                                                      <div className="col-lg-6 pl20 light-label dark-span borderRight">
                                                        <h6>
                                                          {
                                                            labels[
                                                              "ADDITIONAL_PART_TEXT"
                                                            ]
                                                          }
                                                        </h6>
                                                      </div>
                                                      <div className="col-lg-6 pl20 light-label dark-span">
                                                        <h6>
                                                          {
                                                            labels[
                                                              "PART_COST_TEXT"
                                                            ]
                                                          }
                                                        </h6>
                                                      </div>
                                                    </div>
                                                    {appointmentDetails.data.estimates[
                                                      item
                                                    ]?.parts.map(
                                                      (data, index) => {
                                                        return (
                                                          <div
                                                            className="row"
                                                            key={index}
                                                          >
                                                            <div className="col-lg-6 pl20 light-label dark-span borderRight">
                                                              <span>
                                                                {data.name}
                                                              </span>
                                                            </div>
                                                            <div className="col-lg-6 pl20 light-label dark-span">
                                                              <span>
                                                                {data.cost}
                                                              </span>
                                                            </div>
                                                          </div>
                                                        );
                                                      }
                                                    )}
                                                  </div>
                                                )}
                                            </div>
                                            {isRejected === index ? (
                                              <div className="row">
                                                <div className="col-lg-12 button-container buttonContainer">
                                                  <div className="form-group reject-form">
                                                    <textarea
                                                      className="form-control"
                                                      rows="3"
                                                      cols="50"
                                                      placeholder="Please add reason for rejection"
                                                      onChange={
                                                        handleRejectionComment
                                                      }
                                                    />
                                                    {showOnRejectSubmitError && (
                                                      <div className="text-danger">
                                                        {comment === ""
                                                          ? "Please add reason for rejection"
                                                          : ""}
                                                      </div>
                                                    )}
                                                    <button
                                                      disabled={
                                                        isConfirmationDialog
                                                      }
                                                      style={{
                                                        backgroundColor:
                                                          isConfirmationDialog
                                                            ? "grey"
                                                            : "#F37500",
                                                      }}
                                                      onClick={() => {
                                                        setShowOnRejectSubmitError(
                                                          false
                                                        );
                                                        setRejectAction("");
                                                        setComment("");
                                                      }}
                                                    >
                                                      Cancel
                                                    </button>
                                                    <button
                                                      disabled={
                                                        isConfirmationDialog
                                                      }
                                                      style={{
                                                        backgroundColor:
                                                          isConfirmationDialog
                                                            ? "grey"
                                                            : "#F37500",
                                                      }}
                                                      onClick={() => {
                                                        onSubmitReject(
                                                          item,
                                                          index,
                                                          comment,
                                                          false
                                                        );
                                                      }}
                                                    >
                                                      {labels["SUBMIT"]}
                                                    </button>
                                                  </div>
                                                </div>
                                              </div>
                                            ) : (
                                              <>
                                                {appointmentDetails.data
                                                  .qualityChecks[item] &&
                                                (appointmentDetails.data
                                                  .qualityChecks[item]
                                                  .status === "PENDING" ||
                                                  (appointmentDetails.data
                                                    .qualityChecks[item]
                                                    .status !== "PENDING" &&
                                                    reEdit === index)) ? (
                                                  <div className="col-lg-12 button-container buttonContainer">
                                                    <button
                                                      style={{
                                                        backgroundColor:
                                                          isConfirmationDialog
                                                            ? "grey"
                                                            : "#F37500",
                                                      }}
                                                      disabled={
                                                        isConfirmationDialog ||
                                                        !iscorrectAssigned
                                                      }
                                                      onClick={() => {
                                                        setRejectAction(index);
                                                        setIsConfirmationDialog(
                                                          false
                                                        );
                                                        setIsEditCheckpoint("");
                                                        setDataKey("");
                                                        rejectHandler(item);
                                                      }}
                                                    >
                                                      {labels["REJECT"]}
                                                    </button>
                                                    <button
                                                      style={{
                                                        backgroundColor:
                                                          isConfirmationDialog
                                                            ? "grey"
                                                            : "#F37500",
                                                      }}
                                                      disabled={
                                                        isConfirmationDialog ||
                                                        !iscorrectAssigned
                                                      }
                                                      onClick={(e) => {
                                                        onSubmitApprove(
                                                          item,
                                                          index,
                                                          false
                                                        );
                                                      }}
                                                    >
                                                      {labels["APPROVE"]}
                                                    </button>
                                                  </div>
                                                ) : (
                                                  <div className="col-lg-12 button-container buttonContainer">
                                                    {appointmentDetails.data
                                                      .qualityChecks[item] &&
                                                      appointmentDetails.data
                                                        .qualityChecks[item]
                                                        .status !==
                                                        "PENDING" && (
                                                        <>
                                                          {appointmentDetails
                                                            .data.qualityChecks[
                                                            item
                                                          ].status ===
                                                            "REJECTED" &&
                                                          appointmentDetails
                                                            .data.qualityChecks[
                                                            item
                                                          ].invalidated ===
                                                            false ? (
                                                            <>
                                                              {appointmentDetails
                                                                .data
                                                                .qualityChecks[
                                                                item
                                                              ] &&
                                                              appointmentDetails
                                                                .data
                                                                .checkpoints[
                                                                item
                                                              ].ok === true &&
                                                              appointmentDetails
                                                                .data
                                                                .checkpoints[
                                                                item
                                                              ].choices &&
                                                              appointmentDetails
                                                                .data
                                                                .checkpoints[
                                                                item
                                                              ].choices
                                                                .length ? (
                                                                <>
                                                                  <button
                                                                    style={{
                                                                      backgroundColor:
                                                                        isConfirmationDialog
                                                                          ? "grey"
                                                                          : "#F37500",
                                                                    }}
                                                                    disabled={
                                                                      true
                                                                    }
                                                                    onClick={() => {
                                                                      setRejectAction(
                                                                        index
                                                                      );
                                                                      setIsConfirmationDialog(
                                                                        false
                                                                      );
                                                                      setIsEditCheckpoint(
                                                                        ""
                                                                      );
                                                                      setDataKey(
                                                                        ""
                                                                      );
                                                                      rejectHandler(
                                                                        item
                                                                      );
                                                                    }}
                                                                  >
                                                                    {
                                                                      labels[
                                                                        "REJECT"
                                                                      ]
                                                                    }
                                                                  </button>

                                                                  <button
                                                                    style={{
                                                                      backgroundColor:
                                                                        isConfirmationDialog
                                                                          ? "grey"
                                                                          : "#F37500",
                                                                    }}
                                                                    disabled={
                                                                      isConfirmationDialog ||
                                                                      !iscorrectAssigned
                                                                    }
                                                                    onClick={(
                                                                      e
                                                                    ) => {
                                                                      onSubmitApprove(
                                                                        item,
                                                                        index,
                                                                        false
                                                                      );
                                                                    }}
                                                                  >
                                                                    {
                                                                      labels[
                                                                        "APPROVE"
                                                                      ]
                                                                    }
                                                                  </button>
                                                                </>
                                                              ) : null}

                                                              {appointmentDetails
                                                                .data
                                                                .qualityChecks[
                                                                item
                                                              ] &&
                                                              appointmentDetails
                                                                .data
                                                                .checkpoints[
                                                                item
                                                              ].ok === false ? (
                                                                <>
                                                                  <button
                                                                    style={{
                                                                      backgroundColor:
                                                                        isConfirmationDialog
                                                                          ? "grey"
                                                                          : "#F37500",
                                                                    }}
                                                                    disabled={
                                                                      true
                                                                    }
                                                                    onClick={() => {
                                                                      setRejectAction(
                                                                        index
                                                                      );
                                                                      setIsConfirmationDialog(
                                                                        false
                                                                      );
                                                                      setIsEditCheckpoint(
                                                                        ""
                                                                      );
                                                                      setDataKey(
                                                                        ""
                                                                      );
                                                                      rejectHandler(
                                                                        item
                                                                      );
                                                                    }}
                                                                  >
                                                                    {
                                                                      labels[
                                                                        "REJECT"
                                                                      ]
                                                                    }
                                                                  </button>

                                                                  <button
                                                                    style={{
                                                                      backgroundColor:
                                                                        isConfirmationDialog
                                                                          ? "grey"
                                                                          : "#F37500",
                                                                    }}
                                                                    disabled={
                                                                      isConfirmationDialog ||
                                                                      !iscorrectAssigned
                                                                    }
                                                                    onClick={(
                                                                      e
                                                                    ) => {
                                                                      onSubmitApprove(
                                                                        item,
                                                                        index,
                                                                        false
                                                                      );
                                                                    }}
                                                                  >
                                                                    {
                                                                      labels[
                                                                        "APPROVE"
                                                                      ]
                                                                    }
                                                                  </button>
                                                                </>
                                                              ) : null}
                                                            </>
                                                          ) : null}

                                                          {appointmentDetails
                                                            .data.qualityChecks[
                                                            item
                                                          ].status ===
                                                            "APPROVED" &&
                                                          appointmentDetails
                                                            .data.qualityChecks[
                                                            item
                                                          ]?.reason !==
                                                            "NO_WORK_TO_BE_DONE" &&
                                                          appointmentDetails
                                                            .data.qualityChecks[
                                                            item
                                                          ].invalidated ===
                                                            false ? (
                                                            <>
                                                              {appointmentDetails
                                                                .data
                                                                .qualityChecks[
                                                                item
                                                              ] &&
                                                              appointmentDetails
                                                                .data
                                                                .checkpoints[
                                                                item
                                                              ].ok === true &&
                                                              appointmentDetails
                                                                .data
                                                                .checkpoints[
                                                                item
                                                              ].choices &&
                                                              appointmentDetails
                                                                .data
                                                                .checkpoints[
                                                                item
                                                              ].choices
                                                                .length ? (
                                                                <>
                                                                  <button
                                                                    style={{
                                                                      backgroundColor:
                                                                        isConfirmationDialog
                                                                          ? "grey"
                                                                          : "#F37500",
                                                                    }}
                                                                    disabled={
                                                                      isConfirmationDialog ||
                                                                      !iscorrectAssigned
                                                                    }
                                                                    onClick={() => {
                                                                      setRejectAction(
                                                                        index
                                                                      );
                                                                      setIsConfirmationDialog(
                                                                        false
                                                                      );
                                                                      setIsEditCheckpoint(
                                                                        ""
                                                                      );
                                                                      setDataKey(
                                                                        ""
                                                                      );
                                                                      rejectHandler(
                                                                        item
                                                                      );
                                                                    }}
                                                                  >
                                                                    {
                                                                      labels[
                                                                        "REJECT"
                                                                      ]
                                                                    }
                                                                  </button>

                                                                  <button
                                                                    style={{
                                                                      backgroundColor:
                                                                        isConfirmationDialog
                                                                          ? "grey"
                                                                          : "#F37500",
                                                                    }}
                                                                    disabled={
                                                                      true
                                                                    }
                                                                    onClick={(
                                                                      e
                                                                    ) => {
                                                                      onSubmitApprove(
                                                                        item,
                                                                        index,
                                                                        false
                                                                      );
                                                                    }}
                                                                  >
                                                                    {
                                                                      labels[
                                                                        "APPROVE"
                                                                      ]
                                                                    }
                                                                  </button>
                                                                </>
                                                              ) : null}

                                                              {appointmentDetails
                                                                .data
                                                                .qualityChecks[
                                                                item
                                                              ] &&
                                                              appointmentDetails
                                                                .data
                                                                .checkpoints[
                                                                item
                                                              ].ok === false ? (
                                                                <>
                                                                  <button
                                                                    style={{
                                                                      backgroundColor:
                                                                        isConfirmationDialog
                                                                          ? "grey"
                                                                          : "#F37500",
                                                                    }}
                                                                    disabled={
                                                                      isConfirmationDialog ||
                                                                      !iscorrectAssigned
                                                                    }
                                                                    onClick={() => {
                                                                      setRejectAction(
                                                                        index
                                                                      );
                                                                      setIsConfirmationDialog(
                                                                        false
                                                                      );
                                                                      setIsEditCheckpoint(
                                                                        ""
                                                                      );
                                                                      setDataKey(
                                                                        ""
                                                                      );
                                                                      rejectHandler(
                                                                        item
                                                                      );
                                                                    }}
                                                                  >
                                                                    {
                                                                      labels[
                                                                        "REJECT"
                                                                      ]
                                                                    }
                                                                  </button>

                                                                  <button
                                                                    style={{
                                                                      backgroundColor:
                                                                        isConfirmationDialog
                                                                          ? "grey"
                                                                          : "#F37500",
                                                                    }}
                                                                    disabled={
                                                                      true
                                                                    }
                                                                    onClick={(
                                                                      e
                                                                    ) => {
                                                                      onSubmitApprove(
                                                                        item,
                                                                        index,
                                                                        false
                                                                      );
                                                                    }}
                                                                  >
                                                                    {
                                                                      labels[
                                                                        "APPROVE"
                                                                      ]
                                                                    }
                                                                  </button>
                                                                </>
                                                              ) : null}
                                                            </>
                                                          ) : null}

                                                          {
                                                            <div className="action-done-reset-view">
                                                              <div
                                                                style={{
                                                                  padding:
                                                                    "25px 40px",
                                                                }}
                                                              >
                                                                {
                                                                  appointmentDetails
                                                                    .data
                                                                    .checkpoints[
                                                                    item
                                                                  ]
                                                                    .noImperfectionChoices[0]
                                                                }
                                                              </div>
                                                              <label>
                                                                {appointmentDetails
                                                                  .data
                                                                  .qualityChecks[
                                                                  item
                                                                ].status ===
                                                                "APPROVED"
                                                                  ? "This checkpoint and estimates is Approved"
                                                                  : [
                                                                      appointmentDetails
                                                                        .data
                                                                        .qualityChecks[
                                                                        item
                                                                      ]
                                                                        .status ===
                                                                      "NO_ACTION"
                                                                        ? "This checkpoint and estimates is Approved"
                                                                        : "This checkpoint and estimates is Rejected",
                                                                    ]}
                                                              </label>
                                                            </div>
                                                          }
                                                        </>
                                                      )}
                                                  </div>
                                                )}
                                              </>
                                            )}
                                            <div className="settagmainWrapper">
                                              <div className="settagWrapper">
                                                <p>{labels["SET_TAG_AS"]}</p>
                                                <div className="dropdown">
                                                  <span>
                                                    {
                                                      appointmentDetails.data
                                                        .qualityChecks[item]
                                                        ?.tag
                                                    }
                                                  </span>
                                                  <ul>
                                                    <li
                                                      className="none"
                                                      onClick={(e) =>
                                                        addTagHandler(
                                                          "none",
                                                          item
                                                        )
                                                      }
                                                    >
                                                      None
                                                    </li>
                                                    {appointmentDetails.data
                                                      .qualityChecks[item]
                                                      ?.status !==
                                                    "REJECTED" ? (
                                                      <>
                                                        <li
                                                          className="green"
                                                          onClick={(e) =>
                                                            addTagHandler(
                                                              "green",
                                                              item
                                                            )
                                                          }
                                                        >
                                                          Green
                                                        </li>
                                                        <li
                                                          className="yellow"
                                                          onClick={(e) =>
                                                            addTagHandler(
                                                              "yellow",
                                                              item
                                                            )
                                                          }
                                                        >
                                                          Yellow{" "}
                                                        </li>
                                                        <li
                                                          className="red"
                                                          onClick={(e) =>
                                                            addTagHandler(
                                                              "red",
                                                              item
                                                            )
                                                          }
                                                        >
                                                          Red
                                                        </li>
                                                      </>
                                                    ) : null}
                                                  </ul>
                                                </div>

                                                <img
                                                  src={Question}
                                                  alt="info"
                                                  onClick={(e) =>
                                                    onAllocateOpen(item)
                                                  }
                                                />
                                                <Popup
                                                  isOpen={allocateOpen}
                                                  close={(e) =>
                                                    onAllocateClose()
                                                  }
                                                >
                                                  <QuestionMarkPopUp
                                                    onClose={(e) =>
                                                      onAllocateClose()
                                                    }
                                                    hintData={hintData}
                                                  />
                                                </Popup>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    )}

                                    {isCheckpointEdit === index && (
                                      <div className="info-container">
                                        <div className="row">
                                          <div className="col-lg-12">
                                            <div className="row">
                                              <div className="col-lg-6">
                                                <div className="row">
                                                  {appointmentDetails.data
                                                    .checkpoints[item] && (
                                                    <>
                                                      <div className="col-lg-12 light-label dark-span">
                                                        <h6>
                                                          Current condition
                                                        </h6>
                                                        {stateToBeUpdated &&
                                                          stateToBeUpdated.nonAcceptImpChoices &&
                                                          stateToBeUpdated
                                                            .nonAcceptImpChoices
                                                            .choices &&
                                                          stateToBeUpdated.nonAcceptImpChoices.choices.map(
                                                            (choice, ind) => {
                                                              return (
                                                                <>
                                                                  {choice &&
                                                                  choice.other ===
                                                                    false ? (
                                                                    <>
                                                                      <input
                                                                        type="checkbox"
                                                                        checked={
                                                                          choice.selected
                                                                        }
                                                                        onChange={(
                                                                          e
                                                                        ) =>
                                                                          changeChoicesHandler(
                                                                            "nonAccept",
                                                                            ind
                                                                          )
                                                                        }
                                                                      />
                                                                      <span>
                                                                        {" "}
                                                                        {
                                                                          choice.choice
                                                                        }
                                                                      </span>
                                                                      <br />
                                                                    </>
                                                                  ) : null}

                                                                  {masterData &&
                                                                    masterData.checkpoints &&
                                                                    masterData.checkpoints.map(
                                                                      (
                                                                        ChildrenItem
                                                                      ) => {
                                                                        return (
                                                                          <>
                                                                            {item ===
                                                                              ChildrenItem.key && (
                                                                              <>
                                                                                {ChildrenItem.choices &&
                                                                                  ChildrenItem.choices.map(
                                                                                    (
                                                                                      choice2
                                                                                    ) => {
                                                                                      return (
                                                                                        <>
                                                                                          {choice2 &&
                                                                                            choice2.name ===
                                                                                              choice.choice &&
                                                                                            choice.selected &&
                                                                                            !choice.other &&
                                                                                            choice2.type ===
                                                                                              "relative" && (
                                                                                              <div className="checkpoint-edit-options">
                                                                                                <input
                                                                                                  type="radio"
                                                                                                  name={
                                                                                                    "imperfectionType" +
                                                                                                    choice.choice
                                                                                                  }
                                                                                                  onChange={(
                                                                                                    e
                                                                                                  ) =>
                                                                                                    changeImperfectionType(
                                                                                                      choice,
                                                                                                      ind,
                                                                                                      "acceptable"
                                                                                                    )
                                                                                                  }
                                                                                                  checked={
                                                                                                    choice.acceptable
                                                                                                  }
                                                                                                  value="acceptable"
                                                                                                />
                                                                                                <span className="large-text">
                                                                                                  {" "}
                                                                                                  Acceptable
                                                                                                  Imperfection
                                                                                                  (not
                                                                                                  shown
                                                                                                  to
                                                                                                  customer)
                                                                                                </span>
                                                                                                <br />
                                                                                                {choice2.acceptable &&
                                                                                                  choice2.acceptable.map(
                                                                                                    (
                                                                                                      info,
                                                                                                      index
                                                                                                    ) => {
                                                                                                      return (
                                                                                                        <>
                                                                                                          <span className="small-text">
                                                                                                            {index +
                                                                                                              1}{" "}
                                                                                                            {
                                                                                                              info
                                                                                                            }
                                                                                                          </span>
                                                                                                          <br />
                                                                                                        </>
                                                                                                      );
                                                                                                    }
                                                                                                  )}
                                                                                                <br />
                                                                                                <input
                                                                                                  type="radio"
                                                                                                  name={
                                                                                                    "imperfectionType" +
                                                                                                    choice.choice
                                                                                                  }
                                                                                                  onChange={(
                                                                                                    e
                                                                                                  ) =>
                                                                                                    changeImperfectionType(
                                                                                                      choice,
                                                                                                      ind,
                                                                                                      "non-acceptable"
                                                                                                    )
                                                                                                  }
                                                                                                  checked={
                                                                                                    !choice.acceptable
                                                                                                  }
                                                                                                  value="non-acceptable"
                                                                                                />
                                                                                                <span className="large-text">
                                                                                                  {" "}
                                                                                                  Non-Acceptable
                                                                                                  Imperfection
                                                                                                  (shown
                                                                                                  to
                                                                                                  customer)
                                                                                                </span>
                                                                                                <br />
                                                                                                {choice2.acceptable &&
                                                                                                  choice2.nonAcceptable.map(
                                                                                                    (
                                                                                                      info,
                                                                                                      index
                                                                                                    ) => {
                                                                                                      return (
                                                                                                        <>
                                                                                                          <span className="small-text">
                                                                                                            {index +
                                                                                                              1}{" "}
                                                                                                            {
                                                                                                              info
                                                                                                            }
                                                                                                          </span>
                                                                                                          <br />
                                                                                                        </>
                                                                                                      );
                                                                                                    }
                                                                                                  )}
                                                                                              </div>
                                                                                            )}
                                                                                        </>
                                                                                      );
                                                                                    }
                                                                                  )}
                                                                              </>
                                                                            )}
                                                                          </>
                                                                        );
                                                                      }
                                                                    )}
                                                                </>
                                                              );
                                                            }
                                                          )}
                                                        <div className="row">
                                                          <div className="col-lg-12 light-label dark-span textTitle">
                                                            <br />
                                                            <span className="small-text">
                                                              Others :{" "}
                                                            </span>
                                                            <br />
                                                            <input
                                                              type="text"
                                                              className="form-control"
                                                              value={
                                                                otherImperfectionEntered
                                                              }
                                                              onChange={(e) =>
                                                                otherImperfection(
                                                                  e.target.value
                                                                )
                                                              }
                                                            />
                                                          </div>

                                                          {masterData &&
                                                            masterData.checkpoints &&
                                                            masterData.checkpoints.map(
                                                              (masterData) => {
                                                                return (
                                                                  <>
                                                                    {item ===
                                                                      masterData.key && (
                                                                      <>
                                                                        {masterData &&
                                                                          masterData.noImperfectionChoices &&
                                                                          masterData.noImperfectionChoices.map(
                                                                            (
                                                                              option
                                                                            ) => {
                                                                              return (
                                                                                <div className="col-lg-12 light-label dark-span textTitle">
                                                                                  <input
                                                                                    type="radio"
                                                                                    name="imperfectionType"
                                                                                    checked={
                                                                                      isOkNoImperfSelected ===
                                                                                      option.name
                                                                                    }
                                                                                    value={
                                                                                      option.name
                                                                                    }
                                                                                    onChange={(
                                                                                      e
                                                                                    ) =>
                                                                                      isNotApplicableSelected(
                                                                                        e
                                                                                          .target
                                                                                          .value
                                                                                      )
                                                                                    }
                                                                                  />
                                                                                  <span>
                                                                                    {" " +
                                                                                      option.name}
                                                                                  </span>
                                                                                </div>
                                                                              );
                                                                            }
                                                                          )}
                                                                      </>
                                                                    )}
                                                                  </>
                                                                );
                                                              }
                                                            )}
                                                        </div>
                                                      </div>
                                                    </>
                                                  )}
                                                </div>
                                              </div>
                                            </div>
                                            <div className="row">
                                              <div className="col-lg-12 button-container buttonContainer text-center m-0 p-0">
                                                <div className="reject-form">
                                                  <button
                                                    disabled={
                                                      isConfirmationDialog
                                                    }
                                                    style={{
                                                      backgroundColor:
                                                        isConfirmationDialog
                                                          ? "grey"
                                                          : "#F37500",
                                                    }}
                                                    onClick={() => {
                                                      setIsEditCheckpoint("");
                                                      checkpointEditCancled(
                                                        item
                                                      );
                                                    }}
                                                  >
                                                    {labels["CANCEL"]}
                                                  </button>
                                                  <button
                                                    disabled={
                                                      isConfirmationDialog
                                                    }
                                                    style={{
                                                      backgroundColor:
                                                        isConfirmationDialog
                                                          ? "grey"
                                                          : "#F37500",
                                                    }}
                                                    onClick={(e) =>
                                                      updateCheckpointDataHandler(
                                                        item
                                                      )
                                                    }
                                                  >
                                                    {labels["SAVE"]}
                                                  </button>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    )}

                                    {/* Last inspection data */}
                                    <div className="row">
                                      <div className="col-lg-12">
                                        {lastInspectionData &&
                                          lastInspectionData.data && (
                                            <div className="container-box">
                                              {Object.keys(
                                                lastInspectionData.data
                                                  .qualityChecks
                                              ).map(
                                                (inspectionItem, index2) => {
                                                  return (
                                                    <div>
                                                      {inspectionItem ===
                                                        item &&
                                                        lastInspectionData.data
                                                          .qualityChecks[
                                                          inspectionItem
                                                        ]?.invalidated ===
                                                          false && (
                                                          <div
                                                            className="container-box-card  toggle-info-container"
                                                            key={index2}
                                                          >
                                                            <div className="lastinspection-header">
                                                              <span
                                                                className="list-header-first"
                                                                onClick={() =>
                                                                  toggleLastInspectionHandler(
                                                                    index2
                                                                  )
                                                                }
                                                              >
                                                                Last Inspection
                                                                Data
                                                              </span>
                                                              <span className="list-header2 list-header-first">
                                                                Workshop :{" "}
                                                                {lastInspectionData
                                                                  ?.loc?.name
                                                                  ? " " +
                                                                    lastInspectionData
                                                                      .loc.name
                                                                  : " N/A"}{" "}
                                                              </span>
                                                              <span className="list-header2 list-header-first">
                                                                Date:{" "}
                                                                {" " +
                                                                  lastInspectionData.formatedUpdatedAt}{" "}
                                                              </span>
                                                              <span className="list-header2 list-header-first">
                                                                Time:{" "}
                                                                {" " +
                                                                  lastInspectionData.formatedUpdateAtTime}{" "}
                                                              </span>
                                                            </div>

                                                            <div
                                                              className="info-container last-inspection-info-container"
                                                              hidden={
                                                                toggleLastInspection !==
                                                                  index2 ||
                                                                !showHideToggler
                                                              }
                                                            >
                                                              <label className="label-top">
                                                                {item}
                                                              </label>
                                                              <div className="row my-2 mx-2">
                                                                <div className="col-lg-6">
                                                                  <div className="row">
                                                                    <div className="col-lg-12 image-container">
                                                                      {mediaType ===
                                                                      "video" ? (
                                                                        <video
                                                                          width="100%"
                                                                          height="300"
                                                                          controls
                                                                        >
                                                                          {lastInspectionData
                                                                            .data
                                                                            .checkpoints[
                                                                            item
                                                                          ] &&
                                                                            lastInspectionData.data.checkpoints[
                                                                              item
                                                                            ].videos.map(
                                                                              (
                                                                                video,
                                                                                index
                                                                              ) => {
                                                                                return (
                                                                                  <source
                                                                                    src={
                                                                                      video.path
                                                                                    }
                                                                                    type="video/mp4"
                                                                                    key={
                                                                                      index
                                                                                    }
                                                                                  />
                                                                                );
                                                                              }
                                                                            )}
                                                                        </video>
                                                                      ) : (
                                                                        <>
                                                                          {lastInspectionData
                                                                            .data
                                                                            .checkpoints[
                                                                            item
                                                                          ] &&
                                                                            lastInspectionData.data.checkpoints[
                                                                              item
                                                                            ].images.map(
                                                                              (
                                                                                image,
                                                                                index
                                                                              ) => {
                                                                                return (
                                                                                  <img
                                                                                    src={
                                                                                      image.path
                                                                                    }
                                                                                    alt={
                                                                                      image.label
                                                                                    }
                                                                                    key={
                                                                                      index
                                                                                    }
                                                                                    onClick={() => {
                                                                                      imageMagnifier(
                                                                                        image
                                                                                      );
                                                                                    }}
                                                                                  />
                                                                                );
                                                                              }
                                                                            )}
                                                                        </>
                                                                      )}
                                                                    </div>
                                                                  </div>
                                                                  {lastInspectionData
                                                                    .data
                                                                    .checkpoints[
                                                                    inspectionItem
                                                                  ] &&
                                                                    lastInspectionData
                                                                      .data
                                                                      .checkpoints[
                                                                      inspectionItem
                                                                    ].images &&
                                                                    lastInspectionData
                                                                      .data
                                                                      .checkpoints[
                                                                      inspectionItem
                                                                    ].images
                                                                      .length >
                                                                      0 && (
                                                                      <button
                                                                        className="toggle-view-button"
                                                                        onClick={() => {
                                                                          toggleImageHandler2(
                                                                            index2,
                                                                            "image"
                                                                          );
                                                                        }}
                                                                      >
                                                                        Image
                                                                        View
                                                                      </button>
                                                                    )}
                                                                  {lastInspectionData
                                                                    .data
                                                                    .checkpoints[
                                                                    inspectionItem
                                                                  ] &&
                                                                    lastInspectionData
                                                                      .data
                                                                      .checkpoints[
                                                                      inspectionItem
                                                                    ].videos &&
                                                                    lastInspectionData
                                                                      .data
                                                                      .checkpoints[
                                                                      inspectionItem
                                                                    ].videos
                                                                      .length >
                                                                      0 && (
                                                                      <button
                                                                        className="toggle-view-button"
                                                                        onClick={() => {
                                                                          toggleVideoHandler2(
                                                                            index2,
                                                                            "video"
                                                                          );
                                                                        }}
                                                                      >
                                                                        Video
                                                                        View
                                                                      </button>
                                                                    )}
                                                                </div>
                                                                <div className="col-lg-6">
                                                                  <div className="row">
                                                                    {lastInspectionData
                                                                      .data
                                                                      .checkpoints[
                                                                      inspectionItem
                                                                    ] &&
                                                                      lastInspectionData
                                                                        .data
                                                                        .checkpoints[
                                                                        inspectionItem
                                                                      ].ok ===
                                                                        true && (
                                                                        <div className="col-lg-12 card light-label dark-span">
                                                                          <h6>
                                                                            Acceptable
                                                                            Imperfections
                                                                            (not
                                                                            shown
                                                                            to
                                                                            customer)
                                                                          </h6>
                                                                          {lastInspectionData.data.checkpoints[
                                                                            inspectionItem
                                                                          ].choices.map(
                                                                            (
                                                                              choice
                                                                            ) => {
                                                                              return choice.acceptable
                                                                                ? choice.choice +
                                                                                    " | "
                                                                                : "";
                                                                            }
                                                                          )}
                                                                        </div>
                                                                      )}

                                                                    {lastInspectionData
                                                                      .data
                                                                      .checkpoints[
                                                                      inspectionItem
                                                                    ] &&
                                                                      lastInspectionData
                                                                        .data
                                                                        .checkpoints[
                                                                        inspectionItem
                                                                      ].ok ===
                                                                        false && (
                                                                        <>
                                                                          <div className="col-lg-12 card light-label dark-span">
                                                                            <h6>
                                                                              Unacceptable
                                                                              Imperfections
                                                                              (shown
                                                                              to
                                                                              customer)
                                                                            </h6>
                                                                            {lastInspectionData.data.checkpoints[
                                                                              item
                                                                            ].choices.map(
                                                                              (
                                                                                choice,
                                                                                ind,
                                                                                arr
                                                                              ) => {
                                                                                return !choice.acceptable
                                                                                  ? choice.choice +
                                                                                      " | "
                                                                                  : "";
                                                                              }
                                                                            )}
                                                                          </div>

                                                                          <div className="col-lg-12 card light-label dark-span">
                                                                            <h6>
                                                                              Acceptable
                                                                              Imperfections
                                                                              (not
                                                                              shown
                                                                              to
                                                                              customer)
                                                                            </h6>
                                                                            {lastInspectionData.data.checkpoints[
                                                                              item
                                                                            ].choices.map(
                                                                              (
                                                                                choice,
                                                                                ind,
                                                                                arr
                                                                              ) => {
                                                                                return choice.acceptable
                                                                                  ? choice.choice +
                                                                                      " | "
                                                                                  : "";
                                                                              }
                                                                            )}
                                                                          </div>
                                                                        </>
                                                                      )}
                                                                  </div>
                                                                </div>
                                                              </div>
                                                            </div>
                                                          </div>
                                                        )}
                                                    </div>
                                                  );
                                                }
                                              )}
                                            </div>
                                          )}
                                      </div>
                                    </div>
                                    {/* Last inspection section ends*/}
                                  </div>
                                ) : null}
                              </>
                            );
                          }
                        )}

                      {/* Change status starts here */}
                      {Object.keys(appointmentDetails.data.checkpoints).map(
                        (item, index) => {
                          return (
                            <>
                              {appointmentDetails.data.checkpoints[item]
                                ?.choices.length === 0 ? (
                                <div className="container-box-card" key={index}>
                                  <label className="label-top">{item}</label>
                                  <span
                                    className={
                                      appointmentDetails.data.qualityChecks[
                                        item
                                      ]?.tag === "GREEN"
                                        ? "greenLabel"
                                        : appointmentDetails.data.qualityChecks[
                                            item
                                          ]?.tag === "YELLOW"
                                        ? "yellowLabel"
                                        : appointmentDetails.data.qualityChecks[
                                            item
                                          ]?.tag === "RED"
                                        ? "redLabel"
                                        : "greenLabel"
                                    }
                                  >
                                    {appointmentDetails.data.qualityChecks[
                                      item
                                    ] &&
                                    appointmentDetails.data.qualityChecks[item]
                                      ?.tag !== "NONE"
                                      ? appointmentDetails.data.qualityChecks[
                                          item
                                        ]?.tag
                                      : "GREEN"}
                                  </span>
                                  <button
                                    className="checkpoint-edit-button"
                                    onClick={(e) =>
                                      editCheckpointClicked(index, item)
                                    }
                                    disabled={
                                      isCheckpointEdit === index ||
                                      !iscorrectAssigned
                                    }
                                  >
                                    {labels["EDIT"]}
                                  </button>
                                  <div className="row">
                                    {isCheckpointEdit === index ? (
                                      <div className="col-lg-12">
                                        <div className="row">
                                          <div className="col-lg-6">
                                            <div className="row">
                                              {appointmentDetails.data
                                                .checkpoints[item] && (
                                                <>
                                                  <div className="col-lg-12 light-label dark-span">
                                                    <h6>Current condition</h6>
                                                    {stateToBeUpdated &&
                                                      stateToBeUpdated.nonAcceptImpChoices &&
                                                      stateToBeUpdated
                                                        .nonAcceptImpChoices
                                                        .choices &&
                                                      stateToBeUpdated.nonAcceptImpChoices.choices.map(
                                                        (choice, ind) => {
                                                          return (
                                                            <>
                                                              {choice &&
                                                              choice.other ===
                                                                false ? (
                                                                <>
                                                                  <input
                                                                    type="checkbox"
                                                                    checked={
                                                                      choice.selected
                                                                    }
                                                                    onChange={(
                                                                      e
                                                                    ) =>
                                                                      changeChoicesHandler(
                                                                        "nonAccept",
                                                                        ind
                                                                      )
                                                                    }
                                                                  />
                                                                  <span>
                                                                    {" "}
                                                                    {
                                                                      choice.choice
                                                                    }
                                                                  </span>
                                                                  <br />
                                                                </>
                                                              ) : null}

                                                              {masterData &&
                                                                masterData.checkpoints &&
                                                                masterData.checkpoints.map(
                                                                  (
                                                                    ChildrenItem
                                                                  ) => {
                                                                    return (
                                                                      <>
                                                                        {item ===
                                                                          ChildrenItem.key && (
                                                                          <>
                                                                            {ChildrenItem.choices &&
                                                                              ChildrenItem.choices.map(
                                                                                (
                                                                                  choice2
                                                                                ) => {
                                                                                  return (
                                                                                    <>
                                                                                      {choice2 &&
                                                                                        choice2.name ===
                                                                                          choice.choice &&
                                                                                        choice.selected &&
                                                                                        !choice.other &&
                                                                                        choice2.type ===
                                                                                          "relative" && (
                                                                                          <div className="checkpoint-edit-options">
                                                                                            <input
                                                                                              type="radio"
                                                                                              name={
                                                                                                "imperfectionType" +
                                                                                                choice.choice
                                                                                              }
                                                                                              onChange={(
                                                                                                e
                                                                                              ) =>
                                                                                                changeImperfectionType(
                                                                                                  choice,
                                                                                                  ind,
                                                                                                  "acceptable"
                                                                                                )
                                                                                              }
                                                                                              checked={
                                                                                                choice.acceptable
                                                                                              }
                                                                                              value="acceptable"
                                                                                            />
                                                                                            <span className="large-text">
                                                                                              {" "}
                                                                                              Acceptable
                                                                                              Imperfection
                                                                                              (not
                                                                                              shown
                                                                                              to
                                                                                              customer)
                                                                                            </span>
                                                                                            <br />
                                                                                            {choice2.acceptable &&
                                                                                              choice2.acceptable.map(
                                                                                                (
                                                                                                  info,
                                                                                                  index
                                                                                                ) => {
                                                                                                  return (
                                                                                                    <>
                                                                                                      <span className="small-text">
                                                                                                        {index +
                                                                                                          1}{" "}
                                                                                                        {
                                                                                                          info
                                                                                                        }
                                                                                                      </span>
                                                                                                      <br />
                                                                                                    </>
                                                                                                  );
                                                                                                }
                                                                                              )}
                                                                                            <br />
                                                                                            <input
                                                                                              type="radio"
                                                                                              name={
                                                                                                "imperfectionType" +
                                                                                                choice.choice
                                                                                              }
                                                                                              onChange={(
                                                                                                e
                                                                                              ) =>
                                                                                                changeImperfectionType(
                                                                                                  choice,
                                                                                                  ind,
                                                                                                  "non-acceptable"
                                                                                                )
                                                                                              }
                                                                                              checked={
                                                                                                !choice.acceptable
                                                                                              }
                                                                                              value="non-acceptable"
                                                                                            />
                                                                                            <span className="large-text">
                                                                                              {" "}
                                                                                              Non-Acceptable
                                                                                              Imperfection
                                                                                              (shown
                                                                                              to
                                                                                              customer)
                                                                                            </span>
                                                                                            <br />
                                                                                            {choice2.acceptable &&
                                                                                              choice2.nonAcceptable.map(
                                                                                                (
                                                                                                  info,
                                                                                                  index
                                                                                                ) => {
                                                                                                  return (
                                                                                                    <>
                                                                                                      <span className="small-text">
                                                                                                        {index +
                                                                                                          1}{" "}
                                                                                                        {
                                                                                                          info
                                                                                                        }
                                                                                                      </span>
                                                                                                      <br />
                                                                                                    </>
                                                                                                  );
                                                                                                }
                                                                                              )}
                                                                                          </div>
                                                                                        )}
                                                                                    </>
                                                                                  );
                                                                                }
                                                                              )}
                                                                          </>
                                                                        )}
                                                                      </>
                                                                    );
                                                                  }
                                                                )}
                                                            </>
                                                          );
                                                        }
                                                      )}
                                                    <div className="row">
                                                      <div className="col-lg-12 light-label dark-span textTitle">
                                                        <br />
                                                        <span className="small-text">
                                                          Others :{" "}
                                                        </span>
                                                        <br />
                                                        <input
                                                          type="text"
                                                          className="form-control"
                                                          value={
                                                            otherImperfectionEntered
                                                          }
                                                          onChange={(e) =>
                                                            otherImperfection(
                                                              e.target.value
                                                            )
                                                          }
                                                        />
                                                      </div>

                                                      {masterData &&
                                                        masterData.checkpoints &&
                                                        masterData.checkpoints.map(
                                                          (masterData) => {
                                                            return (
                                                              <>
                                                                {item ===
                                                                  masterData.key && (
                                                                  <>
                                                                    {masterData &&
                                                                      masterData.noImperfectionChoices &&
                                                                      masterData.noImperfectionChoices.map(
                                                                        (
                                                                          option
                                                                        ) => {
                                                                          return (
                                                                            <div className="col-lg-12 light-label dark-span textTitle">
                                                                              <input
                                                                                type="radio"
                                                                                name="imperfectionType"
                                                                                checked={
                                                                                  isOkNoImperfSelected ===
                                                                                  option.name
                                                                                }
                                                                                value={
                                                                                  option.name
                                                                                }
                                                                                onChange={(
                                                                                  e
                                                                                ) =>
                                                                                  isNotApplicableSelected(
                                                                                    e
                                                                                      .target
                                                                                      .value
                                                                                  )
                                                                                }
                                                                              />
                                                                              <span>
                                                                                {" " +
                                                                                  option.name}
                                                                              </span>
                                                                            </div>
                                                                          );
                                                                        }
                                                                      )}
                                                                  </>
                                                                )}
                                                              </>
                                                            );
                                                          }
                                                        )}
                                                    </div>
                                                  </div>
                                                </>
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                        <div className="row">
                                          <div className="col-lg-12 button-container buttonContainer text-center m-0 p-0">
                                            <div className="reject-form">
                                              <button
                                                disabled={isConfirmationDialog}
                                                style={{
                                                  backgroundColor:
                                                    isConfirmationDialog
                                                      ? "grey"
                                                      : "#F37500",
                                                }}
                                                onClick={() => {
                                                  setIsEditCheckpoint("");
                                                  checkpointEditCancled(item);
                                                }}
                                              >
                                                {labels["CANCEL"]}
                                              </button>
                                              <button
                                                disabled={isConfirmationDialog}
                                                style={{
                                                  backgroundColor:
                                                    isConfirmationDialog
                                                      ? "grey"
                                                      : "#F37500",
                                                }}
                                                onClick={(e) =>
                                                  updateCheckpointDataHandler(
                                                    item
                                                  )
                                                }
                                              >
                                                {labels["SAVE"]}
                                              </button>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    ) : (
                                      <>
                                        <div className="col-lg-6">
                                          <div className="row">
                                            <div className="col-lg-12 image-container">
                                              {toggleViewHandlerFlag ===
                                              index ? (
                                                <video
                                                  width="100%"
                                                  height="300"
                                                  controls
                                                >
                                                  {appointmentDetails.data
                                                    .checkpoints[item] &&
                                                    appointmentDetails.data.checkpoints[
                                                      item
                                                    ].videos.map(
                                                      (video, index) => {
                                                        return (
                                                          <source
                                                            src={video.path}
                                                            type="video/mp4"
                                                            key={index}
                                                          />
                                                        );
                                                      }
                                                    )}
                                                </video>
                                              ) : (
                                                <>
                                                  {appointmentDetails.data
                                                    .checkpoints[item] &&
                                                    appointmentDetails.data.checkpoints[
                                                      item
                                                    ].images.map(
                                                      (image, index) => {
                                                        return (
                                                          <img
                                                            src={image.path}
                                                            alt={image.label}
                                                            key={index}
                                                            onClick={() => {
                                                              imageMagnifier(
                                                                image
                                                              );
                                                            }}
                                                          />
                                                        );
                                                      }
                                                    )}
                                                </>
                                              )}
                                            </div>
                                          </div>
                                          {appointmentDetails.data.checkpoints[
                                            item
                                          ] &&
                                            appointmentDetails.data.checkpoints[
                                              item
                                            ].images &&
                                            appointmentDetails.data.checkpoints[
                                              item
                                            ].images.length > 0 && (
                                              <button
                                                className="toggle-view-button"
                                                onClick={() => {
                                                  toggleImageHandler(index);
                                                }}
                                              >
                                                {labels["IMAGE_VIEW"]}
                                              </button>
                                            )}
                                          {appointmentDetails.data.checkpoints[
                                            item
                                          ] &&
                                            appointmentDetails.data.checkpoints[
                                              item
                                            ].videos &&
                                            appointmentDetails.data.checkpoints[
                                              item
                                            ].videos.length > 0 && (
                                              <button
                                                className="toggle-view-button"
                                                onClick={() => {
                                                  toggleVideoHandler(index);
                                                }}
                                              >
                                                Video View
                                              </button>
                                            )}
                                        </div>
                                        <div className="col-lg-6">
                                          {appointmentDetails.data.checkpoints[
                                            item
                                          ] &&
                                          appointmentDetails.data.checkpoints[
                                            item
                                          ].noImperfectionChoices.length &&
                                          appointmentDetails.data.checkpoints[
                                            item
                                          ].noImperfectionChoices &&
                                          isCheckpointEdit !== index ? (
                                            <div>
                                              {
                                                appointmentDetails.data
                                                  .checkpoints[item]
                                                  .noImperfectionChoices[0]
                                              }
                                            </div>
                                          ) : null}
                                          {isRejected === index ? (
                                            <div className="col-lg-12 button-container buttonContainer">
                                              <div className="row">
                                                <div className="col-lg-12 form-group reject-form">
                                                  <textarea
                                                    className="form-control"
                                                    rows="3"
                                                    cols="50"
                                                    placeholder="Please add reason for rejection"
                                                    onChange={
                                                      handleRejectionComment
                                                    }
                                                  />
                                                  {showOnRejectSubmitError && (
                                                    <div className="text-danger">
                                                      {comment === ""
                                                        ? "Please add reason for rejection"
                                                        : ""}
                                                    </div>
                                                  )}
                                                  <button
                                                    disabled={
                                                      isConfirmationDialog
                                                    }
                                                    style={{
                                                      backgroundColor:
                                                        isConfirmationDialog
                                                          ? "grey"
                                                          : "#F37500",
                                                    }}
                                                    onClick={() => {
                                                      setShowOnRejectSubmitError(
                                                        false
                                                      );
                                                      setRejectAction("");
                                                      setComment("");
                                                      setActionArray([]);
                                                    }}
                                                  >
                                                    Cancel
                                                  </button>
                                                  <button
                                                    disabled={
                                                      isConfirmationDialog
                                                    }
                                                    style={{
                                                      backgroundColor:
                                                        isConfirmationDialog
                                                          ? "grey"
                                                          : "#F37500",
                                                    }}
                                                    onClick={() => {
                                                      onSubmitReject(
                                                        item,
                                                        index,
                                                        comment,
                                                        true
                                                      );
                                                    }}
                                                  >
                                                    {labels["SUBMIT"]}
                                                  </button>
                                                </div>
                                              </div>
                                            </div>
                                          ) : (
                                            <>
                                              {!actionArray.includes(index) ? (
                                                <div className="col-lg-12 button-container buttonContainer">
                                                  <button
                                                    style={{
                                                      backgroundColor:
                                                        isConfirmationDialog
                                                          ? "grey"
                                                          : "#F37500",
                                                    }}
                                                    disabled={
                                                      !iscorrectAssigned ||
                                                      isConfirmationDialog
                                                    }
                                                    onClick={() => {
                                                      setRejectAction(index);
                                                      setIsConfirmationDialog(
                                                        false
                                                      );
                                                      setIsEditCheckpoint("");
                                                      setDataKey("");
                                                      rejectHandler(item);
                                                    }}
                                                  >
                                                    Reject
                                                  </button>
                                                </div>
                                              ) : (
                                                <div className="col-lg-12 button-container buttonContainer">
                                                  {appointmentDetails.data
                                                    .qualityChecks[item] &&
                                                    appointmentDetails.data
                                                      .qualityChecks[item]
                                                      .status !== "PENDING" &&
                                                    appointmentDetails.data
                                                      .qualityChecks[item]
                                                      .status !==
                                                      "NO_ACTION" && (
                                                      <>
                                                        {
                                                          <div className="action-done-reset-view">
                                                            <label>
                                                              {appointmentDetails
                                                                .data
                                                                .qualityChecks[
                                                                item
                                                              ].status ===
                                                              "APPROVED"
                                                                ? "This checkpoint and estimates is Approved"
                                                                : [
                                                                    appointmentDetails
                                                                      .data
                                                                      .qualityChecks[
                                                                      item
                                                                    ].status ===
                                                                    "REJECTED"
                                                                      ? "This checkpoint and estimates is Rejected"
                                                                      : "",
                                                                  ]}
                                                            </label>
                                                            {/* {appointmentDetails.data.qualityChecks[item].status === "REJECTED" && (
                                        <button onClick={() => qcActionResetHandler(item,index,false)}>Reset</button>
                                        )} */}
                                                          </div>
                                                        }
                                                      </>
                                                    )}
                                                </div>
                                              )}
                                            </>
                                          )}
                                          <div className="settagmainWrapper">
                                            <div className="settagWrapper">
                                              <p>{labels["SET_TAG_AS"]}</p>
                                              <div className="dropdown">
                                                <span>
                                                  {appointmentDetails.data
                                                    .qualityChecks[item]?.tag
                                                    ? appointmentDetails.data
                                                        .qualityChecks[item]
                                                        ?.tag
                                                    : "GREEN"}
                                                </span>
                                                <ul>
                                                  <li
                                                    className="none"
                                                    onClick={(e) =>
                                                      addTagHandler(
                                                        "none",
                                                        item
                                                      )
                                                    }
                                                  >
                                                    None
                                                  </li>
                                                  <li
                                                    className="green"
                                                    onClick={(e) =>
                                                      addTagHandler(
                                                        "green",
                                                        item
                                                      )
                                                    }
                                                  >
                                                    Green
                                                  </li>
                                                  <li
                                                    className="yellow"
                                                    onClick={(e) =>
                                                      addTagHandler(
                                                        "yellow",
                                                        item
                                                      )
                                                    }
                                                  >
                                                    Yellow{" "}
                                                  </li>
                                                  <li
                                                    className="red"
                                                    onClick={(e) =>
                                                      addTagHandler("red", item)
                                                    }
                                                  >
                                                    Red
                                                  </li>
                                                </ul>
                                              </div>

                                              <img
                                                src={Question}
                                                alt="info"
                                                onClick={(e) =>
                                                  onAllocateOpen(item)
                                                }
                                              />
                                              <Popup
                                                isOpen={allocateOpen}
                                                close={(e) => onAllocateClose()}
                                              >
                                                <QuestionMarkPopUp
                                                  onClose={(e) =>
                                                    onAllocateClose()
                                                  }
                                                  hintData={hintData}
                                                />
                                              </Popup>
                                            </div>
                                          </div>
                                        </div>
                                      </>
                                    )}
                                  </div>
                                </div>
                              ) : null}
                            </>
                          );
                        }
                      )}
                      {/* Change status ends here */}
                      <button
                        disabled={isConfirmationDialog}
                        style={{
                          backgroundColor: isConfirmationDialog
                            ? "grey"
                            : "#F37500",
                        }}
                        className="submit-all-ac-actions submitAction"
                        onClick={() => submitAllQcAction()}
                      >
                        Submit All QC Actions
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <SummaryList
              totalCheckpointsCount={+nonAccImperfection + +accImperfection}
              appointmentDetail={appointmentDetails}
              addTagging={addTagging}
            />
          )}
        </div>
        {/* Summary list */}
      </div>
    </>
  );
};

export default YardQaDetailsComponent;
