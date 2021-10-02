import React, { Component, useEffect, useState } from 'react';
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

const QuestionMarkPopUp = (props) => {
    const historyLink = useHistory();
    const dispatch = useDispatch();
    const [hint, setHint] = useState({});

    useEffect(()=>{
        if(props.hintData){
            setHint(props.hintData);
        }
    },[props.hintData]);

    const submitCarTag = ()=>{
        if(props && props.listDetails.appointmentId && props.currentTagSelected !== "NONE"){
            dispatch(props.addTagging({},props.listDetails.appointmentId, "Appointment tagged successfully !", "carTagging", props.currentTagSelected))
        }
    }

    return (
            <>
                {props.type && props.message && props.type === "carTagging" ? (
                    <div className="final-tagging-popup">
                    <h5>{`Car will be marked as ${props.currentTagSelected.split('_')[0]} Tag Are you sure?`}</h5>
                    <button onClick={e=>submitCarTag()}>Yes</button>
                    <button onClick={e=>props.actionButton("NONE")}>No</button>
                    </div>
                ):(
                    <div className="questionMarkPopUp">
                    <h2>{hint && hint.key}</h2>
                    <table cellPadding="0" cellSpacing="0" width="100%">
                        <thead>
                            <tr>
                                <th>Problem</th>
                                <th>Criteria</th>
                                <th>Tag/Solution</th>
                            </tr>
                        </thead>
                        <tbody>
                            {hint && hint.hints && hint.hints.tabular && hint.hints.tabular.map((item,index)=>{
                                return(
                                    <tr>
                                        {item && item.map((col)=>{
                                            return(
                                                <td>{col}</td>
                                            )
                                        })}
                                    </tr>
                                )
                            })}
                            
                        </tbody>
                    </table>
                     </div>
                )}
            </>
        )
    }


export default QuestionMarkPopUp;