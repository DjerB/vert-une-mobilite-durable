import React, { Component, Fragment } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from "react-redux";
import axios from 'axios';

import { ReactComponent as Medal } from '../../images/profile/medal.svg';
import { ReactComponent as LeftArrow } from '../../images/left-arrow.svg'

import Slider from '../../components/slider';
import NewsList from '../../components/newsList';
import Spinner from '../../components/spinner';
import BigUserBar from '../../components/bigUserBar';

import { getAllUsers, getUser, updateUser } from '../../api/users';
import { getAvatar } from '../../utils/avatar';
import { arrayBufferToBase64 } from '../../utils/image';

import { SOCIAL, PROFILE } from '../../constants/routes';
import { getAllBadges } from '../../api/badges';
import { getAsset } from '../../api/assets';
import { getEventsForUsers } from '../../api/events';

const buttonStyle = {
    backgroundColor: "#0052A0",
    color: "white",
    borderRadius: "5px"
};

const validationButtonStyle = {
    backgroundColor: "white",
    color: "#6EC8DE",
    borderRadius: "5px"
};

class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: props.user.gaiaId,
            profileId: props.match.params.userId || props.user.gaiaId,
            firstName: "",
            points: 0,
            isMe: !props.location.pathname.includes("social"),
            toAdd: false, 
            friends: [],
            loading: true,
            badges: [],
            news: []
        };

        this.loadData = this.loadData.bind(this);
        this.loadEvents = this.loadEvents.bind(this);
        this.loadEventsAvatars = this.loadEventsAvatars.bind(this);
        this.loadAvatars = this.loadAvatars.bind(this);
        this.addFriend = this.addFriend.bind(this);
    }

    componentDidMount() {
        this.loadData();
    }

    componentWillReceiveProps(props) {
        const profileId =  props.match.params.userId || props.user.gaiaId;
        if (this.state.profileId !== profileId) {
            if (this.state.userId === profileId) {
                props.history.push(PROFILE);
            } else {
                this.setState({
                    profileId,
                    isMe: false,
                    loading: true,
                    friends: [],
                    badges: [],
                    news: []
                }, this.loadData);
            }
        }
    }


    async loadData() {
        await axios.all([
            getUser(this.state.profileId),
            getAllUsers(),
            getAllBadges(),
            getUser(this.state.userId)
        ])
        .then(arr => {
            console.log(arr)
            this.setState({
                name: arr[0].data.nom,
                avatar: arr[0].data.avatar,
                firstName: arr[0].data.prenom,
                points: arr[0].data.points,
                friends: arr[1].data.filter(({ userId }) => arr[0].data.amis.includes(userId)),
                badges: arr[2].data.filter(({ badgeId }) => arr[0].data.badges.includes(badgeId)),
                toAdd: this.state.userId !== this.state.profileId ? !arr[3].data.amis.includes(this.state.profileId) : false,
                loading: false,
                loadingNews: true
            }, this.loadAvatars);
            const action = { type: "UPDATE_USER", value: arr[0].data };
            this.props.dispatch(action);
        })
        .then(() => this.loadEvents())
        .catch(errorMessage => {
            this.setState({
                loading: false,
                errorMessage
            });
        });
    }

    async loadAvatars() {
        const { friends, profileId, avatar } = this.state;
        let picture = null;
        let apiCalls = [avatar === "custom" ? getAsset("avatars_" + profileId) : null];

        friends.map(({ avatar, userId }) => {
            if (avatar === "custom") {
                apiCalls.push(getAsset("avatars_" + userId))
            } else {
                apiCalls.push(null);
            }
        })
        console.log(friends)

        await axios.all(
            apiCalls
        ).then((arr) => {
            arr.map(async (res, index) => {
                if (index === 0) {
                    if (res === null) {
                        picture = getAvatar(avatar);
                    } else {
                        picture = "data:" + res.data.ContentType + ";base64," + await arrayBufferToBase64(res.data.Body.data);
                    }
                } else {
                    if (res === null) {
                        friends[index - 1].picture = getAvatar(friends[index - 1].avatar);
                    } else {
                        friends[index - 1].picture = "data:" + res.data.ContentType + ";base64," + await arrayBufferToBase64(res.data.Body.data);
                    }
                }
            });
            /*const friendsAction = { type: "UPDATE_FRIENDS", value: friends };
            this.props.dispatch(friendsAction);
            if (friends.length !== this.props.reducedFriends) {
                let friendsIds = [];
                friends.map(({ userId }) => friendsIds.push(userId));
                const suggestedFriends = this.props.reducedSuggestedFriends.filter(({ userId }) => !friendsIds.includes(userId));
                const suggestedFriendsAction = { type: "UPDATE_SUGGESTED_FRIENDS", value: suggestedFriends };
                this.props.dispatch(suggestedFriendsAction);
            }*/
            
            return friends;
        })
        .then((friends) => this.setState({
            friends,
            picture
        }));
    }

    async loadEvents() {
        const { friends, profileId } = this.state;
        let usersIds = [profileId];
        friends.map(({ userId }) => usersIds.push(userId));
        console.log(usersIds)
        await getEventsForUsers(usersIds)
            .then(this.loadEventsAvatars)
            .catch(() => this.setState({ loadingNews: false }))
    }

    /**
     * This function and the one that follows aims at asynchronously downloading the avatars images
     * from S3 and parsing the buffer into a base64 image to be displayed
     */
    async loadEventsAvatars({ data: news }) {
        let apiCalls = [];

        news = news.slice(0, 30);

        news.map(({ avatar, userId }) => {
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
                    news[index].image = getAvatar(news[index].avatar);
                } else {
                    news[index].image = "data:" + res.data.ContentType + ";base64," + await arrayBufferToBase64(res.data.Body.data);
                }
            });
            return news;
        })
        .then((news) => this.setState({
            news,
            loadingNews: false
        }));
    }

    addFriend() {
        const { profileId, userId } = this.state;
        updateUser(userId, profileId, 0)
            .then(() => {
            const newFriend = this.props.reducedSuggestedFriends.find(({ userId }) => userId === profileId);
            let friends = this.props.reducedFriends;
            friends.push(newFriend);
            const suggestedFriends = this.props.reducedSuggestedFriends.filter(({ userId }) => userId !== profileId);
            const suggestedFriendsAction = { type: "UPDATE_SUGGESTED_FRIENDS", value: suggestedFriends };
            this.props.dispatch(suggestedFriendsAction);
            const friendsAction = { type: "UPDATE_FRIENDS", value: friends };
            this.props.dispatch(friendsAction);
            this.setState({ 
                toAdd: false,
                showValidation: true
            }, () => setTimeout(() => this.setState({ showValidation: false }), 2000))}
            )
            .catch((error) => console.log(error));
    }

    render() {
        const { loading, friends, badges, isMe, firstName, points, toAdd, showValidation, picture, news, loadingNews, userId } = this.state;
        console.log(this.props)
        return (
            loading ?
            <Spinner /> :
            <Fragment>
                {!isMe && <div style={{ position: "fixed", left: "5%", top: "1%" }}><Link to={SOCIAL}><LeftArrow /></Link></div>}
                {!isMe && <BigUserBar name={firstName} image={picture} userPoints={points} />}
                {toAdd &&
                <div className="d-flex justify-content-center">
                    <button type="button" className="btn btn-sm col-4" style={buttonStyle} onClick={this.addFriend}>+ Suivre</button>
                </div>}
                {isMe &&
                <div className="d-flex justify-content-center">
                    <button type="button" className="btn btn-sm col-4" style={buttonStyle} onClick={this.props.logout}>Déconnexion</button>
                </div>}
                {showValidation &&
                <div className="d-flex justify-content-center">
                    <button type="button" className="btn btn-sm col-4" style={validationButtonStyle}>Suivi</button>
                </div>}
                <div className="d-flex flex-column align-items-center" style={{ color: "#5C747B" }}>
                    <ContainerRow title={"Gazier(e)s"} height={friends.length > 0 ? "22vh" : "8vh"} titleHeight={"2vh"}>
                        {friends.length > 0 ?
                            <Slider component={ProfileCard} data={friends} height={"17vh"} marginTop={"1vh"} />
                            :
                            <div className="d-flex justify-content-start">
                                <span className="my-2" style={{ marginLeft: "5%" }}>{isMe ? "Tu n'as" : firstName + " n'a" } pas encore de gazier.</span>
                            </div>
                        }
                    </ContainerRow>
                    <ContainerRow title={"Badges"} height={badges.length > 0 ? "22vh" : "8vh"} titleHeight={"2vh"}>
                        {badges.length > 0 ?
                            <Slider component={MedalCard} data={badges} height={"17vh"} marginTop={"1vh"} />
                            :
                            <div className="d-flex justify-content-start">
                                <span className="my-2" style={{ marginLeft: "5%" }}>{isMe ? "Tu n'as" : firstName + " n'a" } pas encore de badge.</span>
                            </div>
                        }
                    </ContainerRow>
                    <ContainerRow title={"Fil d'actualité"}>
                        {   
                            loadingNews ?
                            <Spinner marginY={"3vh"} />
                            :
                            news.length > 0 ?
                            <div style={{ paddingLeft: "5%", paddingTop: "3vh" }}>
                                <NewsList news={isMe && news.length >= 5 ? news : news.slice(0, 5)} userId={userId} style={{ paddingLeft: "5%" }} />
                            </div>
                            :
                            <div className="d-flex justify-content-start">
                                <span className="my-2" style={{ marginLeft: "5%" }}>{isMe ? "Tu n'as" : firstName + " n'a" } pas encore d'actualité.</span>
                            </div>
                        }
                    </ContainerRow>
                </div>
            </Fragment>
        );
    }
}

