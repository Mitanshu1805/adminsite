import { all, fork, put, takeEvery, call } from 'redux-saga/effects';
import { SagaIterator } from '@redux-saga/core';

// apicore
import { APICore, setAuthorization } from '../../helpers/api/apiCore';

// helpers
import {
    login as loginApi,
    logout as logoutApi,
    signup as signupApi,
    forgotPassword as forgotPasswordApi,
} from '../../helpers/';

// actions
import { authApiResponseSuccess, authApiResponseError } from './actions';

// constants
import { AuthActionTypes } from './constants';

type UserData = {
    payload: {
        username: string;
        password: string;
        fullname: string;
        email: string;
    };
    type: string;
};

const api = new APICore();

/**
 * Login the user
 * @param {*} payload - username and password
 */

const AUTH_SESSION_KEY = 'adminto_user';
// function* login({ payload: { email, password }, type }: UserData): SagaIterator {
//     try {
//         const response = yield call(loginApi, { email, password });
//         const user = response.data;
//         // NOTE - You can change this according to response format from your api
//         api.setLoggedInUser(user);
//         setAuthorization(user['token']);
//         yield put(authApiResponseSuccess(AuthActionTypes.LOGIN_USER, user));
//     } catch (error: any) {
//         yield put(authApiResponseError(AuthActionTypes.LOGIN_USER, error));
//         api.setLoggedInUser(null);
//         setAuthorization(null);
//     }
// }

function* login({ payload: { email, password }, type }: UserData): SagaIterator {
    try {
        const response = yield call(loginApi, { email, password });

        // Log the full response structure to debug
        console.log('Full response structure:', response);

        // Check if response.data and response.data.detail exist
        if (response.data.data && response.data.data.detail) {
            const user = response.data.data.detail; // Extract user data from 'detail'
            const token = user.auth_token; // Token is inside 'detail'

            if (token) {
                console.log('Extracted token:', token); // Log token to verify it's being extracted correctly
                localStorage.setItem(AUTH_SESSION_KEY, token); // Save token to localStorage
                console.log('Token saved to localStorage:', token);

                // Now set the token in the authorization header
                setAuthorization(token);
            } else {
                console.error('Token is missing inside response.data.detail');
            }
        } else {
            console.error('Invalid response structure: Missing data or detail');
            console.log('Response data:', response.data); // Log data to help with debugging
        }

        api.setLoggedInUser(response.data);
        yield put(authApiResponseSuccess(AuthActionTypes.LOGIN_USER, response.data));
    } catch (error: any) {
        console.error('Login error:', error);
        yield put(authApiResponseError(AuthActionTypes.LOGIN_USER, error));
        api.setLoggedInUser(null);
        setAuthorization(null);
    }
}

/**
 * Logout the user
 */
function* logout(): SagaIterator {
    try {
        yield call(logoutApi);
        api.setLoggedInUser(null);
        setAuthorization(null);
        yield put(authApiResponseSuccess(AuthActionTypes.LOGOUT_USER, {}));
    } catch (error: any) {
        yield put(authApiResponseError(AuthActionTypes.LOGOUT_USER, error));
    }
}

function* signup({ payload: { fullname, email, password } }: UserData): SagaIterator {
    try {
        const response = yield call(signupApi, { fullname, email, password });
        const user = response.data;
        // api.setLoggedInUser(user);
        // setAuthorization(user['token']);
        yield put(authApiResponseSuccess(AuthActionTypes.SIGNUP_USER, user));
    } catch (error: any) {
        yield put(authApiResponseError(AuthActionTypes.SIGNUP_USER, error));
        api.setLoggedInUser(null);
        setAuthorization(null);
    }
}

function* forgotPassword({ payload: { email } }: UserData): SagaIterator {
    try {
        const response = yield call(forgotPasswordApi, { email });
        yield put(authApiResponseSuccess(AuthActionTypes.FORGOT_PASSWORD, response.data));
    } catch (error: any) {
        yield put(authApiResponseError(AuthActionTypes.FORGOT_PASSWORD, error));
    }
}

export function* watchLoginUser() {
    yield takeEvery(AuthActionTypes.LOGIN_USER, login);
}

export function* watchLogout() {
    yield takeEvery(AuthActionTypes.LOGOUT_USER, logout);
}

export function* watchSignup(): any {
    yield takeEvery(AuthActionTypes.SIGNUP_USER, signup);
}

export function* watchForgotPassword(): any {
    yield takeEvery(AuthActionTypes.FORGOT_PASSWORD, forgotPassword);
}

function* authSaga() {
    yield all([fork(watchLoginUser), fork(watchLogout), fork(watchSignup), fork(watchForgotPassword)]);
}

export default authSaga;
