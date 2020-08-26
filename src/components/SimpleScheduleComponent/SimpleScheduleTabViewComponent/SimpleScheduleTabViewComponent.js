import React, {Component} from 'react';
import {TabBar, TabView} from 'react-native-tab-view';
import {SimpleDayScheduleComponent} from '../SimpleDayScheduleComponent/SimpleDayScheduleComponent';
import ViewPagerAdapter from 'react-native-tab-view-viewpager-adapter';
import {StyleSheet, Text, View} from 'react-native';

function getWeekDay(date) {
  date = date || new Date();
  const DAYS = [
    'Воскресенье',
    'Понедельник',
    'Вторник',
    'Среда',
    'Четверг',
    'Пятница',
    'Суббота',
  ];
  const MONTHS = [
    'января',
    'февраля',
    'марта',
    'апреля',
    'мая',
    'июня',
    'июля',
    'августа',
    'сентября',
    'октября',
    'ноября',
    'декабря',
  ];

  var day = date.getDay();

  return (
    DAYS[day] +
    '\n' +
    date.getDate() +
    ' ' +
    MONTHS[date.getMonth()] +
    ' ' +
    date.getFullYear()
  );
}

function getDayIndex() {
  var day = new Date().getDay();
  if (day !== 0) {
    day--;
  }
  return day;
}

export class SimpleScheduleTabViewComponent extends Component {
  state = {
    schedule: undefined,
    index: undefined,
    routes: [],
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (prevState?.schedule !== nextProps?.schedule) {
      const routes = Object.keys(nextProps?.schedule)
        .sort()
        .map((value, index) => ({
          title: getWeekDay(new Date(value)),
          index: value,
          key: index,
        }));
      var index = prevState?.index;
      if (index === undefined) {
        index = getDayIndex();
      }
      return {
        schedule: nextProps.schedule,
        routes: routes,
        index: index,
      };
    }
    return null;
  }

  _handleIndexChange(index) {
    // this.state.navigation.index = index;
    // this.setState({navigation: {...this.state.navigation, index: index}});
    this.setState({index: index});
    // this.state.index = index;
  }

  renderScene(scene) {
    // return <View><Text>{scene?.route?.index}</Text></View>;
    return (
      <SimpleDayScheduleComponent
        key={scene?.route?.index}
        schedule={this.state?.schedule?.[scene?.route?.index]}
      />
    );
  }

  renderTabBar(props) {
    return (
      <TabBar
        {...props}
        activeColor="black"
        inactiveColor="#546e7a"
        indicatorStyle={{backgroundColor: 'gray'}}
        // tabStyle={{width: 'auto'}}
        renderLabel={({route, focused, color}) => (
          <Text style={{color, textAlign: 'center'}}>{route.title}</Text>
        )}
        style={{backgroundColor: ''}}
        scrollEnabled={true}
      />
    );
  }

  render(): React.ReactNode {
    return (
      <View style={styles.view}>
        <TabView
          renderTabBar={this.renderTabBar.bind(this)}
          renderScene={this.renderScene.bind(this)}
          onIndexChange={this._handleIndexChange.bind(this)}
          navigationState={{index: this.state.index, routes: this.state.routes}}
          initialLayout={styles.view}
          renderPager={props => (
            <ViewPagerAdapter {...props} transition="curl" showPageIndicator/>
          )}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  view: {
    height: '100%',
  },
});
