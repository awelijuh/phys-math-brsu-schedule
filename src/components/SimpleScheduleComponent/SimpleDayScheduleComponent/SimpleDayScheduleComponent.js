import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';
import {SimpleItemScheduleComponent} from '../SimpleItemScheduleComponent/SimpleItemScheduleComponent';

export class SimpleDayScheduleComponent extends React.PureComponent {
  state = {
    schedule: undefined,
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps?.schedule !== prevState?.schedule) {
      return {schedule: nextProps.schedule};
    }
    return null;
  }

  render(): React.ReactNode {
    return (
      <View style={styles.scene}>
        {this.state?.schedule?.map?.((value, index) => (
          <SimpleItemScheduleComponent
            key={index}
            time={value?.time}
            subject={value?.subject}
          />
        ))}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  scene: {
    flex: 1,
    margin: 4,
  },
});
