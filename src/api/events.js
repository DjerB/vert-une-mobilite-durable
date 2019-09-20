import axios from 'axios';

import { EVENTS, API_KEY } from '../constants/apis';

axios.defaults.headers.common['x-api-key'] = API_KEY;

export const getEventsForUsers = (usersIds) => {
    console.log(usersIds)
    return axios.get(EVENTS + "/" + usersIds.join(","));
};