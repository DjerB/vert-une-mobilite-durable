import React from 'react';
import { withRouter } from 'react-router-dom';

import { CATEGORIES_COLOR } from '../constants/challenges';

import { CHALLENGES } from '../constants/routes';

const containerStyle = {
    minWidth: "32vw",
    maxWidth: "100px",
    fontSize: "12px",
    marginRight: "5%",
    borderRadius: "4px 4px",
    boxShadow: "0.5px 0.5px 3px 1px #e2e2e2",
    cursor: "pointer"
};

const borderStyle = {
    color: "white",
    padding: "1%",
    paddingRight: "5%"
};

/**
 * Simple component displaying a challenge information
 * @param {object} data Contains the challenge information such as title, categorie...
 * @param {array} history React Router property to go to challenge view on click
 */
const ChallengeCard = ({ data, history }) => (
    <div className="d-flex flex-column justify-content-between sliderItem" style={containerStyle} onClick={() => history.push(CHALLENGES + "/" + data.challengeId)}>
        <div className="d-flex justify-content-end" style={{ backgroundColor: CATEGORIES_COLOR.find(({ name }) => name === data.categorie).color ,...borderStyle}}>
            <strong>#{data.categorie.split(" ").join("").toLowerCase()}</strong>
        </div>
        <div className="text-center px-1">
            {data.titre}
        </div>
        <div className="d-flex justify-content-end pr-1 pb-1" style={{ color: CATEGORIES_COLOR.find(({ name }) => name === data.categorie).color }}>
            <span>Jusqu'à {data.pointsDebut + data.pointsFin + (data.type === "decouverte" ? getQuizMaxPoints(data.questions, data.pointsBonus) : data.pointsBonus) } points</span>
        </div>
    </div>
);

const getQuizMaxPoints = (questions, unit) => {
    let points = 0;
    questions.map(({ reponses }) => points += reponses.length * unit);
    return points;
}

export default withRouter(ChallengeCard);