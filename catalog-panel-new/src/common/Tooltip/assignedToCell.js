import React from "react";
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { br } from 'react-router-dom';
import {assignAppointmentId} from "./../../store/actions/qaManagement/qa.management.actions";


class AssignedToCell extends React.Component {
    constructor(props){
        super(props);
        this.state = {redirect:null,isProcessing:true};
    }

    assignHandler = ()=>{
        let redirectLocation = window.location.pathname;
        this.props.assignAppointmentId(this.props.dataItem.appointmentId,this.props.dataItem.version,redirectLocation);
    }

    render() {
        if(this.state.redirect){
            return <Redirect to={this.state.redirect} />
        }
        return (
                <>
                {this.props.dataItem && this.props.dataItem.assignedTo && this.props.dataItem.assignedTo.uid ? 
                (<td>{this.props.dataItem.assignedTo.uid}</td>)
                :
                (<button style={{outline:'none',border:'none',background:'#F37500',
                fontSize:"1rem",fontWeight:"500",margin:"5px auto",
                padding:"5px 10px",borderRadius:"7px",color:"#ffffff"}}
                onClick={()=> this.assignHandler()}
                >ASSIGN TO ME</button>)
                }
                </>
        );
    }
}

const mapStateToProps = state => {
    return {
        isProcessing: state.qaReducer.isProcessing,
        assignedResponse: state.qaReducer.assignedResponse
    };
};

const mapDispatchToProps = {
    assignAppointmentId
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(AssignedToCell);