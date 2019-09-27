import React, { Component, Fragment } from 'react';
import { Alert } from 'react-bootstrap';
import Resizer from 'react-image-file-resizer';
import { withRouter, Redirect } from 'react-router-dom';

import './style.css';

import Dots from './dots';
import RegistrationForm from './registrationForm';
import AvatarModal from '../../components/avatarModal';
import Spinner from '../../components/spinner';

import grdf from '../../images/grdf.png';
import circle from '../../images/onboarding/circle.svg';
import { ReactComponent as Camera } from '../../images/onboarding/camera.svg';
import { ReactComponent as RightArrow } from '../../images/right-arrow.svg';
import { ONBOARDING_PAGES } from '../../constants/onboarding';
import { UPLOAD_ASSET } from '../../constants/apis';
import { NEWSFEED, LANDING } from '../../constants/routes';

import { uploadTo, getAsset } from '../../api/assets';
import { createUser, getUser } from '../../api/users';
import { addToLocalStorage } from '../../utils/localStorage';
import { arrayBufferToBase64, dataURLtoFile } from '../../utils/image';
import { getAvatar } from '../../utils/avatar';
import { connect } from 'react-redux';

const bgStyle = {
    backgroundColor: "#F2FCFF"
};

const buttonStyle = {
    backgroundColor: "#0052A0",
    color: "white",
    borderRadius: "10px"
};

const getBase64 = (file) => {
    return new Promise((resolve,reject) => {
       const reader = new FileReader();
       reader.onload = () => resolve(reader.result);
       reader.onerror = error => reject(error);
       reader.readAsDataURL(file);
    });
}

