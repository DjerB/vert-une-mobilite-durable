const initialState = { 
    reducedUser: localStorage.getItem('VMDUser') || {},
    reducedFriends: null,
    reducedSuggestedFriends: null,
    reducedChallenges: null,
    reducedNews: null,
    reducedAvatar: null
};

function update(state = initialState, action) {
    let nextState;
    switch (action.type) {
        case "UPDATE_USER":
            nextState = {
                ...state,
                reducedUser: action.value
            }
            return nextState || state;
        case "UPDATE_FRIENDS":
            nextState = {
                ...state,
                reducedFriends: action.value
            }
            return nextState || state;
        case "UPDATE_SUGGESTED_FRIENDS":
            nextState = {
                ...state,
                reducedSuggestedFriends: action.value
            }
            return nextState || state;
        case "UPDATE_NEWS":
            nextState = {
                ...state,
                reducedNews: action.value
            }
            return nextState || state;
        case "UPDATE_AVATAR":
            nextState = {
                ...state,
                reducedAvatar: action.value
            }
            return nextState || state;
        default:
            return state;
    }
}

export default update;