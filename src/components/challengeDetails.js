import React from 'react';

import { ReactComponent as Difficulte } from '../images/challenge/difficulte.svg';
import { ReactComponent as Timer } from '../images/challenge/timer.svg';
import { ReactComponent as Points } from '../images/challenge/points.svg';

const containerStyle = {
    width: "90%",
    fontSize: "12px",
    borderRadius: "4px 4px",
    boxShadow: "0.5px 0.5px 3px 1px #e2e2e2"
};

const borderStyle = {
    color: "white",
    paddingRight: "3%",
    paddingTop: "1%",
    height: "12%"
};

const buttonStyle = {
    backgroundColor: "#0052A0",
    color: "white",
    borderRadius: "10px"
};

/**
 * Logic based component to display challenge infos inside challenge view
 * Depending on the inputs, buttons for starting, ending or continuing a challenge are disabled.
 * e.g --> challenges of type unique can't be done more than once so if so, the button is disabled forever.
 * 
 * @param {string} color Color depending on the challenge category 
 * @param {string} engagement engagement length if of type engagement
 * @param {function} handleSubmit handles click on buttons, the parent component handles the logic
 * @param {boolean} engaged whether the user is currently engaged in the case of type engagement
 * @param {boolean} engagedSensibilisation whether the user has already started in the case of type sensibilisation
 * @param {boolean} uniqueAndDone if the challenge has already been completed and is of type unique 
 * @param {string} runningChallenge whether the user has already started in the case of type engagement
 * @param {boolean} limitNotRespected if the minimum period before starting over the same challenge is respected
 */
const ChallengeDetails = ({ color, categorie, difficulte, engagement, maxPoints, handleSubmit, engaged, engagedSensibilisation, uniqueAndDone, runningChallenge, limitNotRespected, limite }) => (
    <div className="d-flex flex-column justify-content-between" style={containerStyle}>
        <div className="d-flex justify-content-end" style={{ backgroundColor: color, ...borderStyle}}>
            <strong>#{categorie.split(" ").join("").toLowerCase()}</strong>
        </div>
        <div className="text-center px-1 row align-top">
            <div className="col d-flex flex-column justify-content-around align-items-center">
                <Difficulte className="challengeDetailsSvg" />
                <strong>Niveau</strong>
                <span>{difficulte}</span>
            </div>
            <div className="col d-flex flex-column justify-content-around align-items-center">
                <Timer className="challengeDetailsSvg" />
                <strong>Durée</strong>
                <span>{engagement ? engagement + " jours" : "ponctuel"}</span>
            </div>
            <div className="col d-flex flex-column justify-content-around align-items-center">
                <Points className="challengeDetailsSvg" />
                <strong>Gain</strong>
                <span>Jusqu'à {maxPoints} points</span>
            </div>
        </div>
        <div className="d-flex justify-content-center mb-2" style={{ color: "#EFC358" }}>
            {uniqueAndDone ?
            <span>Tu as déjà réalisé ce défi unique.</span>
            :
            limitNotRespected ?
            <span>Tu as déjà réalisé ce défi il y a moins de {Math.ceil(24 / limite)} heures.</span>
            :
            runningChallenge ?
            <span>Tu es en train de réaliser ce défi.</span>
            :
            <button type="button" className="btn mb-2 btn-sm px-3" style={buttonStyle} onClick={handleSubmit}>{engaged ? "C'est fait" : engagedSensibilisation ? "Reprendre le QCM" : "C'est parti"}<strong className="ml-2">></strong></button>
            }
        </div>
    </div>
);

export default ChallengeDetails;