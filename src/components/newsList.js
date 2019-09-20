import React, { Fragment } from 'react';

import { getTimestamp } from '../utils/time';

const newsStyle =  {
    paddingLeft: "3vw",
    paddingTop: "1vh",
    paddingBottom: "3%",
    marginBottom: "1vh",
    boxShadow: "1px 1px 2px 1px #e2e2e2",
    width: "90vw",
    borderRadius: "7px",
    fontSize: "3vw"
};

const List = ({ news, userId: myId }) => (
    <Fragment>
        {news.sort(({ date: date1 }, { date: date2 }) => date2 - date1).map(({ image, prenom, date, fini, nomDefi, userId }, index) => (
            <div key={index} className="d-flex align-items-center" style={newsStyle}>
                <img src={image} style={{ borderRadius: "50%" }} alt="portrait" width={"35vw"} height={"35vw"} />
                <div className="d-flex justify-content-between align-items-start mx-3 w-100">
                    <span className="col-10 px-0">{(userId === myId ? "Tu as " :  prenom + " a ") + (fini ? "réalisé " : "commencé ") + "le défi " + nomDefi}</span>
                    <span className="col-2 px-0 text-right">{getTimestamp(date)}</span>
                </div>
            </div>
        ))}
    </Fragment>
);

export default List;