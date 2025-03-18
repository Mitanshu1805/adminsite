import { APICore } from './apiCore';

const api = new APICore();

export function registerItem(data: any) {
    return api.create('/item/register', data);
}

export function updateItem(data: any) {
    return api.update('/item/update', data);
}

export function deleteItem(data: any) {
    return api.delete('/item/delete', data);
}

export function itemUpdateIsActive(data: any) {
    return api.update('/item/update/isactive', data);
}

export function itemUpdateDisable(data: any) {
    return api.update('/item/update/disable', data);
}

export function categoryItemList(data: any) {
    const baseUrl = '/category/item/list';
    return api.create(`${baseUrl}`, data);
}
