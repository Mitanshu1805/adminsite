import { APICore } from './apiCore';

const api = new APICore();

export function subPlanList(data: any) {
    return api.get('/subscription/plan/list');
}

export function subPlanAdd(data: any) {
    return api.create('/subscription/plan/create', data);
}

export function subPlanDelete(data: any) {
    return api.delete('/subscription/plan/delete', data);
}
