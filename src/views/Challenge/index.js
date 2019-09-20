import React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from "react-redux";
import { Alert } from 'reactstrap';
import axios from 'axios';
import Resizer from 'react-image-file-resizer';
import uuid from 'uuid';

import BackTo from '../../components/backTo';
import ChallengeDetails from '../../components/challengeDetails';
import Slider from '../../components/slider';
import BravoModal from '../../components/bravoModal';
import ConfirmationModal from '../../components/confirmationModal';
import Spinner from '../../components/spinner';

import { ReactComponent as Mouse } from '../../images/mouse.svg';
import * as ROUTES from '../../constants/routes';
import { CATEGORIES_COLOR } from '../../constants/challenges';
import { UPLOAD_ASSET, ASSETS } from '../../constants/apis';

import './index.css';

import { getChallengeById, updateChallenge, addRunningChallengeToUser, addChallengeToUser } from '../../api/challenges';
import { getUser, updateUser } from '../../api/users';
import { uploadTo } from '../../api/assets';
import { getDays, getHours } from '../../utils/time';
import { dataURLtoFile, arrayBufferToBase64 } from '../../utils/image';
import { getAsset } from '../../api/assets';
import { getAvatar } from '../../utils/avatar';

const mediasStyle =  {
    paddingLeft: "3vw",
    paddingTop: "1vh",
    paddingBottom: "1vh",
    marginBottom: "2%",
    boxShadow: "1px 1px 2px 1px #e2e2e2",
    width: "90vw",
    height: "5vh",
    borderRadius: "7px",
    fontSize: "3vw"
};

