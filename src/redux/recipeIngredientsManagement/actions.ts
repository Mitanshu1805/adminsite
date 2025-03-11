import { RecipeIngredientsManagementActionTypes } from './constants';

export type RecipeIngredientsManagementAction =
    | {
          type: typeof RecipeIngredientsManagementActionTypes.RECIPE_INGREDIENT_ADD;
          payload: {
              name: string;
              business_id: string;
          };
      }
    | {
          type: typeof RecipeIngredientsManagementActionTypes.RECIPE_INGREDIENT_ADD_SUCCESS;
          payload: { message: string };
      }
    | {
          type: typeof RecipeIngredientsManagementActionTypes.RECIPE_INGREDIENT_ADD_ERROR;
          payload: { error: string };
      }
    | {
          type: typeof RecipeIngredientsManagementActionTypes.RECIPE_INGREDIENT_LIST;
          payload: {
              business_id: string;
          };
      }
    | {
          type: typeof RecipeIngredientsManagementActionTypes.RECIPE_INGREDIENT_LIST_SUCCESS;
          payload: { message: string };
      }
    | {
          type: typeof RecipeIngredientsManagementActionTypes.RECIPE_INGREDIENT_LIST_ERROR;
          payload: { error: string };
      }
    | {
          type: typeof RecipeIngredientsManagementActionTypes.RECIPE_INGREDIENT_UPDATE_STATUS;
          payload: {
              is_active: boolean;
              ingredient_id: string;
          };
      }
    | {
          type: typeof RecipeIngredientsManagementActionTypes.RECIPE_INGREDIENT_UPDATE_STATUS_SUCCESS;
          payload: { message: string };
      }
    | {
          type: typeof RecipeIngredientsManagementActionTypes.RECIPE_INGREDIENT_UPDATE_STATUS_ERROR;
          payload: { error: string };
      }
    | {
          type: typeof RecipeIngredientsManagementActionTypes.RECIPE_INGREDIENT_DELETE;
          payload: {
              ingredient_id: string;
          };
      }
    | {
          type: typeof RecipeIngredientsManagementActionTypes.RECIPE_INGREDIENT_DELETE_SUCCESS;
          payload: { message: string };
      }
    | {
          type: typeof RecipeIngredientsManagementActionTypes.RECIPE_INGREDIENT_DELETE_ERROR;
          payload: { error: string };
      };

export const recipeIngredientAdd = (name: string, business_id: string): RecipeIngredientsManagementAction => ({
    type: RecipeIngredientsManagementActionTypes.RECIPE_INGREDIENT_ADD,
    payload: { name, business_id },
});

export const recipeIngredientAddSuccess = (message: string): RecipeIngredientsManagementAction => ({
    type: RecipeIngredientsManagementActionTypes.RECIPE_INGREDIENT_ADD_SUCCESS,
    payload: { message },
});

export const recipeIngredientAddError = (error: string): RecipeIngredientsManagementAction => ({
    type: RecipeIngredientsManagementActionTypes.RECIPE_INGREDIENT_ADD_ERROR,
    payload: { error },
});

export const recipeIngredientList = (business_id: string): RecipeIngredientsManagementAction => ({
    type: RecipeIngredientsManagementActionTypes.RECIPE_INGREDIENT_LIST,
    payload: { business_id },
});

export const recipeIngredientListSuccess = (message: string): RecipeIngredientsManagementAction => ({
    type: RecipeIngredientsManagementActionTypes.RECIPE_INGREDIENT_LIST_SUCCESS,
    payload: { message },
});

export const recipeIngredientListError = (error: string): RecipeIngredientsManagementAction => ({
    type: RecipeIngredientsManagementActionTypes.RECIPE_INGREDIENT_LIST_ERROR,
    payload: { error },
});

export const recipeIngredientUpdateStatus = (
    ingredient_id: string,
    is_active: boolean
): RecipeIngredientsManagementAction => ({
    type: RecipeIngredientsManagementActionTypes.RECIPE_INGREDIENT_UPDATE_STATUS,
    payload: { ingredient_id, is_active },
});

export const recipeIngredientUpdateStatusSuccess = (message: string): RecipeIngredientsManagementAction => ({
    type: RecipeIngredientsManagementActionTypes.RECIPE_INGREDIENT_UPDATE_STATUS_SUCCESS,
    payload: { message },
});

export const recipeIngredientUpdateStatusError = (error: string): RecipeIngredientsManagementAction => ({
    type: RecipeIngredientsManagementActionTypes.RECIPE_INGREDIENT_UPDATE_STATUS_ERROR,
    payload: { error },
});

export const recipeIngredientDelete = (ingredient_id: string): RecipeIngredientsManagementAction => ({
    type: RecipeIngredientsManagementActionTypes.RECIPE_INGREDIENT_DELETE,
    payload: { ingredient_id },
});

export const recipeIngredientDeleteSuccess = (message: string): RecipeIngredientsManagementAction => ({
    type: RecipeIngredientsManagementActionTypes.RECIPE_INGREDIENT_DELETE_SUCCESS,
    payload: { message },
});

export const recipeIngredientDeleteError = (error: string): RecipeIngredientsManagementAction => ({
    type: RecipeIngredientsManagementActionTypes.RECIPE_INGREDIENT_DELETE_ERROR,
    payload: { error },
});
