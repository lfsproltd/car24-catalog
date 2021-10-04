import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setToasterMessage } from './../../store/actions/commonAction/common.action';
import loaderImg from "../../assets/img/loader.png";
import AlertBox from './../../common/showAlert';
import WorkshopQaDetailsComponent from "./workshopQaDetailsComponent";
import {getWorkshopListingDetails,approveQualityChecks,getLastInspectionData,getMasterDataQaImageKeys,getInspectionSummary} from "../../store/actions/workshopQaManagement/workshopQaManagement.action";
class WorkshopQaDetailContainer extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount(){
        let appointmentId = this.props.match && this.props.match.params && this.props.match.params.appointmentId;
        let version = this.props.match && this.props.match.params && this.props.match.params.version;
        let params = {
            appointmentId:appointmentId,
            inspectionType:"CATALOG",
            inspectionStatus:"ESTIMATED"
        }
        this.props.getWorkshopListingDetails(params);
        this.props.getMasterDataQaImageKeys();
        let paramsForInspectionsummary = {
            appointmentId:appointmentId,
            version:version
        };
        this.props.getInspectionSummary(paramsForInspectionsummary);
    }
    render() {
        return (
            <div>
                {this.props.showToaster && <AlertBox ShowAlert={this.props.showToaster} message={this.props.toasterMessage} closeToaster={this.closeToaster} type={this.props.toasterType} />}
                {this.props.isProcessing && <div className="loaderSection"> <img src={loaderImg} alt="loader" /></div>}
                <WorkshopQaDetailsComponent 
                listingDetails={this.props.listingDetails}
                toasterType={this.props.toasterType}
                toasterMessage={this.props.toasterMessage}
                showToaster={this.props.showToaster}
                getWorkshopListingDetails={getWorkshopListingDetails}
                approveQualityChecks={approveQualityChecks}
                getInspectionData={getLastInspectionData}
                lastInspectionData={this.props.lastInspectionData}
                setToasterMessage={setToasterMessage}
                qaTopImagesKeys={this.props.qaTopImagesKeys}
                masterData={this.props.masterData}
                inspectionSummary={this.props.inspectionSummary}
                    />
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        isProcessing: state.workshopReducer.isProcessing,
        showToaster: state.commonReducer.showToaster,
        toasterMessage: state.commonReducer.toasterMessage,
        toasterType: state.commonReducer.toasterType,
        listingDetails: state.workshopReducer.qaListingDetails,
        lastInspectionData:state.workshopReducer.lastInspectionData,
        qaTopImagesKeys:state.workshopReducer.qaTopImagesKeys,
        masterData: state.workshopReducer.masterData,
        inspectionSummary:state.workshopReducer.inspectionSummary
    };
};
const mapDispatchToProps = {
    setToasterMessage,
    getWorkshopListingDetails,
    approveQualityChecks,
    getLastInspectionData,
    getMasterDataQaImageKeys,
    getInspectionSummary
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(WorkshopQaDetailContainer);