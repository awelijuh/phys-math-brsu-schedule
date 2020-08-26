import {
  UPDATE_SCHEDULE_RAW,
  UPDATE_SCHEDULE_RAW_ALL,
  UPDATE_SCHEDULE_RAW_COURSe_GROUP,
  UPDATE_SCHEDULE_RAW_STORAGE,
} from '../reducers/types';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-community/async-storage';
import {readSchedule, writeSchedule} from '../../parsers/StorageManager';
import {ToastAndroid} from 'react-native';

async function getCourseGroup() {
  var courseIndex = await AsyncStorage.getItem('courseIndex');
  var groupIndex = await AsyncStorage.getItem('groupIndex');
  if (courseIndex == null) {
    courseIndex = 0;
  }
  if (groupIndex == null) {
    groupIndex = 0;
  }
  courseIndex = parseInt(courseIndex);
  groupIndex = parseInt(groupIndex);
  return {courseIndex: courseIndex, groupIndex: groupIndex};
}

export function fetchSchedule() {
  return async dispatch => {
    var r = await getCourseGroup();
    dispatch(updateCourseGroupAction(r.courseIndex, r.groupIndex));
    readSchedule().then(s => {
      dispatch(updateScheduleStorage(s));
    });
    try {
      const ref = await firestore()
        .collection('scheduleRaw')
        .get();
      console.log(ref);
      const docs = ref.docs;
      const d = {};
      docs.forEach(doc => {
        d[doc.id] = doc.data();
      });
      dispatch(updateSchedule(d));
      ToastAndroid.show('Загружено!', ToastAndroid.SHORT);
      await writeSchedule(d);
    } catch (e) {
      ToastAndroid.show('Не загружено!', ToastAndroid.SHORT);
    }
  };
}

const updateSchedule = schedule => ({
  type: UPDATE_SCHEDULE_RAW,
  schedule: schedule,
});

const updateScheduleAll = (schedule, courseIndex, groupIndex) => ({
  type: UPDATE_SCHEDULE_RAW_ALL,
  schedule: schedule,
  courseIndex: courseIndex,
  groupIndex: groupIndex,
});

const updateScheduleStorage = schedule => ({
  type: UPDATE_SCHEDULE_RAW_STORAGE,
  schedule: schedule,
});

export function updateCourseGroup(courseIndex, groupIndex) {
  return async dispatch => {
    await AsyncStorage.setItem('courseIndex', courseIndex.toString());
    await AsyncStorage.setItem('groupIndex', groupIndex.toString());
    dispatch(updateCourseGroupAction(courseIndex, groupIndex));
  };
}

export const updateCourseGroupAction = (courseIndex, groupIndex) => ({
  type: UPDATE_SCHEDULE_RAW_COURSe_GROUP,
  courseIndex: courseIndex,
  groupIndex: groupIndex,
});
