import React, { Component, Fragment } from 'react';
import axios from 'axios';
import { connect } from "react-redux";

import Tabs from '../../components/tabs';
import RankingList from '../../components/ranking';
import Spinner from '../../components/spinner';
import NetworkError from '../../components/networkError';

import { REGIONS } from '../../constants/onboarding';

import { getAllUsers, getUser } from '../../api/users';
import { getAsset } from '../../api/assets';
import { arrayBufferToBase64 } from '../../utils/image';
import { getAvatar } from '../../utils/avatar';

const TABS = [
    "Général",
    "Ma région",
    "Mes amis"
];

class Ranking extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: props.user.gaiaId,
            users: [],//TEST.sort((user1, user2) => (user2.points > user1.points) ? 1 : ((user1.points > user2.points) ? -1 : 0)),
            regions: [],//TEST.find(({ userId }) => userId === "baf8f410-b231-11e9-b626-7f4a4167b565").region,
            friendsIds: [],//TEST.find(({ userId }) => userId === "baf8f410-b231-11e9-b626-7f4a4167b565").amis.concat(["baf8f410-b231-11e9-b626-7f4a4167b565"]),
            activeTab: 0,
            loading: true,
            errorMessage: null,
            expand: false
        };

        this.loadAvatars = this.loadAvatars.bind(this);
        this.onTabChange = this.onTabChange.bind(this);
    }

    async componentDidMount() {
        await axios.all([
            getAllUsers(),
            getUser(this.state.userId)
        ])
        .then((arr) => {
            const data = arr[0].data;
            const action = { type: "UPDATE_POINTS", value: arr[1].data.points };
            this.props.dispatch(action);
            const users = data.sort((user1, user2) => (user2.points > user1.points) ? 1 : ((user1.points > user2.points) ? -1 : 0));
            let regions = [];
            REGIONS.forEach(({ value, label }) => regions.push({ value, label, points: 0, nbOfMembers: 0 }));
            users.forEach(({ region, points }) => {
                if (points > 0) {
                    regions.find(({ value }) => value === region).points += points;
                    regions.find(({ value }) => value === region).nbOfMembers += 1;
                }
            });
            regions.forEach((region) => region.points = region.points > 0 ? Math.ceil(region.points / region.nbOfMembers) : region.points);
            const region = users.find(({ userId }) => this.state.userId === userId).region;
            regions = regions.sort((region1, region2) => (region2.points > region1.points) ? 1 : ((region1.points > region2.points) ? -1 : 0));
            const regionIdx = regions.findIndex(({ value }) => region === value);
            this.setState({ 
                users,
                regions,
                regionIdx,
                friendsIds: arr[1].data.amis,
            }, this.loadAvatars);
            console.log(data)
        })
        .catch(errorMessage => {
            this.setState({
                loading: false,
                errorMessage
            });
        });
    }

    async loadAvatars() {
        const { users } = this.state;

        let apiCalls = [];

        users.map(({ avatar, userId }) => {
            if (avatar === "custom") {
                apiCalls.push(getAsset("avatars_" + userId))
            } else {
                apiCalls.push(null);
            }
        })
        console.log(apiCalls)

        await axios.all(
            apiCalls
        ).then((arr) => {
            arr.map(async (res, index) => {
                if (res === null) {
                    users[index].picture = getAvatar(users[index].avatar);
                } else {
                    users[index].picture = "data:" + res.data.ContentType + ";base64," + await arrayBufferToBase64(res.data.Body.data);
                }
            });
            return users;
        })
        .then((users) => {
            this.setState({
                users,
                loading: false
            });
        });
    }

    onTabChange(tab) {
        this.setState({
            activeTab: tab,
            expand: false
        });
    }

    render() {
        const { users, regions, userId, regionIdx, friendsIds, activeTab, loading, expand, errorMessage } = this.state;
        console.log(this.state);
        console.log(regions);
        return (
            loading ?
            <Spinner /> :
            errorMessage ?
            <NetworkError /> :
            <Fragment>
                <Tabs activeTab={activeTab} onTabChange={this.onTabChange} tabs={TABS} width={"70%"} />
                {activeTab === 0 ? 
                <Fragment>
                    <ContainerTab title={"Classement général"}>
                        <RankingList users={users} topLim={3} bottomLim={3} userId={userId} expand={expand} onExpand={() => this.setState({ expand: true })} />
                    </ContainerTab>
                </Fragment>
                    :
                (activeTab === 1 ?
                <Fragment>
                    <ContainerTab title={"Classement par région"}>
                        <div className="d-flex flex-column mt-3">
                            {regions.map(({ label, points }, index) => (
                                regionIdx === index ?
                                <div key={index} className="d-flex flex-column align-items-center h-25 my-1 py-1" style={{ backgroundColor: "#E5E5E5" }}>
                                    <div className="d-flex align-items-center" style={{ width: "90%" }}>
                                        <strong className="mr-2">{index + 1}.</strong>
                                        <div className="d-flex justify-content-between align-items-center" style={{ width: "90%" }}>
                                            <strong>{label}</strong>
                                            <strong style={{ fontSize: "0.7em" }}>{points} point{points > 0 ? "s" : ""}</strong>
                                        </div>
                                    </div>
                                </div>
                                :
                                index < 3 ?
                                <div key={index} className="d-flex flex-column align-items-center h-25 my-1 py-1">
                                    <div className="d-flex align-items-center" style={{ width: "90%" }}>
                                        <strong className="mr-2">{index + 1}.</strong>
                                        <div className="d-flex justify-content-between align-items-center" style={{ width: "90%" }}>
                                            <strong>{label}</strong>
                                            <strong style={{ fontSize: "0.7em" }}>{points} point{points > 0 ? "s" : ""}</strong>
                                        </div>
                                    </div>
                                </div>
                                :
                                (regionIdx <= 3 && index === regions.length - 1 ) || (regionIdx > 3 && index === regionIdx - 1) || (regionIdx > 3 && index === regionIdx + 1) ?
                                <div key={index} className="d-flex flex-column align-items-center h-25 my-2 py-1" style={{ width: "90%" }}>
                                    <div style={{ width: "90%"}}>
                                        <strong>...</strong>
                                    </div>
                                </div>
                                : null
                            ))}
                        </div>
                    </ContainerTab>
                </Fragment>
                    :
                <Fragment>
                    <ContainerTab title={"Classement de mes amis"}> 
                        <RankingList users={users.filter(({ userId: id }) => friendsIds.includes(id) || userId === id)} topLim={3} bottomLim={3} userId={userId} expand={expand} onExpand={() => this.setState({ expand: true })} />
                    </ContainerTab>
                </Fragment>
                )}
            </Fragment>
        );
    }
}

const ContainerTab = ({ children, title }) => (
    <div style={{ marginBottom: "10%", color: "#5C747B" }}>
        <strong style={{ marginLeft: "5%", color: "#5C747B" }}>{title}</strong>
        {children}
    </div>
);

const mapStateToProps = state => {
    return {
      points: state.points
    }
}

export default connect(mapStateToProps)(Ranking);