import {combineReducers} from 'redux';
import {schedule} from './ScheduleRawReducer';

export const rootReducer = combineReducers({
  scheduleRaw: schedule,
});
