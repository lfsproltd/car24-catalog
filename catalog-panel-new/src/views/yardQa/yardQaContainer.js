import React, { Component } from 'react';
import { connect } from 'react-redux';
import loaderImg from "../../assets/img/loader.png";
import AlertBox from './../../common/showAlert';
import { setToasterMessage } from '../../store/actions/commonAction/common.action';
import YardQaComponent from './yardQaComponent';
import {getYardListing,assignAppointmentId,getWorkshopListingCount,searchAppointment} from './../../store/actions/workshopQaManagement/workshopQaManagement.action';

class WorkshopQaContainer extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount(){
        this.props.getYardListing();
        this.props.getWorkshopListingCount("yard");
    }

    render() {
        return (
            <div>
                {this.props.showToaster && <AlertBox ShowAlert={this.props.showToaster} message={this.props.toasterMessage} closeToaster={this.closeToaster} type={this.props.toasterType} />}
                {this.props.isProcessing && <div className="loaderSection"><img src={loaderImg} alt="loader" /></div>}
                <YardQaComponent 
                    getYardListing={getYardListing}
                    yardListing={this.props.yardListing}
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
        yardListing:state.workshopReducer.yardListing,
        qaListingCount:state.workshopReducer.qaListingCount
    };
};
const mapDispatchToProps = {
    setToasterMessage,
    getYardListing,
    assignAppointmentId,
    getWorkshopListingCount,
    searchAppointment
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(WorkshopQaContainer);