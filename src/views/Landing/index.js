import React from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import { Link, withRouter, Redirect } from 'react-router-dom';
import { Modal } from 'react-bootstrap';

import './index.css';
import { ReactComponent as HYMLogo } from '../../images/landing/hym-logo.svg';
import grdfLogo from '../../images/landing/grdf-logo.png';
import { ReactComponent as LeftArrow} from '../../images/left-arrow.svg';
import { ReactComponent as RightArrow} from '../../images/right-arrow.svg';

import * as ROUTES from '../../constants/routes';
import { RGPD_TEXT } from '../../constants/rgpd';

const buttonStyle = {
    backgroundColor: "#0052A0",
    color: "white",
    borderRadius: "10px"
};

const rgpdLinkStyle = {
    color: "white",
    fontSize: "0.7em",
    textDecoration: "underline",
    border: "none",
    backgroundColor: "transparent"
};

const Landing = ({ isAuthenticated, login }) => {
    const [state, setState] = React.useState({
        checkedConditions: false
    });
    console.log("landing")
    const [modalShow, setModalShow] = React.useState(false);
    const handleChange = name => event => {
        setState({ ...state, [name]: event.target.checked });
    };
    if (isAuthenticated) {
        return <Redirect to={ROUTES.NEWSFEED} />
    }
    return (
        <div id="landing" className="d-flex flex-column justify-content-between align-items-center p-5">
            <img src={grdfLogo} alt="grdf" height={"6%"} />
            <HYMLogo />
            <div className="d-flex flex-column align-items-center">
                <button type="button" className={state.checkedConditions ? "btn mb-2" : "btn mb-2 disabled"} style={buttonStyle} onClick={state.checkedConditions ? login : () => {}}>Commencer <RightArrow /></button>
                <button type="button" onClick={() => setModalShow(true)} style={rgpdLinkStyle}>Informations</button>
                <div className="d-flex justify-content-center align-items-center" style={{ width: "110%" }}>
                    <Checkbox
                        checked={state.checkedA}
                        onChange={handleChange("checkedConditions")}
                        color="default"
                        value="checkedConditions"
                    />
                    <span style={{ fontSize: "0.8em" }}>J'ai lu et j'accepte les conditions d'utilisation</span>
                </div>
                <RGPDModal show={modalShow} onHide={() => setModalShow(false)} />
            </div>
        </div>
    );
}

const RGPDModal = (props) => (
    <Modal
        {...props}
        aria-labelledby="rgpd-modal"
    >
        <Modal.Body>
            <div className="d-flex flex-column">
                <div className="d-flex align-items-center">
                    <LeftArrow onClick={props.onHide} />
                    <h4 className="ml-2" style={{ color: "#5C747B" }}>Informations</h4>
                </div>
                <div className="d-flex flex-column" style={{ maxHeight: "50vh", overflowY: "scroll", color: "#5C747B", bottom: "2vh" }}>
                    {RGPD_TEXT.map(phrase => <p>{phrase}</p>)}
                    <span>Crédits</span>
                    <div>
                        Icons made by <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik </a> 
                        from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a> is licensed by  
                        <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target={"_blank"}> CC 3.0 BY</a>
                    </div>
                </div>
            </div>
        </Modal.Body>
    </Modal>
);

export default Landing;