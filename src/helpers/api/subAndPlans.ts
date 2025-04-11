import { APICore } from './apiCore';

const api = new APICore();

export function subPlanList(data: any) {
    return api.get('/subscription/plan/list');
}

export function subPlanAdd(data: any) {
    return api.get('/subscription/plan/create');
}

export function subPlanDelete(data: any) {
    return api.get('/subscription/plan/delete');
}
