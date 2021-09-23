import React from "react"

export default class InspectionTimeCell extends React.Component {
    render() {
        return (
                <td>
                {this.props.dataItem && this.props.dataItem.formatedInspectionTime}
                </td>
        );
    }
}