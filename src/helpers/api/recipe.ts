import { APICore } from './apiCore';

const api = new APICore();

export function recipeAdd(data: any) {
    return api.create('/recipe/add', data);
}

export function recipeUpdate(data: any) {
    return api.update('/recipe/update', data);
}

export function recipeDelete(data: any) {
    return api.delete('/recipe/delete', data);
}

export function recipeList(data: any) {
    return api.create('/recipe/list', data);
}

export function recipeIngredientAdd(data: any) {
    return api.create('/recipe/ingredient/add', data);
}

export function recipeIngredientDelete(data: any) {
    return api.delete('/recipe/ingredient/delete', data);
}

export function recipeIngredientList(data: any) {
    return api.create('/recipe/ingredient/list', data);
}

export function recipeIngredientUpdateStatus(data: any) {
    return api.update('/recipe/ingredient/update/status', data);
}
