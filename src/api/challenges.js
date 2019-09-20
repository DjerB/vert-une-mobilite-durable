import axios from 'axios';

import { CHALLENGES, API_KEY, CHALLENGES_USERS, USERS } from '../constants/apis';

axios.defaults.headers.common['x-api-key'] = API_KEY;

export const getAllChallenges = () => axios.get(CHALLENGES);

export const getChallengeById = (challengeId) => axios.get(CHALLENGES + "/" + challengeId);

export const createChallengeUser = (challengeId, userId, pointsDebut) => axios.put(CHALLENGES_USERS, { challengeId, userId, points: pointsDebut });

export const getChallengeUser = (challengeId, userId) => axios.get(CHALLENGES_USERS, { challengeId, userId });

export const getChallengesForUser = (userId) => axios.get(CHALLENGES_USERS + "/" + userId);

export const updateChallengeUser = (challengeId, userId, pointsFin, badgeId) => 
    axios.post(CHALLENGES_USERS + "/update/" + challengeId + "/" + userId, {
        pointsFin,
        badgeId
    });

/*export const uploadEvidence = (formData) => axios.post(UPLOAD_EVIDENCE, formData, {
    headers: {
        "Content-Type": "multipart/form-data"
    }
});*/

export const addRunningChallengeToUser = (userId, challengeId, nomDefi, defisEnCours, points, nom, prenom, region, avatar) => axios.post(USERS + "/addRunningChallenge/" + userId, { points, defisEnCours, nomDefi, challengeId, nom, prenom, region, avatar });

export const addChallengeToUser = (userId, challengeId, nomDefi, defisEnCours, defisRealises, pointsDebut, pointsFin, points, badges, debut, medias, nom, prenom, region, avatar) => axios.post(USERS + "/addChallenge/" + userId, { points, challengeId, nomDefi, defisEnCours, defisRealises, pointsDebut, pointsFin, badges, debut, medias, nom, prenom, region, avatar });

export const updateChallenge = (challengeId, image, avatar, prenom) => axios.post(CHALLENGES + "/" + challengeId, { image, avatar, prenom });