class Challenge extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: props.user.gaiaId,
            points: 0,
            challengeId: parseInt(props.match.params.challengeId),
            loading: true,
            loadingEvidences: false,
            showBravoModal: false,
            showConfirmationModal: false,
            color: "",
            errorMessage: "",
            type: "",
            categorie: "",
            evidences: []
        };

        this.loadChallenge = this.loadChallenge.bind(this);
        this.loadEvidences = this.loadEvidences.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.uploadEvidence = this.uploadEvidence.bind(this);
    }

    componentDidMount() {
        this.loadChallenge();
    }

    async loadChallenge() {
        const { challengeId, userId } = this.state;
        await axios.all([
            getChallengeById(challengeId),
            getUser(userId)
        ])
        .then(arr => {
            const challengeData = arr[0].data;
            const userData = arr[1].data;
            const action = { type: "UPDATE_USER", value: userData };
            this.props.dispatch(action);
            const isSensibilisation = challengeData.type === "decouverte";
            const isRecurrent = challengeData.type.split("-")[1] === "recurrent";
            const lastOccurence = userData.defisRealises.find(({ challengeId: id }) => id === challengeId);
            let engaged = undefined;
            let engagedSensibilisation = undefined;
            let runningChallenge = undefined;
            let limitNotRespected = undefined;
            let uniqueAndDone = undefined;
            switch(challengeData.type.split("-")[0]) {
                case "engagement":
                    engaged = userData.defisEnCours.find(({ challengeId: id }) => id === challengeId) !== undefined;
                    if (engaged) {
                        runningChallenge = getDays(userData.defisEnCours.find(({ challengeId: id }) => id === challengeId).debut) <= challengeData.engagement;
                    }
                    break;
                case "ponctuel":
                    uniqueAndDone = !isRecurrent && userData.defisRealises.find(({ challengeId: id }) => id === challengeId) !== undefined;
                    engaged = true;
                    if (challengeData.limite !== undefined && lastOccurence !== undefined) {
                        limitNotRespected = getHours(lastOccurence.fin) < Math.ceil(24 / challengeData.limite);
                    }
                    break;
                default:
                    if (lastOccurence) {
                        uniqueAndDone = true;
                    }
                    engagedSensibilisation = userData.defisEnCours.find(({ challengeId: id }) => id === challengeId) !== undefined;
                    break;
            }
            console.log(challengeData)
            this.setState({
                ...challengeData,
                ...userData,
                challengeBadge: challengeData.badgeId,
                userBadges: userData.badges,
                medias: challengeData.medias,
                loading: false,
                loadingEvidences: true,
                color: CATEGORIES_COLOR.find(({ name }) => name === arr[0].data.categorie).color,
                engaged,
                runningChallenge,
                limitNotRespected,
                uniqueAndDone,
                isRecurrent,
                isSensibilisation,
                engagedSensibilisation
            }, this.loadEvidences);
        })
        .catch(errorMessage => {
            this.setState({
                loading: false,
                //errorMessage
            });
        });
    }

    loadEvidences() {
        const { preuves } = this.state;
        console.log(preuves)
        let evidences = [];
        let evidencesCalls = [];
        let avatarsCalls = [];
        preuves.forEach(({ image, avatar }) => {
            evidencesCalls.push(getAsset(image.split("/").join("_")));
            avatarsCalls.push(avatar.includes("avatars") ? getAsset(avatar.split("/").join("_")) : null);
        });
        axios.all(
            evidencesCalls.concat(avatarsCalls)
        ).then(arr => {
            console.log(arr);
            const offset = arr.length / 2;
            console.log(offset)
            for (let i = 0; i < offset; i++) {
                evidences.push({
                    image: "data:" + arr[i].data.ContentType + ";base64," + arrayBufferToBase64(arr[i].data.Body.data),
                    avatar: preuves[i].avatar === "custom" ? "data:" + arr[i + offset].data.ContentType + ";base64," + arrayBufferToBase64(arr[i + offset].data.Body.data) : getAvatar(preuves[i].avatar),
                    prenom: preuves[i].prenom
                });
            }
            this.setState({ evidences, loadingEvidences: false });
        }).catch(error => {
            console.log(error)
            this.setState({ loadingEvidences: false });
        });
    }

    handleSubmit() {
        const { challengeId, userId, titre, type, engaged, pointsDebut, pointsFin, defisEnCours: enCours, defisRealises: realises, limite, badgeId, isSensibilisation, userBadges, challengeBadge, badgeBonus, nom, prenom, region, avatar } = this.state;
        if ((type.split("-")[0] === "engagement" && !engaged) || (isSensibilisation && !engaged)) {
            enCours.push({ challengeId, debut: Date.now() });
            addRunningChallengeToUser(userId, challengeId, titre, enCours, pointsDebut, nom, prenom, region, avatar)
                .then(() => this.setState({ 
                    engaged: true, 
                    defisEnCours: enCours, 
                    runningChallenge: true 
                }, () => {
                    if (isSensibilisation) {
                        this.props.history.push(ROUTES.CHALLENGES + "/" + challengeId + "/quiz");
                    }
                }))
                .catch(err => console.log(err));
        } else if (!isSensibilisation) {
            const debut = type.split("-")[0] === "engagement" && enCours.find(({ challengeId: id }) => challengeId === id).debut;
            const defisEnCours = type.split("-")[0] === "engagement" || isSensibilisation ? enCours.filter(({ challengeId: id }) => challengeId !== id) : enCours;
            const challengeUser = realises ? realises.find(({ challengeId: id }) => id === challengeId) : undefined;
            let defisRealises = [];
            if (challengeUser) {
                challengeUser.occurences += 1;
                challengeUser.fin = Date.now();
                defisRealises = realises;
            } else {
                realises.push({ challengeId, fin: Date.now(), occurences: 1 });
                defisRealises = realises;
            }
            const badgeFound = userBadges.find(({ badgeId }) => badgeId === challengeBadge);
            let badges = [];
            if (badgeFound) {
                badgeFound.count += 1;
                badges = userBadges;
            } else {
                userBadges.push({ badgeId: challengeBadge, count: badgeBonus ? badgeBonus : 1 });
                badges = userBadges;
            }
            addChallengeToUser(userId, challengeId, titre, defisEnCours, defisRealises, pointsDebut, pointsFin, pointsFin, badges, debut ? debut : null, [], nom, prenom, region, avatar)
                .then(() => this.setState({ 
                    showBravoModal: true, 
                    earnedPoints: pointsDebut ? pointsDebut + pointsFin : pointsFin,
                    engaged: false,
                    limitNotRespected: limite !== undefined
                }, this.loadChallenge))
                .catch(error => console.log(error));
        }
    }

    triggerUpload() {
        document.getElementById("input-file").click();
    }

    uploadEvidence(event) {
        const { challengeId, userId, pointsBonus, prenom, avatar } = this.state;
        const file = event.target.files[0];

        let fileToUpload = null;

        Resizer.imageFileResizer(
            file,
            400,
            400,
            file.type.split("/")[1],
            100,
            0,
            uri => {
                fileToUpload = dataURLtoFile(uri);
                const name = uuid.v1();
                uploadTo(UPLOAD_ASSET, fileToUpload, "evidence", challengeId, name)
                    .then(() => {
                        updateUser(userId, null, pointsBonus);
                        updateChallenge(challengeId, `evidences/${challengeId}/${name}`, avatar === "custom" ? `avatars/${userId}` : avatar, prenom);
                        this.setState({ 
                            engaged: false,
                            showBravoModal: false,
                            showConfirmationModal: true
                        }, this.loadChallenge);
                    })
                    .catch((err) => console.log(err));
            },
            'base64'
        );
    }

    render() {
        const {
            loading,
            loadingEvidences,
            errorMessage,
            earnedPoints,
            titre, 
            description,
            categorie,
            difficulte,
            engagement,
            pointsDebut,
            pointsFin,
            pointsBonus,
            showBravoModal,
            showConfirmationModal,
            color,
            engaged,
            engagedSensibilisation,
            runningChallenge,
            limitNotRespected,
            limite,
            uniqueAndDone,
            isSensibilisation,
            medias,
            preuves,
            evidences,
            type,
            questions
        } = this.state;
        console.log(this.state)
        return (
            loading ?
            <Spinner />
            :
            <Fragment>
                <BackTo route={ROUTES.CHALLENGES} title={titre} />
                <div className="w-100 d-flex justify-content-center mt-4" style={{ height: "54vw" }}>
                    <ChallengeDetails 
                    color={color} 
                    categorie={categorie} 
                    difficulte={difficulte} 
                    engagement={engagement}
                    engagedSensibilisation={engagedSensibilisation}
                    runningChallenge={runningChallenge} 
                    maxPoints={type === "decouverte" ? pointsDebut + getQuizMaxPoints(questions, pointsBonus) : pointsDebut + pointsFin + pointsBonus} 
                    handleSubmit={this.handleSubmit} 
                    engaged={engaged} 
                    uniqueAndDone={uniqueAndDone} 
                    limitNotRespected={limitNotRespected} 
                    limite={limite} />
                </div>
                {!!errorMessage && 
                <div className="d-flex justify-content-center w-100 mt-2">
                    <Alert color="danger" style={{ width: "90%", lineHeight: "1em" }}>{errorMessage}</Alert>
                </div>}
                <div className="w-100 d-flex justify-content-center mt-3">
                    <div style={{ width: "90%", color: "#5C747B" }}>
                        <strong className="title mt-1">Objectifs</strong>
                        <p className="mt-2" style={{ fontSize: "0.8em" }}>{description}</p>
                    </div>
                </div>
                {isSensibilisation && medias.length > 0 && <div className="w-100 d-flex justify-content-center mt-3">
                    <div style={{ width: "90%", color: "#5C747B" }}>
                        <strong className="title mt-1">Pour aller plus loin...</strong>
                        {medias.map((media, index) => (
                            <Media {...media} key={index} />
                        ))}
                    </div>
                </div>}
                {preuves.length > 0 &&
                <div style={{ height: "26vh", width: "90%", marginLeft: "5%", marginTop: "2%", marginBottom: "20px" }}>
                    {loadingEvidences ?
                    <Spinner />
                    :
                    <Fragment>
                        <span className="title">Ils l'ont fait</span>
                        <div style={{ height: "80%", marginTop: "2%" }}>
                            <Slider component={Evidence} data={evidences} />
                        </div>
                    </Fragment>
                    }
                </div>}
                <BravoModal points={earnedPoints} isOpen={showBravoModal} toggle={() => this.setState({ showBravoModal: !showBravoModal })} color={color} triggerUpload={this.triggerUpload} uploadEvidence={this.uploadEvidence} />
                <ConfirmationModal points={pointsBonus} isOpen={showConfirmationModal} toggle={() => this.setState({ showConfirmationModal: !showConfirmationModal })} color={color} />
            </Fragment>
        );
    }
}

