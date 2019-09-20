import React from 'react';
import { Modal } from 'react-bootstrap';

import { AVATARS } from '../constants/onboarding';
import { ReactComponent as Close } from '../images/close.svg';

import Slider from '../components/slider';

const buttonStyle = {
    backgroundColor: "#0052A0",
    color: "white",
    borderRadius: "10px"
};

/**
 * 
 * @param {function} loadAvatar function that actually takes the image from device storage and sends it to S3
 * @param {function} loadLocalAvatar function called when the user chooses an avatar among proposed icons
 * @param {function} triggerLoad trick function for the import button to trigger the input function
 */
const AvatarModal = ({ show, onHide, triggerLoad, loadAvatar, loadLocalAvatar }) => (
    <Modal
        show={show}
        aria-labelledby="rgpd-modal"
        dialogClassName="bottomModal"
    >
        <Modal.Body>
            <div className="d-flex flex-column">
                <div className="d-flex flex-column" style={{ maxHeight: "50vh", overflowY: "scroll", color: "#5C747B", bottom: "2vh" }}>
                    <div className="d-flex justify-content-between">
                        <strong>Choisis ton avatar</strong>
                        <Close onClick={onHide}  />
                    </div>
                    <Slider component={Avatar} data={AVATARS} handler={loadLocalAvatar} />
                    <div className="d-flex align-items-center mt-4">
                        <strong>Ou importe ta photo</strong>
                        <input type="file" id="input-file" accept="image/x-png,image/gif,image/jpeg" onChange={loadAvatar} style={{ display: "none" }} />
                        <button type="button" className="btn btn-sm ml-3 px-3" style={buttonStyle} onClick={triggerLoad}>Importer...</button>
                    </div>
                </div>
            </div>
        </Modal.Body>
    </Modal>
);

const Avatar = ({ data: { picture, name }, handler }) => (
    <div className="h-100 mr-3 mt-2 avatar" onClick={() => handler(name, picture)}>
        <img src={picture} alt="avatar" />
    </div>
);

export default AvatarModal;