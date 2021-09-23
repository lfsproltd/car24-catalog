import React from "react"

export default class MakeModelCell extends React.Component {
   
    render() {
        return (
                <td>
                {this.props.dataItem && this.props.dataItem.make && this.props.dataItem.model ? this.props.dataItem.make + ' ' + this.props.dataItem.model : ''}
                </td>
        );
    }
}
