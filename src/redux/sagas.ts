import { all } from 'redux-saga/effects';

import authSaga from './auth/saga';
import layoutSaga from './layout/saga';
import businessSaga from './business/saga';
import menuManagementCategorySaga from './menuManagementCategory/saga';
import menuManagementItemSaga from './menuManagementItem/saga';
import recipeIngredientManagementSaga from './recipeIngredientsManagement/saga';
import recipeManagementSaga from './recipeManagement/saga';

export default function* rootSaga() {
    yield all([
        authSaga(),
        layoutSaga(),
        businessSaga(),
        menuManagementCategorySaga(),
        menuManagementItemSaga(),
        recipeManagementSaga(),
        recipeIngredientManagementSaga(),
    ]);
}
