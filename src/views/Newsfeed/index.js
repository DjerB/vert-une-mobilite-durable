import React, { Component, Fragment } from 'react';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import { connect } from "react-redux";

import NewsList from '../../components/newsList';
import Spinner from '../../components/spinner';

import { getUser } from '../../api/users';
import { getEventsForUsers } from '../../api/events';
import { getAsset } from '../../api/assets';
import { arrayBufferToBase64 } from '../../utils/image';
import { getAvatar } from '../../utils/avatar';

import { NEWS_TEST } from '../../constants/test'; 
import { CHALLENGES } from '../../constants/routes';

const buttonStyle = {
    backgroundColor: "#0052A0",
    color: "white",
    borderRadius: "6px",
    width: "90vw",
    lineHeight: "30px"
};

const NewsFeed  = withRouter(class NewsFeedBase extends Component {
    constructor(props) {
        console.log(props);
        super(props);
        this.state = {
            name: "",
            points: props.reducedUser.points || 0,
            ...props.reducedUser,
            userId: props.user.gaiaId,
            news: [],
            loading: true
        };
    
        this.loadUser = this.loadUser.bind(this);
        this.loadEvents = this.loadEvents.bind(this);
        this.loadAvatars = this.loadAvatars.bind(this);
    }

    async componentDidMount() {
        this.loadUser();
    }

    async loadUser() {
        await getUser(this.state.userId)
            .then((res) => {
                console.log(res);
                const usersIds = res.data.amis.concat([this.state.userId]);
                this.setState({
                    ...res.data,
                    usersIds
                }, this.loadEvents);
                const action = { type: "UPDATE_USER", value: res.data };
                this.props.dispatch(action);
            })
            .catch(() => this.setState({ loading: false }))
    }

    async loadEvents() {
        const { usersIds } = this.state;
        console.log(usersIds)
        await getEventsForUsers(usersIds)
            .then(this.loadAvatars)
            .catch(() => this.setState({ loading: false }))
    }

    /**
     * This function and the one that follows aims at asynchronously downloading the avatars images
     * from S3 and parsing the buffer into a base64 image to be displayed
     */
    async loadAvatars({ data: news }) {
        let apiCalls = [];

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
            loading: false
        }));
    }

    render() {
        const { news, loading, userId } = this.state;
        console.log(news)
        return (
            <Fragment>
                <div className="d-flex flex-column align-items-center justify-content-around overflow-auto" style={{ color: "#5C747B" }}>
                    <button type="button" className="btn my-2 d-flex justify-content-between" onClick={() => this.props.history.push(CHALLENGES)} style={buttonStyle}>
                        <span></span>
                        <strong>Voir les défis</strong>
                        <span className="font-weight-bold">></span>
                    </button>
                    <div id="feed" className="d-flex flex-column justify-content-around align-items-center w-100">
                        <strong className="mb-3 mt-4">Ton fil d'actualité</strong>
                        {loading ?
                        <Spinner marginY={"3vh"} />
                        :
                        news.length > 0 ?
                            <NewsList news={news.length < 30 ? news : news.slice(0, 30)} userId={userId} />
                            :
                            <span className="my-2" style={{ marginLeft: "5%" }}>Tu n'as pas encore d'actualité.</span>
                        }
                    </div>
                </div>
            </Fragment>
        );
    }
});

const mapStateToProps = state => {
    return {
        reducedUser: state.reducedUser,
        reducedFriends: state.reducedFriends
    }
}

export default connect(mapStateToProps)(NewsFeed);