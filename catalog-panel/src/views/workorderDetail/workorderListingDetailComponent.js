import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import loaderImg from "../../assets/img/loader.png";
import AlertBox from './../../common/showAlert';
import "../workshopQaDetail/workshopDetails.css";
import { useHistory } from "react-router-dom";
import { dateFormat, timeFormat } from "../../utils/utils";
import { Link } from 'react-router-dom';
import WorkorderPrintComponent from './workorderPrintComponent';
import { useRef } from 'react';
import ReactToPrint from 'react-to-print';
import { useReactToPrint } from 'react-to-print';
import { render } from "react-dom";


const WorkorderListingDetailComponent = (props) => {
    const componentRef = useRef();
    const historyLink = useHistory();
    const dispatch = useDispatch();
    const [listingDetail, setListingDetail] = useState({});
    const [nonAccImperfection, setNonAccImperfection] = useState("");
    const [accImperfection, setAccImperfection] = useState("");

    useEffect(()=>{
        let totlaNonAcceptableImperfections = 0;
        let totlalAcceptableImperfections = 0;
        props && props.listingDetails.map((item)=>{
            if(item && item.updatedAt){
              item.formatedUpdatedAt = dateFormat(item.updatedAt);
            }
          });  
        setListingDetail(props.listingDetails[0]);
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

    return (
      <>
      {props.showToaster && <AlertBox ShowAlert={props.showToaster} message={props.toasterMessage} type={props.toasterType} />}
      {props && props.isProcessing && <div className="loaderSection"> <img src={loaderImg} alt="loader" /></div>}
      <div className="col-lg-12">
      <Link to="/estimate"> Back </Link>
      <PrintComponent data={listingDetail}  accImperfection={accImperfection} nonAccImperfection={nonAccImperfection}/>
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
          <div className="row">
              <div className="col-lg-12">
                  <div className="container-box">
                {listingDetail && listingDetail.data &&(
                    <>
                    {Object.keys(listingDetail.data.qualityChecks).map((item,index)=>{
                        return(
                            <>
                            {listingDetail.data.qualityChecks[item]?.invalidated === false &&
                            listingDetail.data.checkpoints[item]?.ok === false && 
                            (listingDetail.data.qualityChecks[item]?.reason !== "NO_WORK_TO_BE_DONE" &&
                            listingDetail.data.qualityChecks[item]?.status === "APPROVED") &&
                            (
                              <div className="container-box-card mt-4">
                                <label className="label-top">{item + " "}</label>
                                <label className="label-top status-right-aligned">{listingDetail.data.qualityChecks[item].status.toLowerCase()}</label>
                                <div className="shaded-border"></div>
                                <div className="info-container">
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

                                    {listingDetail.data.checkpoints[item].refurbishmentChoices.length  > 0 && (
                                        <div className="col-lg-12 light-label dark-span">
                                            <h6 className="work-to-done">Work to be done</h6>
                                            {listingDetail.data.checkpoints[item].refurbishmentChoices.map((choice,index)=>{
                                                return(index+1 +". "+ choice.refurbishment + ' ')
                                                })}
                                        </div>
                                    )}

                                        <div className="col-lg-12 light-label dark-span">
                                            <h6 className="work-to-done">Estimated labour cost</h6>
                                            <input type="text" className="form-control"
                                            value={listingDetail.data.estimates && listingDetail.data.estimates[item] && 
                                                listingDetail.data.estimates[item].invalidated === false &&
                                                (listingDetail.data.estimates[item].labourCost || 
                                                listingDetail.data.estimates[item].labourCost === 0)? 
                                                listingDetail.data.estimates[item].labourCost : null} 
                                            disabled={listingDetail.data.qualityChecks[item].status === "APPROVED"}/>
                                        </div>

                                    </div>
                                    <div className="col-lg-6">
                                        {listingDetail.data.estimates && listingDetail.data.estimates[item] &&
                                        listingDetail.data.estimates[item].invalidated === false &&
                                         listingDetail.data.estimates[item].parts && 
                                        listingDetail.data.estimates[item].parts.map((part,index2)=>{
                                            return(
                                            <div className="row">
                                            <div className="col-lg-6 light-label dark-span">
                                                <h6>Additional part name</h6>
                                                <input type="text" className="form-control"
                                                value={part && part.name ? part.name : null}
                                                disabled={listingDetail.data.qualityChecks[item].status === "APPROVED"}/>
                                            </div>
                                            <div className="col-lg-6 light-label dark-span">
                                                <h6>Additional part cost</h6>
                                                <input type="text" className="form-control"
                                                value={part && (part.cost || part.cost === 0) ? part.cost : null}
                                                disabled={listingDetail.data.qualityChecks[item].status === "APPROVED"}/>
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

export default WorkorderListingDetailComponent;

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
