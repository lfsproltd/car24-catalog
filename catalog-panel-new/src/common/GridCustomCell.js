import React from 'react';
import { Link } from 'react-router-dom';

const GridCustomCell = (props) => {
    return (
        <>
            {props.dataLink && <td title={props.dataText} className="gridLinkCls">
                <Link to={{pathname:props.dataLink, state: {isLogistic: props.isLogistic}}}>{props.dataText}</Link>
            </td>}
        </>
    )
}

export default GridCustomCell;