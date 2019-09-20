import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { ReactComponent as LeftArrow } from '../images/left-arrow.svg'

/**
 * Functional generic component that creates a link between from a nested view
 * @param {string} route Route to redirect to on click
 * @param {string} title Title to display next to the arrow 
 */
const BackTo = ({ route, title }) => (
    <div className="d-flex mt-4" style={{ marginLeft: "5%", color: "#5C747B", fontSize: "1.1em" }}>
        <Link to={route}><LeftArrow /></Link>
        <strong className="ml-3">{title}</strong>
    </div>
);

export default withRouter(BackTo);