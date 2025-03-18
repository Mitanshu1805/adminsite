import { APICore } from './apiCore';

const api = new APICore();

export function registerOutlet(data: any) {
    return api.create('/outlet/register', data);
}

export function updateOutlet(data: any) {
    return api.update('/outlet/update', data);
}

export function deleteOutlet(data: any) {
    return api.delete('/outlet/delete', data);
}

export function outletUpdateIsActive(data: any) {
    return api.update('/outlet/update/isactive', data);
}

export function categoryOutletLists(data: any) {
    const baseUrl = '/category/outlet/lists';
    return api.create(`${baseUrl}`, data);
}

export function updateOutletPrice(data: any) {
    const baseUrl = '/item/update/outlet/price';
    return api.update(`${baseUrl}`, data);
}
