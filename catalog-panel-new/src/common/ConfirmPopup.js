import React from 'react';
import { Dialog } from '@progress/kendo-react-dialogs';

const ConfirmPopup = (props) => {
    return (
        <>
            <Dialog title={props.title} onClose={(e) => props.closeConfirmDialog()}>
                <div className="modalSection">
                    <div className="row">
                        <div className="col-lg-12">
                            {props.text}
                        </div>                    
                    </div>

                    <div className="buttonAction confirmPopup">
                        <button className="k-button cancel" onClick={(e) => props.closeConfirmDialog()}>Cancel</button>
                        <button className="k-button k-primary" onClick={() => props.confirmDialog()}>Confirm</button>
                    </div>
                </div>

            </Dialog>
        </>
    )
}

export default ConfirmPopup;