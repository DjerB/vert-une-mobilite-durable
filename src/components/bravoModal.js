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

/**
 * Multipurposes modal component for confirmation of challenge success
 * It is used to display the points earned when achieving the challenge,
 * suggests to upload an evidence of success and confirming that the upload succeeded.
 * 
 * @param {number} points Number of points earned
 * @param {number} correctAnswers Number of correct answers if the modal is called inside a Quiz view
 * @param {number} nbOfQuestions Number of questions if the modal is called inside a Quiz view
 * @param {string} color Color of text wrt the type of challenge involved
 * @param {function} uploadEvidence Called by the image input tool when challenge is achieved and is not of type Sensibilisation
 * @param {function} triggerUpload Called by the button to trigger the input tool function
 */
const BravoModalBase = ({ points, correctAnswers, nbOfQuestions, isOpen, toggle, color, uploadEvidence, triggerUpload, history }) => (
    <Modal isOpen={isOpen} toggle={toggle} centered={true} className="bravoModal d-flex justify-content-center">
        <ModalBody className="d-flex flex-column justify-content-between h-100">
            <div className="d-flex justify-content-end">
                <Close onClick={toggle} />
            </div>
            <div className="d-flex flex-column align-items-center justify-content-between" style={{ height: "30%" }}>
                <Like className={points === 0 ? "dislike-svg" : ""} />
                <span style={{ color: color, fontSize: "0.8em" }}>+ {points} points</span>
                {nbOfQuestions && <span style={{ fontSize: "0.8em" }}>{correctAnswers} bonne{correctAnswers > 1 ? "s" : ""} réponse{correctAnswers > 1 ? "s" : ""} sur {nbOfQuestions}</span>}
            </div>
            <div className="d-flex flex-column align-items-center text-center">
                {points === 0 ? "Dommage, retente ta chance sur un autre défi sensibilisation" : <h5>Bravo tu as {correctAnswers !== nbOfQuestions ? "partiellement" : ""} réussi !</h5>}
                {triggerUpload && <span style={{ fontSize: "0.8em" }}>Tu peux aussi partager une photo de ton expérience avec les autres gazier(e)s</span>}
            </div>
            <div className="d-flex flex-column align-items-center">
                {uploadEvidence && <input type="file" id="input-file" accept="image/x-png,image/gif,image/jpeg" onChange={uploadEvidence} style={{ display: "none" }} />}
                {triggerUpload && <button type="button" className="btn mb-2 btn-sm px-3" style={buttonStyle} onClick={triggerUpload}>Importer...</button>}
                {triggerUpload && <button type="button" className="btn mb-2 btn-sm px-3" style={buttonStyle} onClick={() => history.push(CHALLENGES)}>Voir les défis</button>}
            </div>
        </ModalBody>
    </Modal>
);

export default withRouter(BravoModalBase);
