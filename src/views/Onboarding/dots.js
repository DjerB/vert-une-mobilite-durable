import React from 'react';

const Dots = (props) => {
    const { activeDot, nbOfDots } = props;
    let dots = [];
    for (let i = 0; i < nbOfDots; i++) {
        dots.push(<span key={i} className={activeDot === i ? "active-dot" : "dot"}></span>)
    }

    return <div className="d-flex justify-content-between" style={{ width: "35%" }}>{dots}</div>
}

export default Dots;