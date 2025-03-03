import { Outlet } from 'react-router-dom';
import { BusinessActionTypes } from './constants';
import { AppDispatch } from '../store'; // Adjust based on your store

// User Data Type
type UserData = {
    id: number;
    email: string;
    username: string;
    firstName: string;
    lastName: string;
    role: string;
    token: string;
};

// Outlet Type
interface Outlet {
    outlet_id: string;
    outlet_name: string;
    outlet_type: string;
    is_primary_outlet: boolean;
    outlet_address: string;
    outlet_gst_no: string;
    language_id: string;
}

type OutletPayload = {
    outlet_name: string;
    outlet_type: string;
    outlet_address: string;
    gst_no: string;
    business_id: string;
    language_id: string;
    is_primary_outlet: boolean;
    currency: string;
};

type UpdateOutlet = {
    outlet_id: string;
    outlet_name: string;
    outlet_type: string;
    outlet_address: string;
    gst_no: string;
    business_id: string;
    language_id: string;
};

type RegisterBusinessUser = {
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    address: string;
    business_id: string;
};

type UpdateBusinessUser = {
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    address: string;
    user_id: string;
};

// Business Type
type Business = {
    business_id: string;
    business_logo: File | string;
    business_name: string;
    business_contact: string;
    business_address: string;
    gst_no: string;
    cuisine: string;
    outlets: Outlet[];
    user_id: string;
};

// Register Business Payload Type
export interface RegisterBusinessPayload {
    business_name: string;
    business_contact: string;
    business_address: string;
    gst_no: string;
    cuisine: string;
    currency: string;
    business_logo: File | String;
    outlets: Outlet[];
    business_users: {
        first_name: string;
        last_name: string;
        email: string;
        phone_number: string;
        address: string;
    };
    user_id: string;
}

