import { SubsAndPlansActionTypes } from './constants';

type SubPlanListSuccess = {
    plan_id: string;
    plan_name: string;
    description: string;
    price: string;
    billing_cycle: string;
    max_users: string;
    max_outlets: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
};

type SubPlanDelete = {
    plan_id: string;
};

type SubPlanCreate = {
    plan_name: string;
    description: string;
    price: string;
    billing_cycle: string;
    max_users: string;
    max_outlets: string;
};
type SubscriptionPlan = {
    plan_id: string;
    plan_name: string;
    description: string;
    price: string;
    billing_cycle: string;
    max_users: string;
    max_outlets: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
};

interface SubsAndPlansState {
    loading: boolean;
    plans: SubscriptionPlan[];
    error: string | null;
    successMessage: string | null;
}

const initialState: SubsAndPlansState = {
    loading: false,
    plans: [],
    error: null,
    successMessage: null,
};

type SubAdd = {
    business_id: string;
    outlet_id: string;
    plan_id: string;
    status: string;
    start_date: string;
    end_date: string;
};

export type SubsAndPlansAction =
    | {
          type: typeof SubsAndPlansActionTypes.SUBSCRIPTION_PLAN_LIST;
      }
    | {
          type: typeof SubsAndPlansActionTypes.SUBSCRIPTION_PLAN_LIST_SUCCESS;
          payload: SubPlanListSuccess[];
      }
    | {
          type: typeof SubsAndPlansActionTypes.SUBSCRIPTION_PLAN_LIST_ERROR;
          payload: { error: string };
      }
    | {
          type: typeof SubsAndPlansActionTypes.SUBSCRIPTION_PLAN_DELETE;
          payload: SubPlanDelete;
      }
    | {
          type: typeof SubsAndPlansActionTypes.SUBSCRIPTION_PLAN_DELETE_SUCCESS;
          payload: { message: string };
      }
    | {
          type: typeof SubsAndPlansActionTypes.SUBSCRIPTION_PLAN_DELETE_ERROR;
          payload: { error: string };
      }
    | {
          type: typeof SubsAndPlansActionTypes.SUBSCRIPTION_PLAN_ADD;
          payload: SubPlanCreate;
      }
    | {
          type: typeof SubsAndPlansActionTypes.SUBSCRIPTION_PLAN_ADD_SUCCESS;
          payload: { message: string };
      }
    | {
          type: typeof SubsAndPlansActionTypes.SUBSCRIPTION_PLAN_ADD_ERROR;
          payload: { error: string };
      }
    | {
          type: typeof SubsAndPlansActionTypes.SUBSCRIPTION_ADD;
          payload: SubAdd;
      }
    | {
          type: typeof SubsAndPlansActionTypes.SUBSCRIPTION_ADD_SUCCESS;
          payload: { message: string };
      }
    | {
          type: typeof SubsAndPlansActionTypes.SUBSCRIPTION_ADD_ERROR;
          payload: { error: string };
      };
const subsAndPlansReducer = (state = initialState, action: SubsAndPlansAction): SubsAndPlansState => {
    switch (action.type) {
        case SubsAndPlansActionTypes.SUBSCRIPTION_PLAN_LIST:
        case SubsAndPlansActionTypes.SUBSCRIPTION_PLAN_DELETE:
        case SubsAndPlansActionTypes.SUBSCRIPTION_PLAN_ADD:
        case SubsAndPlansActionTypes.SUBSCRIPTION_ADD:
            return {
                ...state,
                loading: true,
                error: null,
                successMessage: null,
            };

        case SubsAndPlansActionTypes.SUBSCRIPTION_PLAN_LIST_SUCCESS:
            return {
                ...state,
                loading: false,
                plans: action.payload,
                error: null,
            };

        case SubsAndPlansActionTypes.SUBSCRIPTION_PLAN_LIST_ERROR:
        case SubsAndPlansActionTypes.SUBSCRIPTION_PLAN_DELETE_ERROR:
        case SubsAndPlansActionTypes.SUBSCRIPTION_PLAN_ADD_ERROR:
        case SubsAndPlansActionTypes.SUBSCRIPTION_ADD_ERROR:
            return {
                ...state,
                loading: false,
                error: action.payload.error,
            };

        case SubsAndPlansActionTypes.SUBSCRIPTION_PLAN_DELETE_SUCCESS:
        case SubsAndPlansActionTypes.SUBSCRIPTION_PLAN_ADD_SUCCESS:
        case SubsAndPlansActionTypes.SUBSCRIPTION_ADD_SUCCESS:
            return {
                ...state,
                loading: false,
                successMessage: action.payload.message,
                error: null,
            };

        default:
            return state;
    }
};

export default subsAndPlansReducer;
