// import { combineReducers } from 'redux';

// import Auth from './auth/reducers';
// import Layout from './layout/reducers';
// import PageTitle from './pageTitle/reducers';
// import { businessReducer } from './business/reducers';
// import { languageReducer } from './business/reducers';

// export default combineReducers({
//     Auth,
//     Layout,
//     PageTitle,
//     business: businessReducer,
//     language: languageReducer,
// });

import { combineReducers } from 'redux';

import Auth from './auth/reducers';
import Layout from './layout/reducers';
import PageTitle from './pageTitle/reducers';
import { businessReducer } from './business/reducers';
import { languageReducer } from './business/reducers';
import MenuManagementCategoryReducer from './menuManagementCategory/reducers';
import MenuManagementItemReducer from './menuManagementItem/reducers';

import RecipeIngredientsManagementReducer from './recipeIngredientsManagement/reducers';
import RecipeManagementReducer from './recipeManagement/reducers';

const rootReducer = combineReducers({
    Auth,
    Layout,
    PageTitle,
    business: businessReducer,
    language: languageReducer,
    category: MenuManagementCategoryReducer,
    MenuManagementItemReducer,
    ingredient: RecipeIngredientsManagementReducer,
    recipe: RecipeManagementReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
