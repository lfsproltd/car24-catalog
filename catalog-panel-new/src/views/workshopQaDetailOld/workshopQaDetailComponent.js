import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import loaderImg from "../../assets/img/loader.png";
import AlertBox from './../../common/showAlert';
import "../workshopQaDetail/workshopDetails_Old.css";
import { useHistory } from "react-router-dom";
import { dateFormat, setLocationType, timeFormat } from "../../utils/utils";
import { AlertType } from '../../utils/constants/values.constants';
import { Link } from 'react-router-dom';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { connect } from 'react-redux';
import {getWorkshopListingDetails,approveQualityChecks,getInspectionSummary} from "../../store/actions/workshopQaManagement/workshopQaManagement.action";
import CustomDialog from './../dialog/customDialog';

const WorkshopQaDetailComponent = (props) => {
  const historyLink = useHistory();
  const dispatch = useDispatch();
  let imperfectionActionsData = {
    "inspectionType": "CATALOG",
    "locationType":"",
    "schemaVersion": "IN_CAR_CATALOG_V1",
    "data":{
        "action":"qa",
        "qualityChecks":{
        
        }
    }
  };
  const [appointmentDetails, setAppointmentDetails] = useState({});
  const [showHideToggler, setShowHideToggler] = useState(false);
  const [imperfectionCount, setImperfectionCount] = useState("");
  const [nonAccImperfection, setNonAccImperfection] = useState("");
  const [accImperfection, setAccImperfection] = useState("");
  const [isRejected, setRejectAction] = useState("");
  const [comment,setComment] = useState("");
  const [toggleViewHandlerFlag, setToggleViewHandler] = useState("");
  let   [qcActionData, setQcActionData] = useState(imperfectionActionsData);
  const [allImages, setAllImages] = useState([]);
  const [allVideos, setAllVideos] = useState([]);
  const [actionArray, setActionArray] = useState([]);
  const [lastInspectionData, setInspectionData] = useState([]);
  const [toggleLastInspection, setToggleLastInspection] = useState("");
  const [mediaType, setMediaType] = useState("image");
  const [magnifyImg, setMagnifier] = useState("");
  const [showOnRejectSubmitError,setShowOnRejectSubmitError] = useState(false);
  const [qcPendingStatusLength,setQcPendingStatusLength] = useState(0);
  const [qcPendingStatusAcceptableImp,setQcPendingStatusAcceptableImp] = useState(0);
  const [qcActionCompletedStatus, setQcActionCompletedStatus] = useState(0);
  const [iscorrectAssigned, setIscorrectAssigned] = useState(false);

  //For editing checkpoints data starts
  const [masterData, setMasterData] = useState({});
  const [reEdit,setReEdit] = useState("");
  const [isCheckpointEdit, setIsEditCheckpoint] = useState("");
  const [stateToBeUpdated, setStateToBeUpdated] = useState({});
  const [isOkNoImperfSelected,setIsOkNoImperfectionSelected] = useState("");
  const [otherImperfectionEntered, setOtherImperfectionEntered] = useState("");
  const [otherWorkToBeDone, setOtherWorkToBeDone] = useState("");
  const [disableWhenAcceptableImperf, setDisableWhenAcceptableImperf] = useState(false);
  const [isConfirmationDialog, setIsConfirmationDialog] = useState(false);
  const [getConfirmation, setGetConfirmation] = useState(false);
  const [dataKey,setDataKey] = useState("");
  const [confirmationForOnSubmitReject, setConfirmationForOnSubmitReject] = useState({
    item:'',index:'',comment:'',optional:false, isConfirm:false
  });
  const [popupMessage, setPopupMessage] = useState("");
  //inspection summary data
  const [inspectionSummary, setInspectionSummary] = useState({});
  //No work to be done 
  const [noWorkToBeDone,setNoWorkToBeDone] = useState("");

  useEffect(()=>{
    let totlaNonAcceptableImperfections = 0;
    let totlalAcceptableImperfections = 0;
    let searchParams = {
      appointmentId:'',
      inspectionType:"CATALOG",
      version:'all'
    };
    let allImages = [];
    let allVideos = [];
    if(props && props.listingDetails && props.listingDetails[0] && props.listingDetails[0].appointmentId){
      searchParams.appointmentId = props.listingDetails[0].appointmentId;
      dispatch(props.getInspectionData(searchParams));
      setInspectionData(props.lastInspectionData[1]);
      }
    if(props && props.listingDetails[0] && props.listingDetails[0].data && props.listingDetails[0].data.checkpoints){
      Object.keys(props.listingDetails[0].data.checkpoints).map((item)=>{
          props.qaTopImagesKeys.map((itemTop)=>{
            if(itemTop === item){
              props.listingDetails[0].data.checkpoints[itemTop].images.map((item,index)=>{
                allImages.push(item);
              });
              props.listingDetails[0].data.checkpoints[itemTop].videos.map((item,index)=>{
                allVideos.push(item);
              })
            }          
          })
          setAllImages(allImages);
          setAllVideos(allVideos);
      });

      Object.keys(props.listingDetails[0].data.qualityChecks).map((item)=>{
        if(props.listingDetails[0].data.qualityChecks[item].invalidated === false){
            if(props.listingDetails[0].data.checkpoints[item].ok === false){
                totlaNonAcceptableImperfections += 1;
              }
              else if( 
                props.listingDetails[0].data.checkpoints[item].choices.length > 0){
                  totlalAcceptableImperfections += 1;
              }
        }
      });
    }
    setNonAccImperfection(totlaNonAcceptableImperfections);
    setAccImperfection(totlalAcceptableImperfections);
    let totalQCheck = 0;
    if(props && props.listingDetails[0] && props.listingDetails[0].data && props.listingDetails[0].data.qualityChecks){
      Object.keys(props.listingDetails[0].data.qualityChecks).map((item)=>{
        Object.keys(props.listingDetails[0].data.qualityChecks[item]).map((invalidated)=>{
          if(invalidated && invalidated === "invalidated" && 
          props.listingDetails[0].data.qualityChecks[item][invalidated] === false){
            totalQCheck += 1
          }        
        })
      });   
      setImperfectionCount(totalQCheck);   
    }

    let lengthQc = 0;
    let acceptableImp = 0;
        if(props && props.listingDetails[0] && props.listingDetails[0].data && props.listingDetails[0].data.qualityChecks){
        Object.keys(props.listingDetails[0].data.qualityChecks).map((item)=>{
        if(props.listingDetails[0].data.qualityChecks[item].status === "PENDING" 
        && props.listingDetails[0].data.qualityChecks[item].invalidated === false){
            lengthQc += 1 
        }
        });
        setQcPendingStatusLength(lengthQc);
        } 

        if(props && props.listingDetails[0] && props.listingDetails[0].data){
          if(props.listingDetails[0].data && props.listingDetails[0].data.checkpoints){
            Object.keys(props.listingDetails[0].data.checkpoints).map((item)=>{
              if(((props.listingDetails[0].data.qualityChecks[item]?.status === "APPROVED") || 
              (props.listingDetails[0].data.checkpoints[item]?.ok === true))
              ){
                acceptableImp += 1 
              }
            })
          }
          setQcPendingStatusAcceptableImp(lengthQc);
        }

  },[props.listingDetails]);

  useEffect(()=>{
    if(props && props.inspectionSummary){
      setInspectionSummary(props.inspectionSummary);
    }
  },[props.inspectionSummary]);

  useEffect(()=>{
    if(props && props.masterData){
      setMasterData(props.masterData);
    }
  },[props.masterData]);
  useEffect(()=>{
    let userData = JSON.parse(localStorage.getItem("userData"));
    if(userData && userData.email && props && props.listingDetails[0] && props.listingDetails[0].assignedTo){
      setIscorrectAssigned(userData.email === props.listingDetails[0].assignedTo.uid);
    }
    props && props.listingDetails.map((item)=>{
      if(item && item.updatedAt){
        item.formatedUpdatedAt = dateFormat(item.updatedAt);
      }
    });   
    setAppointmentDetails(props.listingDetails[0]);
  },[props.listingDetails]);

  useEffect(()=>{
    props && props.lastInspectionData.map((item)=>{
      if(item && item.updatedAt){
        item.formatedUpdatedAt = dateFormat(item.updatedAt);
        item.formatedUpdateAtTime = timeFormat(item.updatedAt);
      }
    });
    if(props && props.lastInspectionData && props.lastInspectionData.length > 1){
      props.lastInspectionData.sort((a,b)=>{
        return b.version - a.version;
      });
      setInspectionData(props.lastInspectionData[1]);
    }
  },[props.lastInspectionData]);
  
  const handleRejectionComment = (event)=>{
    setComment(event.target.value);
  }

  useEffect(()=>{
    if(getConfirmation && confirmationForOnSubmitReject.isConfirm){
      onSubmitReject(confirmationForOnSubmitReject.item,confirmationForOnSubmitReject.index,
        confirmationForOnSubmitReject.comment,confirmationForOnSubmitReject.optional);
    }
  },[getConfirmation]);

  const rejectHandler = (item)=>{
    let obj = {};
    obj = {...qcActionData};
    obj.data.qualityChecks = {};
    setQcActionData({...obj});
    setConfirmationForOnSubmitReject({item:'',index:'',comment:'',optional:false, isConfirm:false});
  }

  useEffect(()=>{
    if(getConfirmation && !!noWorkToBeDone){
      onFinalSubmitNoWorkToBeDone(noWorkToBeDone);
    }
    if(!getConfirmation){
      setNoWorkToBeDone("");
      setPopupMessage("");
    }
  },[getConfirmation && noWorkToBeDone]);

  const onSubmitNoWorkToBeDone = (item) => {
    setIsConfirmationDialog(true);
    setNoWorkToBeDone(item);
    setPopupMessage("No work to be done will remove the checkpoint estimates, Are you sure?");
  }

  const onFinalSubmitNoWorkToBeDone = (item) => {
    let data = {
      "inspectionType": "CATALOG",
      "schemaVersion": "IN_CAR_CATALOG_V1",
      "data":{
          "action":"noWork",
          "qualityChecks":{} 
            }
          }
          data.data.qualityChecks[item] = {
            "status":"APPROVED",
          }

          dispatch(approveQualityChecks(data,appointmentDetails.appointmentId,"Approved Successfully"));
          let params = {
            appointmentId:appointmentDetails.appointmentId,
            inspectionType:"CATALOG",
            inspectionStatus:"ESTIMATED"
          }
          setTimeout(()=>{
            dispatch(getWorkshopListingDetails(params));
            dispatch(getWorkshopListingDetails(params));
          },1000);
  
          setTimeout(()=>{
            dispatch(getInspectionSummary({appointmentId:appointmentDetails.appointmentId}));
            dispatch(getInspectionSummary({appointmentId:appointmentDetails.appointmentId}));
          },1100);
  
          setGetConfirmation(false);
          setIsConfirmationDialog(false);
          setNoWorkToBeDone("");
          setPopupMessage("");
  }

  const onSubmitReject = (item,index,comment,optional)=>{
    setReEdit("");
    setNoWorkToBeDone("");
    setPopupMessage("");
    if(!comment || comment === ""){
      setShowOnRejectSubmitError(true);
      return false
    }
    setConfirmationForOnSubmitReject({item:item,index:index,comment:comment,optional:optional, isConfirm:true});
    setIsConfirmationDialog(true);
    setShowOnRejectSubmitError(false);
    let obj = {};
    obj = {...qcActionData};
    obj.data.qualityChecks[item] = {status:"REJECTED","comment":comment};
    setQcActionData({...obj});

    let newActionArray = [];
    newActionArray = [...actionArray];
    newActionArray.push(index);
    setActionArray([...newActionArray]);
    if(optional === false){
    let qcActionCompletedStatus = 0;
    if(appointmentDetails?.data?.qualityChecks){
      Object.keys(appointmentDetails.data.qualityChecks).map((key)=>{
        if(qcActionData.data.qualityChecks[key]){
          qcActionCompletedStatus += 1;
          setQcActionCompletedStatus(qcActionCompletedStatus);
        }
      })
      }
    }
    // Submitting single request
    if(getConfirmation && confirmationForOnSubmitReject.isConfirm){
      if(appointmentDetails && appointmentDetails.inspectionStatus === "ESTIMATED"){
        let appointmentId = window.location.pathname.split("/")[2];
        qcActionData.locationType = appointmentDetails.locationType;
        dispatch(approveQualityChecks(qcActionData,appointmentId,"Rejected successfully"));
        setQcActionData(imperfectionActionsData);
        setActionArray([]);
        setComment("");
        setRejectAction("");
        // Refreshing list details
        let params = {
          appointmentId:appointmentDetails.appointmentId,
          inspectionType:"CATALOG",
          inspectionStatus:"ESTIMATED"
        }
        
        setTimeout(()=>{
          dispatch(getWorkshopListingDetails(params));
          dispatch(getWorkshopListingDetails(params));
        },1000);

        setTimeout(()=>{
          dispatch(getInspectionSummary({appointmentId:appointmentDetails.appointmentId}));
          dispatch(getInspectionSummary({appointmentId:appointmentDetails.appointmentId}));
        },1100);

        setGetConfirmation(false);
        setIsConfirmationDialog(false);
        setConfirmationForOnSubmitReject({item:'',index:'',comment:'',optional:false, isConfirm:false});        
  
      }else{
        dispatch(props.setToasterMessage({
          toasterMessage: "Something went wrong",
          showToaster: true,
          toasterType: AlertType.ERROR
        }));
      }  
    } 
      
  }

  const onSubmitApprove = (item,index,optional) =>{
    setReEdit("");
    setNoWorkToBeDone("");
    setPopupMessage("");
    let obj = {};
    obj = {...qcActionData};
    obj.data.qualityChecks[item] = {status:"APPROVED"};
    setQcActionData({...obj});

    let newActionArray = [];
    newActionArray = [...actionArray];
    newActionArray.push(index);
    setActionArray([...newActionArray]);
    if(optional === false){
    let qcActionCompletedStatus = 0;
    if(appointmentDetails?.data?.qualityChecks){
      Object.keys(appointmentDetails.data.qualityChecks).map((key)=>{
        if(qcActionData.data.qualityChecks[key]){
          qcActionCompletedStatus += 1;
          setQcActionCompletedStatus(qcActionCompletedStatus);
        }
      })
    }
    }

    if(appointmentDetails && appointmentDetails.inspectionStatus === "ESTIMATED"){
      let appointmentId = window.location.pathname.split("/")[2];
      qcActionData.locationType = appointmentDetails.locationType;
      dispatch(approveQualityChecks(qcActionData,appointmentId,"Approved successfully"));
      setQcActionData(imperfectionActionsData);
      setActionArray([]);

      // Refreshing list details
      let params = {
        appointmentId:appointmentDetails.appointmentId,
        inspectionType:"CATALOG",
        inspectionStatus:"ESTIMATED"
      }
      setTimeout(()=>{
        dispatch(getWorkshopListingDetails(params));
        dispatch(getWorkshopListingDetails(params));
      },1000);

      setTimeout(()=>{
        dispatch(getInspectionSummary({appointmentId:appointmentDetails.appointmentId}));
        dispatch(getInspectionSummary({appointmentId:appointmentDetails.appointmentId}));
      },1100);
      
      // historyLink.push('/workshop-qa');
    }else{
      dispatch(props.setToasterMessage({
        toasterMessage: "Something went wrong",
        showToaster: true,
        toasterType: AlertType.ERROR
      }));
    }    
    
  }

  const qcActionResetHandler = (item,index,optional) => {
    setActionArray(actionArray.filter(item => item !== index));
    setReEdit(index);
    let obj = {};
    obj = {...qcActionData};
    delete obj.data.qualityChecks[item]; 
    setQcActionData({...obj});
    if(optional === false){
      let qcActionCompletedCount = 1;
      setQcActionCompletedStatus(qcActionCompletedStatus - qcActionCompletedCount);
    }
    }

  const submitAllQcAction = () => {
    if(appointmentDetails && appointmentDetails.inspectionStatus === "ESTIMATED"){
      let appointmentId = window.location.pathname.split("/")[2];
      let payload = {
        "inspectionType": "CATALOG",
        "schemaVersion": "IN_CAR_CATALOG_V1",
        "data":{
            "action":"submitQa"
        }
    };
      dispatch(approveQualityChecks(payload,appointmentId,"Submitted successfully","submit all qc workshopQA"));
      setQcActionData(imperfectionActionsData);
      setActionArray([]);
    }else{
      dispatch(props.setToasterMessage({
        toasterMessage: "Something went wrong",
        showToaster: true,
        toasterType: AlertType.ERROR
      }));
    } 
  }

  const toggleVideoHandler = (index)=>{
    setToggleViewHandler(index);
  }

  const toggleVideoHandler2 = (index, type)=>{
    setMediaType(type);
  }

  const toggleImageHandler = (index)=>{
    setToggleViewHandler("");
  }

  const toggleImageHandler2 = (index,type)=>{
    setMediaType(type);
  }

  const toggleLastInspectionHandler = (index) => {
    setToggleLastInspection(index);
    setShowHideToggler(!showHideToggler);
  }

  const imageMagnifier = (data) =>{
    setMagnifier(data);    
  };

  // Handlers to update checkpoints data starts here
  const editCheckpointClicked = (index,checkpointName) => {
    setConfirmationForOnSubmitReject({item:'',index:'',comment:'',optional:false, isConfirm:false});
    setIsConfirmationDialog(false);
    setIsEditCheckpoint(index);
    setReEdit("");
    setNoWorkToBeDone("");
    setRejectAction("");
    setIsOkNoImperfectionSelected("");
    setOtherImperfectionEntered("");
    setOtherWorkToBeDone("");
    setStateToBeUpdated({});
    let prevCondition = {
      acceptImpChoices:{},
      nonAcceptImpChoices:{}
    };
    if(appointmentDetails && appointmentDetails.data && appointmentDetails.data.checkpoints && 
      appointmentDetails.data.checkpoints[checkpointName]){
              masterData && masterData.checkpoints && masterData.checkpoints.map((masterData)=>{
                if(checkpointName === masterData.key){
                  masterData && masterData.noImperfectionChoices && masterData.noImperfectionChoices.map((option)=>{
                    if(appointmentDetails.data.checkpoints[checkpointName].noImperfectionChoices.includes(option.name)){
                      setIsOkNoImperfectionSelected(option.name);
                    }
                  });
                }
              })

          //Imperfections
          if(appointmentDetails.data.checkpoints[checkpointName]){
              prevCondition.nonAcceptImpChoices["choices"] = appointmentDetails.data.checkpoints[checkpointName].choices;
              prevCondition.nonAcceptImpChoices["choices"].map((choice,index)=>{
                if(choice.other === true){
                  setOtherImperfectionEntered(choice.choice);
                }
                choice.selected = true;
                return choice
              })
            }

          // Work to be done
          if(appointmentDetails.data.checkpoints[checkpointName]?.refurbishmentChoices?.length){
            prevCondition["reburbChoices"] = appointmentDetails.data.checkpoints[checkpointName].refurbishmentChoices;
            prevCondition["reburbChoices"].map((item,index)=>{
                if(item.other === true){
                  setOtherWorkToBeDone(item.refurbishment);
                }
                item.selected = true;
                return item;
            })
          }

          // Possible options
          if(masterData && masterData.checkpoints){
            let addPossibleChoices = [];
            let addPossibleRefurbChoices = [];
            masterData.checkpoints.map((item) => {
              if(item.key === checkpointName){
                if(item && item.choices){
                  item.choices.map((choice)=>{
                    addPossibleChoices.push({acceptable: choice?.type === "absolute" ? false : true,choice: choice.name, other: false,selected: false});
                  });
                }
                if(item && item.refurbishment && item.refurbishment.choices){
                  item.refurbishment.choices.map((choice)=>{
                    addPossibleRefurbChoices.push({refurbishment: choice, other: false, selected: false});
                  })
                }
              }
            });
            if(prevCondition.nonAcceptImpChoices["choices"] && addPossibleChoices){
              prevCondition.nonAcceptImpChoices["choices"] = [...addPossibleChoices,...prevCondition.nonAcceptImpChoices["choices"]];
              prevCondition.nonAcceptImpChoices["choices"] = [...prevCondition.nonAcceptImpChoices["choices"].reduce((map,obj)=> map.set(obj.choice,obj), new Map()).values()];
            }else if(!prevCondition.nonAcceptImpChoices["choices"] && addPossibleChoices){
              prevCondition.nonAcceptImpChoices["choices"] = [...addPossibleChoices];
              prevCondition.nonAcceptImpChoices["choices"] = [...prevCondition.nonAcceptImpChoices["choices"].reduce((map,obj)=> map.set(obj.choice,obj), new Map()).values()];
            }
            if(prevCondition["reburbChoices"] && addPossibleRefurbChoices){
            prevCondition["reburbChoices"] = [...addPossibleRefurbChoices,...prevCondition["reburbChoices"]];
            prevCondition["reburbChoices"] = [... prevCondition["reburbChoices"].reduce((map,obj)=> map.set(obj.refurbishment,obj), new Map()).values()];
            }else if(!prevCondition["reburbChoices"] && addPossibleRefurbChoices){
              prevCondition["reburbChoices"] = [...addPossibleRefurbChoices];
              prevCondition["reburbChoices"] = [... prevCondition["reburbChoices"].reduce((map,obj)=> map.set(obj.refurbishment,obj), new Map()).values()];
            }
          }
          setStateToBeUpdated({...prevCondition});
          let allSelectedChoices = [];
          let allAcceptableChoices = [];
          let allOptions = {};
          allOptions = {...stateToBeUpdated};
          if(allOptions && allOptions.nonAcceptImpChoices 
            && allOptions.nonAcceptImpChoices.choices && 
            allOptions.nonAcceptImpChoices.choices.length){
              allSelectedChoices = allOptions.nonAcceptImpChoices.choices.filter((item)=>{
                if(item && item.selected === true){
                return true;
                } 
              });
              if(allSelectedChoices && allSelectedChoices.length){
                allAcceptableChoices = allSelectedChoices.filter((item)=>{
                  if(item && item.acceptable === true ){
                    return item
                  }
                });
              }
            }
          if(allSelectedChoices && allSelectedChoices.length && allAcceptableChoices 
            && allAcceptableChoices.length && allAcceptableChoices.length === allSelectedChoices.length && !!!otherImperfectionEntered){
            setDisableWhenAcceptableImperf(true);
            setOtherWorkToBeDone("");
            if(stateToBeUpdated && stateToBeUpdated.reburbChoices && stateToBeUpdated.reburbChoices.length){
              stateToBeUpdated.reburbChoices.filter((item) => {
                item.selected = false;
                return item
                })
              }
            }else{
              setDisableWhenAcceptableImperf(false);
            }
    }
  }

  const changeChoicesHandler = (type,index,value) => {
    if(type === "modify"){
      stateToBeUpdated.nonAcceptImpChoices.choices[index].choice = value;
    }
    if(type === "nonAccept"){
      setIsOkNoImperfectionSelected("");
      stateToBeUpdated.nonAcceptImpChoices.choices[index].selected = !stateToBeUpdated.nonAcceptImpChoices.choices[index].selected;
    }
    if(type === "accept"){
      setIsOkNoImperfectionSelected("");
      stateToBeUpdated.acceptImpChoices.choices[index].selected = !stateToBeUpdated.acceptImpChoices.choices[index].selected;
    }

    let allSelectedChoices = [];
      let allAcceptableChoices = [];
      let allOptions = {};
      allOptions = {...stateToBeUpdated};
      if(allOptions && allOptions.nonAcceptImpChoices 
        && allOptions.nonAcceptImpChoices.choices && 
        allOptions.nonAcceptImpChoices.choices.length){
          allSelectedChoices = allOptions.nonAcceptImpChoices.choices.filter((item)=>{
           if(item && item.selected === true){
            return true;
           } 
          });
          if(allSelectedChoices && allSelectedChoices.length){
            allAcceptableChoices = allSelectedChoices.filter((item)=>{
              if(item && item.acceptable === true ){
                return item
              }
            });
          }
        }
      if(allSelectedChoices && allSelectedChoices.length && allAcceptableChoices 
        && allAcceptableChoices.length && allAcceptableChoices.length === allSelectedChoices.length && !!!otherImperfectionEntered){
        setDisableWhenAcceptableImperf(true);
        setOtherWorkToBeDone("");
        if(stateToBeUpdated && stateToBeUpdated.reburbChoices && stateToBeUpdated.reburbChoices.length){
          stateToBeUpdated.reburbChoices.filter((item) => {
            item.selected = false;
            return item
            })
          }
        }else{
          setDisableWhenAcceptableImperf(false);
        }

    if(type === "reburbChoice"){
      if(!!isOkNoImperfSelected){
        dispatch(props.setToasterMessage({
          toasterMessage: "No imperfection selected !!",
          showToaster: true,
          toasterType: AlertType.WARNING
        }));
        return
      }
      if(disableWhenAcceptableImperf){
        dispatch(props.setToasterMessage({
          toasterMessage: "Acceptable imperfection selected !!",
          showToaster: true,
          toasterType: AlertType.WARNING
        }));
        return
      }
      stateToBeUpdated.reburbChoices[index].selected = !stateToBeUpdated.reburbChoices[index].selected;
    }
    if(type === "reburbChoiceModify"){
      stateToBeUpdated.reburbChoices[index].refurbishment = value ? value : stateToBeUpdated.reburbChoices[index].refurbishment;
    }
    setStateToBeUpdated({...stateToBeUpdated});
  }

  const changeImperfectionType = (choice,index,imperfectionType) => {
    stateToBeUpdated.nonAcceptImpChoices.choices[index].acceptable = !stateToBeUpdated.nonAcceptImpChoices.choices[index].acceptable;
    setStateToBeUpdated({...stateToBeUpdated});
      let allSelectedChoices = [];
      let allAcceptableChoices = [];
      let allOptions = {};
      allOptions = {...stateToBeUpdated};
      if(allOptions && allOptions.nonAcceptImpChoices 
        && allOptions.nonAcceptImpChoices.choices && 
        allOptions.nonAcceptImpChoices.choices.length){
          allSelectedChoices = allOptions.nonAcceptImpChoices.choices.filter((item)=>{
           if(item && item.selected === true){
            return true;
           } 
          });
          if(allSelectedChoices && allSelectedChoices.length){
            allAcceptableChoices = allSelectedChoices.filter((item)=>{
              if(item && item.acceptable === true ){
                return item
              }
            });
          }
        }
      if(allSelectedChoices && allSelectedChoices.length && allAcceptableChoices 
        && allAcceptableChoices.length && allAcceptableChoices.length === allSelectedChoices.length && !!!otherImperfectionEntered){
        setDisableWhenAcceptableImperf(true);
        setOtherWorkToBeDone("");
        if(stateToBeUpdated && stateToBeUpdated.reburbChoices && stateToBeUpdated.reburbChoices.length){
          stateToBeUpdated.reburbChoices.filter((item) => {
            item.selected = false;
            return item
            })
          }
        }else{
          setDisableWhenAcceptableImperf(false);
        }
    
  }

  const isNotApplicableSelected = (value) => {
    setOtherImperfectionEntered("");
    setOtherWorkToBeDone("");
    setDisableWhenAcceptableImperf(false);
    setIsOkNoImperfectionSelected(value);
    if(stateToBeUpdated.nonAcceptImpChoices && stateToBeUpdated.nonAcceptImpChoices.choices){
      stateToBeUpdated.nonAcceptImpChoices.choices.map((data)=>{
        data.selected = false;
        return data;
      })
    }
    if(stateToBeUpdated && stateToBeUpdated.reburbChoices && stateToBeUpdated.reburbChoices.length){
      stateToBeUpdated.reburbChoices.map((refurb)=>{
        refurb.selected = false;
        return refurb;
      });
    }
  }

  const otherImperfection = (value) =>{
    setIsOkNoImperfectionSelected("");
    setDisableWhenAcceptableImperf(false);
    setOtherImperfectionEntered(value);
    let allSelectedChoices = [];
            let allAcceptableChoices = [];
            let allOptions = {};
            allOptions = {...stateToBeUpdated};
            if(allOptions && allOptions.nonAcceptImpChoices 
              && allOptions.nonAcceptImpChoices.choices && 
              allOptions.nonAcceptImpChoices.choices.length){
                allSelectedChoices = allOptions.nonAcceptImpChoices.choices.filter((item)=>{
                 if(item && item.selected === true){
                  return true;
                 } 
                });
                if(allSelectedChoices && allSelectedChoices.length){
                  allAcceptableChoices = allSelectedChoices.filter((item)=>{
                    if(item && item.acceptable === true ){
                      return item
                    }
                  });
                }
              }
            if(allSelectedChoices && allSelectedChoices.length && allAcceptableChoices 
              && allAcceptableChoices.length && allAcceptableChoices.length === allSelectedChoices.length && (!value || !otherImperfectionEntered)){
              setDisableWhenAcceptableImperf(true);
              setOtherWorkToBeDone("");
              if(stateToBeUpdated && stateToBeUpdated.reburbChoices && stateToBeUpdated.reburbChoices.length){
                stateToBeUpdated.reburbChoices.filter((item) => {
                  item.selected = false;
                  return item
                  })
                }
              }else{
                setDisableWhenAcceptableImperf(false);
              }
  }

  const otherWorktoBeDone = (value) => {
    if(disableWhenAcceptableImperf){
      dispatch(props.setToasterMessage({
        toasterMessage: "Acceptable imperfection selected !!",
        showToaster: true,
        toasterType: AlertType.WARNING
      }));
      return
    }
    if(!!!isOkNoImperfSelected){
      setOtherWorkToBeDone(value);
    }
  }

  const checkpointEditCancled = (item)=>{
    let params = {
      appointmentId:appointmentDetails.appointmentId,
      inspectionType:"CATALOG",
      inspectionStatus:"ESTIMATED"
    };    
    setTimeout(()=>{
      dispatch(getWorkshopListingDetails(params));
    },100);
  }

  useEffect(()=>{
    if(dataKey && getConfirmation){
      updateCheckpointDataHandler(dataKey);
    }
  },[getConfirmation]);

  const updateCheckpointDataHandler = (dataKey) => {
      let payload = {
        "inspectionType": "CATALOG",
        "schemaVersion": "IN_CAR_CATALOG_V1",
            "data":{
                "action":"checkpointsQa",
                "checkpoints":{}
            }
        };
      payload.data.checkpoints[dataKey] = {};
      let selectedChoices;
      let selectedRefurbChoices;
      let noImperfectionChoices = [];
        if(stateToBeUpdated.nonAcceptImpChoices && stateToBeUpdated.nonAcceptImpChoices.choices){
          selectedChoices = stateToBeUpdated.nonAcceptImpChoices.choices.map((item)=>{
            if(item.selected === true && item.other === false){
              return {acceptable:item.acceptable,choice:item.choice,other:item.other}
            }
          });
    
          selectedChoices = selectedChoices.filter(function( element ) {
            return element !== undefined;
         });
    
         if(!!otherImperfectionEntered){
          selectedChoices.push({acceptable:false,choice:otherImperfectionEntered,other:true});
         }    
        }
        if(stateToBeUpdated && stateToBeUpdated.reburbChoices){
          selectedRefurbChoices = stateToBeUpdated.reburbChoices.map((item)=>{
            if(item.selected === true && item.other === false){
              return {refurbishment:item.refurbishment,other:item.other}
            }
          });
          selectedRefurbChoices = selectedRefurbChoices.filter(function( element ) {
            return element !== undefined;
         });
         if(!!otherWorkToBeDone){
          selectedRefurbChoices.push({refurbishment:otherWorkToBeDone,other:true})
         }
        }
    
        if(!!isOkNoImperfSelected){
          noImperfectionChoices.push(isOkNoImperfSelected);
        }
    
        if(selectedChoices?.length){
          payload.data.checkpoints[dataKey]["choices"] = selectedChoices;
        }
        if(selectedRefurbChoices?.length){
          payload.data.checkpoints[dataKey]["refurbishmentChoices"] = selectedRefurbChoices;
        }
        if(noImperfectionChoices?.length){
          payload.data.checkpoints[dataKey]["noImperfectionChoices"] = noImperfectionChoices;
        }
    
        if(appointmentDetails && appointmentDetails.data && appointmentDetails.data.checkpoints && 
          appointmentDetails.data.checkpoints[dataKey] && appointmentDetails.data.checkpoints[dataKey].images && 
          appointmentDetails.data.checkpoints[dataKey].images.length){
            payload.data.checkpoints[dataKey]["images"] = appointmentDetails.data.checkpoints[dataKey].images;
        }
    
        if(appointmentDetails && appointmentDetails.data && appointmentDetails.data.checkpoints && 
          appointmentDetails.data.checkpoints[dataKey] && appointmentDetails.data.checkpoints[dataKey].videos && 
          appointmentDetails.data.checkpoints[dataKey].videos.length){
            payload.data.checkpoints[dataKey]["videos"] = appointmentDetails.data.checkpoints[dataKey].videos;
        }
    
        console.log(payload);
        // check whether no work to be done selected or not in case of non-acceptable imperfection
        let showWorkToBeDoneWarning = 0;
        if(payload.data.checkpoints[dataKey] && payload.data.checkpoints[dataKey].choices && payload.data.checkpoints[dataKey].choices.length){
          payload.data.checkpoints[dataKey].choices.map((choice)=>{
            if(choice && choice.acceptable === false && 
              (!payload.data.checkpoints[dataKey].refurbishmentChoices || payload.data.checkpoints[dataKey].refurbishmentChoices.length === 0)){
                showWorkToBeDoneWarning += 1;
                dispatch(props.setToasterMessage({
                  toasterMessage: "Please select work to be done!!",
                  showToaster: true,
                  toasterType: AlertType.WARNING
                })); 
                return                             
            }
          });
        }
       
        if(showWorkToBeDoneWarning === 0){
          setDataKey(dataKey);
          setIsConfirmationDialog(true);
        }else{
          setDataKey("");
          setIsConfirmationDialog(false);
        }

        if(getConfirmation && dataKey){
        dispatch(approveQualityChecks(payload,appointmentDetails.appointmentId));
        setIsEditCheckpoint("");
        setTimeout(()=>{
          let params = {
            appointmentId:appointmentDetails.appointmentId,
            inspectionType:"CATALOG",
            inspectionStatus:"ESTIMATED"
          }
          dispatch(getWorkshopListingDetails(params));
          dispatch(getWorkshopListingDetails(params));
        },1000);
        setTimeout(()=>{
          dispatch(getInspectionSummary({appointmentId:appointmentDetails.appointmentId}));
          dispatch(getInspectionSummary({appointmentId:appointmentDetails.appointmentId}));
        },1100);
        setGetConfirmation(false);
        setDataKey("");
        setIsConfirmationDialog(false);
      }      
  }
  // Handlers to update checkpoints data ends here

  return (
    <>
    {isConfirmationDialog ? (
    <CustomDialog
    setPopupMessage={popupMessage} 
    setGetConfirmation={setGetConfirmation} 
    setIsConfirmationDialog={setIsConfirmationDialog}
    />  
    ):(null)}

    {magnifyImg && magnifyImg.path && (
      <div className="background-shadow">
        <div>
        <TransformWrapper defaultScale={1} defaultPositionX={200} defaultPositionY={100}>
          {({zoomIn,zoomOut,resetTransform,...rest}) => (
            <><div className="row m-0">
              <div className="col-4"></div>
              <div className="col-5">
                <button className="btn btn-primary p-1 px-3 text-white" onClick={()=>zoomIn()}> + </button>
                <button className="btn mx-1 my-1 p-1 btn-primary text-white" onClick={()=>resetTransform()}> Reset </button>
                <button className="btn btn-primary p-1 px-3 text-white" onClick={()=>zoomOut()}> - </button>
                <TransformComponent>
                  <img src={magnifyImg.path} width="550"/>
                </TransformComponent>
              </div>
              <div className="col-3">
              <span className="close-image-preview" onClick={()=> setMagnifier("")}>X</span>
              </div>
            </div>
            </>
          )}
        </TransformWrapper>
        
        </div>
      </div>
    )}
    
    {props.showToaster && <AlertBox ShowAlert={props.showToaster} message={props.toasterMessage} type={props.toasterType} />}
    {props && props.isProcessing && <div className="loaderSection"> <img src={loaderImg} alt="loader" /></div>}
    <div className="col-lg-12">
    <Link to="/workshop-qa" className="back">Back</Link>
      <div className="middleContent">
        <div className="row contentWrapper">
        {appointmentDetails && appointmentDetails.make && (
          <div className="col-lg-3">
            <div className="form-group">
              <h5>{appointmentDetails.make + " " + appointmentDetails.model}</h5>
              <span>{appointmentDetails.variant ? appointmentDetails.variant+ " | " : ''}</span> 
              <span>{appointmentDetails.fuelType ? appointmentDetails.fuelType : ''}</span>
            </div>
          </div>
        )}

          <div className="col-lg-3">
            <div className="form-group  bolder-label">
            <label>Inspected By: </label>
              <span>{appointmentDetails?.createdBy?.uid ? " " + appointmentDetails?.createdBy?.uid : ' N/A'}</span>
            </div>
          </div>

          <div className="col-lg-3">
            <div className="form-group bolder-label">
              <label>Workshop Name: </label>
              <span>{appointmentDetails?.loc?.name ? ' ' + appointmentDetails.loc?.name : ' N/A'}</span>
            </div>
          </div>

            <div className="col-lg-3">
              <div className="form-group bolder-label">
              <label>Assigned To: </label>
                <span>{appointmentDetails?.assignedTo?.uid ? ' ' + appointmentDetails.assignedTo.uid : ' None'}</span>
              </div>
            </div>

        </div>
      
        <div className="row contentWrapper">
          <div className="col-lg-3">
            <div className="form-group bolder-span">
              <label>Appointment ID: </label>
              <span>{appointmentDetails?.appointmentId ? " " + appointmentDetails.appointmentId : " N/A"}</span>
            </div>
          </div>

            <div className="col-lg-3">
              <div className="form-group bolder-span">
              <label>Inspection Date: </label>
                <span>{appointmentDetails?.formatedUpdatedAt ? " " + appointmentDetails.formatedUpdatedAt : " N/A"}</span>
              </div>
            </div>

            <div className="col-lg-3">
              <div className="form-group bolder-span">
              <label>Acceptable Imperfection: </label>
                <span>{" "+ accImperfection}</span>
              </div>
            </div>

            <div className="col-lg-3">
              <div className="form-group bolder-span">
              <label>Non-Acceptable Imperfection: </label>
                <span>{" " + nonAccImperfection}</span>
              </div>
            </div>
          
        </div>
        
        <div className="row contentWrapper border-top">
          {/* <div className="col-lg-3">
            <div className="form-group bolder-span cost-center">
              <label>Price of the car: </label>
              <span>{inspectionSummary && inspectionSummary.purchasePrice >= 0 ? inspectionSummary.purchasePrice : " N/A"}</span>
            </div>
          </div> */}

            <div className="col-lg-4">
              <div className="form-group bolder-span cost-center">
              <label>Pending estimate cost: </label>
                <span>{inspectionSummary && inspectionSummary.current && inspectionSummary.current.pending >= 0 ? inspectionSummary.current.pending : " N/A"}</span>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="form-group bolder-span cost-center">
              <label>Approved Estimate cost: </label>
                <span>{inspectionSummary && inspectionSummary.current && inspectionSummary.current.approved >= 0 ? inspectionSummary.current.approved : " N/A"}</span>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="form-group bolder-span cost-center">
              <label>Total Refurb Cost till now: </label>
                <span>{inspectionSummary && inspectionSummary.totalCost >= 0 ? inspectionSummary.totalCost : "N/A"}</span>
              </div>
            </div>
          
        </div>

        {/* Photo slider starts here*/}
        <div className="row titleWrapper">
          <div className="col-lg-12">
            <div className="photos-row align-items-center d-flex justify-content-between">
              <label>Photos</label> <span>Total <strong>{allImages.length}</strong> photos</span>
            </div>
            {allImages && allImages.length > 0 && (
            <div className="row">
              <div className="photo-container-horiz">
              {allImages.map((image,index)=>(
                <div className="col-lg-4 photos-slider" key={index}>
                  <img src={image.path} alt={image.label} onClick={()=>{imageMagnifier(image)}}/>
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
                <span className="list-header">Imperfections List {" " + (accImperfection + nonAccImperfection)}</span>
                {appointmentDetails.data.checkpoints && Object.keys(appointmentDetails.data.checkpoints).map((item,index)=>{
                  return(
                   <>
                   {appointmentDetails.data.qualityChecks[item]?.invalidated === false && ( 
            
                  <div className="container-box-card" key={index}>
                    <label className="label-top">{item}</label>
                    {appointmentDetails.data.qualityChecks[item] && appointmentDetails.data.qualityChecks[item].status &&
                     (
                      <button className="checkpoint-edit-button" 
                      onClick={e=>{editCheckpointClicked(index,item);setRejectAction("");setIsConfirmationDialog(false);setDataKey("");}}
                      disabled={isCheckpointEdit === index || !iscorrectAssigned}
                      >EDIT</button>
                    )}
                    {isCheckpointEdit !== index && (
                      <div className="info-container">
                      <div className="row">
                        <div className="col-lg-6">
                          <div className="row">
                            <div className="col-lg-12 image-container">
                              {toggleViewHandlerFlag === index ? (
                                <video width="100%" height="300" controls>
                                {appointmentDetails.data.checkpoints[item] && appointmentDetails.data.checkpoints[item].videos.
                                map((video,index)=>{
                                  return(   <source src={video.path} type="video/mp4" key={index}/>)
                                })}
                                </video>
                              ):
                                (<>
                                  {appointmentDetails.data.checkpoints[item] && appointmentDetails.data.checkpoints[item].images.
                                  map((image,index)=>{
                                    return(<img src={image.path} alt={image.label} key={index} onClick={()=>{imageMagnifier(image)}}/>)
                                  })}
                                </>
                              )}
                            </div>
                          </div>
                          {appointmentDetails.data.checkpoints[item] && 
                          appointmentDetails.data.checkpoints[item].images &&
                          appointmentDetails.data.checkpoints[item].images.length > 0 && (
                            <button className="toggle-view-button" onClick={()=>{toggleImageHandler(index)}}>Image View</button>
                          )}
                          {appointmentDetails.data.checkpoints[item] && 
                          appointmentDetails.data.checkpoints[item].videos &&
                          appointmentDetails.data.checkpoints[item].videos.length > 0 && (
                            <button className="toggle-view-button" onClick={()=>{toggleVideoHandler(index)}}>Video View</button>
                          )}
                        </div>
                        <div className="col-lg-6">
                          <div className="row">
                              {appointmentDetails.data.checkpoints[item] && appointmentDetails.data.checkpoints[item].ok === true && 
                              appointmentDetails.data.checkpoints[item].choices.length > 0 &&(
                                <div className="col-lg-12  light-label dark-span textTitle">
                                      <h6>Acceptable Imperfections (not shown to customer)</h6>
                                      {appointmentDetails.data.checkpoints[item].choices.map((choice)=>{
                                        return(choice.acceptable ? choice.choice + ' | ':'')
                                        })}
                                    </div>
                              )}

                              {appointmentDetails.data.checkpoints[item] && appointmentDetails.data.checkpoints[item].ok === false && 
                              appointmentDetails.data.checkpoints[item].choices.length  > 0 &&(
                                <>
                                <div className="col-lg-12 light-label dark-span textTitle">
                                      <h6>Unacceptable Imperfections (shown to customer)</h6>
                                      {appointmentDetails.data.checkpoints[item].choices.map((choice)=>{
                                        return(!choice.acceptable ? choice.choice + ' | ' : '')
                                        })}
                                    </div>

                                    <div className="col-lg-12 light-label dark-span textTitle">
                                    <h6>Acceptable Imperfections (not shown to customer)</h6>
                                    {appointmentDetails.data.checkpoints[item].choices.map((choice)=>{
                                      return(choice.acceptable ? choice.choice + ' | ' : '')
                                      })}
                                  </div>
                                </>
                              )}

                              {appointmentDetails.data.checkpoints[item].refurbishmentChoices.length  > 0 && (
                                <div className="col-lg-6">
                                  <div className="row">
                                    <div className="col-lg-6 light-label dark-span borderRight">
                                          <h6>Work to be done</h6>
                                            {appointmentDetails.data.checkpoints[item].refurbishmentChoices.map((choice,index)=>{
                                              return(
                                                <span>{index+1 +". "+ choice.refurbishment + ''}</span>
                                                )
                                              })}
                                    </div>
                                    <div className="col-lg-6 pl20 light-label dark-span">
                                      
                                      {appointmentDetails.data.estimates[item] && appointmentDetails.data.estimates[item].invalidated === false  && 
                                      appointmentDetails.data.estimates[item].labourCost >= 0
                                      &&(
                                        <>
                                        <h6>Labour Cost</h6>
                                        {appointmentDetails.data.estimates[item].labourCost}
                                        </>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              )}
                                {appointmentDetails.data.estimates && appointmentDetails.data.estimates[item] && appointmentDetails.data.estimates[item] && appointmentDetails.data.estimates[item].invalidated === false  &&(
                                    <div className="col-lg-6">
                                      <div className="row">
                                          <div className="col-lg-6 pl20 light-label dark-span borderRight">
                                                  <h6>Additional Part</h6>
                                          </div>
                                          <div className="col-lg-6 pl20 light-label dark-span">
                                                  <h6>Part Cost</h6>
                                          </div>
                                       </div>
                                    {appointmentDetails.data.estimates[item]?.parts.map((data,index)=>{
                                      return(
                                            <div className="row" key={index}>
                                                <div className="col-lg-6 pl20 light-label dark-span borderRight">
                                                  <span>{data.name}</span>
                                                </div>
                                                <div className="col-lg-6 pl20 light-label dark-span">
                                                  <span>{data.cost}</span>
                                                </div>
                                            </div>                                                                                   
                                      )
                                    })}
                                    </div>
                                  
                                )} 
                          </div>      
                            {isRejected === index ? (
                              <div className="row"> 
                                <div className="col-lg-12 button-container buttonContainer">
                                      <div className="form-group reject-form">
                                      <textarea className="form-control" rows="3" cols="50"
                                        placeholder="Please add reason for rejection"
                                        onChange={handleRejectionComment}
                                        />
                                        {showOnRejectSubmitError && (
                                          <div className="text-danger">
                                            {comment === "" ? "Please add reason for rejection" : ''}
                                            </div>
                                        )}
                                      <button disabled={isConfirmationDialog} style={{backgroundColor: isConfirmationDialog ? 'grey' : '#F37500'}} onClick={()=>{setShowOnRejectSubmitError(false);setRejectAction("");setComment("");}}>Cancel</button>
                                      <button disabled={isConfirmationDialog} style={{backgroundColor: isConfirmationDialog ? 'grey' : '#F37500'}} onClick={()=>{onSubmitReject(item,index,comment,false)}}>Submit</button>
                                      </div>                            
                                </div>
                              </div>
                                ):(<>
                                  {appointmentDetails.data.qualityChecks[item] &&
                                  (appointmentDetails.data.qualityChecks[item].status === "PENDING" ||
                                  (appointmentDetails.data.qualityChecks[item].status !== "PENDING" && reEdit === index))
                                  ? (
                                  <div className="col-lg-12 button-container buttonContainer">
                                  <button
                                  style={{backgroundColor: isConfirmationDialog ? 'grey' : '#F37500'}}
                                  disabled={isConfirmationDialog || !iscorrectAssigned}
                                  onClick={()=>{setRejectAction(index);setIsConfirmationDialog(false);
                                  setIsEditCheckpoint("");setDataKey("");rejectHandler(item)}}>Reject</button>
                                  <button 
                                  style={{backgroundColor: isConfirmationDialog ? 'grey' : '#F37500'}}
                                  disabled={isConfirmationDialog || !iscorrectAssigned}
                                  onClick={(e)=>{onSubmitApprove(item,index,false);}}>Approve</button>
                                  {appointmentDetails.data.checkpoints[item] && appointmentDetails.data.checkpoints[item].ok === false && 
                                  appointmentDetails.data.checkpoints[item].choices.length  > 0 && (
                                    <button className="no-work-to-be-done"
                                      style={{backgroundColor: isConfirmationDialog ? 'grey' : '#F37500'}}
                                      disabled={isConfirmationDialog || !iscorrectAssigned}
                                      onClick={(e)=>onSubmitNoWorkToBeDone(item)}>No work <br/>to be done</button>
                                  )}                                  
                                  </div>
                                ) : (
                                  <div className="col-lg-12 button-container buttonContainer">
                                    {appointmentDetails.data.qualityChecks[item] &&
                                  appointmentDetails.data.qualityChecks[item].status !== "PENDING" &&
                                    (<>
                                      {appointmentDetails.data.qualityChecks[item].status === "APPROVED" &&
                                      appointmentDetails.data.qualityChecks[item]?.reason === "NO_WORK_TO_BE_DONE" &&
                                      appointmentDetails.data.qualityChecks[item].invalidated === false ? (
                                        <>
                                        {appointmentDetails.data.qualityChecks[item] && 
                                        appointmentDetails.data.checkpoints[item].ok === false ?
                                        (
                                        <>
                                        <button
                                        style={{backgroundColor: isConfirmationDialog ? 'grey' : '#F37500'}}
                                        disabled={isConfirmationDialog || !iscorrectAssigned}
                                        onClick={()=>{setRejectAction(index);setIsConfirmationDialog(false);
                                        setIsEditCheckpoint("");setDataKey("");rejectHandler(item)}}>Reject</button>

                                        <button className="no-work-to-be-done"
                                        style={{backgroundColor: isConfirmationDialog ? 'grey' : '#F37500'}}
                                        disabled={true}
                                        onClick={(e)=>onSubmitNoWorkToBeDone(item)}>No work <br/>to be done</button>  
                                         </> ):(null)}
                                        </>
                                      ):(null)}

                                      {appointmentDetails.data.qualityChecks[item].status === "REJECTED" &&
                                      appointmentDetails.data.qualityChecks[item].invalidated === false ? (
                                        <>
                                        {appointmentDetails.data.qualityChecks[item] && appointmentDetails.data.checkpoints[item].ok === true && 
                                        appointmentDetails.data.checkpoints[item].choices && appointmentDetails.data.checkpoints[item].choices.length ? (
                                          <>
                                          <button
                                          style={{backgroundColor: isConfirmationDialog ? 'grey' : '#F37500'}}
                                          disabled={true}
                                          onClick={()=>{setRejectAction(index);setIsConfirmationDialog(false);
                                          setIsEditCheckpoint("");setDataKey("");rejectHandler(item)}}>Reject</button>

                                          <button 
                                          style={{backgroundColor: isConfirmationDialog ? 'grey' : '#F37500'}}
                                          disabled={isConfirmationDialog || !iscorrectAssigned}
                                          onClick={(e)=>{onSubmitApprove(item,index,false);}}>Approve</button>
                                          </>
                                        ):(null)}
                                        {appointmentDetails.data.qualityChecks[item] && appointmentDetails.data.checkpoints[item].ok === false ?(
                                        <>
                                        <button
                                        style={{backgroundColor: isConfirmationDialog ? 'grey' : '#F37500'}}
                                        disabled={true}
                                        onClick={()=>{setRejectAction(index);setIsConfirmationDialog(false);
                                        setIsEditCheckpoint("");setDataKey("");rejectHandler(item)}}>Reject</button>

                                        {appointmentDetails.data.estimates[item] &&
                                         appointmentDetails.data.estimates[item].invalidated === false ? (
                                          <button 
                                          style={{backgroundColor: isConfirmationDialog ? 'grey' : '#F37500'}}
                                          disabled={isConfirmationDialog || !iscorrectAssigned}
                                          onClick={(e)=>{onSubmitApprove(item,index,false);}}>Approve</button>
                                         ):(null)}
                                        
                                        <button className="no-work-to-be-done"
                                        style={{backgroundColor: isConfirmationDialog ? 'grey' : '#F37500'}}
                                        disabled={isConfirmationDialog || !iscorrectAssigned}
                                        onClick={(e)=>onSubmitNoWorkToBeDone(item)}>No work <br/>to be done</button>  
                                         </>):(null)}
                                      </>
                                      ):(null)}

                                      {appointmentDetails.data.qualityChecks[item].status === "APPROVED" &&
                                      appointmentDetails.data.qualityChecks[item]?.reason !== "NO_WORK_TO_BE_DONE" &&
                                      appointmentDetails.data.qualityChecks[item].invalidated === false ? (
                                      <>
                                      {appointmentDetails.data.qualityChecks[item] && appointmentDetails.data.checkpoints[item].ok === true && 
                                      appointmentDetails.data.checkpoints[item].choices && appointmentDetails.data.checkpoints[item].choices.length ? (
                                          <>
                                          <button
                                          style={{backgroundColor: isConfirmationDialog ? 'grey' : '#F37500'}}
                                          disabled={isConfirmationDialog || !iscorrectAssigned}
                                          onClick={()=>{setRejectAction(index);setIsConfirmationDialog(false);
                                          setIsEditCheckpoint("");setDataKey("");rejectHandler(item)}}>Reject</button>

                                          <button 
                                          style={{backgroundColor: isConfirmationDialog ? 'grey' : '#F37500'}}
                                          disabled={true}
                                          onClick={(e)=>{onSubmitApprove(item,index,false);}}>Approve</button>
                                          </>
                                        ):(null)}
                                        {appointmentDetails.data.qualityChecks[item] && appointmentDetails.data.checkpoints[item].ok === false ?(
                                        <>
                                        <button
                                        style={{backgroundColor: isConfirmationDialog ? 'grey' : '#F37500'}}
                                        disabled={isConfirmationDialog || !iscorrectAssigned}
                                        onClick={()=>{setRejectAction(index);setIsConfirmationDialog(false);
                                        setIsEditCheckpoint("");setDataKey("");rejectHandler(item)}}>Reject</button>
                                        
                                        <button 
                                        style={{backgroundColor: isConfirmationDialog ? 'grey' : '#F37500'}}
                                        disabled={true}
                                        onClick={(e)=>{onSubmitApprove(item,index,false);}}>Approve</button>

                                        <button className="no-work-to-be-done"
                                        style={{backgroundColor: isConfirmationDialog ? 'grey' : '#F37500'}}
                                        disabled={isConfirmationDialog || !iscorrectAssigned}
                                        onClick={(e)=>onSubmitNoWorkToBeDone(item)}>No work <br/>to be done</button>  
                                         </> ):(null)}
                                      </>):(null)}
                                      {(
                                        <div className="action-done-reset-view">
                                        <label>
                                          {appointmentDetails.data.qualityChecks[item].status === "APPROVED" ?
                                           `This checkpoint and estimates is 
                                           ${appointmentDetails.data.qualityChecks[item]?.reason === "NO_WORK_TO_BE_DONE" ? "No work to be done" : 'Approved'}` : 
                                           "This checkpoint and estimates is Rejected"}
                                        </label>
                                        </div>
                                      )}
                                      </>)
                                    }
                                  </div>
                                )}
                                  </>
                                )
                              }
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
                                {appointmentDetails.data.checkpoints[item] && 
                                  (
                                    <>
                                    <div className="col-lg-12 light-label dark-span">
                                          <h6>Current condition</h6>
                                          {stateToBeUpdated && stateToBeUpdated.nonAcceptImpChoices && stateToBeUpdated.nonAcceptImpChoices.choices && 
                                          stateToBeUpdated.nonAcceptImpChoices.choices.map((choice,ind)=>{
                                            return(
                                              <>
                                              {choice && choice.other === false ? (
                                                <>
                                                <input type="checkbox" checked={choice.selected} onChange={e=> changeChoicesHandler("nonAccept",ind)}/>
                                                 <span> {choice.choice}</span><br/>
                                                </>
                                              ):( null
                                                // <>
                                                // <input type="text" className="form-control" value={choice.choice} 
                                                // onChange={e=> changeChoicesHandler("modify",ind,e.target.value)}
                                                // /><br/>
                                                // </>
                                              )}
                                              
                                              {masterData && masterData.checkpoints && masterData.checkpoints.map((ChildrenItem)=>{
                                                return (<>
                                                {item === ChildrenItem.key && (
                                                  <>
                                                  {ChildrenItem.choices && ChildrenItem.choices.map((choice2)=>{
                                                    return(
                                                      <>
                                                      {choice2 && choice2.name === choice.choice && choice.selected && !choice.other && choice2.type === "relative" && (
                                                        <div className="checkpoint-edit-options">
                                                        <input type="radio" name={"imperfectionType"+choice.choice} 
                                                        onChange={e=> changeImperfectionType(choice,ind,"acceptable")} 
                                                        checked={choice.acceptable} value="acceptable"/>
                                                        <span className="large-text"> Acceptable Imperfection (not shown to customer)</span><br/>
                                                        {choice2.acceptable && choice2.acceptable.map((info,index)=>{
                                                          return(
                                                            <>
                                                            <span className="small-text">{index + 1} {info}</span><br/>
                                                            </>
                                                          )
                                                        })}
                                                        <br/>        
                                                        <input type="radio" name={"imperfectionType"+choice.choice} 
                                                        onChange={e=> changeImperfectionType(choice,ind,"non-acceptable")} 
                                                        checked={!choice.acceptable} value="non-acceptable"/>
                                                        <span className="large-text"> Non-Acceptable Imperfection (shown to customer)</span><br/>
                                                        {choice2.acceptable && choice2.nonAcceptable.map((info,index)=>{
                                                          return(
                                                            <>
                                                            <span className="small-text">{index + 1} {info}</span><br/>
                                                            </>
                                                          )
                                                        })}
                                                      </div>
                                                      )}
                                                      </>
                                                    )
                                                  })}
                                                  </>
                                                )}
                                                </>)
                                              })}
                                              </>
                                            )
                                            })}
                                        <div className="row">
                                          <div className="col-lg-12 light-label dark-span textTitle">
                                            <br/>
                                            <span className="small-text">Others : </span><br/>
                                            <input type="text" className="form-control"
                                            value={otherImperfectionEntered} 
                                            onChange={e=> otherImperfection(e.target.value)}/>
                                          </div>

                                          {masterData && masterData.checkpoints && masterData.checkpoints.map((masterData)=>{
                                            return(
                                              <>
                                              {item === masterData.key && (
                                                <>
                                                {masterData && masterData.noImperfectionChoices && masterData.noImperfectionChoices.map((option)=>{
                                                  return(
                                                    <div className="col-lg-12 light-label dark-span textTitle">
                                                    <input type="radio" name="imperfectionType" checked={isOkNoImperfSelected === option.name} value={option.name} onChange={e=> isNotApplicableSelected(e.target.value)}/>
                                                    <span>{" " + option.name}</span>
                                                    </div>
                                                  )
                                                })}
                                                </>
                                              )}
                                              </>
                                            )
                                          })}
                                        </div>
                                        </div>
                                    </>
                                  )}
                              </div>
                            </div>
                            <div className="col-lg-6">
                              <div className="row">
                                   {appointmentDetails.data.checkpoints[item] && (
                                    <div className="row ml-2">
                                      <div className="col-lg-12 light-label dark-span2">
                                          <h6>Work to be done</h6>
                                              {stateToBeUpdated && stateToBeUpdated.reburbChoices &&  
                                              stateToBeUpdated.reburbChoices.map((choice,ind)=>{
                                                return(
                                                  <>
                                                  {choice.other === false ? (
                                                    <>
                                                    <input type="checkbox" checked={choice.selected} 
                                                    onChange={e=> changeChoicesHandler("reburbChoice",ind)}/>
                                                    <span> {choice.refurbishment}</span> <br/>
                                                    </>
                                                  ):(
                                                    null
                                                    // <>
                                                    // <input type="text" className="form-control mb-2" name={choice.refurbishment+ind} value={choice.refurbishment} 
                                                    // onChange={e=> changeChoicesHandler("reburbChoiceModify",ind,e.target.value)}/>
                                                    // </>
                                                  )}                                                  
                                                  </>
                                                )
                                              })}
                                        </div>
                                        <div className="col-lg-12 light-label dark-span textTitle">
                                            <br/>
                                            <span className="small-text">Others : </span><br/>
                                            <input type="text" className="form-control"
                                            value={otherWorkToBeDone} 
                                            onChange={e=> otherWorktoBeDone(e.target.value)}/>
                                          </div>
                                      </div>
                                      
                                  )}
                              </div>
                            </div>
                          </div>      
                          <div className="row">
                            <div className="col-lg-12 button-container buttonContainer text-center m-0 p-0">
                              <div className="reject-form">
                              <button disabled={isConfirmationDialog} style={{backgroundColor: isConfirmationDialog ? 'grey' : '#F37500'}} onClick={()=>{setIsEditCheckpoint(""); checkpointEditCancled(item)}}>Cancel</button>
                              <button disabled={isConfirmationDialog} style={{backgroundColor: isConfirmationDialog ? 'grey' : '#F37500'}} onClick={e=>updateCheckpointDataHandler(item)}>Save</button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    )}
                    
                    {/* Last inspection data */}
                    <div className="row inspectionData">
                      <div className="col-lg-12">
                      {lastInspectionData && lastInspectionData.data  && false && (
                        <div className="container-box">
                      {Object.keys(lastInspectionData.data.qualityChecks).map((inspectionItem,index2)=>{
                        return (
                          <div>
                            {inspectionItem === item && lastInspectionData.data.qualityChecks[inspectionItem]?.invalidated === false && (
                          <div className="container-box-card  toggle-info-container" key={index2}>
                            <div className="lastinspection-header">
                              <span className="list-header-first" onClick={() => toggleLastInspectionHandler(index2)}>Last Inspection Data</span>
                              <span className="list-header2 list-header-first">Workshop : {lastInspectionData?.loc?.name ? " " + lastInspectionData.loc.name : " N/A"} </span>
                              <span className="list-header2 list-header-first">Date: {" " + lastInspectionData.formatedUpdatedAt} </span>
                              <span className="list-header2 list-header-first">Time: {" " + lastInspectionData.formatedUpdateAtTime} </span>
                            </div>
                          
                          <div className="info-container" hidden={toggleLastInspection !== index2 || !showHideToggler}>
                          <label className="label-top">{item}</label>
                            <div className="row">
                              <div className="col-lg-6">
                                <div className="row">
                                  <div className="col-lg-12 image-container">
                                        { mediaType === "video" ? (
                                          <video width="100%" height="300" controls>
                                          {lastInspectionData.data.checkpoints[item] && lastInspectionData.data.checkpoints[item].videos.
                                          map((video,index)=>{
                                            return(   <source src={video.path} type="video/mp4" key={index}/>)
                                          })}
                                          </video>
                                        ):
                                          (<>
                                            {lastInspectionData.data.checkpoints[item] && lastInspectionData.data.checkpoints[item].images.
                                            map((image,index)=>{
                                              return(<img src={image.path} alt={image.label} key={index} onClick={()=>{imageMagnifier(image)}}/>)
                                            })}
                                          </>
                                        )}
                                  </div>
                                </div>
                                {lastInspectionData.data.checkpoints[inspectionItem] && 
                                lastInspectionData.data.checkpoints[inspectionItem].images &&
                                lastInspectionData.data.checkpoints[inspectionItem].images.length > 0 && (
                                  <button className="toggle-view-button" onClick={()=>{toggleImageHandler2(index2,"image")}}>Image View</button>
                                )}
                                {lastInspectionData.data.checkpoints[inspectionItem] && 
                                lastInspectionData.data.checkpoints[inspectionItem].videos &&
                                lastInspectionData.data.checkpoints[inspectionItem].videos.length > 0 && (
                                  <button className="toggle-view-button" onClick={()=>{toggleVideoHandler2(index2,"video")}}>Video View</button>
                                )}
                              </div>
                              <div className="col-lg-6">
                                <div className="row">
                                    {lastInspectionData.data.checkpoints[inspectionItem] && lastInspectionData.data.checkpoints[inspectionItem].ok === true && (
                                      <div className="col-lg-12 light-label dark-span textTitle">
                                            <h6>Acceptable Imperfections (not shown to customer)</h6>
                                            {lastInspectionData.data.checkpoints[inspectionItem].choices.map((choice)=>{
                                              return(choice.acceptable ? choice.choice + ' | ' : '')                                              
                                              })}
                                          </div>
                                    )}

                                    {lastInspectionData.data.checkpoints[inspectionItem] && lastInspectionData.data.checkpoints[inspectionItem].ok === false && (
                                      <>
                                      <div className="col-lg-12  light-label dark-span textTitle">
                                            <h6>Unacceptable Imperfections (shown to customer)</h6>
                                            {lastInspectionData.data.checkpoints[item].choices.map((choice,ind,arr)=>{
                                              return(!choice.acceptable ? choice.choice + ' | ' : '')
                                              })}
                                          </div>

                                          <div className="col-lg-12 light-label dark-span textTitle">
                                          <h6>Acceptable Imperfections (not shown to customer)</h6>
                                          {lastInspectionData.data.checkpoints[item].choices.map((choice,ind,arr)=>{
                                            return(choice.acceptable ? choice.choice + ' | ' : '')
                                            })}
                                        </div>
                                    </>
                                    )}

                                    {lastInspectionData.data.checkpoints[inspectionItem].refurbishmentChoices.length  > 0 && (
                                      

                                      <>
                                      <div className="col-lg-12 card light-label dark-span">
                                            <h6>Work to be done</h6>
                                            {lastInspectionData.data.checkpoints[inspectionItem].refurbishmentChoices.map((choice,index)=>{
                                              return(
                                                <span>{index+1 +". "+ choice.refurbishment + ' '}</span>
                                                  )
                                              })}
                                             
                                            {lastInspectionData.data.estimates[inspectionItem] && lastInspectionData.data.estimates[inspectionItem].invalidated === false 
                                            && lastInspectionData.data.estimates[inspectionItem].labourCost >= 0 
                                            (
                                              <>
                                              <h6>Labour Cost</h6>
                                              {lastInspectionData.data.estimates[inspectionItem].labourCost}
                                              </>
                                            )}
                                      </div>
                                      {lastInspectionData.data.estimates && lastInspectionData.data.estimates[inspectionItem] && 
                                      lastInspectionData.data.estimates[inspectionItem].invalidated === false &&(
                                        <div className="row">
                                          <div className="col-lg-12">
                                          {lastInspectionData.data.estimates[inspectionItem]?.parts.map((data,index)=>{
                                            return(
                                                  <div className="float-div" key={index}>
                                                      <div>
                                                      <h6>Additional Part</h6>
                                                      <span>{data.name}</span>
                                                      </div> 

                                                      <div>
                                                      <h6>Part Cost</h6>
                                                      <span>{data.cost}</span>
                                                      </div>                                                      
                                                    </div>                                                                                   
                                            )
                                          })}
                                          </div>
                                      </div>  
                                      )}
                                      </>
                                    )}
                                </div>
                              </div>
                            </div>
                          </div>
                          </div>
                          )}
                          </div>
                      )}
                      )}
                        </div>
                      )}
                      </div>
                    </div>
                        {/* Last inspection section ends*/}
                  </div>
                )}
                </>
                )                  
                })}

                {/* Change status starts here */}
                {appointmentDetails.data.checkpoints && Object.keys(appointmentDetails.data.checkpoints).map((item,index)=>{
                  return(
                   <>
                   {(appointmentDetails.data.qualityChecks[item]?.invalidated === true || appointmentDetails.data.qualityChecks[item] === undefined) &&( 
                  <div className="container-box-card" key={index}>
                    <label className="label-top">{item}</label>
                    {/* {appointmentDetails.data.qualityChecks[item] && appointmentDetails.data.qualityChecks[item].status &&
                    appointmentDetails.data.qualityChecks[item].status === "PENDING" && ( */}
                      <button className="checkpoint-edit-button" 
                      onClick={e=>editCheckpointClicked(index,item)}
                      disabled={isCheckpointEdit === index || !iscorrectAssigned}
                      >EDIT</button>
                    {/* )} */}
                    <div className="row">
                    {isCheckpointEdit === index ? (
                        <div className="col-lg-12">
                          <div className="row">
                            <div className="col-lg-6">
                              <div className="row">
                                {appointmentDetails.data.checkpoints[item] && 
                                  (
                                    <>
                                    <div className="col-lg-12 light-label dark-span">
                                          <h6>Current condition</h6>
                                          {stateToBeUpdated && stateToBeUpdated.nonAcceptImpChoices && stateToBeUpdated.nonAcceptImpChoices.choices && 
                                          stateToBeUpdated.nonAcceptImpChoices.choices.map((choice,ind)=>{
                                            return(
                                              <>
                                              {choice && choice.other === false ? (
                                                <>
                                                <input type="checkbox" checked={choice.selected} onChange={e=> changeChoicesHandler("nonAccept",ind)}/>
                                                 <span> {choice.choice}</span><br/>
                                                </>
                                              ):( null
                                                // <>
                                                // <input type="text" className="form-control" value={choice.choice} 
                                                // onChange={e=> changeChoicesHandler("modify",ind,e.target.value)}
                                                // /><br/>
                                                // </>
                                              )}
                                              
                                              {masterData && masterData.checkpoints && masterData.checkpoints.map((ChildrenItem)=>{
                                                return (<>
                                                {item === ChildrenItem.key && (
                                                  <>
                                                  {ChildrenItem.choices && ChildrenItem.choices.map((choice2)=>{
                                                    return(
                                                      <>
                                                      {choice2 && choice2.name === choice.choice && choice.selected && !choice.other && choice2.type === "relative" && (
                                                        <div className="checkpoint-edit-options">
                                                        <input type="radio" name={"imperfectionType"+choice.choice} onChange={e=> changeImperfectionType(choice,ind,"acceptable")} checked={choice.acceptable} value="acceptable"/>
                                                        <span className="large-text"> Acceptable Imperfection (not shown to customer)</span><br/>
                                                        {choice2.acceptable && choice2.acceptable.map((info,index)=>{
                                                          return(
                                                            <>
                                                            <span className="small-text">{index + 1} {info}</span><br/>
                                                            </>
                                                          )
                                                        })}
                                                        <br/>        
                                                        <input type="radio" name={"imperfectionType"+choice.choice} onChange={e=> changeImperfectionType(choice,ind,"non-acceptable")} checked={!choice.acceptable} value="non-acceptable"/>
                                                        <span className="large-text"> Non-Acceptable Imperfection (shown to customer)</span><br/>
                                                        {choice2.acceptable && choice2.nonAcceptable.map((info,index)=>{
                                                          return(
                                                            <>
                                                            <span className="small-text">{index + 1} {info}</span><br/>
                                                            </>
                                                          )
                                                        })}
                                                      </div>
                                                      )}
                                                      </>
                                                    )
                                                  })}
                                                  </>
                                                )}
                                                </>)
                                              })}
                                              </>
                                            )
                                            })}
                                        <div className="row">
                                          <div className="col-lg-12 light-label dark-span textTitle">
                                            <br/>
                                            <span className="small-text">Others : </span><br/>
                                            <input type="text" className="form-control"
                                            value={otherImperfectionEntered} 
                                            onChange={e=> otherImperfection(e.target.value)}/>
                                          </div>

                                          {masterData && masterData.checkpoints && masterData.checkpoints.map((masterData)=>{
                                            return(
                                              <>
                                              {item === masterData.key && (
                                                <>
                                                {masterData && masterData.noImperfectionChoices && masterData.noImperfectionChoices.map((option)=>{
                                                  return(
                                                    <div className="col-lg-12 light-label dark-span textTitle">
                                                    <input type="radio" name="imperfectionType" checked={isOkNoImperfSelected === option.name} value={option.name} onChange={e=> isNotApplicableSelected(e.target.value)}/>
                                                    <span>{" " + option.name}</span>
                                                    </div>
                                                  )
                                                })}
                                                </>
                                              )}
                                              </>
                                            )
                                          })}
                                        </div>
                                        </div>
                                    </>
                                  )}
                              </div>
                            </div>
                            <div className="col-lg-6">
                              <div className="row">
                                   {appointmentDetails.data.checkpoints[item] && (
                                    <div className="row ml-2">
                                      <div className="col-lg-12 light-label dark-span2">
                                          <h6>Work to be done</h6>
                                              {stateToBeUpdated && stateToBeUpdated.reburbChoices &&  
                                              stateToBeUpdated.reburbChoices.map((choice,ind)=>{
                                                return(
                                                  <>
                                                  {choice.other === false ? (
                                                    <>
                                                    <input type="checkbox" checked={choice.selected} 
                                                    onChange={e=> changeChoicesHandler("reburbChoice",ind)}/>
                                                    <span> {choice.refurbishment}</span> <br/>
                                                    </>
                                                  ):(
                                                    null
                                                    // <>
                                                    // <input type="text" className="form-control mb-2" name={choice.refurbishment+ind} value={choice.refurbishment} 
                                                    // onChange={e=> changeChoicesHandler("reburbChoiceModify",ind,e.target.value)}/>
                                                    // </>
                                                  )}                                                  
                                                  </>
                                                )
                                              })}
                                        </div>
                                        <div className="col-lg-12 light-label dark-span textTitle">
                                            <br/>
                                            <span className="small-text">Others : </span><br/>
                                            <input type="text" className="form-control"
                                            value={otherWorkToBeDone} 
                                            onChange={e=> otherWorktoBeDone(e.target.value)}/>
                                          </div>
                                      </div>
                                      
                                  )}
                              </div>
                            </div>
                          </div>      
                          <div className="row">
                            <div className="col-lg-12 button-container buttonContainer text-center m-0 p-0">
                              <div className="reject-form">
                              <button disabled={isConfirmationDialog} style={{backgroundColor: isConfirmationDialog ? 'grey' : '#F37500'}} onClick={()=>{setIsEditCheckpoint(""); checkpointEditCancled(item)}}>Cancel</button>
                              <button disabled={isConfirmationDialog} style={{backgroundColor: isConfirmationDialog ? 'grey' : '#F37500'}} onClick={e=>updateCheckpointDataHandler(item)}>Save</button>
                              </div>
                            </div>
                          </div>
                        </div>
                    ):(
                      <>
                      <div className="col-lg-6">
                          <div className="row">
                            <div className="col-lg-12 image-container">
                              {toggleViewHandlerFlag === index ? (
                                <video width="100%" height="300" controls>
                                {appointmentDetails.data.checkpoints[item] && appointmentDetails.data.checkpoints[item].videos.
                                map((video,index)=>{
                                  return(   <source src={video.path} type="video/mp4" key={index}/>)
                                })}
                                </video>
                              ):
                                (<>
                                  {appointmentDetails.data.checkpoints[item] && appointmentDetails.data.checkpoints[item].images.
                                  map((image,index)=>{
                                    return(<img src={image.path} alt={image.label} key={index} onClick={()=>{imageMagnifier(image)}}/>)
                                  })}
                                </>
                              )}
                            </div>
                          </div>
                          {appointmentDetails.data.checkpoints[item] && 
                          appointmentDetails.data.checkpoints[item].images &&
                          appointmentDetails.data.checkpoints[item].images.length > 0 && (
                            <button className="toggle-view-button" onClick={()=>{toggleImageHandler(index)}}>Image View</button>
                          )}
                          {appointmentDetails.data.checkpoints[item] && 
                          appointmentDetails.data.checkpoints[item].videos &&
                          appointmentDetails.data.checkpoints[item].videos.length > 0 && (
                            <button className="toggle-view-button" onClick={()=>{toggleVideoHandler(index)}}>Video View</button>
                          )}
                        </div>
                    <div className="col-lg-6"> 
                    {appointmentDetails.data.checkpoints[item] && appointmentDetails.data.checkpoints[item].noImperfectionChoices.length &&
                          appointmentDetails.data.checkpoints[item].noImperfectionChoices && isCheckpointEdit !== index ? (
                            <div>{appointmentDetails.data.checkpoints[item].noImperfectionChoices[0]}</div>
                          ):(null)} 
                    {isRejected === index ? (
                      <div className="col-lg-12 button-container buttonContainer">
                        <div className="row">
                            <div className="col-lg-12 form-group reject-form">
                            <textarea className="form-control" rows="3" cols="50"
                              placeholder="Please add reason for rejection"
                              onChange={handleRejectionComment}
                              />
                              {showOnRejectSubmitError && (
                                <div className="text-danger">
                                  {comment === "" ? "Please add reason for rejection" : ''}
                                  </div>
                              )}
                            <button disabled={isConfirmationDialog} style={{backgroundColor: isConfirmationDialog ? 'grey' : '#F37500'}} onClick={()=>{setShowOnRejectSubmitError(false);setRejectAction("");setComment("")}}>Cancel</button>
                            <button disabled={isConfirmationDialog} style={{backgroundColor: isConfirmationDialog ? 'grey' : '#F37500'}} onClick={()=>{onSubmitReject(item,index,comment,true)}}>Submit</button>
                            </div>
                        </div>                                
                      </div>
                        ):(<>{ !actionArray.includes(index) ? (
                          <div className="col-lg-12 button-container buttonContainer">
                          <button
                          style={{backgroundColor: isConfirmationDialog ? 'grey' : '#F37500'}}
                          disabled={!iscorrectAssigned || isConfirmationDialog}
                          onClick={()=>{setRejectAction(index);setIsConfirmationDialog(false);setIsEditCheckpoint("");setDataKey("");rejectHandler(item)}}>Reject</button>
                          </div>
                        ) : (
                          <div className="col-lg-12 button-container buttonContainer">
                                    {appointmentDetails.data.qualityChecks[item] &&
                                  appointmentDetails.data.qualityChecks[item].status !== "PENDING" &&
                                    (<>
                                      {(
                                        <div className="action-done-reset-view">
                                        <label>
                                          {appointmentDetails.data.qualityChecks[item].status === "APPROVED" ? `This checkpoint and estimates is ${appointmentDetails.data.qualityChecks[item]?.reason === "NO_WORK_TO_BE_DONE" ? "No work to be done" : 'Approved'}` : "This checkpoint and estimates is Rejected"}
                                        </label>
                                        {/* {appointmentDetails.data.qualityChecks[item].status === "REJECTED" && (
                                        <button onClick={() => qcActionResetHandler(item,index,false)}>Reset</button>
                                        )} */}
                                        </div>
                                      )}
                                      </>)
                                    }
                                  </div>
                        )}
                          </>
                        )
                      }
                      </div>
                      </>
                    )}
                    </div>
                  </div>
                )}
                </>
                )                  
                })}
                {/* Change status ends here */}
                
                    <button disabled={isConfirmationDialog} style={{backgroundColor: isConfirmationDialog ? 'grey' : '#F37500'}} className="submit-all-ac-actions submitAction" onClick={() => submitAllQcAction()}>Submit All QC Actions</button>
              </div>
              )}
            </div>
        </div>
      </div>
    </div>
    </>
  );
};

const mapDispatchToProps = {
    getWorkshopListingDetails,
    approveQualityChecks,
    getInspectionSummary
};

const mapStateToProps = state => {
  return {
    isProcessing: state.workshopReducer.isProcessing,
    showToaster: state.commonReducer.showToaster,
    toasterMessage: state.commonReducer.toasterMessage,
    toasterType: state.commonReducer.toasterType,
    listingDetails: state.workshopReducer.qaListingDetails,
    lastInspectionData:state.workshopReducer.lastInspectionData,
    qaTopImagesKeys:state.workshopReducer.qaTopImagesKeys,
    inspectionSummary:state.workshopReducer.inspectionSummary
  };
};

export default connect(mapStateToProps,
  mapDispatchToProps,)(WorkshopQaDetailComponent);