const ContainerRow = ({ children, title, height, titleHeight }) => (
    <div className="d-flex flex-column justify-content-between w-100 mt-2" style={{ height: height }}>
        <div className="d-flex justify-content-start" style={{ height: titleHeight ? titleHeight : "10%" }}>
            <strong style={{ marginLeft: "5%" }}>{title}</strong>
        </div>
        {children}
    </div>
);

const cardStyle = {
    borderRadius: "5%",
    marginLeft: "5%",
    minWidth: "30vw",
    boxShadow: "1px 1px 5px 0px #d6d6d6",
    fontSize: "0.8em",
    height: "100%"
};

const MedalCard = ({ data: { nom }}) => (
    <div className="d-flex flex-column align-items-center justify-content-center text-center" style={cardStyle}>
        <Medal className="medal" width={"20vw"} />
        <strong>{nom}</strong>
    </div>
);

const ProfileCard = withRouter(({ data: { prenom, points, userId, picture }, history }) => (
    <div className="d-flex flex-column align-items-center justify-content-center" style={cardStyle} onClick={() => history.push(SOCIAL + "/" + userId)}>
        <div className="d-flex justify-content-center" style={{ height: "8vh" }}>
            {picture ? 
            <img src={picture} alt="portrait" style={{ height: "8vh", width: "8vh", borderRadius: "50%" }} />
            : <span style={{ backgroundColor: "#eaeaea", borderRadius: "50%", width: "8vh", height: "8vh" }}></span>}
        </div>
        <div className="d-flex flex-column align-items-center">
            <strong>{prenom}</strong>
            <span className="d-flex">{points ? points : 230} point{points > 0 ? "s" : ""}</span>
        </div>
    </div>
));

const mapStateToProps = state => {
    return {
        reducedUser: state.reducedUser,
        reducedAvatar: state.reducedAvatar,
        reducedSuggestedFriends: state.reducedSuggestedFriends,
        reducedFriends: state.reducedFriends
    }
}

export default connect(mapStateToProps)(Profile);