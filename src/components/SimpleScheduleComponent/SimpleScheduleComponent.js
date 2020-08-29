import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';
import {Picker} from '@react-native-community/picker';
import moment from 'moment';
import {SimpleScheduleTabViewComponent} from './SimpleScheduleTabViewComponent/SimpleScheduleTabViewComponent';
import {Text, Image} from 'react-native';

function dateFormat(s) {
  if (s === undefined) {
    return undefined;
  }
  return (
    moment(s).format('DD.MM.YYYY') +
    ' \u2013 ' +
    moment(s)
      .add(5, 'days')
      .format('DD.MM.YYYY')
  );
}

function getCurrentDateIndex(dateList) {
  var date = moment(new Date());
  for (var i in dateList) {
    let s = moment(dateList[i]);
    if (s.add(-1, 'days') <= date && date <= s.add(5, 'days')) {
      return dateList[i];
    }
  }
  return dateList[dateList.length - 1];
}

function normalizeState(
  nextState,
  defaultCourseIndex = 0,
  defaultGroupIndex = 0,
) {
  var schedule = nextState.schedule;
  if (schedule === undefined) {
    return nextState;
  }
  nextState.dateList = Object.keys(schedule).sort();
  if (
    nextState.currentDate === undefined ||
    !nextState.dateList.includes(nextState.currentDate)
  ) {
    nextState.currentDate = getCurrentDateIndex(nextState.dateList);
  }
  schedule = schedule?.[nextState.currentDate]?.schedule;
  nextState.courseList = schedule?.map?.(value => value.courseName);
  if (nextState.currentCourseIndex === undefined) {
    if (schedule?.[defaultCourseIndex] !== undefined) {
      nextState.currentCourseIndex = defaultCourseIndex;
    } else {
      nextState.currentCourseIndex = 0;
    }
  }
  schedule = schedule?.[nextState.currentCourseIndex]?.schedule;
  nextState.groupList = schedule?.map?.(value => value.groupName);

  if (nextState.currentGroupIndex === undefined) {
    if (schedule?.[defaultGroupIndex] !== undefined) {
      nextState.currentGroupIndex = defaultGroupIndex;
    } else {
      nextState.currentGroupIndex = 0;
    }
  }
  schedule = schedule?.[nextState.currentGroupIndex]?.schedule;
  nextState.currentSchedule = schedule;
  return nextState;
}

export class SimpleScheduleComponent extends Component {
  state = {
    currentDate: undefined,
    currentCourseIndex: undefined,
    currentGroupIndex: undefined,
    dateList: [],
    courseList: [],
    groupList: [],
    currentSchedule: undefined,
    schedule: undefined,
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps?.schedule !== prevState?.schedule) {
      return normalizeState(
        {
          ...prevState,
          schedule: nextProps.schedule,
        },
        nextProps.courseIndex,
        nextProps.groupIndex,
      );
    }
    return null;
  }

  componentDidMount(): void {
    this.props?.updateSchedule();
  }

  _handleChangePicker(stateKey, itemValue) {
    var q = {...this.state};
    q[stateKey] = itemValue;
    q = normalizeState(q);
    this.setState(q);
    this.props?.updateCourseGroup?.(q.currentCourseIndex, q.currentGroupIndex);
  }

  render() {
    if (this.state.schedule === undefined) {
      return (
        <View style={styles.viewLoading}>
          <Image
            style={styles.imageLoad}
            source={require('../../res/splash.jpg')}
          />
        </View>
      );
    }
    return (
      <View style={styles.view}>
        <Picker
          style={styles.datePicker}
          mode="dropdown"
          selectedValue={this.state.currentDate}
          onValueChange={this._handleChangePicker.bind(this, 'currentDate')}>
          {this.state.dateList.map((value, index) => (
            <Picker.Item key={index} label={dateFormat(value)} value={value} />
          ))}
        </Picker>
        <View style={styles.pickerView}>
          <Picker
            style={styles.picker}
            mode="dropdown"
            selectedValue={this.state.currentCourseIndex}
            onValueChange={this._handleChangePicker.bind(
              this,
              'currentCourseIndex',
            )}>
            {this.state.courseList.map((value, index) => (
              <Picker.Item key={index} label={value} value={index} />
            ))}
          </Picker>
          <Picker
            style={styles.picker}
            mode="dropdown"
            selectedValue={this.state.currentGroupIndex}
            onValueChange={this._handleChangePicker.bind(
              this,
              'currentGroupIndex',
            )}>
            {this.state.groupList.map((value, index) => (
              <Picker.Item key={index} label={value} value={index} />
            ))}
          </Picker>
        </View>

        <SimpleScheduleTabViewComponent schedule={this.state.currentSchedule} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  view: {
    height: '100%',
    width: '100%',
    backgroundColor: '#eceff1',
  },
  pickerView: {
    justifyContent: 'flex-start',
    flexDirection: 'row',
  },
  picker: {
    width: '49%',
  },
  datePicker: {
    width: '98%',
  },
  viewLoading: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  loading: {
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 20,
  },
  imageLoad: {
    // marginTop: '-20%',
  },
});
