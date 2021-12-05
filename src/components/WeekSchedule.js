import React, {useEffect, useState} from "react";
import {getDaySchedule, getWeekDay, searchInDay} from "../utils/ScheduleUtils";
import {StyleSheet, Text, View} from "react-native";
import {TabBar, TabView} from "react-native-tab-view";
import {DaySchedule} from "./DaySchedule";

function getDayIndex() {
    var day = new Date().getDay();
    if (day !== 0) {
        day--;
    }
    return day;
}

function MTabBar(props) {
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

function Scene({day, weekSchedule, searchSchedule, isSearch, searchText}) {
    const [daySchedule, setDaySchedule] = useState({daySchedule: null,})
    useEffect(() => {
        let ds
        if (!isSearch) {
            ds = getDaySchedule(weekSchedule, day)
        } else {
            ds = searchInDay(searchSchedule, searchText, day)
        }
        setDaySchedule({daySchedule: ds, day: day, isSearch: isSearch, searchText: searchText})
    }, [day, weekSchedule, searchSchedule, isSearch, searchText])

    if (day !== daySchedule.day || isSearch !== daySchedule?.isSearch || searchText !== daySchedule?.searchText) {
        return <Text style={{width: '100%', textAlign: 'center'}}>Загрузка...</Text>
    }

    return (
        <DaySchedule
            daySchedule={daySchedule?.daySchedule}
        />
    );
}

function WeekSchedule({weekSchedule, onChangeDay, isSearch, searchSchedule, searchText}) {
    const [index, setIndex] = useState(getDayIndex())

    const routes = Object.keys(weekSchedule)
        .sort()
        .map((value, index) => ({
            title: getWeekDay(new Date(value)),
            index: value,
            key: index,
        }));

    useEffect(() => {
        onChangeDay?.(routes?.[index]?.index)
    }, [index, weekSchedule])

    return (
        <View style={styles.view}>
            <TabView
                lazy
                renderTabBar={props => <MTabBar {...props}/>}
                renderScene={(scene) => <Scene day={scene?.route?.index} weekSchedule={weekSchedule}
                                               isSearch={isSearch}
                                               searchSchedule={searchSchedule} searchText={searchText}/>}
                onIndexChange={index => setIndex(index)}
                navigationState={{index: index, routes: routes}}
                initialLayout={styles.view}
                renderLazyPlaceholder={() => <Text style={{width: '100%', textAlign: 'center'}}>Загрузка...</Text>}
            />
        </View>

    )
}

const styles = StyleSheet.create({
    view: {
        height: '100%',
    },
});


export {WeekSchedule}
