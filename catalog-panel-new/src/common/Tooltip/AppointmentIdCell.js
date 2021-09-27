import React from "react"

export default class AppointmentIdCell extends React.Component {
   
    render() {
        return (
                  <td >
                {this.props.dataItem && this.props.dataItem.appointmentId.replace(/_/g, ' ')}
            </td>
        );
    }
}


