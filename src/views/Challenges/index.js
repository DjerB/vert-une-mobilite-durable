import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";
import axios from 'axios';

import Slider from '../../components/slider';
import ChallengeCard from '../../components/challengeCard';
import Tabs from '../../components/tabs';
import Spinner from '../../components/spinner';

import { CATEGORIES } from '../../constants/challenges';

import { getAllChallenges, getChallengesForUser } from '../../api/challenges';
import { getUser } from '../../api/users';
import { checkPoints } from '../../utils/localStorage';

const TABS = [
    "Tous les défis",
    "Mes défis"
];

class Challenges extends Component {
    constructor(props) {
        super(props);
        console.log(props);
        this.state = {
            userId: props.user.gaiaId,
            challenges: [],
            unfinishedUserChallenges: [],
            finishedUserChallenges: [],
            activeTab: 0,
            loading: true
        };

        this.onTabChange = this.onTabChange.bind(this);
    }

    async componentDidMount() {
        await axios.all([
            getAllChallenges(),
            getUser(this.state.userId)
        ])
        .then(arr => {
            console.log(arr)
            let challenges = arr[0].data;
            console.log(challenges)
            const finishedUserChallengesIds = [];
            const unfinishedUserChallengesIds = [];
            arr[1].data.defisEnCours.map(({ challengeId }) => unfinishedUserChallengesIds.push(challengeId));
            arr[1].data.defisRealises.map(({ challengeId }) => finishedUserChallengesIds.push(challengeId));
            console.log(challenges)
            console.log(arr[0].data);
            this.setState({
                allChallenges: challenges,
                challenges: challenges.filter(({ type, challengeId }) => !((type === "sensibilisation" || type.split("-")[1] ===  "unique") && finishedUserChallengesIds.includes(challengeId))),
                finishedUserChallenges: arr[0].data.filter(({ challengeId }) => finishedUserChallengesIds.includes(challengeId)),
                unfinishedUserChallenges: arr[0].data.filter(({ challengeId }) => unfinishedUserChallengesIds.includes(challengeId)),
                loading: false
            });
            const action = { type: "UPDATE_USER", value: arr[1].data };
            this.props.dispatch(action);
        })
        .catch(errorMessage => {
            this.setState({
                loading: false,
                errorMessage
            });
        });
    }

    onTabChange(tab) {
        this.setState({
            activeTab: tab
        });
    }

    render() {
        const { allChallenges, challenges, finishedUserChallenges, unfinishedUserChallenges, activeTab, loading } = this.state;
        console.log(this.state)
        return (
            loading ?
            <Spinner /> :
            <Fragment>
                <Tabs activeTab={activeTab} onTabChange={this.onTabChange} tabs={TABS} width={"60%"} />
                {activeTab === 0 ? 
                <Fragment>
                    <div style={{ height: "50vw", marginBottom: "10%" }}>
                        <strong style={{ marginLeft: "5%", color: "#5C747B" }}>Tous les défis</strong>
                        <div className="mt-2" style={{ height: "90%" }}>
                            <Slider component={ChallengeCard} data={allChallenges} />
                        </div>
                    </div>
                    <div style={{ height: "50vw", marginBottom: "10%" }}>
                        <strong style={{ marginLeft: "5%", color: "#5C747B" }}>Les défis mis en avant</strong>
                        <div className="mt-2" style={{ height: "90%" }}>
                            <Slider component={ChallengeCard} data={challenges.slice(0, 5)} />
                        </div>
                    </div>
                    {CATEGORIES.map((cat, index) => {
                        const filteredChallenges = challenges.filter(({ categorie }) => categorie === cat);
                        if (filteredChallenges.length === 0) {
                            return null;
                        }
                        return (
                            <div key={index} style={{ height: "50vw", marginBottom: "10%" }}>
                                <strong style={{ marginLeft: "5%", color: "#5C747B" }}>Les défis {cat}</strong>
                                <div className="mt-2" style={{ height: "90%" }}>
                                    <Slider component={ChallengeCard} data={filteredChallenges} />
                                </div>
                            </div>
                        );
                    })}
                </Fragment>
                    :
                    <Fragment>
                        <div style={{ height: unfinishedUserChallenges.length > 0 ? "50vw" : "6%", marginBottom: "10%" }}>
                            <strong style={{ marginLeft: "5%", color: "#5C747B" }}>Mes défis en cours</strong>
                            <div className="mt-2" style={{ height: "90%" }}>
                                {unfinishedUserChallenges.length > 0 ?
                                <Slider component={ChallengeCard} data={unfinishedUserChallenges} />
                                :
                                <div className="d-flex justify-content-start">
                                    <span className="my-2" style={{ marginLeft: "5%" }}>Tu n'as aucun défi en cours.</span>
                                </div>
                                }
                            </div>
                        </div>
                        <div style={{ height: finishedUserChallenges.length > 0 ? "50vw" : "6%", marginBottom: "10%" }}>
                            <strong style={{ marginLeft: "5%", color: "#5C747B" }}>Mes défis réalisés</strong>
                            <div className="mt-2" style={{ height: "90%" }}>
                                {finishedUserChallenges.length > 0 ?
                                <Slider component={ChallengeCard} data={finishedUserChallenges} />
                                :
                                <div className="d-flex justify-content-start">
                                    <span className="my-2" style={{ marginLeft: "5%" }}>Tu n'as réalisé encore aucun défi.</span>
                                </div>
                                }
                            </div>
                        </div>
                    </Fragment>
                }
            </Fragment>
        );
    }
}

const mapStateToProps = state => {
    return {
      reducedUser: state.reducedUser
    }
}

export default connect(mapStateToProps)(Challenges);