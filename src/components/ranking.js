import React from 'react';

const Ranking = ({ users, topLim, bottomLim, userId, expand, onExpand }) => {
    const userIndex = users.findIndex(({ userId: id }) => id === userId);
    return (
        <div className="d-flex flex-column mt-3">
            {users.map((user, index) => {
                if (users.length <= topLim + bottomLim) {
                    return <RankingItem key={index} index={index} prenom={user.prenom} points={user.points} image={user.picture} isMe={user.userId === userId} />;
                }
                if (expand || users.length <= topLim || (index <= userIndex + 1 && index >= userIndex - 1)) {
                    return <RankingItem key={index} index={index} prenom={user.prenom} points={user.points} image={user.picture} isMe={user.userId === userId} />;
                }
                if (index === topLim) {
                    return <RankingDivider key={index} onClick={onExpand} />;
                } else if (index > topLim && index < users.length - bottomLim) {
                    return null;
                } else {
                    return <RankingItem key={index} index={index} prenom={user.prenom} points={user.points} image={user.picture} isMe={user.userId === userId} />;
                }
            })}
        </div>
    );
};

const RankingDivider = ({ onClick }) => (
    <div className="d-flex flex-column align-items-center h-25 my-2 py-1" style={{ width: "90%" }} onClick={onClick}>
        <div style={{ width: "90%"}}>
            <strong>...</strong>
        </div>
    </div>
);

const RankingItem = ({ index, prenom, points, isMe, image }) => (
    <div className="d-flex flex-column align-items-center h-25 my-1 py-1" style={{ backgroundColor: isMe ? "#E5E5E5" : "" }}>
        <div className="d-flex align-items-center justify-content-between" style={{ width: "90%" }}>
            <div className="d-flex align-items-center">
                <strong>{index + 1}.</strong>
                <div className="d-flex justify-content-start align-items-center">
                    <img src={image} style={{ borderRadius: "50%" }} width={"30vw"} height={"30vw"} alt="portrait" className="mx-2" />
                    <strong>{prenom}</strong>
                </div>
            </div>
            <div className="d-flex justify-content-end" style={{ fontSize: "0.7em", width: "50%" }}>
                <strong>{points} point{points > 0 ? "s" : ""}</strong>
            </div>
        </div>
    </div>
);

export default Ranking;