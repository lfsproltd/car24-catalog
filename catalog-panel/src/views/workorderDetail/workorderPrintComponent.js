import React from 'react';

export default class WorkorderPrintComponent extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            lists:[],
            nonAccImperfection:0,
            accImperfection:0
        }
        this.nonAccImperfection = this.props.nonAccImperfection;
        this.accImperfection = this.props.accImperfection;
    }

    componentWillReceiveProps(nextProps) {
        console.log('componentWillReceiveProps', nextProps);
        if (this.props !== nextProps) {
            this.setState({
                lists:nextProps.data,
                nonAccImperfection:nextProps.nonAccImperfection,
                accImperfection:nextProps.accImperfection
            })
        }
       }

    render(){
        return(
            <div style={{
                fontFamily: `'Roboto', sans-serif`,
                // "-webkit-print-color-adjust":"exact",
                margin:"50px auto"
            }}>
            <table cellpadding="0" cellspacing="0" width="100%" margin="20px">
            <tr>
                <td>
                    <table cellpadding="0" cellspacing="0" width="100%" style={{tableLayout: 'fixed'}}>
                        <tr>
                        {this.state.lists && this.state.lists.make && (
                            <td>
                                <h1 style={{fontWeight: '600', fontSize: '16px', color: '#212529'}}>
                                {this.state.lists.make + " " + this.state.lists.model}
                                </h1>
                                <p style={{margin: '2px 0 0 0', padding: '0px 0 0 0', fontSize: '16px'}}>
                                {this.state.lists.variant ? this.state.lists.variant : ''} | 
                                {this.state.lists.fuelType ? this.state.lists.fuelType : ''}
                                </p>
                            </td>
                        )}
                            
                            <td>
                                <p style={{fontSize: "14px", color: "#3c8dbc", margin: '0 0 6px',padding: '0'}}>Inspected By:</p>
                                <span style={{fontSize: "13px", color: "#212529"}}>
                                    {this.state.lists?.createdBy?.uid ? " " + this.state.lists?.createdBy?.uid : ' N/A'}
                                </span>
                            </td>
                            <td>
                                <p style={{fontSize: "14px", color: "#3c8dbc", margin: "0 0 6px",padding: "0"}}>Workshop Name:</p>
                                <span style={{fontSize: "13px", color: "#212529"}}>
                                {this.state.lists?.loc?.name ? ' ' + this.state.lists.loc?.name : ' N/A'}
                                </span>
                            </td>
                            <td>
                                <p style={{fontSize: "14px", color: "#3c8dbc", margin: "0 0 6px",padding: "0"}}></p>
                                <span style={{fontSize: "13px", color: "#212529"}}></span>
                            </td>
                        </tr>
                        <tr>
                            <td style={{paddingTop:"15px"}}>
                                <p style={{fontSize: "14px", color: "#3c8dbc", margin: "0px 0 6px",padding: "0"}}>Appointment ID:</p>
                                <span style={{fontSize: "13px", color: "#212529"}}>
                                {this.state.lists?.appointmentId ? " " + this.state.lists.appointmentId : " N/A"}
                                </span>
                            </td>
                            <td style={{paddingTop:"15px"}}>
                                <p style={{fontSize: "14px", color: "#3c8dbc", margin: "0px 0 6px",padding: "0"}}>Inspection Date:</p>
                                <span style={{fontSize: "13px", color: "#212529"}}>
                                {this.state.lists?.formatedUpdatedAt ? " " + this.state.lists.formatedUpdatedAt : " N/A"}
                                </span>
                            </td>
                            <td style={{paddingTop:"15px"}}>
                                <p style={{fontSize: "14px", color: "#3c8dbc", margin: "0px 0 6px",padding: "0"}}>Acceptable Imperfection: </p>
                                <span style={{fontSize: "13px", color: "#212529"}}>
                                    {this.state.accImperfection}
                                </span>
                            </td>
                            <td style={{paddingTop:"15px"}}>
                                <p style={{fontSize: "14px", color: "#3c8dbc", margin: "0px 0 6px",padding: "0"}}>Non-Acceptable Imperfection:</p>
                                <span style={{fontSize: "13px", color: "#212529"}}>
                                {this.state.nonAccImperfection}    
                                </span>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
            {this.state.lists?.data && this.state.lists?.data.qualityChecks && Object.keys(this.state.lists?.data.qualityChecks).map((item,index)=>{
            return(
            <>
            {this.state.lists?.data.qualityChecks[item] && 
             this.state.lists?.data.qualityChecks[item]?.invalidated === false &&
             this.state.lists?.data.checkpoints[item]?.ok === false && 
             (this.state.lists?.data.qualityChecks[item]?.reason !== "NO_WORK_TO_BE_DONE" &&
             this.state.lists?.data.qualityChecks[item]?.status === "APPROVED") && ( 
            <>
            <tr>
                <td style={{padding: "40px 0 10px 0"}}>
                    <table cellpadding="0" cellspacing="0" width="100%">
                        <tr>
                            <td>{item}</td>
                            <td style={{textAlign: "right"}}>
                            <button type="button" style={{margin: "0", padding: "10px", border: "0", background: "#3c8dbc24", color: "#3c8dbc", textTransform: "uppercase", borderRadius: "5px"}}>
                               {this.state.lists?.data.qualityChecks[item]?.status}
                            </button>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
            <tr>
                <td style={{paddingTop: "15px", borderTop: "1px solid #99999940"}}>
                    <table cellpadding="0" cellspacing="0" width="100%"  style={{tableLayout: "fixed"}}>
                        <tr>
                            <td style={{verticalAlign: "top"}}>
                                <table cellpadding="0" cellspacing="0" width="100%">
                                    <tr>
                                        <td style={{fontSize: "16px", color: "#999", margin: "0", padding: "0"}}>
                                            Unacceptable Imperfections
                                        </td>
                                    </tr>
                                    <tr>
                                    {this.state.lists?.data.checkpoints[item] && this.state.lists?.data.checkpoints[item].ok === false && 
                                    this.state.lists?.data.checkpoints[item].choices.length  > 0 &&(
                                        <td style={{fontSize: "15px", color: "#333", margin: "0px 0 0 0", padding: "10px 0 0 0"}}>
                                        {this.state.lists?.data.checkpoints[item].choices.map((choice)=>{
                                                return(!choice.acceptable ? choice.choice + ' | ' : '')
                                                })}
                                        </td>
                                    )}
                                    </tr>
                                    <tr>
                                        <td style={{fontSize: "16px", color: "#999", margin: "0", padding: "15px 0 0 0"}}>Work to be done</td>
                                    </tr>
                                    <tr>
                                        <td style={{fontSize: "15px", color: "#333", margin: "0px 0 0 0", padding: "10px 0 0 0"}}>
                                        {this.state.lists?.data.checkpoints[item].refurbishmentChoices.length  > 0 && (
                                        <>
                                        {this.state.lists?.data.checkpoints[item].refurbishmentChoices.map((choice,index)=>{
                                            return(index+1 +". "+ choice.refurbishment + ' ')
                                            })}
                                        </>
                                    )}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style={{fontSize: "16px", color: "#999", margin: "0", padding: "15px 0 10px 0"}}>Estimated labour cost</td>
                                    </tr>
                                    <tr>
                                    <td style={{fontWSize: "15px", color: "#333", margin: "0px 0 0 0", padding: "8px 5px", border:"1px solid #66666669", background: "#9999994a", borderRadius: "5px"}}>
                                                {this.state.lists?.data.estimates && this.state.lists?.data.estimates[item] && 
                                                this.state.lists?.data.estimates[item].invalidated === false &&
                                                (this.state.lists?.data.estimates[item].labourCost || 
                                                this.state.lists?.data.estimates[item].labourCost === 0)? 
                                                this.state.lists?.data.estimates[item].labourCost : "N/A"}
                                    </td>
                                    </tr>
                                </table>
                            </td>
                            {this.state.lists?.data.estimates && this.state.lists?.data.estimates[item] && 
                            this.state.lists?.data.estimates[item].invalidated === false &&
                            this.state.lists?.data.estimates[item].parts && 
                            this.state.lists?.data.estimates[item].parts.map((part,index2)=>{
                            return(<>
                            <td style={{paddingLeft: "10px", verticalAlign: "top"}}>
                                <p style={{fontSize: "16px", color: "#999", margin: "0", padding: "0"}}>Additional part name</p>
                                <p style={{fontSize: "15px", color: "#333", margin: "10px 0 0 0", padding: "8px 5px", border:"1px solid #66666669", background: "#9999994a", borderRadius: "5px"}}>
                                    {part.name ? part.name : 'N/A'}
                                </p>
                            </td>
                            <td style={{paddingLeft: "10px", verticalAlign: "top"}}>
                                <p style={{fontSize: "16px", color: "#999", margin: "0", padding: "0"}}>Additional part cost</p>
                                <p style={{fontSize: "15px", color: "#333", margin: "10px 0 0 0", padding: "8px 5px", border:"1px solid #66666669", background: "#9999994a", borderRadius: "5px"}}>
                                {part.cost || part.cost >= 0 ? part.cost : 'N/A'}
                                </p>
                            </td>
                           </>
                            )})}
                        </tr>
                    </table>
                </td>
            </tr>
            </>)}
            </>
            )})}
      </table>
            </div>
        )
    }
}
