import { APICore } from './apiCore';

const api = new APICore();

export function categoryRegister(data: any) {
    return api.create('/category/register', data);
}

export function categoryUpdate(data: any) {
    return api.update('/category/update', data);
}

export function categoryDelete(data: any) {
    return api.delete('/category/delete', data);
}

export function categoryUpdateIsActive(data: any) {
    return api.update('/category/update/isactive', data);
}

export function categoryUpdateDisable(data: any) {
    return api.update('/category/update/disable', data);
}
