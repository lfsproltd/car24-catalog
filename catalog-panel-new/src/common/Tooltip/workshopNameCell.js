import React from "react"

export default class WorkshopNameCell extends React.Component {
   constructor(props){
       super(props);
   }
    render() {
        return (
                <td>
                    {this.props.dataItem && this.props.dataItem.loc && this.props.dataItem.loc.name}
                </td>
        );
    }
}