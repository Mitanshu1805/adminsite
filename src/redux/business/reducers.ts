import { updateBusinessList } from './actions';
import { BusinessActionTypes } from './constants';

interface Outlet {
    outlet_id: string;
    outlet_name: string;
    outlet_type: string;
    outlet_address: string;
    gst_no: string;
    currency: string;
    is_primary_outlet: boolean;
    language_id: string;
}

interface BusinessUser {
    user_id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    address: string;
}

interface Business {
    business_id: string;
    business_logo: string;
    business_name: string;
    business_contact: string;
    business_address: string;
    gst_no: string;
    cuisine: string;
    outlets: Outlet[];
    outlet_id: string;
    business_users: BusinessUser[];
    user_id: string;
}

interface LanguageState {
    languages: { id: string; name: string }[];
    loading: boolean;
    error: string | null;
}

type BusinessState = {
    loading: boolean;
    businesses: Business[];
    error: string | null;
    registrationMessage: string | null;
};

const INITIAL_STATE: BusinessState = {
    loading: false,
    businesses: [],
    error: null,
    registrationMessage: null,
};

// Initial state for language
const INITIAL_LANGUAGE_STATE: LanguageState = {
    languages: [],
    loading: false,
    error: null,
};

// Initial state for form
const INITIAL_FORM_STATE = {
    business_name: '',
    business_contact: '',
    business_address: '',
    gst_no: '',
    cuisine: '',
    // Add more fields as necessary
};

// Action types
const SET_BUSINESS_FORM_DATA = 'SET_BUSINESS_FORM_DATA';

// Payload interfaces
interface BusinessListSuccessPayload {
    data: Business[];
}

interface BusinessListErrorPayload {
    error: string;
}

interface RegisterBusinessSuccessPayload {
    message: string;
}

interface RegisterBusinessErrorPayload {
    error: string;
}

interface LanguageListSuccessPayload {
    languages: { id: string; name: string }[];
}

interface LanguageListErrorPayload {
    error: string;
}

interface UpdateBusinessListErrorPayload {
    error: string;
}

interface DeleteBusinessListErrorPayload {
    error: string;
}

interface RegisterOutletSuccessPayload {
    message: string;
}

interface RegisterOutletErrorPayload {
    error: string;
}

interface UpdateOutletPayload {
    business_id: string;
    outlet_id: string;
    outlet: Outlet;
}

interface UpdateOutletSuccessPayload {
    business_id: string;
    outlet: Outlet;
}

interface UpdateOutletErrorPayload {
    business_id: string;
    outlet: Outlet;
}

interface DeleteOutletPayload {
    business_id: string;
    outlet_id: string; // outlet ID for deletion
}

interface DeleteOutletSuccessPayload {
    business_id: string;
    outlet: Outlet;
    outlet_id: string; // outlet ID for
}

interface DeleteOutletErrorPayload {
    business_id: string;
    outlet: Outlet;
}

interface UpdateBusinessUserPayload {
    user_id: string;
    business_users: BusinessUser;
}

interface UpdateBusinessUserSuccessPayload {
    user_id: string;
    business_users: BusinessUser;
}

interface UpdateBusinessUserErrorPayload {
    user_id: string;
    business_users: BusinessUser;
    error: string;
}

interface DeleteBusinessUserPayload {
    user_id: string;
    outlet_id: string; // outlet ID for deletion
    business_id: string; // business
}

interface DeleteBusinessUserSuccessPayload {
    user_id: string;
    business_id: string;
    business_users: BusinessUser; // full outlet object for update
    outlet_id: string; // outlet ID for
}

interface DeleteBusinessUserErrorPayload {
    user_id: string;
    business_id: string;
    business_users: BusinessUser;
    error: string;
}

