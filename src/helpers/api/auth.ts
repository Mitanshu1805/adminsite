import { APICore } from './apiCore';

const api = new APICore();

export function login(params: { email: string; password: string }) {
    return api.create('/superadmin/login', params);
}

export function logout() {
    return api.create('/superadmin/logout', {});
}

export function signup(params: { fullname: string; email: string; password: string }) {
    return api.create('/superadmin/register/', params);
}

export function forgotPassword(params: { email: string }) {
    return api.create('/superadmin/forget-password/', params);
}

// import { APICore } from './apiCore';

// const api = new APICore();

// // account
// function login(params: { email: string; password: string }) {
//     const baseUrl = '/superadmin/login';
//     return api.create(`${baseUrl}`, params);
// }

// function logout() {
//     const baseUrl = '/superadmin/logout';
//     return api.create(`${baseUrl}`, {});
// }

// function signup(params: { fullname: string; email: string; password: string }) {
//     const baseUrl = '/superadmin/register/';
//     return api.create(`${baseUrl}`, params);
// }

// function forgotPassword(params: { email: string }) {
//     const baseUrl = '/superadmin/forget-password/';
//     return api.create(`${baseUrl}`, params);
// }

// // function businessList() {
// //     const baseUrl = '/Business/List';
// //     return api.get(`${baseUrl}`, {});
// // }

// function businessList() {
//     const baseUrl = '/business/list';
//     return api
//         .get(`${baseUrl}`, {})
//         .then((response) => {
//             console.log('Business List API Response:', response);
//             return response;
//         })
//         .catch((error) => {
//             console.error('Error fetching business list:', error);
//             throw error;
//         });
// }

// function businessRegister(data: any) {
//     const baseUrl = '/business/register';
//     return api.create(`${baseUrl}`, data); // Pass the data to the API
// }

// function languageList() {
//     const baseUrl = '/language/list'; // Example endpoint for fetching the language list
//     return api
//         .get(`${baseUrl}`, {})
//         .then((response) => {
//             console.log('Language List API Response:', response); // Log for debugging
//             return response; // Return the response
//         })
//         .catch((error) => {
//             console.error('Error fetching language list:', error); // Log the error
//             throw error; // Rethrow the error to be handled by the calling function
//         });
// }

// function updateBusinessList(data: any) {
//     const baseUrl = '/business/update';
//     return api.update(baseUrl, data); // API request
// }

// function deleteBusinessList(data: any) {
//     console.log('deleteBusinessList', data);
//     const baseUrl = '/business/delete';
//     return api.delete(baseUrl, data); // API request
// }

// function registerOutlet(data: any) {
//     const baseUrl = '/outlet/register';
//     return api.create(`${baseUrl}`, data); // Pass the data to the API
// }

// function updateOutlet(data: any) {
//     const baseUrl = '/outlet/update';
//     return api.update(`${baseUrl}`, data); // Pass the data to the API
// }

// function deleteOutlet(data: any) {
//     const baseUrl = '/outlet/delete';
//     return api.delete(`${baseUrl}`, data); // Pass the data to the API
// }

// function registerBusinessUser(data: any) {
//     const baseUrl = '/business/user/register';
//     return api.create(`${baseUrl}`, data); // Pass the data to the API
// }

// function updateBusinessUser(data: any) {
//     const baseUrl = '/business/user/update';
//     return api.update(`${baseUrl}`, data); // Pass the data to the API
// }

// function deleteBusinessUser(data: any) {
//     const baseUrl = '/business/user/delete';
//     return api.delete(`${baseUrl}`, data); // Pass the data to the API
// }

// function businessUpdateIsActive(data: any) {
//     const baseUrl = '/business/update/isactive';
//     return api.update(`${baseUrl}`, data); // Pass the data to the API
// }
// function outletUpdateIsActive(data: any) {
//     const baseUrl = '/outlet/update/isactive';
//     return api.update(`${baseUrl}`, data); // Pass the data to the API
// }

// function updateOutletPrice(data: any) {
//     const baseUrl = '/item/update/outlet/price';
//     return api.update(`${baseUrl}`, data);
// }

// function registerItem(data: any) {
//     const baseUrl = '/item/register';
//     return api.create(`${baseUrl}`, data);
// }

// function updateItem(data: any) {
//     const baseUrl = '/item/update';
//     return api.update(`${baseUrl}`, data);
// }

// function deleteItem(data: any) {
//     const baseUrl = '/item/delete';
//     return api.delete(`${baseUrl}`, data);
// }

// function itemUpdateIsActive(data: any) {
//     const baseUrl = '/item/update/isactive';
//     return api.update(`${baseUrl}`, data);
// }

// function itemUpdateDisable(data: any) {
//     const baseUrl = '/item/update/disable';
//     return api.update(`${baseUrl}`, data);
// }

// function categoryUpdateDisable(data: any) {
//     const baseUrl = '/category/update/disable';
//     return api.update(`${baseUrl}`, data);
// }

// function categoryOutletLists(data: any) {
//     const baseUrl = '/category/outlet/lists';
//     return api.create(`${baseUrl}`, data);
// }
// function categoryRegister(data: any) {
//     const baseUrl = '/category/register';
//     return api.create(`${baseUrl}`, data);
// }
// function categoryDelete(data: any) {
//     const baseUrl = '/category/delete';
//     return api.delete(`${baseUrl}`, data);
// }
// function categoryUpdate(data: any) {
//     const baseUrl = '/category/update';
//     return api.update(`${baseUrl}`, data);
// }
// function categoryItemList(data: any) {
//     const baseUrl = '/category/item/list';
//     return api.create(`${baseUrl}`, data);
// }
// function categoryUpdateIsActive(data: any) {
//     const baseUrl = '/category/update/isactive';
//     return api.update(`${baseUrl}`, data);
// }

// function businessDetails(data: any) {
//     const baseUrl = '/business/details';
//     return api.create(`${baseUrl}`, data);
// }

// function recipeIngredientAdd(data: any) {
//     const baseUrl = '/recipe/ingredient/add';
//     return api.create(`${baseUrl}`, data);
// }

// function recipeIngredientList(data: any) {
//     const baseUrl = '/recipe/ingredient/list';
//     return api.create(`${baseUrl}`, data);
// }

// function recipeIngredientUpdateStatus(data: any) {
//     const baseUrl = '/recipe/ingredient/update/status';
//     return api.update(`${baseUrl}`, data);
// }

// function recipeIngredientDelete(data: any) {
//     const baseUrl = '/recipe/ingredient/delete';
//     return api.delete(`${baseUrl}`, data);
// }

// function recipeAdd(data: any) {
//     const baseUrl = '/recipe/add';
//     return api.create(`${baseUrl}`, data);
// }

// function recipeList(data: any) {
//     const baseUrl = '/recipe/list';
//     return api.create(`${baseUrl}`, data);
// }

// function recipeUpdate(data: any) {
//     const baseUrl = '/recipe/update';
//     return api.update(`${baseUrl}`, data);
// }

// function recipeDelete(data: any) {
//     const baseUrl = '/recipe/delete';
//     return api.delete(`${baseUrl}`, data);
// }

// export {
//     login,
//     logout,
//     signup,
//     forgotPassword,
//     businessList,
//     businessRegister,
//     languageList,
//     updateBusinessList,
//     deleteBusinessList,
//     registerOutlet,
//     updateOutlet,
//     deleteOutlet,
//     registerBusinessUser,
//     updateBusinessUser,
//     deleteBusinessUser,
//     businessUpdateIsActive,
//     outletUpdateIsActive,
//     updateOutletPrice,
//     registerItem,
//     updateItem,
//     deleteItem,
//     itemUpdateIsActive,
//     itemUpdateDisable,
//     categoryUpdateDisable,
//     categoryOutletLists,
//     categoryRegister,
//     categoryDelete,
//     categoryUpdate,
//     categoryItemList,
//     categoryUpdateIsActive,
//     businessDetails,
//     recipeIngredientAdd,
//     recipeIngredientDelete,
//     recipeIngredientList,
//     recipeIngredientUpdateStatus,
//     recipeAdd,
//     recipeDelete,
//     recipeUpdate,
//     recipeList,
// };

// import { APICore } from './apiCore';

// const api = new APICore();

// // account
// function login(params: { email: string; password: string }) {
//     const baseUrl = '/superadmin/login';
//     return handleAPIRequest(() => api.create(baseUrl, params));
// }

// function logout() {
//     const baseUrl = '/superadmin/logout';
//     return handleAPIRequest(() => api.create(baseUrl, {}));
// }

// function signup(params: { fullname: string; email: string; password: string }) {
//     const baseUrl = '/superadmin/register/';
//     return handleAPIRequest(() => api.create(baseUrl, params));
// }

// function forgotPassword(params: { email: string }) {
//     const baseUrl = '/superadmin/forget-password/';
//     return handleAPIRequest(() => api.create(baseUrl, params));
// }

// function businessList() {
//     const baseUrl = '/Business/List';
//     return handleAPIRequest(() => api.get(baseUrl, {}));
// }

// function businessRegister(data: any) {
//     const baseUrl = '/business/register';
//     return handleAPIRequest(() => api.create(baseUrl, data));
// }

// function languageList() {
//     const baseUrl = '/language/list';
//     return handleAPIRequest(() => api.get(baseUrl, {}));
// }

// function updateBusinessList(businessId: string, data: any) {
//     const baseUrl = `/Business/Update/${businessId}`;
//     return handleAPIRequest(() => api.put(baseUrl, data));
// }

// function deleteBusinessList(businessId: string) {
//     const baseUrl = `/business/delete/${businessId}`;
//     return handleAPIRequest(() => api.delete(baseUrl));
// }

// // Centralized API request handling for error management
// async function handleAPIRequest(request: Function) {
//     try {
//         const response = await request();
//         console.log('API Response:', response);
//         return response; // Return the response if successful
//     } catch (error) {
//         console.error('API Error:', error);
//         throw error; // Throw error for handling in the calling function or saga
//     }
// }

// export {
//     login,
//     logout,
//     signup,
//     forgotPassword,
//     businessList,
//     businessRegister,
//     languageList,
//     updateBusinessList,
//     deleteBusinessList,
// };