// Define the action types for Business and Language
export type BusinessAction =
    | { type: typeof BusinessActionTypes.BUSINESS_LIST }
    | { type: typeof BusinessActionTypes.BUSINESS_LIST_SUCCESS; payload: { data: Business[] } }
    | { type: typeof BusinessActionTypes.BUSINESS_LIST_ERROR; payload: { error: string } }
    | { type: typeof BusinessActionTypes.REGISTER_BUSINESS; payload: FormData }
    | { type: typeof BusinessActionTypes.REGISTER_BUSINESS_SUCCESS; payload: { message: string } }
    | { type: typeof BusinessActionTypes.REGISTER_BUSINESS_ERROR; payload: { error: string } }
    | { type: typeof BusinessActionTypes.LANGUAGE_LIST }
    | { type: typeof BusinessActionTypes.RESET }
    | { type: typeof BusinessActionTypes.LANGUAGE_LIST_SUCCESS; payload: { languages: { id: string; name: string }[] } }
    | { type: typeof BusinessActionTypes.LANGUAGE_LIST_ERROR; payload: { error: string } }
    | {
          type: typeof BusinessActionTypes.UPDATE_BUSINESS_LIST;
          payload:
              | {
                    business_id: string;
                    business_name: string;
                    business_contact: string;
                    business_logo: string;
                    business_address: string;
                    cuisine: string;
                    gst_no: string;
                }
              | FormData;
      }
    | { type: typeof BusinessActionTypes.UPDATE_BUSINESS_LIST_SUCCESS; payload: { message: string } }
    | { type: typeof BusinessActionTypes.UPDATE_BUSINESS_LIST_ERROR; payload: { error: string } }
    | { type: typeof BusinessActionTypes.DELETE_BUSINESS_LIST; payload: { business_id: string } }
    | { type: typeof BusinessActionTypes.DELETE_BUSINESS_LIST_SUCCESS; payload: { message: string } }
    | { type: typeof BusinessActionTypes.DELETE_BUSINESS_LIST_ERROR; payload: { error: string } }
    | { type: typeof BusinessActionTypes.REGISTER_OUTLET; payload: OutletPayload }
    | { type: typeof BusinessActionTypes.REGISTER_OUTLET_SUCCESS; payload: { message: string } }
    | { type: typeof BusinessActionTypes.REGISTER_OUTLET_ERROR; payload: { error: string } }
    | { type: typeof BusinessActionTypes.UPDATE_OUTLET; payload: UpdateOutlet }
    | { type: typeof BusinessActionTypes.UPDATE_OUTLET_SUCCESS; payload: { message: string } }
    | { type: typeof BusinessActionTypes.UPDATE_OUTLET_ERROR; payload: { error: string } }
    | { type: typeof BusinessActionTypes.DELETE_OUTLET; payload: { outlet_id: string; business_id: string } }
    | { type: typeof BusinessActionTypes.DELETE_OUTLET_SUCCESS; payload: { message: string } }
    | { type: typeof BusinessActionTypes.DELETE_OUTLET_ERROR; payload: { error: string } }
    | { type: typeof BusinessActionTypes.REGISTER_BUSINESS_USER; payload: RegisterBusinessUser }
    | { type: typeof BusinessActionTypes.REGISTER_BUSINESS_USER_SUCCESS; payload: { message: string } }
    | { type: typeof BusinessActionTypes.REGISTER_BUSINESS_USER_ERROR; payload: { error: string } }
    | { type: typeof BusinessActionTypes.UPDATE_BUSINESS_USER; payload: UpdateBusinessUser }
    | { type: typeof BusinessActionTypes.UPDATE_BUSINESS_USER_SUCCESS; payload: { message: string } }
    | { type: typeof BusinessActionTypes.UPDATE_BUSINESS_USER_ERROR; payload: { error: string } }
    | { type: typeof BusinessActionTypes.DELETE_BUSINESS_USER; payload: { user_id: string; business_id: string } }
    | { type: typeof BusinessActionTypes.DELETE_BUSINESS_USER_SUCCESS; payload: { message: string } }
    | { type: typeof BusinessActionTypes.DELETE_BUSINESS_USER_ERROR; payload: { error: string } }
    | {
          type: typeof BusinessActionTypes.BUSINESS_UPDATE_ISACTIVE;
          payload: { business_id: string; is_active: boolean };
      }
    | { type: typeof BusinessActionTypes.BUSINESS_UPDATE_ISACTIVE_SUCCESS; payload: { message: string } }
    | { type: typeof BusinessActionTypes.BUSINESS_UPDATE_ISACTIVE_ERROR; payload: { error: string } }
    | {
          type: typeof BusinessActionTypes.OUTLET_UPDATE_ISACTIVE;
          payload: { outlet_id: string; is_active: boolean };
      }
    | { type: typeof BusinessActionTypes.OUTLET_UPDATE_ISACTIVE_SUCCESS; payload: { message: string } }
    | { type: typeof BusinessActionTypes.OUTLET_UPDATE_ISACTIVE_ERROR; payload: { error: string } }
    | { type: typeof BusinessActionTypes.BUSINESS_DETAILS; payload: { business_id: string } }
    | { type: typeof BusinessActionTypes.BUSINESS_DETAILS_SUCCESS; payload: { message: string } }
    | { type: typeof BusinessActionTypes.BUSINESS_DETAILS_ERROR; payload: { error: string } };

export const businessList = (): BusinessAction => ({
    type: BusinessActionTypes.BUSINESS_LIST,
});

export const resetBusiness = (): BusinessAction => ({
    type: BusinessActionTypes.RESET,
});

// Action creator for a successful business list response
export const businessApiResponseSuccess = (data: Business[]): BusinessAction => ({
    type: BusinessActionTypes.BUSINESS_LIST_SUCCESS,
    payload: { data },
});

// Action creator for a failed business list response
export const businessApiResponseError = (error: string): BusinessAction => ({
    type: BusinessActionTypes.BUSINESS_LIST_ERROR,
    payload: { error },
});

// Action creator for registering a business
export const registerBusiness = (data: FormData): BusinessAction => ({
    type: BusinessActionTypes.REGISTER_BUSINESS,
    payload: data,
});

