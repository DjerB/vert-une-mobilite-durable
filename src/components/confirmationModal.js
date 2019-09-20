import React from 'react';
import { Modal, ModalBody } from 'reactstrap';
import { withRouter } from 'react-router-dom';

import { ReactComponent as Like } from '../images/challenge/like.svg';
import { ReactComponent as Close } from '../images/close.svg';
import { CHALLENGES } from '../constants/routes';

const buttonStyle = {
    backgroundColor: "#0052A0",
    color: "white",
    borderRadius: "10px",
    width: "50%"
};

const ConfirmationModal = ({ points, isOpen, toggle, color, uploadEvidence, triggerUpload, history }) => (
    <Modal isOpen={isOpen} toggle={toggle} centered={true} className="bravoModal d-flex justify-content-center">
        <ModalBody className="d-flex flex-column justify-content-around h-100">
            <div className="d-flex justify-content-end">
                <Close onClick={toggle} />
            </div>
            <div className="d-flex flex-column align-items-center justify-content-between h-25">
                <Like />
                <span style={{ color: color, fontSize: "0.8em" }}>+ {points} points</span>
            </div>
            <div className="d-flex flex-column align-items-center text-center">
                <h5>Bravo tu as réussi !</h5>
                <p style={{ fontSize: "0.7em" }}>Tu peux aussi partager une photo de ton expérience avec les autres gazier(e)s.</p>
            </div>
            <div className="d-flex flex-column align-items-center">
                {uploadEvidence && <input type="file" id="input-file" accept="image/x-png,image/gif,image/jpeg" onChange={uploadEvidence} style={{ display: "none" }} />}
                {triggerUpload && <button type="button" className="btn mb-2 btn-sm px-3" style={buttonStyle} onClick={triggerUpload}>Importer...</button>}
                <button type="button" className="btn mb-2 btn-sm px-3" style={buttonStyle} onClick={() => history.push(CHALLENGES)}>Voir les défis</button>
            </div>
        </ModalBody>
    </Modal>
);

export default withRouter(ConfirmationModal);