const OnBoardingPage = withRouter(class OnBoarding extends Component {
    constructor(props) {
        console.log(props);
        super(props);
        this.state = {
            isAuthenticated: props.isAuthenticated,
            activePage: 0,
            nbOfPages: ONBOARDING_PAGES.length + 1,
            name: props.user ? props.user.nom : "", //props.user.family_name
            firstName: props.user ? props.user.prenom : "", //props.user.given_name
            region: "",
            gaiaId: props.user ? props.user.gaiaId : "",
            avatar: null,
            avatarName: null,
            showAvatarModal: false,
            imageToUpload: null,
            errors: {},
            error: "",
            loading: true,
            loadingPage: false
        };

        this.onPageChange = this.onPageChange.bind(this);
        this.onFormChange = this.onFormChange.bind(this);
        this.loadAvatar = this.loadAvatar.bind(this);
        this.loadLocalAvatar = this.loadLocalAvatar.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    componentDidMount() {
        const user = this.props.getIdToken();
        this.setState({
            gaiaId: user ? user.gaiaId : "",
            firstName: user ? user.prenom : "",
            name: user ? user.nom : ""
        }, async () => {
            await getUser(this.state.gaiaId)
            .then(async ({ data }) => {
                let avatar = null;
                if (data.avatar === "custom") {
                    await getAsset("avatars_" + this.state.gaiaId)
                        .then(async (res) => avatar = "data:" + res.data.ContentType + ";base64," + await arrayBufferToBase64(res.data.Body.data));
                } else {
                    avatar = getAvatar(data.avatar);
                }
                return { user: data, avatar };
            })
            .then(({ user, avatar }) => {
                addToLocalStorage("hymAvatar", avatar);
                addToLocalStorage("hymPoints", user.points);
                const avatarAction = { type: "UPDATE_AVATAR", value: avatar };
                this.props.dispatch(avatarAction);
                const userAction = { type: "UPDATE_USER", value: user };
                this.props.dispatch(userAction);
                this.setState({ loading: false }, () => this.props.history.push(NEWSFEED));
            })
            .catch((err) => {
                this.setState({ loading: false });
            });
        })
    }

    onPageChange() {
        const { activePage, nbOfPages } = this.state;
        this.setState({
            loadingPage: true,
            activePage: activePage < nbOfPages - 1 ? activePage + 1 : activePage
        }, () => setTimeout(() => this.setState({
            loadingPage: false
        })), 500);
    }

    onFormChange(event) {
        const { errors } = this.state;
        errors[event.target.name] = null;
        this.setState({
            [event.target.name]: event.target.value,
            errors
        });
    }

    triggerLoad() {
        document.getElementById("input-file").click();
    }

    loadAvatar(event) {
        const file = event.target.files[0];
        console.log(file)
        if (file) {
            var reader = new FileReader();
            
            reader.onload = function(e) {
              document.getElementById("user-avatar").src = e.target.result;
            }
            
            reader.readAsDataURL(file);
        }
        const { errors } = this.state;
        errors["avatar"] = null;
        this.setState({ 
            showAvatarModal: false,
            imageToUpload: file,
            avatar: null,
            avatarName: null,
            errors
        });
    }

    loadLocalAvatar(name, avatar) {
        console.log(avatar)
        addToLocalStorage("hymAvatar", avatar);
        const avatarAction = { type: "UPDATE_AVATAR", value: avatar };
        this.props.dispatch(avatarAction);
        const { errors } = this.state;
        errors["avatar"] = null;
        this.setState({ 
            avatarName: name,
            avatar, 
            showAvatarModal: false,
            imageToUpload: null,
            errors
        });
    }

    uploadAvatar() {
        const { gaiaId, imageToUpload } = this.state;

        let fileToUpload = null;

        Resizer.imageFileResizer(
            imageToUpload,
            400,
            400,
            imageToUpload.type.split("/")[1],
            100,
            0,
            uri => {
                fileToUpload = dataURLtoFile(uri);
                uploadTo(UPLOAD_ASSET, fileToUpload, gaiaId, gaiaId)
                    .then(() => {
                        getBase64(fileToUpload).then(base64 => {
                            addToLocalStorage("hymAvatar", base64);
                            const avatarAction = { type: "UPDATE_AVATAR", value: base64 };
                            this.props.dispatch(avatarAction);
                        });
                        this.props.history.push(NEWSFEED);
                    })
                    .catch(() => this.setState({ error: "Une erreur est survenue. Vérifie que toutes tes informations sont correctes."}));
            },
            'base64'
        );
    }

    onSubmit(event) {
        const { name, firstName, region, gaiaId, avatarName, avatar, imageToUpload } = this.state;
        event.preventDefault();
        let invalid = false;
        let errors = {};
        if (name === "") {
            invalid = true;
            errors["name"] = true;
        }
        if (firstName === "") {
            invalid = true;
            errors["firstName"] = true;
        }
        if (region === "") {
            invalid = true;
            errors["region"] = true;
        }
        if (gaiaId === "") {
            invalid = true;
            errors["gaiaId"] = true;
        }
        if (avatar === null && imageToUpload === null) {
            invalid = true;
            errors["avatar"] = true;
        }

        if (invalid) {
            this.setState({ errors });
        } else {
            if (imageToUpload) {
                createUser(name, firstName, region, gaiaId, null)
                    .then(() => this.uploadAvatar())
                    .catch(e => console.log(e))
            } else {
                createUser(name, firstName, region, gaiaId, avatarName)
                    .then(({ data }) => {
                        const userAction = { type: "UPDATE_USER", value: data };
                        this.props.dispatch(userAction);
                        this.props.history.push(NEWSFEED);
                    })
                    .catch(() => this.setState({ error: "Une erreur est survenue. Vérifie que toutes tes informations sont correctes."}));
            }
        }
    }

    renderBoardingInfoPage() {
        const { activePage, nbOfPages, loadingPage, name, firstName, region, gaiaId, avatar, errors, error } = this.state;
        if (activePage < nbOfPages - 1) {
            const Logo = ONBOARDING_PAGES[activePage].logo;
            return (
                <Fragment>
                    <div className={`d-flex flex-column align-items-center justify-content-around h-50 w-75 text-center ${loadingPage ? "boarding-fade-in-hide" : "boarding-fade-in"}`}>
                        <Logo />
                        <div className="d-flex flex-column justify-content-between">
                            <strong>
                                {ONBOARDING_PAGES[activePage].title}
                            </strong>
                            <p className="mt-2">
                                {ONBOARDING_PAGES[activePage].text}
                            </p>
                        </div>
                    </div>
                </Fragment>
            );
        } else {
            return (
                <div className={`d-flex flex-column justify-content-around align-items-center w-100 ${loadingPage ? "boarding-fade-in-hide" : "boarding-fade-in"}`} style={{ height: "90%" }}>
                    <h6 className="font-weight-bold mb-3">Parle-moi un peu plus de toi :)</h6>
                    <div className="d-flex flex-column align-items-center">
                        <div onClick={() => this.setState({ showAvatarModal: true })}>
                            <img src={avatar ? avatar : circle} id="user-avatar" style={errors["avatar"] && { padding: "1px", border: "thin solid #f65f53" }} alt="avatar" width="90vw" height="90vw" />
                            <div className="camera"><div><Camera /></div></div>
                        </div>
                        <RegistrationForm name={name} firstName={firstName} region={region} gaiaId={gaiaId} onChange={this.onFormChange} errors={errors} />
                        {/*!!error && <Alert color="danger">{error}</Alert>*/}
                    </div>
                </div>
            );
        }
    }

    render() {
        const { activePage, nbOfPages, isAuthenticated, showAvatarModal, loading } = this.state;
        const buttonText = nbOfPages - 1 === activePage ? "C'est parti !" : <span>Suivant <RightArrow className="ml-2" /></span>;
        /*if (!this.props.user) {
            //return <Redirect to={LANDING} />;
        }*/
        return (
            loading ?
            <Spinner />
            :
            <div className="d-flex flex-column h-100 align-items-center justify-content-around" style={bgStyle}>
                <img src={grdf} alt="logo-grdf" width={"20%"} />
                <div className="w-100 d-flex justify-content-center align-items-center" style={{ height: activePage === nbOfPages - 1 ? "" : "60%", color: "#5C747B" }}>
                    {this.renderBoardingInfoPage()}
                </div>
                <div className="d-flex flex-column align-items-center justify-content-between" style={{ height: "10%", width: "40%" }}>
                    {activePage === nbOfPages - 1 ?
                        <button type="button" className="btn mb-2 w-100" onClick={this.onSubmit} style={buttonStyle}>{buttonText}</button>
                        :
                        <button type="button" className="btn mb-2 w-100" onClick={this.onPageChange} style={buttonStyle}>{buttonText}</button>
                    }
                    <Dots nbOfDots={nbOfPages} activeDot={activePage} />
                </div>
                <AvatarModal show={showAvatarModal} onHide={() => this.setState({ showAvatarModal: false })} triggerLoad={this.triggerLoad} loadAvatar={this.loadAvatar} loadLocalAvatar={this.loadLocalAvatar} />
            </div>
        );
    }
});

const mapStateToProps = state => {
    return {
        reducedAvatar: state.reducedAvatar,
        reducedUser: state.reducedUser
    }
};

export default connect(mapStateToProps)(OnBoardingPage);