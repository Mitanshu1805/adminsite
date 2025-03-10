import { all, fork, put, call, takeEvery } from 'redux-saga/effects';
import {
    businessList,
    businessRegister,
    languageList,
    updateBusinessList,
    deleteBusinessList,
    registerOutlet,
    updateOutlet,
    deleteOutlet,
    registerBusinessUser,
    updateBusinessUser,
    deleteBusinessUser,
    businessUpdateIsActive,
    outletUpdateIsActive,
    businessDetails,
} from '../../helpers/api/auth';
import {
    businessApiResponseSuccess,
    businessApiResponseError,
    registerBusinessSuccess,
    registerBusinessError,
    languageListSuccess,
    languageListError,
    updateBusinessListSuccess,
    updateBusinessListError,
    deleteBusinessListSuccess,
    deleteBusinessListError,
    registerOutletSuccess,
    registerOutletError,
    updateOutletSuccess,
    updateOutletError,
    deleteOutletSuccess,
    deleteOutletError,
    registerBusinessUserSuccess,
    registerBusinessUserError,
    updateBusinessUserSuccess,
    updateBusinessUserError,
    deleteBusinessUserError,
    deleteBusinessUserSuccess,
    businessUpdateIsActiveSuccess,
    businessUpdateIsActiveError,
    outletUpdateIsActiveSuccess,
    outletUpdateIsActiveError,
    businessDetailsSuccess,
    businessDetailsError,
} from './actions';
import { BusinessActionTypes } from './constants';
import { SagaIterator } from '@redux-saga/core';
import { AxiosResponse } from 'axios';

// Define Language and API Response types
interface Language {
    language_id: string;
    language: string;
}

interface ApiResponseData {
    List: Language[];
}

interface ApiResponse {
    data: {
        data: ApiResponseData;
    };
}

interface RegisterOutletResponse {
    message: string;
}

// Business List Saga
function* businessListSaga(): SagaIterator {
    try {
        const response = yield call(businessList);
        if (response.data?.data?.BusinessLists && Array.isArray(response.data.data.BusinessLists)) {
            const businesses = response.data.data.BusinessLists;
            yield put(businessApiResponseSuccess(businesses));
        } else {
            yield put(businessApiResponseError('No businesses found.'));
        }
    } catch (error: any) {
        yield put(businessApiResponseError(error.message || 'Error Occurred'));
    }
}

// Register Business Saga
function* registerBusinessSaga(action: any): SagaIterator {
    try {
        const response = yield call(businessRegister, action.payload);
        yield put(registerBusinessSuccess(response.data.message));
    } catch (error: any) {
        yield put(registerBusinessError(error.message || 'Error Occurred'));
    }
}

// Update Business Saga
// Update Business Saga

// Update Business Saga
function* updateBusinessSaga(action: any): SagaIterator {
    try {
        const response = yield call(updateBusinessList, action.payload); // Ensure proper typing
        yield put(updateBusinessListSuccess(response.data.message));
    } catch (error: any) {
        yield put(updateBusinessListError(error.message || 'Error Occurred'));
    }
}

// function* updateBusinessSaga(action: any): SagaIterator {
//     try {
//         // Creating FormData object
//         const formData = new FormData();
//         // Assuming 'action.payload' has the necessary data
//         Object.keys(action.payload).forEach((key) => {
//             formData.append(key, action.payload[key]);
//         });

//         // Call the API with the FormData
//         const response: AxiosResponse = yield call(updateBusinessList, formData);

//         // Handle success
//         yield put(updateBusinessListSuccess(response.data.message));
//     } catch (error: any) {
//         yield put(updateBusinessListError(error.message || 'Error Occurred'));
//     }
// }

function* deleteBusinessSaga(action: any): SagaIterator {
    try {
        const { business_id } = action.payload; // Ensure you're extracting the businessId from the payload

        // Make the actual API call to delete the business
        const response: AxiosResponse = yield call(deleteBusinessList, { business_id: business_id });

        // Check if the request was successful
        if (response.status === 200) {
            yield put(deleteBusinessListSuccess(response.data.message));
        } else {
            yield put(deleteBusinessListError('Failed to delete business.'));
        }
    } catch (error: any) {
        console.error('Error during business deletion:', error); // Log the error for debugging
        yield put(deleteBusinessListError(error.message || 'Error Occurred'));
    }
}

