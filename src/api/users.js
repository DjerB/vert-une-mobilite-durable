import axios from 'axios';

import { USERS, API_KEY, USERS_BY_IDS } from '../constants/apis';

axios.defaults.headers.common['x-api-key'] = API_KEY;

export const createUser = (nom, prenom, region, gaiaId, avatar) => axios.put(USERS, { nom, prenom, avatar, region, gaiaId });

export const getUser = (userId) => axios.get(USERS + "/" + userId);

export const getUsersByIds = (usersIds) => axios.get(USERS_BY_IDS, { usersIds });

export const getAllUsers = () => axios.get(USERS);

export const updateUser = (userId, friendId, points) => axios.post(USERS + "/" + userId, { ami: friendId, points });