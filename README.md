# Vert une mobilité durable

This project comes from GRDF commitment to sustainable mobility: through this React PWA that raises awareness about non sustainable ways of transport, its employees will be able to compete against each other by completing ludic challenges and improve their environmental impact on a dailay basis.

<img src="images/image_1.png" width="170" height="300" /> <img src="images/2.png" width="170" height="300" /> <img src="images/image_1.png" width="170" height="300" /> <img src="images/4.png" width="170" height="300" /> <img src="images/5.png" width="170" height="300" />
<img src="images/image_2.png" width="170" height="300" /> <img src="images/2.png" width="170" height="300" /> <img src="images/image_1.png" width="170" height="300" /> <img src="images/4.png" width="170" height="300" /> <img src="images/5.png" width="170" height="300" />
<img src="images/image_3.png" width="170" height="300" /> <img src="images/2.png" width="170" height="300" /> <img src="images/3.png" width="170" height="300" /> <img src="images/4.png" width="170" height="300" /> <img src="images/5.png" width="170" height="300" />
<img src="images/image_4.png" width="170" height="300" /> <img src="images/2.png" width="170" height="300" /> <img src="images/3.png" width="170" height="300" /> <img src="images/4.png" width="170" height="300" /> <img src="images/5.png" width="170" height="300" />
<img src="images/image_5.png" width="170" height="300" /> <img src="images/2.png" width="170" height="300" /> <img src="images/3.png" width="170" height="300" /> <img src="images/4.png" width="170" height="300" /> <img src="images/5.png" width="170" height="300" />
<img src="images/image_6.png" width="170" height="300" /> <img src="images/2.png" width="170" height="300" /> <img src="images/3.png" width="170" height="300" /> <img src="images/4.png" width="170" height="300" /> <img src="images/5.png" width="170" height="300" />
<img src="images/image_7.png" width="170" height="300" /> <img src="images/2.png" width="170" height="300" /> <img src="images/3.png" width="170" height="300" /> <img src="images/4.png" width="170" height="300" /> <img src="images/5.png" width="170" height="300" />
<img src="images/image_8.png" width="170" height="300" /> <img src="images/2.png" width="170" height="300" /> <img src="images/3.png" width="170" height="300" /> <img src="images/4.png" width="170" height="300" /> <img src="images/5.png" width="170" height="300" />
<img src="images/image_9.png" width="170" height="300" /> <img src="images/2.png" width="170" height="300" /> <img src="images/3.png" width="170" height="300" /> <img src="images/4.png" width="170" height="300" /> <img src="images/5.png" width="170" height="300" />
<img src="images/image_10.png" width="170" height="300" /> <img src="images/2.png" width="170" height="300" /> <img src="images/3.png" width="170" height="300" /> <img src="images/4.png" width="170" height="300" /> <img src="images/5.png" width="170" height="300" />
<img src="images/image_11.png" width="170" height="300" /> <img src="images/2.png" width="170" height="300" /> <img src="images/3.png" width="170" height="300" /> <img src="images/4.png" width="170" height="300" /> <img src="images/5.png" width="170" height="300" />
<img src="images/image_12.png" width="170" height="300" /> <img src="images/2.png" width="170" height="300" /> <img src="images/3.png" width="170" height="300" /> <img src="images/4.png" width="170" height="300" /> <img src="images/5.png" width="170" height="300" />

## Concept

The App is designed as a social network where employees may add friends, follow their progress and earn points on succesfully completing one of the many challenges. The latter take very different forms: quiz, engagement challenges (such as not taking any planes for 1 or 3 months), ponctual ones... When logging in for the first time, the user is invited to upload a photo that will appear on her friends' newfeeds. Users contribute to their own regions success as they are publicly ranked so as to foster engagement and participation.

## Architecture

The front end part is composed of views, roughly one per tab, that use global generic components such as Userbars, forms, cards... Redux enables to store a global state (user, avatar, points) and to keep track of any changes. The authentication part relies on AWS Cognito API and the code uses the id token received to identify the user.


This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `npm run build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify
