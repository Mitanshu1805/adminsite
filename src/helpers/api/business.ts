import { APICore } from './apiCore';

const api = new APICore();

export function businessList() {
    return api.get('/business/list', {});
}

export function businessRegister(data: any) {
    return api.create('/business/register', data);
}

export function updateBusinessList(data: any) {
    return api.update('/business/update', data);
}

export function deleteBusinessList(data: any) {
    return api.delete('/business/delete', data);
}

export function businessUpdateIsActive(data: any) {
    return api.update('/business/update/isactive', data);
}

export function registerBusinessUser(data: any) {
    const baseUrl = '/business/user/register';
    return api.create(`${baseUrl}`, data); // Pass the data to the API
}

export function updateBusinessUser(data: any) {
    const baseUrl = '/business/user/update';
    return api.update(`${baseUrl}`, data); // Pass the data to the API
}

export function deleteBusinessUser(data: any) {
    const baseUrl = '/business/user/delete';
    return api.delete(`${baseUrl}`, data); // Pass the data to the API
}

export function languageList() {
    const baseUrl = '/language/list'; // Example endpoint for fetching the language list
    return api
        .get(`${baseUrl}`, {})
        .then((response) => {
            console.log('Language List API Response:', response); // Log for debugging
            return response; // Return the response
        })
        .catch((error) => {
            console.error('Error fetching language list:', error); // Log the error
            throw error; // Rethrow the error to be handled by the calling function
        });
}

export function businessDetails(data: any) {
    const baseUrl = '/business/details';
    return api.create(`${baseUrl}`, data);
}