const getQuizMaxPoints = (questions, unit) => {
    let points = 0;
    questions.map(({ reponses }) => points += reponses.length * unit);
    return points;
}

const containerStyle = {
    paddingTop: "3vw"
};

const figureStyle = {
    height: "100%",
    boxShadow: "1px 1px 2px 1px #f3f3f3",
    borderRadius: "5%"
};

const imageStyle = {
    display: "block",
    height: "100%",
    borderRadius: "6px",
    width: "33vw",
    overflow: "hidden"
};

const Evidence = ({ data }) => {
    console.log(data);
    return (
    <div className="h-100 mr-2" style={containerStyle}>
        <div style={figureStyle}>
            <img src={data.image} alt={data.image} style={imageStyle} />
            {data.avatar ?
            <div className="author"><div><img src={data.avatar} alt="author" /></div></div>
            : 
            <span style={{ backgroundColor: "white", borderRadius: "50%", width: "10vw", height: "10vw" }}></span>
            }
        </div>
    </div>);
};

class Media extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isYoutube: props.lien.includes("youtube"),
            openMedia: false,
            ...props
        };
    }

    render() {
        const { titre, lien, openMedia, isYoutube } = this.state;
        const link = "https://www.youtube.com/embed/" + lien.split("?")[1];
        console.log(titre)
        return (
            <div className="d-flex align-items-center mt-2" style={mediasStyle}>
                <div className="col-1 pl-1"><Mouse /></div>
                <a style={{ textDecoration: "none", marginLeft: "4%", color: "#5C747B" }} target={"_blank"} href={lien}>{titre.length > 3 ? titre : "Clique ici pour en savoir plus"}</a>
                {/*<button style={{ display: openMedia && "none", marginLeft: "2%" }} onClick={() => this.setState({ openMedia: true })}>{titre.length > 3 ? titre : "Clique ici pour en savoir plus"}</button>*/}
                {/*isYoutube && <iframe style={!openMedia && { display: "none" }} title={titre} width="300" height="150" src={link} frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>*/}
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
      reducedUser: state.reducedUser
    }
}

export default connect(mapStateToProps)(withRouter(Challenge));