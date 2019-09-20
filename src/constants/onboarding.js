import { ReactComponent as Target } from '../images/onboarding/target.svg';
import { ReactComponent as Idea } from '../images/onboarding/idea.svg';
import { ReactComponent as Profit } from '../images/onboarding/profit.svg';
import { ReactComponent as Chat } from '../images/onboarding/chat.svg';
import cat from '../images/onboarding/cat.svg';
import dog from '../images/onboarding/dog.svg';
import fox from '../images/onboarding/fox.svg';
import monkey from '../images/onboarding/monkey.svg';

export const ONBOARDING_PAGES = [
    { logo: Target, title: "Découvre", text: "des défis ludiques autour de la mobilité durable" },
    { logo: Idea, title: "Développe", text: "tes connaisances autour de la mobilité" },
    { logo: Profit, title: "Economise", text: "de l'argent en trouvant des solutions alternatives" },
    { logo: Chat, title: "Partage", text: "autour de toi l'application et challenge tes collègues !" }
];

export const AVATARS = [
    { name: "cat", picture: cat },
    { name: "dog", picture: dog },
    { name: "fox", picture: fox },
    { name: "monkey", picture: monkey }
];

export const REGIONS = [
    { value: "fonctionsCentrales", label: "Fonction Centrales" },
    { value: "ileDeFrance", label: "Ile-de-France" },
    { value: "centreOuest", label: "Centre Ouest" },
    { value: "nordOuest", label: "Nord Ouest" },
    { value: "est", label: "Est" },
    { value: "sudEst", label: "Sud Est" },
    { value: "sudOuest", label: "Sud Ouest" },
];