// Action creator for successful business registration
export const registerBusinessSuccess = (message: string): BusinessAction => ({
    type: BusinessActionTypes.REGISTER_BUSINESS_SUCCESS,
    payload: { message },
});

// Action creator for failed business registration
export const registerBusinessError = (error: string): BusinessAction => ({
    type: BusinessActionTypes.REGISTER_BUSINESS_ERROR,
    payload: { error },
});

// Action to set form data
export const setFormData = (data: any) => ({
    type: 'SET_FORM_DATA',
    payload: data,
});

// Action creator for fetching the language list
export const languageList = (): BusinessAction => ({
    type: BusinessActionTypes.LANGUAGE_LIST,
});

// Action creator for a successful language list response
export const languageListSuccess = (languages: { id: string; name: string }[]): BusinessAction => ({
    type: BusinessActionTypes.LANGUAGE_LIST_SUCCESS,
    payload: { languages }, // This directly sends the array
});

// Action creator for a failed language list response
export const languageListError = (error: string): BusinessAction => ({
    type: BusinessActionTypes.LANGUAGE_LIST_ERROR,
    payload: { error },
});

// Action creators for updating business
export const updateBusinessList = (
    data:
        | {
              business_id: string;
              business_name: string;
              business_contact: string;
              business_logo: string;
              business_address: string;
              cuisine: string;
              gst_no: string;
          }
        | FormData
): BusinessAction => ({
    type: BusinessActionTypes.UPDATE_BUSINESS_LIST,
    payload: data, // This can now handle both FormData and objects
});

export const updateBusinessListSuccess = (message: string): BusinessAction => ({
    type: BusinessActionTypes.UPDATE_BUSINESS_LIST_SUCCESS,
    payload: { message },
});

export const updateBusinessListError = (error: string): BusinessAction => ({
    type: BusinessActionTypes.UPDATE_BUSINESS_LIST_ERROR,
    payload: { error },
});

// Action creators for deleting business
export const deleteBusinessList = (business_id: string): BusinessAction => ({
    type: BusinessActionTypes.DELETE_BUSINESS_LIST,
    payload: { business_id },
});

export const deleteBusinessListSuccess = (message: string): BusinessAction => ({
    type: BusinessActionTypes.DELETE_BUSINESS_LIST_SUCCESS,
    payload: { message },
});

export const deleteBusinessListError = (error: string): BusinessAction => ({
    type: BusinessActionTypes.DELETE_BUSINESS_LIST_ERROR,
    payload: { error },
});

export const registerOutlet = (data: OutletPayload): BusinessAction => ({
    type: BusinessActionTypes.REGISTER_OUTLET,
    payload: data,
});

// Action creator for successful business registration
export const registerOutletSuccess = (message: string): BusinessAction => ({
    type: BusinessActionTypes.REGISTER_OUTLET_SUCCESS,
    payload: { message },
});

// Action creator for failed business registration
export const registerOutletError = (error: string): BusinessAction => ({
    type: BusinessActionTypes.REGISTER_OUTLET_ERROR,
    payload: { error },
});

// Action creator for updating the outlet
export const updateOutlet = (data: {
    outlet_id: string;
    outlet_name: string;
    outlet_type: string;
    outlet_address: string;
    gst_no: string;
    business_id: string;
    language_id: string;
}): BusinessAction => ({
    type: BusinessActionTypes.UPDATE_OUTLET,
    payload: data, // No FormData here, just the plain object
});

export const updateOutletSuccess = (message: string): BusinessAction => ({
    type: BusinessActionTypes.UPDATE_OUTLET_SUCCESS,
    payload: { message }, // Ensure that message is correctly typed here
});

export const updateOutletError = (error: string): BusinessAction => ({
    type: BusinessActionTypes.UPDATE_OUTLET_ERROR,
    payload: { error }, // Correctly pass the error here
});

// Action creators for deleting business
export const deleteOutlet = (outlet_id: string, business_id: string): BusinessAction => ({
    type: BusinessActionTypes.DELETE_OUTLET,
    payload: { outlet_id, business_id },
});