// Language List Saga
function* languageListSaga(): SagaIterator {
    console.log('languageListSaga started');
    try {
        console.log('Calling languageList API');
        const response: ApiResponse = yield call(languageList);

        console.log('Full API Response:', response);
        console.log('Response Data:', response.data); // Log the data field directly
        console.log('Check if List exists correctly:', response.data?.data?.List);

        // Check if List exists and is an array
        if (response.data?.data?.List && Array.isArray(response.data.data.List)) {
            console.log('Found List:', response.data.data.List);

            const languages = response.data.data.List.map((lang) => ({
                id: lang.language_id,
                name: lang.language,
            }));

            console.log('Mapped Languages:', languages);
            console.log('Mapped Languages (Detailed):', JSON.stringify(languages, null, 2));

            yield put(languageListSuccess(languages));
        } else {
            console.log('No languages found. List might be missing or incorrectly formatted.');
            yield put(languageListError('No languages found.'));
        }
    } catch (error: any) {
        console.log('Error in API Call:', error);
        yield put(languageListError(error.message || 'Error Occurred'));
    }
}

function* registerOutletSaga(action: any): SagaIterator {
    try {
        const response = yield call(registerOutlet, action.payload); // API call to register outlet
        yield put(registerOutletSuccess(response.message));
    } catch (error: unknown) {
        // Handle unknown error type
        if (error instanceof Error) {
            yield put(registerOutletError(error.message || 'Error registering outlet'));
        } else {
            yield put(registerOutletError('Error registering outlet'));
        }
    }
}

function* updateOutletSaga(action: any): SagaIterator {
    try {
        const response = yield call(updateOutlet, action.payload);
        yield put(updateOutletSuccess(response.data.message));
    } catch (error: any) {
        yield put(updateOutletError(error.message || 'Error Occurred'));
    }
}

function* deleteOutletSaga(action: any): SagaIterator {
    try {
        const { outlet_id, business_id } = action.payload; // Make sure to extract the correct ID
        const response = yield call(deleteOutlet, { outlet_id, business_id }); // Pass outlet_id as the payload

        if (response.status === 200) {
            yield put(deleteOutletSuccess(response.data.message));
        } else {
            yield put(deleteOutletError('Failed to delete outlet.'));
        }
    } catch (error: any) {
        console.error('Error during outlet deletion:', error);
        yield put(deleteOutletError(error.message || 'Error Occurred'));
    }
}

function* registerBusinessUserSaga(action: any): SagaIterator {
    try {
        const response = yield call(registerBusinessUser, action.payload);
        yield put(registerBusinessUserSuccess(response.data.message));
    } catch (error: any) {
        yield put(registerBusinessUserError(error.message || 'Error Occurred'));
    }
}

function* updateBusinessUserSaga(action: any): SagaIterator {
    try {
        const response = yield call(updateBusinessUser, action.payload);
        yield put(updateBusinessUserSuccess(response.data.message));
    } catch (error: any) {
        yield put(updateBusinessUserError(error.message || 'Error Occurred'));
    }
}

function* deleteBusinessUserSaga(action: any): SagaIterator {
    try {
        const { business_id } = action.payload; // Make sure to extract the correct ID
        const response = yield call(deleteBusinessUser, action.payload); // Pass outlet_id as the payload

        if (response.status === 200) {
            yield put(deleteBusinessUserSuccess(response.data.message));
        } else {
            yield put(deleteBusinessUserError('Failed to delete outlet.'));
        }
    } catch (error: any) {
        console.error('Error during BusinessUser deletion:', error);
        yield put(deleteBusinessUserError(error.message || 'Error Occurred'));
    }
}

function* businessUpdateIsActiveSaga(action: any): SagaIterator {
    try {
        console.log('Saga triggered with:', action.payload);
        const response = yield call(businessUpdateIsActive, action.payload);
        yield put(businessUpdateIsActiveSuccess(response.data.message));
    } catch (error: any) {
        yield put(businessUpdateIsActiveError(error.message || 'Error Occured'));
    }
}

