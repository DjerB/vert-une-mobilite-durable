import React from 'react';
import { IconContext } from 'react-icons';
import { FaWifi } from 'react-icons/fa';


const NetworkError = () => (
    <div className="d-flex flex-column justify-content-center align-items-center" id="networkError" style={{ color: "#729ca6", height: "90%" }}> 
        <FaWifi />
        <p>Une erreur est survenue</p>
        <p>Vérifie ta connexion ou réessaie plus tard</p>
    </div>
);

export default NetworkError;