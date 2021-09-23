import React from "react";
import ReactModal from 'react-modal';
import styles from "./popup.module.css";
import Close from "./close.svg";
// import H2 from "../h2/component";

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)'
    }
};

const Popup = ({ children,
    isOpen,
    close,
    // contentClass = "",
    // overlayClass = "overlayClass",
    // heading = "",
    heading = "",
    contentStyles = {},
    closeOnOutside = true,
    showCloseButton = true
}) => {
    return (
        <div>
            <ReactModal
                isOpen={isOpen}
                onRequestClose={close}
                style={{ ...customStyles, content: { ...customStyles.content, ...contentStyles } }}
                contentLabel="Modal"
                appElement={document.getElementById('root')}
                shouldCloseOnEsc={true}
                shouldCloseOnOverlayClick={closeOnOutside}
            >
                {showCloseButton &&
                    <div className={styles.popupWrapper}>
                        <button className={styles.closeModal} onClick={close}><img src={Close} alt="close" /></button>
                        {/* {heading && <H2 text={heading}></H2>} */}
                    </div>
                }
                {children}
            </ReactModal>
        </div>
    );
};

export default Popup;

