// import { subPlanAdd } from './actions';
import { all, fork, put, call, takeEvery } from 'redux-saga/effects';
import { subPlanList, subPlanAdd, subPlanDelete } from '../../helpers/api';

import {
    subPlanListSuccess,
    subPlanAddSuccess,
    subPlanDeleteSuccess,
    subPlanListError,
    subPlanAddError,
    subPlanDeleteError,
} from './actions';

import { SubsAndPlansActionTypes } from './constants';
import { SagaIterator } from 'redux-saga';

function* subPlanListSaga(action: any): SagaIterator {
    try {
        const response = yield call(subPlanList, action.payload);
        yield put(subPlanListSuccess(response.data.message));
    } catch (error: any) {
        yield put(subPlanListError(error.message || 'Error Occurred'));
    }
}

function* subPlanDeleteSaga(action: any): SagaIterator {
    try {
        const response = yield call(subPlanDelete, action.payload);
        yield put(subPlanDeleteSuccess(response.data.message));
    } catch (error: any) {
        yield put(subPlanDeleteError(error.message || 'Error Occurred'));
    }
}

function* subPlanAddSaga(action: any): SagaIterator {
    try {
        const response = yield call(subPlanAdd, action.payload);
        yield put(subPlanAddSuccess(response.data.message));
    } catch (error: any) {
        yield put(subPlanAddError(error.message || 'Error Occurred'));
    }
}

function* watchSubPlanList() {
    yield takeEvery(SubsAndPlansActionTypes.SUBSCRIPTION_PLAN_LIST, subPlanListSaga);
}

function* watchSubPlanAdd() {
    yield takeEvery(SubsAndPlansActionTypes.SUBSCRIPTION_PLAN_ADD, subPlanAddSaga);
}

function* watchSubPlanDelete() {
    yield takeEvery(SubsAndPlansActionTypes.SUBSCRIPTION_PLAN_DELETE, subPlanDeleteSaga);
}

export default function* SubAndPlansSaga() {
    yield all([fork(watchSubPlanList), fork(watchSubPlanAdd), fork(watchSubPlanDelete)]);
}
