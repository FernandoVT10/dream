import { MixFormData } from "./Mixes";

export enum MixFormActions {
  Add = "add",
  Remove = "remove",
  Update = "update",
  Reset = "reset",
  Duplicate = "duplicate",
};

export type MixFormAction = {
  type: MixFormActions.Add;
} | {
  type: MixFormActions.Remove;
  formId: number;
} | {
  type: MixFormActions.Update;
  formId: number;
  data: Omit<MixFormData, "id">;
} | {
  type: MixFormActions.Reset;
} | {
  type: MixFormActions.Duplicate;
  formId: number;
};

let mixFormId = 0;

export const intialMixesForms: MixFormData[] = [
  {
    id: mixFormId++,
    quantity: "",
    presentation: "",
    numberOfMix: "",
  },
];

function mixesFormsReducer(state: MixFormData[], action: MixFormAction): MixFormData[] {
  switch(action.type) {
    case MixFormActions.Add: {
      return [...state, {
        id: mixFormId++,
        quantity: "",
        presentation: "",
        numberOfMix: "",
      }];
    } break;
    case MixFormActions.Remove: {
      return state.filter(mix => mix.id !== action.formId);
    } break;
    case MixFormActions.Update: {
      return state.map(mix => {
        if(mix.id === action.formId) {
          return {
            id: mix.id,
            ...action.data,
          };
        }

        return mix;
      });
    } break;
    case MixFormActions.Reset: {
      mixFormId = 0;
      return intialMixesForms;
    } break;
    case MixFormActions.Duplicate: {
      const index = state.findIndex((mix) => {
        return mix.id === action.formId;
      });
      const newState = [...state];

      newState.splice(index, 0, {
        ...state[index],
        id: mixFormId++,
      });

      return newState;
    } break;
  }
}

export default mixesFormsReducer;
