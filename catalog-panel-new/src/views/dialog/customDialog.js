import React, { useState, useEffect } from "react";
import './../workshopQaDetail/workshopDetails.css';
const CustomDialog = (props) => {
    return(
        <div className="custom-dialog">
            <div style={{width:'auto'}}>
               <div className="row">
                   <div className="col-lg-12 text-center">
                       <div className="confirmation-button">
                        {props.setPopupMessage ? (<h4>{props.setPopupMessage}</h4>):(<h4>You won’t be able to change the state after submitting. Are you sure?</h4>)}
                        <button onClick={e=> {props.setGetConfirmation(false);props.setIsConfirmationDialog(false)}}>No</button>
                        <button onClick={e=> {props.setGetConfirmation(true); props.setIsConfirmationDialog(false)}}>Yes</button>
                       </div>
                   </div>
               </div>

            </div>
        </div>
    )
}

export default CustomDialog;