function* outletUpdateIsActiveSaga(action: any): SagaIterator {
    try {
        console.log('OutletUpdateIsActiveSaga triggered with:', action.payload);
        const response = yield call(outletUpdateIsActive, action.payload);
        yield put(outletUpdateIsActiveSuccess(response.data.message));
    } catch (error: any) {
        yield put(outletUpdateIsActiveError(error.message || 'Error Occured'));
    }
}

function* businessDetailsSaga(action: any): SagaIterator {
    try {
        const response = yield call(businessDetails, action.payload);
        console.log('API Response:', response);
        console.log('API Data:', response.data);
        console.log('Action PAYLOAD: ', action.payload);
        console.log('Business Data:', response.data.data.business);

        yield put(businessDetailsSuccess(response.data.data.business));
        console.log('Dispatched Success Action:', {
            message: response.data.message,
            business: response.data.data.business,
        });
    } catch (error: any) {
        yield put(businessDetailsError(error.message || 'Error Occurred'));
    }
}

// Watcher Sagas
function* watchBusinessList() {
    yield takeEvery(BusinessActionTypes.BUSINESS_LIST, businessListSaga);
}

function* watchRegisterBusiness() {
    yield takeEvery(BusinessActionTypes.REGISTER_BUSINESS, registerBusinessSaga);
}

function* watchUpdateBusiness() {
    yield takeEvery(BusinessActionTypes.UPDATE_BUSINESS_LIST, updateBusinessSaga); // Corrected action type
}

function* watchDeleteBusiness() {
    yield takeEvery(BusinessActionTypes.DELETE_BUSINESS_LIST, deleteBusinessSaga); // Corrected action type
}

function* watchLanguageList() {
    yield takeEvery(BusinessActionTypes.LANGUAGE_LIST, languageListSaga);
}

export function* watchRegisterOutlet() {
    yield takeEvery(BusinessActionTypes.REGISTER_OUTLET, registerOutletSaga);
}

export function* watchUpdateOutlet() {
    yield takeEvery(BusinessActionTypes.UPDATE_OUTLET, updateOutletSaga);
}

export function* watchDeleteOutlet() {
    yield takeEvery(BusinessActionTypes.DELETE_OUTLET, deleteOutletSaga);
}

export function* watchRegisterBusinessUser() {
    yield takeEvery(BusinessActionTypes.REGISTER_BUSINESS_USER, registerBusinessUserSaga);
}

export function* watchUpdateBusinessUser() {
    yield takeEvery(BusinessActionTypes.UPDATE_BUSINESS_USER, updateBusinessUserSaga);
}

export function* watchDeleteBusinessUser() {
    yield takeEvery(BusinessActionTypes.DELETE_BUSINESS_USER, deleteBusinessUserSaga);
}

export function* watchBusinessUpdateIsActive() {
    yield takeEvery(BusinessActionTypes.BUSINESS_UPDATE_ISACTIVE, businessUpdateIsActiveSaga);
}

export function* watchOutletUpdateIsActive() {
    yield takeEvery(BusinessActionTypes.OUTLET_UPDATE_ISACTIVE, outletUpdateIsActiveSaga);
}

export function* watchBusinessDetails() {
    yield takeEvery(BusinessActionTypes.BUSINESS_DETAILS, businessDetailsSaga);
}

// Root Saga
function* businessSaga() {
    yield all([
        fork(watchBusinessList),
        fork(watchRegisterBusiness),
        fork(watchUpdateBusiness), // Added update watcher
        fork(watchDeleteBusiness), // Added delete watcher
        fork(watchLanguageList),
        fork(watchRegisterOutlet), // Added
        fork(watchUpdateOutlet), // Added
        fork(watchDeleteOutlet), // Added
        fork(watchRegisterBusinessUser),
        fork(watchUpdateBusinessUser), // Added
        fork(watchDeleteBusinessUser),
        fork(watchBusinessUpdateIsActive),
        fork(watchOutletUpdateIsActive),
        fork(watchBusinessDetails),
    ]);
}

export default businessSaga;
