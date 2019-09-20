import { AVATARS } from '../constants/onboarding';

export const getAvatar = (avatarName) => {
    console.log(avatarName)
    return AVATARS.find(({ name }) => name === avatarName).picture;
}