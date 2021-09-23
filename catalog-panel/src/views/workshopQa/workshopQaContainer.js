import React, { Component } from 'react';
import { connect } from 'react-redux';
import loaderImg from "../../assets/img/loader.png";
import AlertBox from './../../common/showAlert';
import { setToasterMessage } from '../../store/actions/commonAction/common.action';
import WorkshopQaComponent from './workshopQaComponent';
import {getWorkshopListing,assignAppointmentId,getWorkshopListingCount,searchAppointment} from './../../store/actions/workshopQaManagement/workshopQaManagement.action';

class WorkshopQaContainer extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount(){
        this.props.getWorkshopListing();
        this.props.getWorkshopListingCount();
    }

    render() {
        return (
            <div>
                {this.props.showToaster && <AlertBox ShowAlert={this.props.showToaster} message={this.props.toasterMessage} closeToaster={this.closeToaster} type={this.props.toasterType} />}
                {this.props.isProcessing && <div className="loaderSection"><img src={loaderImg} alt="loader" /></div>}
                <WorkshopQaComponent 
                    getWorkshopListing={getWorkshopListing}
                    qaListing={this.props.qaListing}
                    toasterType={this.props.toasterType}
                    toasterMessage={this.props.toasterMessage}
                    showToaster={this.props.showToaster}
                    assignAppointmentId={assignAppointmentId}
                    qaListingCount={this.props.qaListingCount}
                    getWorkshopListingCount={getWorkshopListingCount}
                    searchAppointmentId={searchAppointment}
                />
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        isProcessing: state.workshopReducer.isProcessing,
        toasterType: state.commonReducer.toasterType,
        toasterMessage: state.commonReducer.toasterMessage,
        showToaster: state.commonReducer.showToaster,
        qaListing:state.workshopReducer.qaListing,
        qaListingCount:state.workshopReducer.qaListingCount
    };
};
const mapDispatchToProps = {
    setToasterMessage,
    getWorkshopListing,
    assignAppointmentId,
    getWorkshopListingCount,
    searchAppointment
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(WorkshopQaContainer);