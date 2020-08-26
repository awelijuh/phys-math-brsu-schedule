import * as RNFS from 'react-native-fs';

const SCHEDULE_FILE_NAME = 'schedule.json';
const SCHEDULE_FILE_PATH =
  RNFS.DocumentDirectoryPath + '/' + SCHEDULE_FILE_NAME;

export async function readSchedule() {
  try {
    if (!(await RNFS.exists(SCHEDULE_FILE_PATH))) {
      return undefined;
    }
    var f = await RNFS.readFile(SCHEDULE_FILE_PATH, 'utf8');
  } catch (e) {
    return undefined;
  }
  return JSON.parse(f);
}

export async function writeSchedule(schedule) {
  try {
    await RNFS.writeFile(SCHEDULE_FILE_PATH, JSON.stringify(schedule), 'utf8');
  } catch (e) {}
}
