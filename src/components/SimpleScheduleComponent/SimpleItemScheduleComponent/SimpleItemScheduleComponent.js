import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';

export class SimpleItemScheduleComponent extends Component {
  state = {
    time: undefined,
    subject: undefined,
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (
      nextProps?.time !== prevState?.time ||
      nextProps?.subject !== prevState?.subject
    ) {
      return {time: nextProps?.time, subject: nextProps?.subject};
    }
    return null;
  }

  render(): React.ReactNode {
    return (
      <View style={styles.container}>
        <Text style={styles.timeText}>{this.state.time}</Text>
        <View style={styles.subjectView}>
          <Text style={styles.subjectText}>{this.state.subject}</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginTop: 6,
    backgroundColor: '#cfd8dc',
    padding: 2,
  },
  timeText: {
    width: 80,
    margin: 4,
    flexWrap: 'wrap',
    textAlign: 'center',
    // fontSize: 14,
  },
  subjectView: {
    flexDirection: 'row',
    flex: 1,
    flexShrink: 1,
    flexWrap: 'wrap',
    marginLeft: 10,
  },
  subjectText: {
    // textAlign: 'center',
    // fontSize: 16,
  },
});
