import moment from 'moment';

export const getTimestamp = function(date) { 
    const hours = getHours(date);
    if (hours < 24) {
        if (hours === 1) {
            return "il y a " + getMinutes(date) + "min";
        }
        return "il y a " + hours + "h";
    } else if (hours < 48) {
        return "hier";
    } else {
        return "il y a " + Math.ceil(hours / 24) + "j";
    }   
}

export const getDays = (date) => Math.ceil(moment().diff(date) / 86400000);

export const getHours = (date) => Math.ceil(moment().diff(date) / 3600000);

export const getMinutes = (date) => Math.ceil(moment().diff(date) / 216000000);