type BusinessActions =
    | { type: typeof BusinessActionTypes.BUSINESS_LIST }
    | { type: typeof BusinessActionTypes.BUSINESS_LIST_SUCCESS; payload: BusinessListSuccessPayload }
    | { type: typeof BusinessActionTypes.BUSINESS_LIST_ERROR; payload: BusinessListErrorPayload }
    | { type: typeof BusinessActionTypes.REGISTER_BUSINESS }
    | { type: typeof BusinessActionTypes.REGISTER_BUSINESS_SUCCESS; payload: RegisterBusinessSuccessPayload }
    | { type: typeof BusinessActionTypes.REGISTER_BUSINESS_ERROR; payload: RegisterBusinessErrorPayload }
    | { type: typeof BusinessActionTypes.LANGUAGE_LIST }
    | { type: typeof BusinessActionTypes.LANGUAGE_LIST_SUCCESS; payload: LanguageListSuccessPayload }
    | { type: typeof BusinessActionTypes.LANGUAGE_LIST_ERROR; payload: LanguageListErrorPayload }
    | { type: typeof BusinessActionTypes.UPDATE_BUSINESS_LIST; payload: Business }
    | { type: typeof BusinessActionTypes.UPDATE_BUSINESS_LIST_SUCCESS; payload: Business }
    | { type: typeof BusinessActionTypes.UPDATE_BUSINESS_LIST_ERROR; payload: UpdateBusinessListErrorPayload }
    | { type: typeof BusinessActionTypes.DELETE_BUSINESS_LIST; payload: string }
    | { type: typeof BusinessActionTypes.DELETE_BUSINESS_LIST_SUCCESS; payload: string }
    | { type: typeof BusinessActionTypes.DELETE_BUSINESS_LIST_ERROR; payload: DeleteBusinessListErrorPayload }
    | { type: typeof BusinessActionTypes.REGISTER_OUTLET; payload: UpdateOutletPayload } // Correct usage of FormData
    | { type: typeof BusinessActionTypes.REGISTER_OUTLET_SUCCESS; payload: { message: string } }
    | { type: typeof BusinessActionTypes.REGISTER_OUTLET_ERROR; payload: { error: string } }
    | { type: typeof BusinessActionTypes.UPDATE_OUTLET; payload: UpdateOutletPayload }
    | { type: typeof BusinessActionTypes.UPDATE_OUTLET_SUCCESS; payload: UpdateOutletSuccessPayload }
    | { type: typeof BusinessActionTypes.UPDATE_OUTLET_ERROR; payload: UpdateBusinessListErrorPayload }
    | { type: typeof BusinessActionTypes.DELETE_OUTLET; payload: DeleteOutletPayload }
    | { type: typeof BusinessActionTypes.DELETE_OUTLET_SUCCESS; payload: DeleteOutletSuccessPayload }
    | { type: typeof BusinessActionTypes.DELETE_OUTLET_ERROR; payload: DeleteBusinessListErrorPayload }
    | { type: typeof BusinessActionTypes.REGISTER_BUSINESS_USER }
    | { type: typeof BusinessActionTypes.REGISTER_BUSINESS_USER_SUCCESS; payload: RegisterBusinessSuccessPayload }
    | { type: typeof BusinessActionTypes.REGISTER_BUSINESS_USER_ERROR; payload: RegisterBusinessErrorPayload }
    | { type: typeof BusinessActionTypes.UPDATE_BUSINESS_USER; payload: UpdateBusinessUserPayload }
    | { type: typeof BusinessActionTypes.UPDATE_BUSINESS_USER_SUCCESS; payload: UpdateBusinessUserSuccessPayload }
    | { type: typeof BusinessActionTypes.UPDATE_BUSINESS_USER_ERROR; payload: UpdateBusinessUserErrorPayload }
    | { type: typeof BusinessActionTypes.DELETE_BUSINESS_USER; payload: DeleteBusinessUserPayload }
    | { type: typeof BusinessActionTypes.DELETE_BUSINESS_USER_SUCCESS; payload: DeleteBusinessUserSuccessPayload }
    | { type: typeof BusinessActionTypes.DELETE_BUSINESS_USER_ERROR; payload: DeleteBusinessUserErrorPayload };

// Language Reducer
const languageReducer = (state = INITIAL_LANGUAGE_STATE, action: BusinessActions): LanguageState => {
    switch (action.type) {
        case BusinessActionTypes.LANGUAGE_LIST:
            return { ...state, loading: true };
        case BusinessActionTypes.LANGUAGE_LIST_SUCCESS:
            return {
                ...state,
                loading: false,
                languages: action.payload.languages,
                error: null,
            };
        case BusinessActionTypes.LANGUAGE_LIST_ERROR:
            return { ...state, loading: false, error: action.payload.error };
        default:
            return state;
    }
};

// Form Reducer
const formReducer = (state = INITIAL_FORM_STATE, action: any) => {
    switch (action.type) {
        case SET_BUSINESS_FORM_DATA:
            return { ...state, ...action.payload };
        default:
            return state;
    }
};

