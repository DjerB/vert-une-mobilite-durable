import axios from 'axios';

import { BADGES, API_KEY } from '../constants/apis';

axios.defaults.headers.common['x-api-key'] = API_KEY;

export const getAllBadges = () => axios.get(BADGES);

