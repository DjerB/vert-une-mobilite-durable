export const addToLocalStorage = (key, value) => {
    localStorage.removeItem(key);
    localStorage.setItem(key, value);
};

export const checkPoints = (points) => {
    if (parseInt(localStorage.getItem("hymPoints")) !== points) {
        addToLocalStorage("hymPoints", points);
    }
}