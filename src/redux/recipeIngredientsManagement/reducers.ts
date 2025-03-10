import { RecipeIngredientsManagementActionTypes } from './constants';

// Define State Type
interface State {
    ingredients: any[]; // Replace `any` with the proper ingredient type
    loading: boolean;
    error: string | null;
}

const initialState: State = {
    ingredients: [],
    loading: false,
    error: null,
};

type RecipeIngredientsManagementActions =
    | { type: typeof RecipeIngredientsManagementActionTypes.RECIPE_INGREDIENT_ADD }
    | {
          type: typeof RecipeIngredientsManagementActionTypes.RECIPE_INGREDIENT_ADD_SUCCESS;
          payload: { ingredient: any };
      }
    | { type: typeof RecipeIngredientsManagementActionTypes.RECIPE_INGREDIENT_ADD_ERROR; payload: { error: string } }
    | { type: typeof RecipeIngredientsManagementActionTypes.RECIPE_INGREDIENT_LIST }
    | {
          type: typeof RecipeIngredientsManagementActionTypes.RECIPE_INGREDIENT_LIST_SUCCESS;
          payload: { ingredients: any[] };
      }
    | { type: typeof RecipeIngredientsManagementActionTypes.RECIPE_INGREDIENT_LIST_ERROR; payload: { error: string } }
    | { type: typeof RecipeIngredientsManagementActionTypes.RECIPE_INGREDIENT_UPDATE_STATUS }
    | {
          type: typeof RecipeIngredientsManagementActionTypes.RECIPE_INGREDIENT_UPDATE_STATUS_SUCCESS;
          payload: { ingredient_id: string; is_active: boolean };
      }
    | {
          type: typeof RecipeIngredientsManagementActionTypes.RECIPE_INGREDIENT_UPDATE_STATUS_ERROR;
          payload: { error: string };
      }
    | { type: typeof RecipeIngredientsManagementActionTypes.RECIPE_INGREDIENT_DELETE }
    | {
          type: typeof RecipeIngredientsManagementActionTypes.RECIPE_INGREDIENT_DELETE_SUCCESS;
          payload: { ingredient_id: string };
      }
    | {
          type: typeof RecipeIngredientsManagementActionTypes.RECIPE_INGREDIENT_DELETE_ERROR;
          payload: { error: string };
      };

const RecipeIngredientsManagementReducer = (
    state = initialState,
    action: RecipeIngredientsManagementActions
): State => {
    switch (action.type) {
        case RecipeIngredientsManagementActionTypes.RECIPE_INGREDIENT_ADD:
            return { ...state, loading: true, error: null };

        case RecipeIngredientsManagementActionTypes.RECIPE_INGREDIENT_ADD_SUCCESS:
            return { ...state, loading: false, ingredients: [...state.ingredients, action.payload.ingredient] };

        case RecipeIngredientsManagementActionTypes.RECIPE_INGREDIENT_ADD_ERROR:
            return { ...state, loading: false, error: action.payload.error };

        case RecipeIngredientsManagementActionTypes.RECIPE_INGREDIENT_LIST:
            return { ...state, loading: true, error: null };

        case RecipeIngredientsManagementActionTypes.RECIPE_INGREDIENT_LIST_SUCCESS:
            return { ...state, loading: false, ingredients: action.payload.ingredients };

        case RecipeIngredientsManagementActionTypes.RECIPE_INGREDIENT_LIST_ERROR:
            return { ...state, loading: false, error: action.payload.error };

        case RecipeIngredientsManagementActionTypes.RECIPE_INGREDIENT_UPDATE_STATUS:
            return { ...state, loading: true, error: null };

        case RecipeIngredientsManagementActionTypes.RECIPE_INGREDIENT_UPDATE_STATUS_SUCCESS:
            return {
                ...state,
                loading: false,
                ingredients: state.ingredients.map((ingredient) =>
                    ingredient.id === action.payload.ingredient_id
                        ? { ...ingredient, is_active: action.payload.is_active }
                        : ingredient
                ),
            };

        case RecipeIngredientsManagementActionTypes.RECIPE_INGREDIENT_UPDATE_STATUS_ERROR:
            return { ...state, loading: false, error: action.payload.error };

        case RecipeIngredientsManagementActionTypes.RECIPE_INGREDIENT_DELETE:
            return { ...state, loading: true, error: null };

        case RecipeIngredientsManagementActionTypes.RECIPE_INGREDIENT_DELETE_SUCCESS:
            return {
                ...state,
                loading: false,
                ingredients: state.ingredients.filter((ingredient) => ingredient.id !== action.payload.ingredient_id),
            };

        case RecipeIngredientsManagementActionTypes.RECIPE_INGREDIENT_DELETE_ERROR:
            return { ...state, loading: false, error: action.payload.error };

        default:
            return state;
    }
};

export default RecipeIngredientsManagementReducer;
