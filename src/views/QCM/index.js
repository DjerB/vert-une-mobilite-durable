import React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import { Alert } from 'reactstrap';
import { connect } from "react-redux";
import { IconContext } from 'react-icons';
import { FaCheck, FaTimes } from 'react-icons/fa';
import axios from 'axios';

import BackTo from '../../components/backTo';
import BravoModal from '../../components/bravoModal';
import Spinner from '../../components/spinner';

import { getChallengeById, addChallengeToUser } from '../../api/challenges';
import { getUser } from '../../api/users';

import { ReactComponent as Right } from "../../images/right-arrow.svg"

import * as ROUTES from '../../constants/routes';
import { CATEGORIES_COLOR } from '../../constants/challenges';

const buttonStyle = {
    backgroundColor: "#0052A0",
    color: "white",
    borderRadius: "10px",
    width: "35%"
};

/**
 * This class contains the Quiz view for Sensibilisation challenges.
 * It support multiple answering and provides a fancy feedback once submitted.
 * The data are structured as followed:
 * questions: [
 *      {
 *          reponses: [],
 *          question: "",
 *          choix: []
 *      },
 *      ...
 * ]
 * The user can select and unselect a set of choices for each question and then
 * submits the answers. The toggleBravoModal then checks that all questions have
 * been answered to and computes the number of correct answers and the number of
 * points to be allocated.
 * The global logic is separated into three levels: Choice diplays a simple line
 * which is embedded into a QCMItem component (that handles the logic for a single
 * question) and the QCM class is a list of QCMItems.
 * @author Bachir Djermani bach.djermani@gmail.com
 */

const QCM = withRouter(class QCMBase extends Component {
    constructor(props) {
        super(props);
        this.state = {
            challengeId: parseInt(props.match.params.challengeId),
            userId: props.user.gaiaId,
            loading: true,
            titre: "",
            questions: [],
            showBravoModal: false,
            color: CATEGORIES_COLOR.find(({ name }) => name === "Découverte").color,
            invalidIndexes: [],
            submitted: false,
            nbOfCorrectChoices: 0
        };

        this.toggleBravoModal = this.toggleBravoModal.bind(this);
        this.onQCMItemSelection = this.onQCMItemSelection.bind(this);
    }

    async componentDidMount() {
        const { challengeId, userId } =  this.state;
        await axios.all([
            getChallengeById(challengeId),
            getUser(userId)
        ])
        .then(arr => {
            const challengeData = arr[0].data;
            const userData = arr[1].data;
            const isDone = !(userData.defisRealises.find(({ challengeId: id }) => challengeId === id) === undefined);
            if (isDone) {
                this.props.history.push(ROUTES.CHALLENGES + "/" + challengeId);
            }
            const action = { type: "UPDATE_USER", value: userData };
            this.props.dispatch(action);
            this.setState({
                ...challengeData,
                ...userData,
                medias: challengeData.medias,
                loading: false,
                choices: new Array(challengeData.questions.length).fill([])
            })
        })
        .catch(err => console.log(err));
    }

    toggleBravoModal() {
        const { questions, choices, challengeId, userId, defisEnCours: enCours, defisRealises: realises, pointsDebut, pointsBonus, pointsFin, badgeId, medias, nom, prenom, avatar, titre, region  } = this.state;
        let invalid = false;
        let invalidIndexes = [];
        choices.forEach((choice, index) => {
            if (choice.length === 0) {
                invalidIndexes.push(index);
                invalid = true;
            }
        });
        if (invalid) {
            this.setState({ invalidIndexes });
        } else {
            try {
                // looking for the date the user started the quiz
                const debut = enCours.find(({ challengeId: id }) => challengeId === id).debut;
                // removing the challenge from the list of running challenges
                const defisEnCours = enCours.filter(({ challengeId: id }) => challengeId !== id);
                
                let defisRealises = realises;
                // adding the challenge to the list of finished challenges
                defisRealises.push({ challengeId, fin: Date.now(), occurences: 1 });

                // check number of correct answers
                // handles the case of multiple correct answers (even if some correct choices have not been selected)
                let correctAnswers = 0;
                let correctChoices = 0;
                questions.forEach(({ reponses }, index) => {
                    let ok = true;
                    let answers = choices[index];
                    answers.forEach((ans) => {
                        if (!reponses.includes(ans)) {
                            ok = false;
                        } else {
                            correctChoices++;
                        }
                    })
                    if (ok) {
                        correctAnswers += 1;
                    }
                });
                const earnedPoints = pointsBonus * correctChoices;
                addChallengeToUser(userId, challengeId, titre, defisEnCours, defisRealises, pointsDebut, pointsFin, earnedPoints, [badgeId], debut ? debut : null, medias, nom, prenom, region, avatar)
                    .then(() => this.setState({ 
                        showBravoModal: !this.state.showBravoModal, 
                        nbOfCorrectChoices: correctAnswers, 
                        earnedPoints,
                        submitted: true
                    }))
                    .catch(error => {
                        console.log(error);
                        this.setState({ submitted: true });    
                    });
            } catch(e) {
                console.log(e);
            }
        }
        
    }

    onQCMItemSelection(index, responses) {
        const choices = this.state.choices;
        choices[index] = responses;
        this.setState({ choices, invalidIndexes: [] });
    }

    render() {
        console.log(this.state)
        const { challengeId, titre, questions, loading, showBravoModal, color, invalidIndexes, earnedPoints, nbOfCorrectChoices, submitted } = this.state;
        return (
            loading ?
            <Spinner /> :
            <Fragment>
                <BackTo route={ROUTES.CHALLENGES + "/" + challengeId} title={titre} />
                <div className="d-flex flex-column" style={{ color: "#5C747B", marginLeft: "5%", width: "90%" }}>
                    {questions.map((question, index) => (
                        <QCMItem key={index} data={question} index={index} onSelection={this.onQCMItemSelection} showAnswers={submitted} error={invalidIndexes.includes(index)} />
                    ))}
                </div>
                {!submitted && <div className="d-flex justify-content-end my-3" style={{ marginLeft: "5%", width: "90%" }}>
                    <button type="button" className="btn mb-2 btn-sm px-3" style={buttonStyle} onClick={this.toggleBravoModal}>Valider <Right /></button>
                </div>}
                <BravoModal nbOfQuestions={questions.length} correctAnswers={nbOfCorrectChoices} points={earnedPoints} isOpen={showBravoModal} color={color} toggle={this.toggleBravoModal} />
            </Fragment>
                
        );
    }
});

class QCMItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            index: props.index,
            question: props.data.question,
            choices: props.data.choix,
            answers: props.data.reponses,
            multi: props.data.multi,
            error: props.error,
            responses: [],
            showAnswers: false
        };

        this.onSelection = this.onSelection.bind(this);
    }

    componentDidUpdate() {
        if (this.props.showAnswers !== this.state.showAnswers) {
            this.setState({
                showAnswers: this.props.showAnswers
            });
        }
        if (this.props.error !== this.state.error) {
            this.setState({
                error: this.props.error
            });
        }
    }

    onSelection(choice) {
        let { responses, multi } = this.state;
        if (multi) {
            if (responses.includes(choice)) {
                responses = responses.filter((value) => value !== choice);
            } else {
                responses.push(choice);
            }
        } else {
            responses = [choice];
        }
        this.setState({
            responses
        }, () => this.props.onSelection(this.state.index, responses));
    }

    render() {
        const { index, question, choices, responses, answers, showAnswers, error } = this.state;
        console.log(responses);
        return (
            <div className="d-flex flex-column mt-3">
                <div style={{ color: error && "#8b424a" }}><strong>Question {index + 1} : </strong>{question}</div>
                <div className="d-flex">
                    <div className="d-flex flex-column justify-content-evenly mt-2">
                        {choices.map((choice, index) => (
                            <Choice key={index} choice={choice} index={index} selected={responses.includes(choice)} correct={showAnswers ? answers.includes(choice) : undefined} onSelection={this.onSelection} />
                        ))}
                    </div>
                </div>
                {error && <Alert color="danger" style={{ fontSize: "0.8em" }}>N'oublie pas de répondre à cette question !</Alert>}
            </div>
        );
    }
}

const choiceStyle =  {
    paddingLeft: "3vw",
    paddingTop: "1vh",
    paddingBottom: "1vh",
    marginBottom: "2%",
    boxShadow: "1px 1px 2px 1px #e2e2e2",
    width: "90vw",
    borderRadius: "7px",
    fontSize: "1em"
};

const squareStyle = {
    borderRadius: "7px",
    width: "10vw",
    height: "10vw"
}

const Choice = ({ choice, index, selected, correct, onSelection }) => (
    correct === undefined ? 
    <div className="d-flex align-items-center" style={choiceStyle} onClick={() => onSelection(choice)}>
        <div style={{ ...squareStyle, backgroundColor: selected ? "#0052A0" : "#E5E5E5" }} className="d-flex justify-content-center align-items-center">
            <span style={{ color: selected ? "white" : "#5C747B" }}>{index + 1}</span>
        </div>
        <div style={{ width: "80vw", marginLeft: "5vw", color: selected ? "#0052A0" : "#5C747B" }} className="d-flex align-items-center justify-content-start">
            <span>{choice}</span>
        </div>
    </div>
    :
    <div className="d-flex align-items-center" style={choiceStyle}>
        <div style={{ ...squareStyle, backgroundColor: selected ? (correct ? "#0052A0" : "#E71823") : (correct ? "#8AC13D" : "#E5E5E5") }} className="d-flex justify-content-center align-items-center">
            <span style={{ color: selected || correct ? "white" : "#5C747B" }}>{index + 1}</span>
        </div>
        <div style={{ width: selected || correct ? "75vw" : "80vw", marginLeft: "5vw", marginRight: selected || correct ? "5vw" : "", color: selected ? (correct ? "#0052A0" : "#E71823") : (correct ? "#8AC13D" : "#5C747B") }} className={`d-flex align-items-center justify-content-${selected || correct ? "between" : "start"}`}>
            <span>{choice}</span>
            <div className="col-1">{selected ? (correct ? <CheckIcon color={"#0052A0"} /> : <CrossIcon />) : (correct ? <CheckIcon /> : null)}</div>
        </div>
    </div>
);

const CheckIcon = (color="#8AC13D") => (
    <IconContext.Provider value={{ color }}>
        <FaCheck />
    </IconContext.Provider>
);

const CrossIcon = () => (
    <IconContext.Provider value={{ color: "#E71823" }}>
        <FaTimes />
    </IconContext.Provider>
);

const mapStateToProps = state => {
    return {
      points: state.points
    }
}

export default connect(mapStateToProps)(QCM);