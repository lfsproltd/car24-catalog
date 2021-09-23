import React, { useState, useEffect } from "react";
import { connect, useDispatch } from "react-redux";
import loaderImg from "../../assets/img/loader.png";
import AlertBox from './../../common/showAlert';
import "../workshopQaDetail/workshopDetails.css";
import { useHistory } from "react-router-dom";
import { dateFormat, timeFormat } from "../../utils/utils";
import { Link } from 'react-router-dom';
import {getEstimateDetails} from "../../store/actions/workshopQaManagement/workshopQaManagement.action";
import { AlertType } from '../../utils/constants/values.constants';

const EstimateDetailsComponent = (props) => {
    const historyLink = useHistory();
    const dispatch = useDispatch();
    let estimatesFinalData = {
        "inspectionType": "CATALOG",
        "schemaVersion": "IN_CAR_CATALOG_V1",
        "data":{
            "action":"estimation",
            "estimates":{
                
            }
        }
    };
    const [listingDetail, setListingDetail] = useState({});
    const [otherWorkToBeDoneFieldValue,setOtherWorkToBeDoneFieldValue] = useState("");
    const [isEdit, setIsEdit] = useState("");
    const [nonAccImperfection, setNonAccImperfection] = useState("");
    const [accImperfection, setAccImperfection] = useState("");
    const [errors, setError] = useState({
      name:'',
      errors:false
    })
    let estimateFields = {};
    let worktobedone = {};
    const [estimatesFieldsInitial, setEstimatesFieldsInitial] =  useState(estimateFields);
    const [prevIndex,setPrevIndex] = useState("0");
    const [masterData, setMasterData] = useState([]);
    const [workToBeDone, setWorkToBeDone] = useState(worktobedone);
    const [editWorkClicked,setEditWorkClicked] = useState(false);
    const [refurbishmentChoices, setRefurbishmentChoices] = useState({});
    const [possibleOptions, setPossibleOptions] = useState({});

    const [totalEstimates,setTotalEstimates] = useState("");
    const [remainingEstimates, setRemainingEstimates] = useState("");
    const [totalNoWorkToBeDone, setTotalNoWorkToBeDone] = useState("");
    const [acceptableImperfectionRejected,setAcceptableImperfectionRejected] = useState(false);

    useEffect(()=>{
      if(props.listingDetailsUpdated && props.listingDetailsUpdated[0] && props.listingDetailsUpdated[0].data && 
        props.listingDetailsUpdated[0].data.estimates){
         setListingDetail(props.listingDetailsUpdated[0])
        }
     
      if(props.listingDetailsUpdated && props.listingDetailsUpdated[0] && props.listingDetailsUpdated[0].data){
        let totalEstimatesToBeFilled = 0;
        let totalEstimatesFilled = 0;
        let totalEstimatesRejected = 0;
        let totalNoWorkToBeDone = 0;
        Object.keys(props.listingDetailsUpdated[0].data.qualityChecks).map((item)=>{

           //check whether acceptable imperfection is rejected
          if(props.listingDetailsUpdated[0].data.qualityChecks[item]?.invalidated === false &&
            props.listingDetailsUpdated[0].data.checkpoints[item]?.ok === true && 
            props.listingDetailsUpdated[0].data.checkpoints[item]?.choices.length && 
            props.listingDetailsUpdated[0].data.qualityChecks[item]?.status === "REJECTED"){
              setAcceptableImperfectionRejected(true);
            }

          //count of no work to be done
          if(props.listingDetailsUpdated[0].data.checkpoints[item]?.ok === false &&
            props.listingDetailsUpdated[0].data?.qualityChecks[item]?.reason === "NO_WORK_TO_BE_DONE" &&
            props.listingDetailsUpdated[0].data?.qualityChecks[item]?.status === "APPROVED"){
              totalNoWorkToBeDone += 1;
            }
            setTotalNoWorkToBeDone(totalNoWorkToBeDone);

          if(props.listingDetailsUpdated[0].data.checkpoints[item]?.ok === false &&
            props.listingDetailsUpdated[0].data?.qualityChecks[item]?.reason !== "NO_WORK_TO_BE_DONE"){
              totalEstimatesToBeFilled += 1;
            }
            setTotalEstimates(totalEstimatesToBeFilled);

            if(props.listingDetailsUpdated[0].data?.estimates[item] && 
                props.listingDetailsUpdated[0].data?.estimates[item]?.invalidated === false){
                totalEstimatesFilled += 1;
              }

            if(props.listingDetailsUpdated[0].data?.estimates[item] && 
              props.listingDetailsUpdated[0].data?.estimates[item]?.invalidated === false &&
              props.listingDetailsUpdated[0].data?.qualityChecks[item]?.status === "REJECTED"){
                totalEstimatesRejected += 1;
            }
           setRemainingEstimates((totalEstimatesToBeFilled - +totalEstimatesFilled) + totalEstimatesRejected);
        })
        
      }
     },[props.listingDetailsUpdated]);

    //  Setting master data
    useEffect(()=>{
      if(props && props.masterData && props.masterData.checkpoints){
        setMasterData(props.masterData);
      }
    },[props.masterData,props.listingDetails,props.listingDetailsUpdated]);

    useEffect(()=>{
      let totalEstimtates = 0;
      let allValidQualityChecks = 0;
      let refurbishment = {};
      if(props && props.listingDetails && props.listingDetails[0]){
        Object.keys(props.listingDetails[0].data.qualityChecks).map((item,index)=>{
          if(props.listingDetails[0].data.qualityChecks[item] && 
            props.listingDetails[0].data.qualityChecks[item]?.invalidated === false &&
            props.listingDetails[0].data.checkpoints[item]?.ok === false){
              allValidQualityChecks += 1;
              if(props.listingDetails[0].data.estimates[item] && 
                props.listingDetails[0].data.estimates[item]?.invalidated === false){
                totalEstimtates += 1;
                estimateFields[item] = {
                  labourCost:props.listingDetails[0].data.estimates[item].labourCost >= 0 ? props.listingDetails[0].data.estimates[item].labourCost : null,
                  parts:props.listingDetails[0].data.estimates[item].parts ? props.listingDetails[0].data.estimates[item].parts : [{name:'',cost:null}]
                }
                if(props.listingDetails[0].data.estimates[item].parts && props.listingDetails[0].data.estimates[item].parts.length === 0){
                  props.listingDetails[0].data.estimates[item].parts = [{name:'',cost:null}]
                }

                refurbishment[item] = {};
                if(props.listingDetails[0].data.checkpoints[item]?.refurbishmentChoices){
                  refurbishment[item] = props.listingDetails[0].data.checkpoints[item]?.refurbishmentChoices;
                }
              }else{
                estimateFields[item] = {
                  labourCost:null,
                  parts:[{name:'',cost:null}]
                }
              }
            }
        })
      }

      let castObj = {};
      castObj = {...estimateFields};
      setEstimatesFieldsInitial({...castObj});
      setRefurbishmentChoices({...refurbishment});

      if(props.listingDetails && props.listingDetails[0] && props.listingDetails[0].data.estimates){
        if(allValidQualityChecks === totalEstimtates){
          dispatch(props.setToasterMessage({
            toasterMessage: "Estimates Submitted",
            showToaster: true,
            toasterType: AlertType.SUCCESS
        }));
        }
        if(props.listingDetails && props.listingDetails[0] && props.listingDetails[0].inspectionStatus &&
          props.listingDetails[0].inspectionStatus === "ESTIMATED" ){
          setTimeout(()=>{
            historyLink.push('/estimate');
          },1000);
          }
      }
    },[props.listingDetails])


    useEffect(()=>{
        props && props.listingDetails.map((item)=>{
            if(item && item.updatedAt){
              item.formatedUpdatedAt = dateFormat(item.updatedAt);
            }
          });  
        setListingDetail(props.listingDetails[0]);
        let totalEstimate = 0;
        props && props.listingDetails.map((data)=>{
            Object.keys(data.data.qualityChecks).map((item)=>{
                if(data.data.qualityChecks[item].invalidated === false && 
                    data.data.checkpoints[item].ok === false && data.data.qualityChecks[item].status !== "APPROVED"){
                    totalEstimate += 1;
                }
            });
        })
        let totlaNonAcceptableImperfections = 0;
        let totlalAcceptableImperfections = 0;
        if(props && props.listingDetails[0] && props.listingDetails[0].data && props.listingDetails[0].data.checkpoints){
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
    },[props]);

    const editClickHandler = (index,item) => {
        setIsEdit(index);
        let possibleData = {};
        let availableData = {};
        setPossibleOptions({});
        setOtherWorkToBeDoneFieldValue("");
        if(estimatesFieldsInitial[item] && (estimatesFieldsInitial[item].parts && 
          estimatesFieldsInitial[item].parts.length === 0)){
          estimatesFieldsInitial[item].parts=[
            { name:estimatesFieldsInitial[item]?.parts[0]?.name ? estimatesFieldsInitial[item]?.parts[0]?.name : "",
              cost:estimatesFieldsInitial[item]?.parts[0]?.cost ? estimatesFieldsInitial[item]?.parts[0]?.cost : null 
            }];
        }
        if(masterData && masterData.checkpoints){
          masterData.checkpoints.map((checkpoint)=>{
            if(checkpoint.key === item){
              if(checkpoint.refurbishment && checkpoint.refurbishment.choices){
                possibleData[item] = {
                  refurbishmentChoices:[]
                }
                checkpoint.refurbishment.choices.map((name)=>{
                  possibleData[item].refurbishmentChoices.push({other:false,refurbishment:name,checked:false});
                })
              }
            }
          });
          setPossibleOptions({...possibleData});
        }
        if(listingDetail && listingDetail.data && listingDetail.data.checkpoints[item] && 
          listingDetail.data.checkpoints[item].refurbishmentChoices){
            availableData[item] = {
              refurbishmentChoices:[]
            }
            listingDetail.data.checkpoints[item].refurbishmentChoices.map((choice1)=>{
              listingDetail.data.checkpoints[item].refurbishmentChoices.map((choice1)=>{
                if(choice1 && choice1.other === true){
                  setOtherWorkToBeDoneFieldValue(choice1.refurbishment);
                }
              });
              availableData[item].refurbishmentChoices.push({other:choice1.other,refurbishment:choice1.refurbishment,checked:true})
            });
            
          if(possibleData[item] && possibleData[item].refurbishmentChoices && 
            availableData[item] && availableData[item].refurbishmentChoices){
              let filteredData = {};
              filteredData[item] = {
                refurbishmentChoices:[]
              }
              let combinedData = [...possibleData[item].refurbishmentChoices,...availableData[item].refurbishmentChoices];
              filteredData[item].refurbishmentChoices = [...combinedData.reduce((map,obj)=> map.set(obj.refurbishment,obj),new Map()).values()];
              setPossibleOptions(filteredData);
            }          
        }
        console.log("possible options", possibleOptions);        
        setEstimatesFieldsInitial({...estimatesFieldsInitial});
    }

    const estimatedLaborCostHandler = (e,item) => {
      let checknumbers  = /^\d*\.?\d*$/;
      if(!checknumbers.test(e.target.value)){
        setError({
          name:e.target.name,
          errors:true
        })
      }else{
        setError({
          name:e.target.name,
          errors:false
        })
      }
      estimatesFieldsInitial[item].labourCost = e.target.value;
      setEstimatesFieldsInitial({...estimatesFieldsInitial});
    }

    const addtionalPartNameHandler = (e,item,partIntex) => {
      
      if(estimatesFieldsInitial[item] && estimatesFieldsInitial[item].parts && !estimatesFieldsInitial[item].parts.length){
        estimatesFieldsInitial[item].parts=[
          {name:estimatesFieldsInitial[item]?.parts[partIntex]?.name ? estimatesFieldsInitial[item]?.parts[partIntex]?.name : "",
          cost:estimatesFieldsInitial[item]?.parts[partIntex]?.cost ? estimatesFieldsInitial[item]?.parts[partIntex]?.cost : null
          }
        ];
      }
      estimatesFieldsInitial[item].parts[partIntex].name = e.target.value;
      setEstimatesFieldsInitial({...estimatesFieldsInitial})
      if(estimatesFieldsInitial[item] && estimatesFieldsInitial[item].parts && 
        estimatesFieldsInitial[item].parts.length){
          if(!!estimatesFieldsInitial[item].parts[partIntex]?.name && !!estimatesFieldsInitial[item].parts[partIntex]?.cost){
            setPrevIndex(partIntex);
          }
      }else{
        setPrevIndex("0")
      }
    }

    const additionalPartCostHandler = (e,item,partIntex) => {
      let checknumbers  = /^\d*\.?\d*$/;
      if(!checknumbers.test(e.target.value)){
        setError({
          name:e.target.name,
          errors:true
        })
      }else{
        setError({
          name:e.target.name,
          errors:false
        })
      }
      if(estimatesFieldsInitial[item] && estimatesFieldsInitial[item].parts && !estimatesFieldsInitial[item].parts.length){
        estimatesFieldsInitial[item].parts=[
          {name:estimatesFieldsInitial[item]?.parts[partIntex]?.name ? estimatesFieldsInitial[item]?.parts[partIntex]?.name : "",
          cost:estimatesFieldsInitial[item]?.parts[partIntex]?.cost ? estimatesFieldsInitial[item]?.parts[partIntex]?.cost : e.target.value}
        ];
      }
      estimatesFieldsInitial[item].parts[partIntex].cost = e.target.value ? e.target.value : "";
      setEstimatesFieldsInitial({...estimatesFieldsInitial});

      if(estimatesFieldsInitial[item] && estimatesFieldsInitial[item].parts && 
        estimatesFieldsInitial[item].parts.length){
          if(!!estimatesFieldsInitial[item].parts[partIntex]?.name && !!estimatesFieldsInitial[item].parts[partIntex]?.cost){
            setPrevIndex(partIntex);
          }
      }else{
        setPrevIndex("0")
      }

    }

    const onSaveEditsHandler = (index, data) => {
            let editedRefurbs = [];
            if(possibleOptions && possibleOptions[data] && possibleOptions[data].refurbishmentChoices){
              possibleOptions[data].refurbishmentChoices.map((selected)=>{
                if(selected.checked === true && selected.other === false){
                  editedRefurbs.push({other:selected.other,refurbishment:selected.refurbishment});
                }
              });
            }
            if(!!otherWorkToBeDoneFieldValue){
              editedRefurbs.push({"refurbishment":otherWorkToBeDoneFieldValue, other:true})
            }         
            
            setEditWorkClicked("")
            let objSubmit = {};
            objSubmit = {...estimatesFieldsInitial};
            setEstimatesFieldsInitial({...objSubmit});
            // make proper data --> make labourCost and part cost integer
            let sendSingleEstimate = {...estimatesFieldsInitial};
            let labourCost; 
            if(!!sendSingleEstimate[data].labourCost){
              labourCost = sendSingleEstimate[data].labourCost;
              estimatesFinalData.data.estimates[data] = {
                labourCost:+sendSingleEstimate[data].labourCost
              }
            }
            if(sendSingleEstimate[data].parts && sendSingleEstimate[data].parts.length){
              sendSingleEstimate[data].parts.map((part,i,arr)=>{
                if(!!part.name && part.cost >= 0){
                  part.cost = +part.cost
                  return arr
                }else
                 return arr.splice(i,1)
              })

            estimatesFinalData.data.estimates[data] = objSubmit[data];
            if(estimatesFinalData.data.estimates[data] && !!estimatesFinalData.data.estimates[data].labourCost)
            estimatesFinalData.data.estimates[data].labourCost = +estimatesFinalData.data.estimates[data].labourCost
            }

            // saving refrub choices 
            if(editedRefurbs && editedRefurbs.length){
              let uniqRefurbs = [...editedRefurbs.reduce((map,obj)=> map.set(obj.refurbishment,obj), new Map()).values()];
              estimatesFinalData.data.estimates[data]["refurbishmentChoices"] = uniqRefurbs;
            }
            // submit data to api
            console.log(estimatesFinalData);
            dispatch(props.approveQualityChecks(estimatesFinalData,listingDetail.appointmentId,"Estimate filled successfully"));
            setIsEdit(""); 
            setOtherWorkToBeDoneFieldValue("");
            
          // temprory solution to get updated state from store
          setTimeout(()=>{
            let params = {
              appointmentId:listingDetail.appointmentId,
              inspectionType:"CATALOG",
            }
            dispatch(getEstimateDetails(params));
            dispatch(getEstimateDetails(params));
          },1500);
          
    }

    const addMoreParts = (item) => {
     setPrevIndex(prevIndex+1)
     let obj = {};
     obj = {...estimatesFieldsInitial};
     obj[item].parts.push({name:"",cost:null});
     setEstimatesFieldsInitial({...obj});
   }

   const removeParts = (item,index)=>{
     let obj = {};
     obj = {...estimatesFieldsInitial};
     if(obj && obj[item] && obj[item].parts && obj[item].parts.length > 1){
      obj[item].parts = obj[item].parts.filter((currentItem,currentIndex)=>{
        if(currentIndex !== index){
          return currentItem
        }
      })
     }
     setEstimatesFieldsInitial({...obj});
     setPrevIndex(obj[item].parts.length - 1);
   }

   const setOtherWorkToBeDoneField = (value) => {
    setOtherWorkToBeDoneFieldValue(value);
   }

   const editWorkToBeDone = (item,option,i,value)=>{
     let updateWorkToBeDone = {};
     updateWorkToBeDone = {...possibleOptions};
     if(option && option.refurbishment && option.refurbishment === value.name){
      updateWorkToBeDone[item].refurbishmentChoices[i].checked = !updateWorkToBeDone[item].refurbishmentChoices[i].checked;
     }
     setWorkToBeDone(updateWorkToBeDone);
   }

   const editRefurbChoice = (item,event,choice,index)=>{
     let obj = {};
     obj = {...refurbishmentChoices};
     if(refurbishmentChoices && refurbishmentChoices[item]){
      obj[item][index].refurbishment = event.target.value;
     }
     setRefurbishmentChoices({...obj});
   }

    return (
      <>
      {props.showToaster && <AlertBox ShowAlert={props.showToaster} message={props.toasterMessage} type={props.toasterType} />}
      {props && props.isProcessing && <div className="loaderSection"> <img src={loaderImg} alt="loader" /></div>}
      <div className="col-lg-12">
      <Link to="/estimate"> Back </Link>
        <div className="middleContent">
        <div className="row contentWrapper">
        {listingDetail && listingDetail.make && (
          <div className="col-lg-3">
            <div className="form-group">
              <h5>{listingDetail.make + " " + listingDetail.model}</h5>
              <span>{listingDetail.variant ? listingDetail.variant+ " | " : ''}</span> 
              <span>{listingDetail.fuelType ? listingDetail.fuelType : ''}</span>
            </div>
          </div>
        )}

          <div className="col-lg-3">
            <div className="form-group  bolder-label">
            <label>Inspected By: </label>
              <span>{listingDetail?.createdBy?.uid ? " " + listingDetail?.createdBy?.uid : ' N/A'}</span>
            </div>
          </div>

          <div className="col-lg-3">
            <div className="form-group bolder-label">
              <label>Workshop Name: </label>
              <span>{listingDetail?.loc?.name ? ' ' + listingDetail.loc?.name : ' N/A'}</span>
            </div>
          </div>

        </div>
      
        <div className="row contentWrapper">
          <div className="col-lg-3">
            <div className="form-group bolder-span">
              <label>Appointment ID: </label>
              <span>{listingDetail?.appointmentId ? " " + listingDetail.appointmentId : " N/A"}</span>
            </div>
          </div>

            <div className="col-lg-3">
              <div className="form-group bolder-span">
              <label>Inspection Date: </label>
                <span>{listingDetail?.formatedUpdatedAt ? " " + listingDetail.formatedUpdatedAt : " N/A"}</span>
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
        
        <div className="row contentWrapper">
            <div className="col-lg-3">
              <div className="form-group bolder-span">
              <label>Total Estimates: </label>
                <span>{totalEstimates}</span>
              </div>
            </div>

            <div className="col-lg-3">
              <div className="form-group bolder-span">
              <label>Remaining estimates: </label>
                <span>{remainingEstimates}</span>
              </div>
            </div>

            <div className="col-lg-3">
              <div className="form-group bolder-span">
              <label>No work to be done: </label>
                <span>{totalNoWorkToBeDone}</span>
              </div>
            </div>
            
          
        </div>
        
        <div className="row contentWrapper">
          {acceptableImperfectionRejected ? (
            <div className="col-lg-12 text-center">
              <div className="form-group bolder-span">
                <span style={{color:'#F34500'}}>
                Acceptable imperfections have been rejected for this appointment id.
                Please re inspect them through mobile app.</span>
              </div>
            </div>
          ):(null)} 
        </div>
        {/* Photo slider starts here*/}
          <div className="row">
              <div className="col-lg-12">
                  <div className="container-box estimates-container">
                {listingDetail && listingDetail.data &&(
                    <>
                    {Object.keys(listingDetail.data.qualityChecks).map((item,index)=>{
                        return(
                            <>
                            {listingDetail.data.qualityChecks[item]?.invalidated === false &&
                            listingDetail.data.checkpoints[item]?.ok === false && 
                            (
                              <div className="container-box-card mt-4">
                                <label className="label-top">{item}</label>
                                <label className="label-top status-right-aligned">
                                  {listingDetail.data.qualityChecks[item]?.reason === "NO_WORK_TO_BE_DONE" && 
                                  listingDetail.data.qualityChecks[item].status === "APPROVED" ? "No work to be done" : 
                                  listingDetail.data.qualityChecks[item].status.toLowerCase()}
                                </label>
                                <div className="shaded-border"></div>
                                <div className="info-container">
                                <div className="row my-2 mx-2">
                                    <div className="col-lg-12">
                                    <div className="form-group photos-row">
                                        <div className="estimate-photo-container-horiz">
                                            {listingDetail.data.checkpoints[item]?.images.map((image,index)=>(
                                                <div className="col-lg-4 photos-slider">
                                                    <img src={image.path} alt={image.label}/>
                                                </div>
                                            ))} 
                                        </div>
                                    </div>
                                    </div>
                                </div>
                                <div className="row my-2 mx-2">
                                    <div className="col-lg-6">
                                    {listingDetail.data.checkpoints[item] && listingDetail.data.checkpoints[item].ok === false && 
                                    listingDetail.data.checkpoints[item].choices.length  > 0 &&(
                                        <div className="col-lg-12 light-label dark-span">
                                            <h6>Unacceptable Imperfections</h6>
                                            {listingDetail.data.checkpoints[item].choices.map((choice)=>{
                                                return(!choice.acceptable ? choice.choice + ' | ' : '')
                                                })}
                                            </div>
                                    )}
                                    {isEdit !== index ? (<>
                                      {listingDetail.data.checkpoints[item].refurbishmentChoices.length  > 0 && (
                                        <div className="col-lg-12 light-label dark-span">
                                            <h6 className="work-to-done">Work to be done</h6>
                                            {listingDetail.data.checkpoints[item].refurbishmentChoices.map((choice,index2)=>{
                                                return(
                                                  <>
                                                  {choice && choice.refurbishment && (
                                                    <>
                                                   <span>{index2+1 +". "+ choice.refurbishment + ' '}</span><br/>
                                                    </>
                                                  )}
                                                  </>
                                                )
                                                })}                                             
                                        </div>
                                    
                                    )}
                                    </>):(null)}
                                     <div className="col-lg-12 light-label dark-span">
                                    {possibleOptions && possibleOptions[item] && possibleOptions[item].refurbishmentChoices && isEdit === index && (
                                      <> {possibleOptions[item].refurbishmentChoices.map((option,ind)=>{
                                        return(
                                          <>
                                          {option && option.other === false ? (
                                            <>
                                             <input type="checkbox" 
                                              name={option.refurbishment} 
                                              checked={option.checked} 
                                              onClick={e=>editWorkToBeDone(item,option,ind,e.target)}/>
                                              <span>{" " + option.refurbishment}</span><br/>
                                            </>
                                          ):(null)}
                                          </>
                                        )
                                      })
                                      }
                                      <span>Other: </span> 
                                      <input className="form-control" type="textbox" name="otherWorkToBeDoneField"
                                        value={otherWorkToBeDoneFieldValue} 
                                        onChange={e=> setOtherWorkToBeDoneFieldValue(e.target.value)}
                                        />
                                      </>
                                    )}
                                    </div>


                                        <div className="col-lg-12 light-label dark-span">
                                            <h6 className="work-to-done">Estimated labour cost</h6>
                                            <input type="text" className="form-control"
                                            name={item}
                                            value={estimatesFieldsInitial[item]?.labourCost >= 0 ? estimatesFieldsInitial[item]?.labourCost : ""}
                                            onChange={e=> estimatedLaborCostHandler(e,item)} 
                                            disabled={((isEdit !== index) || (listingDetail.data.qualityChecks[item].status === "APPROVED"))}
                                            />
                                            {isEdit === index && errors?.name === item &&
                                            errors.errors && !!estimatesFieldsInitial[item].labourCost &&
                                            (<span className="text-danger">Should be number</span>)}

                                        </div>
                                        <div className="col-lg-12 mt-4 pl-0">
                                        {(listingDetail.data.qualityChecks[item].status !== "APPROVED") && (
                                            <button className="estimates-button" 
                                            onClick={e => {editClickHandler(index,item);setEditWorkClicked(true)}}
                                            >Edit</button>
                                        )}
                                        { !errors.errors && isEdit === index &&
                                          ((
                                            !!estimatesFieldsInitial[item]?.labourCost && 
                                            !!!estimatesFieldsInitial[item]?.parts[0]?.name &&
                                            !!!estimatesFieldsInitial[item]?.parts[0]?.cost
                                          ) ||(
                                            !!estimatesFieldsInitial[item]?.labourCost 
                                            && (
                                            !!estimatesFieldsInitial[item]?.parts[0]?.name &&
                                            !!estimatesFieldsInitial[item]?.parts[0]?.cost)
                                          )||(
                                            !!!estimatesFieldsInitial[item]?.labourCost &&
                                            !!estimatesFieldsInitial[item]?.parts[0]?.name &&
                                            !!estimatesFieldsInitial[item]?.parts[0]?.cost
                                            ) || (!!otherWorkToBeDoneFieldValue || isEdit === index))
                                        && (
                                            <button 
                                            className={"estimates-button"}
                                            onClick={e => onSaveEditsHandler(index,item)}
                                            >Save</button>                                    
                                        )}
                                        </div>
                                    </div>
                                    
                                    <div className="col-lg-6">
                                          {estimatesFieldsInitial[item]?.parts && estimatesFieldsInitial[item]?.parts.length ? 
                                          (<> 
                                          {estimatesFieldsInitial[item]?.parts.map((part,partIndex)=>{
                                            return(
                                              <>
                                              <div className="row" key={partIndex}>
                                                <div className="col-lg-5 light-label dark-span">
                                                    <h6>Additional part name</h6>
                                                    <input type="text" className="form-control"
                                                    name={item+partIndex}
                                                    value={part?.name ? part?.name : ""}
                                                    onChange={(e)=> {addtionalPartNameHandler(e,item,partIndex)}} 
                                                    disabled={(isEdit !== index || listingDetail.data.qualityChecks[item].status === "APPROVED")}/>
                                                </div>
                                                <div className="col-lg-5 light-label dark-span">
                                                    <h6>Additional part cost</h6>
                                                    <input type="text" className="form-control"
                                                    name={item+partIndex} 
                                                    value={part?.cost >= 0 ? part?.cost : ""}
                                                    onChange={e=> additionalPartCostHandler(e,item,partIndex)} 
                                                    disabled={(isEdit !== index) || (listingDetail.data.qualityChecks[item].status === "APPROVED")}/>
                                                {isEdit === index && errors?.name === item+partIndex &&
                                                errors.errors && estimatesFieldsInitial[item].parts[partIndex].cost &&
                                                (<span className="text-danger">Should be number</span>)}
                                                </div>
                                                <div className="col-lg-2">
                                                {partIndex && partIndex !== 0 ? (
                                                  <button type="button" disabled={isEdit !== index} className="remove-additional-part" 
                                                  onClick={e=> removeParts(item,partIndex)}>X</button>
                                                ):(null)}
                                                </div>
                                              </div> 
                                              </>                                         
                                            )
                                          
                                          })}
                                          </>)
                                          :
                                          (
                                            <>
                                              <div className="row" key={0}>
                                                <div className="col-lg-6 light-label dark-span">
                                                    <h6>Additional part name</h6>
                                                    <input type="text" className="form-control"
                                                    name={item+0}
                                                    value={estimatesFieldsInitial[item]?.parts[0]?.name ? estimatesFieldsInitial[item]?.parts[0]?.name : ""}
                                                    onChange={(e)=> {addtionalPartNameHandler(e,item,0)}} 
                                                    disabled={(isEdit !== index || listingDetail.data.qualityChecks[item].status === "APPROVED")}/>
                                                </div>
                                                <div className="col-lg-6 light-label dark-span">
                                                    <h6>Additional part cost</h6>
                                                    <input type="text" className="form-control"
                                                    name={item+0} 
                                                    value={estimatesFieldsInitial[item]?.parts[0]?.cost ? estimatesFieldsInitial[item]?.parts[0]?.cost : ""}
                                                    onChange={e=> additionalPartCostHandler(e,item,0)} 
                                                    disabled={(isEdit !== index) || (listingDetail.data.qualityChecks[item].status === "APPROVED")}/>
                                                {isEdit === index && errors?.name === item+"0" &&
                                                errors.errors && estimatesFieldsInitial[item].parts[0].cost &&
                                                (<span className="text-danger">Should be number</span>)}
                                                </div>
                                              </div> 
                                              </>                                         
                                          )}
                                        {isEdit === index && (
                                          <button 
                                        type="button" 
                                        onClick={e=>addMoreParts(item)}
                                        className="estimates-button"
                                        disabled={!!!estimatesFieldsInitial[item].parts[prevIndex]?.cost || 
                                          !!!estimatesFieldsInitial[item].parts[prevIndex]?.name}
                                        >Add More</button>
                                        )}
                                         <div className="row">
                                            <div className="col-lg-12 m-2 p-2 light-label">
                                                {listingDetail.data.qualityChecks[item].status === "REJECTED" && (
                                                    <>
                                                    {listingDetail.data.qualityChecks[item].comment && (
                                                        <>
                                                        <h6>Comment : <span>{listingDetail.data.qualityChecks[item].comment}</span> </h6>
                                                        </>
                                                    )} 
                                                    </>
                                                 )} 
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                </div>
                              </div>  
                            )}
                            </>
                        )
                    })}
                    </>
                )}
                </div>
              </div>
          </div>
        </div>
      </div>
      </>
    );
  };
 

const mapDispatchToProps = {
  getEstimateDetails,
};

const mapStateToProps = state => {
  return {
      listingDetailsUpdated: state.workshopReducer.estimatesListingDetail,
  };
};

export default connect(mapStateToProps,
  mapDispatchToProps)(EstimateDetailsComponent)
