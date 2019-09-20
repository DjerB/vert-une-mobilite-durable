import React, { Fragment } from 'react';

const mediaStyle =  {
    paddingLeft: "3vw",
    paddingTop: "1vh",
    paddingBottom: "1vh",
    marginBottom: "2%",
    boxShadow: "1px 1px 2px 1px #e2e2e2",
    width: "90vw",
    height: "8vh",
    borderRadius: "7px",
    fontSize: "3vw"
};

const List = ({ medias }) => (
    <Fragment>
        {medias.map(({ image, title, link }, index) => (
            <div key={index} className="d-flex align-items-center" style={mediaStyle}>
                <img src={image} alt="portrait" width={"10%"} />
                <div className="d-flex justify-content-between align-items-center mx-3 w-100">
                    <span>{title}</span>
                    <span></span>
                </div>
            </div>
        ))}
    </Fragment>
);

export default List;