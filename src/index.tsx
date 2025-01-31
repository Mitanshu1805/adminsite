import React from 'react';
import ReactDOM from 'react-dom';
import './i18n'; // Your i18n setup
// import './index.css'; // Your global styles
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import { configureStore } from './redux/store';
import { setAuthorization } from './helpers/api/apiCore'; // Import setAuthorization function

// Check if token is in localStorage and set it in axios
// const user = localStorage.getItem('adminto_user');
// if (user) {
//     try {
//         const parsedUser = JSON.parse(user);
//         const token = parsedUser.token;
//         if (token) {
//             setAuthorization(token); // Set the JWT token in the Authorization header
//         }
//     } catch (error) {
//         console.error('Error parsing user from localStorage', error);
//     }
// }

ReactDOM.render(
    <Provider store={configureStore({})}>
        <App />
    </Provider>,
    document.getElementById('root')
);

reportWebVitals();
