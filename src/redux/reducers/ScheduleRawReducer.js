import {
  UPDATE_SCHEDULE_RAW,
  UPDATE_SCHEDULE_RAW_ALL,
  UPDATE_SCHEDULE_RAW_COURSe_GROUP,
  UPDATE_SCHEDULE_RAW_STORAGE,
} from './types';

const initialState = {
  schedule: undefined,
  courseIndex: undefined,
  groupIndex: undefined,
};

export function schedule(state = initialState, action) {
  if (action.type === UPDATE_SCHEDULE_RAW_ALL) {
    return {
      ...state,
      schedule: action.schedule,
      courseIndex: action.courseIndex,
      groupIndex: action.groupIndex,
    };
  }
  if (action.type === UPDATE_SCHEDULE_RAW) {
    return {
      ...state,
      schedule: action.schedule,
    };
  }
  if (action.type === UPDATE_SCHEDULE_RAW_COURSe_GROUP) {
    return {
      ...state,
      courseIndex: action.courseIndex,
      groupIndex: action.groupIndex,
    };
  }
  if (action.type === UPDATE_SCHEDULE_RAW_STORAGE) {
    if (state.schedule === undefined) {
      return {...state, schedule: action.schedule};
    }
  }
  return state;
}
