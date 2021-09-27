import React, { Component } from 'react';
import { connect } from 'react-redux';
import loaderImg from "../../assets/img/loader.png";
import AlertBox from './../../common/showAlert';
import { setToasterMessage } from '../../store/actions/commonAction/common.action';
import InspectionHistoryComponent from './inspectionHistoryComponent';
import {getInspectionHistoryListing,getWorkshopListingCount,searchAppointment} from './../../store/actions/workshopQaManagement/workshopQaManagement.action';

class InspectionHistoryContainer extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount(){
        this.props.getInspectionHistoryListing();
        this.props.getWorkshopListingCount("inspectionhistory");
    }

    render() {
        return (
            <div>
                {this.props.showToaster && <AlertBox ShowAlert={this.props.showToaster} message={this.props.toasterMessage} closeToaster={this.closeToaster} type={this.props.toasterType} />}
                {this.props.isProcessing && <div className="loaderSection"><img src={loaderImg} alt="loader" /></div>}
                <InspectionHistoryComponent 
                    inspectionHistoryListing={this.props.inspectionHistoryListing}
                    getInspectionHistoryListing={getInspectionHistoryListing}
                    toasterType={this.props.toasterType}
                    toasterMessage={this.props.toasterMessage}
                    showToaster={this.props.showToaster}
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
        inspectionHistoryListing:state.workshopReducer.inspectionHistoryListing,
        qaListingCount:state.workshopReducer.qaListingCount
    };
};
const mapDispatchToProps = {
    setToasterMessage,
    getInspectionHistoryListing,
    getWorkshopListingCount,
    searchAppointment
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(InspectionHistoryContainer);