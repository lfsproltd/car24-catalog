import React, { useState, useEffect } from 'react';
import { Notification } from '@progress/kendo-react-notification';
import { Fade } from '@progress/kendo-react-animation';
import { useDispatch } from 'react-redux';
import { setToasterMessage } from './../store/actions/commonAction/common.action'

const AlertBox = (props) => {
    const dispatch = useDispatch();
    const [ShowAlert, setAlert] = useState(false)
    const [ShowMessage, setMessage] = useState('')
    const [MessageType, setType] = useState('')
    const defaultTime = props.defaultTime ? props.defaultTime : 5000
    useEffect(() => {
        setAlert(props.ShowAlert)
        setMessage(props.message)
        setType(props.type)
    }, [props.ShowAlert]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setAlert(false);
            dispatch(setToasterMessage({
                showToaster: false,
                toasterMessage: '',
                toasterType: ''
            }));
        }, defaultTime);
        return () => clearTimeout(timer);
    }, [ShowAlert]);

    return (
        <div className="alertMsg">
            {
                ShowAlert && <Fade enter={true} exit={true}>{
                    <Notification
                        type={{ style: MessageType, icon: false }}
                        closable={true}
                        onClose={() => setAlert(false)}
                    >
                        <span>{ShowMessage}</span>
                    </Notification>}
                </Fade>
            }
        </div>
    )


}
export default AlertBox;