export const deleteOutletSuccess = (message: string): BusinessAction => ({
    type: BusinessActionTypes.DELETE_OUTLET_SUCCESS,
    payload: { message },
});

export const deleteOutletError = (error: string): BusinessAction => ({
    type: BusinessActionTypes.DELETE_OUTLET_ERROR,
    payload: { error },
});

export const registerBusinessUser = (data: RegisterBusinessUser): BusinessAction => ({
    type: BusinessActionTypes.REGISTER_BUSINESS_USER,
    payload: data,
});

// Action creator for successful business registration
export const registerBusinessUserSuccess = (message: string): BusinessAction => ({
    type: BusinessActionTypes.REGISTER_BUSINESS_USER_SUCCESS,
    payload: { message },
});

// Action creator for failed business registration
export const registerBusinessUserError = (error: string): BusinessAction => ({
    type: BusinessActionTypes.REGISTER_BUSINESS_USER_ERROR,
    payload: { error },
});

export const updateBusinessUser = (data: {
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    address: string;
    user_id: string;
}): BusinessAction => ({
    type: BusinessActionTypes.UPDATE_BUSINESS_USER,
    payload: data, // No FormData here, just the plain object
});

export const updateBusinessUserSuccess = (message: string): BusinessAction => ({
    type: BusinessActionTypes.UPDATE_BUSINESS_USER_SUCCESS,
    payload: { message }, // Ensure that message is correctly typed here
});

export const updateBusinessUserError = (error: string): BusinessAction => ({
    type: BusinessActionTypes.UPDATE_BUSINESS_USER_ERROR,
    payload: { error }, // Correctly pass the error here
});

// Action creators for deleting business
export const deleteBusinessUser = (user_id: string, business_id: string): BusinessAction => ({
    type: BusinessActionTypes.DELETE_BUSINESS_USER,
    payload: { user_id, business_id },
});

export const deleteBusinessUserSuccess = (message: string): BusinessAction => ({
    type: BusinessActionTypes.DELETE_BUSINESS_USER_SUCCESS,
    payload: { message },
});

export const deleteBusinessUserError = (error: string): BusinessAction => ({
    type: BusinessActionTypes.DELETE_BUSINESS_USER_ERROR,
    payload: { error },
});

export const businessUpdateIsActive = (business_id: string, is_active: boolean): BusinessAction => ({
    type: BusinessActionTypes.BUSINESS_UPDATE_ISACTIVE,
    payload: { business_id, is_active },
});

export const businessUpdateIsActiveSuccess = (message: string): BusinessAction => ({
    type: BusinessActionTypes.BUSINESS_UPDATE_ISACTIVE_SUCCESS,
    payload: { message },
});

export const businessUpdateIsActiveError = (error: string): BusinessAction => ({
    type: BusinessActionTypes.BUSINESS_UPDATE_ISACTIVE_ERROR,
    payload: { error },
});

export const outletUpdateIsActive = (outlet_id: string, is_active: boolean): BusinessAction => ({
    type: BusinessActionTypes.OUTLET_UPDATE_ISACTIVE,
    payload: { outlet_id, is_active },
});

export const outletUpdateIsActiveSuccess = (message: string): BusinessAction => ({
    type: BusinessActionTypes.OUTLET_UPDATE_ISACTIVE_SUCCESS,
    payload: { message },
});

export const outletUpdateIsActiveError = (error: string): BusinessAction => ({
    type: BusinessActionTypes.OUTLET_UPDATE_ISACTIVE_ERROR,
    payload: { error },
});

export const businessDetails = (business_id: string): BusinessAction => ({
    type: BusinessActionTypes.BUSINESS_DETAILS,
    payload: { business_id },
});

export const businessDetailsSuccess = (message: string): BusinessAction => ({
    type: BusinessActionTypes.BUSINESS_DETAILS_SUCCESS,
    payload: { message },
});

export const businessDetailsError = (error: string): BusinessAction => ({
    type: BusinessActionTypes.BUSINESS_DETAILS_ERROR,
    payload: { error },
});