// Business Reducer
const businessReducer = (state = INITIAL_STATE, action: BusinessActions): BusinessState => {
    switch (action.type) {
        case BusinessActionTypes.BUSINESS_LIST:
            return { ...state, loading: true };

        case BusinessActionTypes.BUSINESS_LIST_SUCCESS:
            return {
                ...state,
                loading: false,
                businesses: action.payload.data,
                error: null,
            };

        case BusinessActionTypes.BUSINESS_LIST_ERROR:
            return {
                ...state,
                loading: false,
                error: action.payload.error,
            };

        case BusinessActionTypes.REGISTER_BUSINESS:
            return { ...state, loading: true, registrationMessage: null };

        case BusinessActionTypes.REGISTER_BUSINESS_SUCCESS:
            return {
                ...state,
                loading: false,
                registrationMessage: action.payload.message,
                error: null,
            };

        case BusinessActionTypes.REGISTER_BUSINESS_ERROR:
            return {
                ...state,
                loading: false,
                registrationMessage: null,
                error: action.payload.error,
            };

        case BusinessActionTypes.UPDATE_BUSINESS_LIST:
            const updatedBusinesses = state.businesses.map((business) =>
                business.business_id === action.payload.business_id ? { ...business, ...action.payload } : business
            );
            return {
                ...state,
                businesses: updatedBusinesses,
                loading: false,
                registrationMessage: null,
                error: null,
            };

        case BusinessActionTypes.UPDATE_BUSINESS_LIST_SUCCESS:
            return {
                ...state,
                businesses: state.businesses.map((business) =>
                    business.business_id === action.payload.business_id ? { ...business, ...action.payload } : business
                ),
                loading: false,
                registrationMessage: null,
                error: null,
            };

        case BusinessActionTypes.UPDATE_BUSINESS_LIST_ERROR:
            return {
                ...state,
                loading: false,
                error: action.payload.error,
            };

        case BusinessActionTypes.DELETE_BUSINESS_LIST:
            return {
                ...state,
                businesses: state.businesses.filter((business) => business.business_id !== action.payload),
                loading: false,
                registrationMessage: null,
                error: null,
            };

        case BusinessActionTypes.DELETE_BUSINESS_LIST_SUCCESS:
            return {
                ...state,
                businesses: state.businesses.filter((business) => business.business_id !== action.payload),
                loading: false,
                registrationMessage: null,
                error: null,
            };

        case BusinessActionTypes.DELETE_BUSINESS_LIST_ERROR:
            return {
                ...state,
                loading: false,
                error: action.payload.error,
            };

        case BusinessActionTypes.REGISTER_OUTLET:
            return { ...state, loading: true };

        case BusinessActionTypes.REGISTER_OUTLET_SUCCESS:
            return {
                ...state,
                loading: false,
                registrationMessage: action.payload.message,
                error: null,
            };

        case BusinessActionTypes.REGISTER_OUTLET_ERROR:
            return {
                ...state,
                loading: false,
                registrationMessage: null,
                error: action.payload.error,
            };

        // Handle updating an outlet
        case BusinessActionTypes.UPDATE_OUTLET:
            console.log('Action Payload in UPDATE_OUTLET:', action.payload);
            return {
                ...state,
                businesses: state.businesses.map((business) => {
                    if (business.business_id === action.payload.business_id) {
                        // Check if outlets exist and is an array
                        if (!Array.isArray(business.outlets)) {
                            console.log('Outlets is not an array or is undefined', business.outlets);
                        }
                        const updatedOutlets = business.outlets?.map((outlet: Outlet) => {
                            console.log('Checking outlet:', outlet);
                            if (outlet?.outlet_id === action.payload.outlet_id) {
                                return { ...outlet, ...action.payload };
                            }
                            return outlet;
                        });
                        return { ...business, outlets: updatedOutlets };
                    }
                    return business;
                }),
                loading: false,
                registrationMessage: null,
                error: null,
            };

        case BusinessActionTypes.UPDATE_OUTLET_SUCCESS:
            return {
                ...state,
                businesses: state.businesses.map((business) => {
                    if (business.business_id === action.payload.business_id) {
                        const updatedOutlets = business.outlets.map((outlet: Outlet) =>
                            outlet.outlet_id === action.payload.outlet.outlet_id
                                ? { ...outlet, ...action.payload.outlet }
                                : outlet
                        );
                        return { ...business, outlets: updatedOutlets };
                    }
                    return business;
                }),
                loading: false,
                registrationMessage: null,
                error: null,
            };

        case BusinessActionTypes.UPDATE_OUTLET_ERROR:
            return {
                ...state,
                loading: false,
                error: action.payload.error,
            };

        // Handle deleting an outlet
        case BusinessActionTypes.DELETE_OUTLET:
            return {
                ...state,
                businesses: state.businesses.map((business) => {
                    if (business.business_id === action.payload.business_id) {
                        const updatedOutlets = business.outlets.filter(
                            (outlet: Outlet) => outlet.outlet_id !== action.payload.outlet_id
                        );
                        return { ...business, outlets: updatedOutlets };
                    }
                    return business; // Keep business unchanged if no match
                }),
                loading: false,
                registrationMessage: null,
                error: null,
            };

        case BusinessActionTypes.DELETE_OUTLET_SUCCESS:
            return {
                ...state,
                businesses: state.businesses.map((business) => {
                    if (business.business_id === action.payload.business_id) {
                        const updatedOutlets = business.outlets.filter(
                            (outlet: Outlet) => outlet.outlet_id !== action.payload.outlet_id
                        );
                        return { ...business, outlets: updatedOutlets };
                    }
                    return business;
                }),
                loading: false,
                registrationMessage: null,
                error: null,
            };

        case BusinessActionTypes.DELETE_OUTLET_ERROR:
            return {
                ...state,
                loading: false,
                error: action.payload.error,
            };

        case BusinessActionTypes.REGISTER_BUSINESS_USER:
            return { ...state, loading: true, registrationMessage: null };

        case BusinessActionTypes.REGISTER_BUSINESS_USER_SUCCESS:
            return {
                ...state,
                loading: false,
                registrationMessage: action.payload.message,
                error: null,
            };

        case BusinessActionTypes.REGISTER_BUSINESS_USER_ERROR:
            return {
                ...state,
                loading: false,
                registrationMessage: null,
                error: action.payload.error,
            };

        case BusinessActionTypes.UPDATE_BUSINESS_USER:
            console.log('Action Payload in UPDATE_BUSINESS_USER:', action.payload);
            return {
                ...state,
                businesses: state.businesses.map((business) => {
                    if (business.user_id === action.payload.user_id) {
                        // Ensure business_users is an array
                        if (!Array.isArray(business.business_users)) {
                            console.warn('BusinessUsers is not an array or is undefined', business.business_users);
                            return business; // Return the original business if business_users is invalid
                        }

                        const updatedBusinessUsers = business.business_users.map((business_user: BusinessUser) => {
                            console.log('Checking business user:', business_user);
                            if (business_user?.user_id === action.payload.user_id) {
                                return { ...business_user, ...action.payload }; // Update the matching business_user
                            }
                            return business_user; // Return unchanged if no match
                        });

                        return { ...business, business_users: updatedBusinessUsers }; // Update business with new business_users
                    }
                    return business; // Return unchanged business if no match
                }),
                loading: false,
                registrationMessage: null,
                error: null,
            };

        case BusinessActionTypes.UPDATE_BUSINESS_USER_SUCCESS:
            return {
                ...state,
                businesses: state.businesses.map((business) => {
                    if (business.user_id === action.payload.user_id) {
                        const updatedBusinessUsers = business.business_users.map((business_users: BusinessUser) =>
                            business_users.user_id === action.payload.business_users.user_id
                                ? { ...business_users, ...action.payload.business_users }
                                : business_users
                        );
                        return { ...business, business_users: updatedBusinessUsers };
                    }
                    return business;
                }),
                loading: false,
                registrationMessage: null,
                error: null,
            };

        case BusinessActionTypes.UPDATE_BUSINESS_USER_ERROR:
            return {
                ...state,
                loading: false,
                error: action.payload.error,
            };

        // Handle deleting an outlet
        case BusinessActionTypes.DELETE_BUSINESS_USER:
            return {
                ...state,
                businesses: state.businesses.map((business) => {
                    if (business.user_id === action.payload.user_id) {
                        const updatedBusinessUsers = business.business_users.filter(
                            (business_users: BusinessUser) => business_users.user_id !== action.payload.user_id
                        );
                        return { ...business, business_users: updatedBusinessUsers };
                    }
                    return business; // Keep business unchanged if no match
                }),
                loading: false,
                registrationMessage: null,
                error: null,
            };

        case BusinessActionTypes.DELETE_BUSINESS_USER_SUCCESS:
            return {
                ...state,
                businesses: state.businesses.map((business) => {
                    if (business.user_id === action.payload.user_id) {
                        const updatedBusinessUsers = business.business_users.filter(
                            (business_users: BusinessUser) => business_users.user_id !== action.payload.user_id
                        );
                        return { ...business, business_users: updatedBusinessUsers };
                    }
                    return business;
                }),
                loading: false,
                registrationMessage: null,
                error: null,
            };

        case BusinessActionTypes.DELETE_BUSINESS_USER_ERROR:
            return {
                ...state,
                loading: false,
                error: action.payload.error,
            };

        default:
            return state;
    }
};

export { businessReducer, languageReducer, formReducer };
