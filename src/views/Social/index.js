import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from "react-redux";
import axios from 'axios';

import Spinner from '../../components/spinner';

import { getUser, getAllUsers, updateUser } from '../../api/users';
import { getAsset } from '../../api/assets';
import { arrayBufferToBase64 } from '../../utils/image';
import { getAvatar } from '../../utils/avatar';
import { SOCIAL } from '../../constants/routes';

const buttonStyle = {
    backgroundColor: "#0052A0",
    color: "white",
    borderRadius: "5px"
};

/**
 * This view contains the Social tab and displays the list of an user friends and a list
 * of suggested friends to be followed.
 * @author Bachir Djermani bach.djermani@gmail.com
 */

class Social extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: props.user.gaiaId,
            points: props.reducedUser.points || 0,
            friends:  [],
            suggestedFriends: [],
            loading: true,
            loadingAvatars: false,
            search: ""
        };

        this.loadAvatars = this.loadAvatars.bind(this);
        this.onSearchChange = this.onSearchChange.bind(this);
    }

    /**
     * Load the user data and all users data as soon as the view gets mounted
     */
    async componentDidMount() {
        if (this.props.reducedFriends && this.props.reducedSuggestedFriends) {
            this.setState({
                friends: this.props.reducedFriends,
                suggestedFriends: this.props.reducedSuggestedFriends,
                loading: false,
                loadingAvatars: false
            });
        } else {
            await axios.all([
                getUser(this.state.userId),
                getAllUsers()
            ])
            .then(arr => {
                const friends = arr[1].data.filter(({ userId }) => arr[0].data.amis.includes(userId));
                const suggestedFriends = arr[1].data.filter(({ userId }) => userId !== this.state.userId && !arr[0].data.amis.includes(userId)).slice(0, 10);
                this.setState({
                    friends,
                    suggestedFriends,
                    loading: false,
                    loadingAvatars: true
                }, this.loadAvatars);
                // Update the Redux store to make sure all the user data of the whole app are up to date 
                const userAction = { type: "UPDATE_USER", value: arr[0].data };
                this.props.dispatch(userAction);
            })
            .catch(errorMessage => {
                console.log(errorMessage)
                this.setState({
                    loading: false,
                    errorMessage
                });
            });
        }
        
    }

    /**
     * This function and the one that follows aims at asynchronously downloading the avatars images
     * from S3 and parsing the buffer into a base64 image to be displayed
     */
    async loadAvatars() {
        const { friends, suggestedFriends } = this.state;

        let apiCalls = [];

        const users = friends.concat(suggestedFriends);

        users.map(({ avatar, userId }) => {
            if (avatar === "custom") {
                apiCalls.push(getAsset("avatars_" + userId))
            } else {
                apiCalls.push(null);
            }
        });

        await axios.all(
            apiCalls
        ).then((arr) => {
            arr.map(async (res, index) => {
                const isFriend = index < friends.length;
                if (res === null) {
                    if (isFriend) {
                        friends[index].picture = getAvatar(friends[index].avatar);
                    } else {
                        suggestedFriends[index - friends.length].picture = getAvatar(suggestedFriends[index - friends.length].avatar);
                    }
                } else {
                    const image = "data:" + res.data.ContentType + ";base64," + await arrayBufferToBase64(res.data.Body.data);
                    if (isFriend) {
                        friends[index].picture = image;
                    } else {
                        suggestedFriends[index - friends.length].picture = image;
                    }
                }
            });
            return { friends, suggestedFriends };
        })
        .then(({ friends, suggestedFriends }) => {
            const friendsAction = { type: "UPDATE_FRIENDS", value: friends };
            this.props.dispatch(friendsAction);
            const suggestedFriendsAction = { type: "UPDATE_SUGGESTED_FRIENDS", value: suggestedFriends };
            this.props.dispatch(suggestedFriendsAction);
            this.setState({
                friends,
                suggestedFriends,
                loadingAvatars: false
            });
        });
    }

    onSearchChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    render() {
        const { friends, suggestedFriends, loading, loadingAvatars, search } = this.state;
        let filteredFriends = friends;
        let filteredSuggestedFriends = suggestedFriends;
        if (search.length > 0) {
            filteredFriends = friends.filter(({ nom, prenom }) => prenom.toLowerCase().includes(search.toLowerCase()) || nom.toLowerCase().includes(search.toLowerCase()));
            filteredSuggestedFriends = suggestedFriends.filter(({ nom, prenom }) => prenom.toLowerCase().includes(search.toLowerCase()) || nom.toLowerCase().includes(search.toLowerCase()));
        }
        return (
            loading ?
            <Spinner /> :
            <div className="d-flex flex-column align-items-center overflow-auto" style={{ height: "90%" }}>
                <div className="d-flex flex-column align-items-center" style={{ width: "90vw", color: "#5C747B"}}>
                    <input type="text" className="form-control my-3" id="friendSearch" name="search" value={search} onChange={this.onSearchChange} aria-describedby="friendSearch" placeholder="Rechercher un(e) gazier(e)..." />
                    <div className="d-flex flex-column justify-content-around w-100">
                        <div className="d-flex justify-content-start">
                            <strong className="my-2">{friends.length} gazier(e)s</strong>
                        </div>
                        {loadingAvatars ?
                        <Spinner marginY={"3vh"} /> :
                        filteredFriends.length > 0 ?
                        filteredFriends.map(({ prenom, points, userId: friendId, picture }, index) => (
                            <div key={index} className="d-flex align-items-center mb-3" onClick={() => this.props.history.push(SOCIAL + "/" + friendId)}>
                                {picture ?
                                <div className="col-3"><img height={"50vh"} width={"50vh"} style={{ borderRadius: "50%" }} src={picture} alt="portrait"  /></div>
                                : <div className="col-3"><span className="col-3" style={{ backgroundColor: "white", borderRadius: "50%", width: "11vw", height: "11vw" }}></span></div>}
                                <div className="col-5 d-flex flex-column justify-content-center align-items-start" style={{ fontSize: "0.8em" }}>
                                    <strong>{prenom}</strong>
                                    <span>{points ? points : 0} point{points > 0 ? "s" : ""}</span>
                                </div>
                                <button type="button" className="btn btn-sm col-4" style={buttonStyle}>Suivi</button>
                            </div>
                        ))
                        :
                        <span>Aucun gazier ne correspond à ta recherche</span>
                        }
                    </div>
                    <div className="d-flex flex-column justify-content-around w-100">
                        <div className="d-flex justify-content-start">
                            <strong className="my-2">Vous connaissez peut-être...</strong>
                        </div>
                        {loadingAvatars ?
                        <Spinner marginY={"3vh"} /> :
                        filteredSuggestedFriends.length > 0 ?
                        filteredSuggestedFriends.map(({ prenom, points, userId: friendId, picture }, index) => (
                            <div key={index} className="d-flex align-items-center mb-3" onClick={() => this.props.history.push(SOCIAL + "/" + friendId)}>
                                {picture ? 
                                <div className="col-3"><img height={"50vh"} width={"50vh"} style={{ borderRadius: "50%" }} src={picture} alt="portrait"  /></div>
                                : <div className="col-3"><span style={{ backgroundColor: "white", borderRadius: "50%", width: "11vw", height: "11vw" }}></span></div>}
                                <div className="col-5 d-flex flex-column justify-content-center align-items-start" style={{ fontSize: "0.8em" }}>
                                    <strong>{prenom}</strong>
                                    <span>{points ? points : 0} point{points > 0 ? "s" : ""}</span>
                                </div>
                                <button type="button" className="btn btn-sm col-4" style={buttonStyle}>+ Suivre</button>
                            </div>
                        ))
                        :
                        <span>Aucun gazier ne correspond à ta recherche</span>
                        }
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        reducedUser: state.reducedUser,
        reducedFriends: state.reducedFriends,
        reducedSuggestedFriends: state.reducedSuggestedFriends
    }
}

export default connect(mapStateToProps)(withRouter(Social));