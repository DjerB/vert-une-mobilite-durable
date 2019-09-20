import React from 'react';
import { connect } from 'react-redux';

import { getAsset } from '../api/assets';
import { arrayBufferToBase64 } from '../utils/image';

/**
 * @image image might come from different sources. We first check if it is given by the parent component.
 * If not, it must be stored in Redux (the current user avatar).
 * @points points might come from the parent component (for Friend profile) or from the Redux store used
 * to store the current user number of points.
 * @name the name is either given by the parent or by the Okta HOC (via App component)
 * @return the top largee user bar component shared by multiple screens
 */
const BigUserBar = (props) => {
    console.log(props)
    let image = props.image !== undefined ? 
        props.image :
        props.reducedAvatar ? props.reducedAvatar : localStorage.getItem("hymAvatar");
    const points = props.points !== undefined ?
        props.points :
        props.reducedUser.points !== undefined ? 
        props.reducedUser.points : parseInt(localStorage.getItem("hymPoints"));
    const name = props.name !== undefined ?
        props.name : props.user.prenom; //props.user.given_name
    if (image === null && props.user) {
        getAsset("avatars_" + props.user.gaiaId)
        .then(async res => {
            image = "data:" + res.data.ContentType + ";base64," + await arrayBufferToBase64(res.data.Body.data);
            const avatarAction = { type: "UPDATE_AVATAR", value: image };
            props.dispatch(avatarAction);
        })
        .catch((err) => console.log(err));
    }
    return (
    <div className="d-flex flex-column align-items-center justify-content-around" id="halfBackground">
        <div id="avatar" className="d-flex flex-column align-items-center" style={{ marginTop: "8vh", height: "auto", width: "auto" }}>
            {image ?
            <img src={image} id="user-avatar" alt="portrait" width={"100vw"} height={"100vw"} style={{ backgroundColor: "white", borderRadius: "50%" }} />
            :
            <span style={{ backgroundColor: "white", borderRadius: "50%", width: "27vw", height: "27vw" }}></span>
            }
            <strong>{name}</strong>
            <span>{points} point{points > 0 ? "s" : ""}</span>
        </div>
    </div>);
};

const mapStateToProps = state => {
    return {
        reducedUser: state.reducedUser,
        reducedAvatar: state.reducedAvatar
    }
}

export default connect(mapStateToProps)(BigUserBar);