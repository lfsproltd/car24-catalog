import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setToasterMessage } from './../../store/actions/commonAction/common.action';
import loaderImg from "../../assets/img/loader.png";
import AlertBox from './../../common/showAlert';
import YardQaDetailsComponent from "./yardQaDetailsComponent";
import {getYardListingDetails,approveQualityChecks,getLastInspectionData,getMasterDataQaImageKeys} from "../../store/actions/workshopQaManagement/workshopQaManagement.action";
class YardQaDetailsContainer extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount(){
        let appointmentId = this.props.match && this.props.match.params && this.props.match.params.appointmentId;
        let params = {
            appointmentId:appointmentId,
            inspectionType:"CATALOG"
        }
        this.props.getYardListingDetails(params);
        this.props.getMasterDataQaImageKeys();
    }
    render() {
        return (
            <div>
                {this.props.showToaster && <AlertBox ShowAlert={this.props.showToaster} message={this.props.toasterMessage} closeToaster={this.closeToaster} type={this.props.toasterType} />}
                {this.props.isProcessing && <div className="loaderSection"> <img src={loaderImg} alt="loader" /></div>}
                <YardQaDetailsComponent 
                listingDetails={this.props.listingDetails}
                toasterType={this.props.toasterType}
                toasterMessage={this.props.toasterMessage}
                showToaster={this.props.showToaster}
                getYardListingDetails={getYardListingDetails}
                approveQualityChecks={approveQualityChecks}
                getInspectionData={getLastInspectionData}
                lastInspectionData={this.props.lastInspectionData}
                setToasterMessage={setToasterMessage}
                qaTopImagesKeys={this.props.qaTopImagesKeys}
                masterData={this.props.masterData}
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
        listingDetails: state.workshopReducer.yardListingDetails,
        lastInspectionData:state.workshopReducer.lastInspectionData,
        qaTopImagesKeys:state.workshopReducer.qaTopImagesKeys,
        masterData: state.workshopReducer.masterData
    };
};
const mapDispatchToProps = {
    setToasterMessage,
    getYardListingDetails,
    approveQualityChecks,
    getLastInspectionData,
    getMasterDataQaImageKeys
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(YardQaDetailsContainer);