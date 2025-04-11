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
          payload: SubPlanListSuccess;
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

export const subPlanList = (): SubsAndPlansAction => ({
    type: SubsAndPlansActionTypes.SUBSCRIPTION_PLAN_LIST,
});
export const subPlanListSuccess = (data: SubPlanListSuccess): SubsAndPlansAction => ({
    type: SubsAndPlansActionTypes.SUBSCRIPTION_PLAN_LIST_SUCCESS,
    payload: data,
});
export const subPlanListError = (error: string): SubsAndPlansAction => ({
    type: SubsAndPlansActionTypes.SUBSCRIPTION_PLAN_LIST_ERROR,
    payload: { error },
});

export const subPlanAdd = (data: SubPlanCreate): SubsAndPlansAction => ({
    type: SubsAndPlansActionTypes.SUBSCRIPTION_PLAN_ADD,
    payload: data,
});
export const subPlanAddSuccess = (message: string): SubsAndPlansAction => ({
    type: SubsAndPlansActionTypes.SUBSCRIPTION_PLAN_ADD_SUCCESS,
    payload: { message },
});
export const subPlanAddError = (error: string): SubsAndPlansAction => ({
    type: SubsAndPlansActionTypes.SUBSCRIPTION_PLAN_ADD_ERROR,
    payload: { error },
});

export const subPlanDelete = (plan_id: string): SubsAndPlansAction => ({
    type: SubsAndPlansActionTypes.SUBSCRIPTION_PLAN_DELETE,
    payload: { plan_id },
});
export const subPlanDeleteSuccess = (message: string): SubsAndPlansAction => ({
    type: SubsAndPlansActionTypes.SUBSCRIPTION_PLAN_DELETE_SUCCESS,
    payload: { message },
});
export const subPlanDeleteError = (error: string): SubsAndPlansAction => ({
    type: SubsAndPlansActionTypes.SUBSCRIPTION_PLAN_DELETE_ERROR,
    payload: { error },
});

export const subAdd = (data: SubAdd): SubsAndPlansAction => ({
    type: SubsAndPlansActionTypes.SUBSCRIPTION_ADD,
    payload: data,
});
export const subAddSuccess = (message: string): SubsAndPlansAction => ({
    type: SubsAndPlansActionTypes.SUBSCRIPTION_ADD_SUCCESS,
    payload: { message },
});
export const subAddError = (error: string): SubsAndPlansAction => ({
    type: SubsAndPlansActionTypes.SUBSCRIPTION_ADD_ERROR,
    payload: { error },
});
