import React, {useEffect, useState} from "react";
import {getDaySchedule, getWeekDay} from "../utils/ScheduleUtils";
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

function Scene({scene, weekSchedule}) {
    return (
        <DaySchedule
            key={scene?.route?.index}
            daySchedule={getDaySchedule(weekSchedule, scene?.route?.index)}
        />
    );
}

function WeekSchedule({weekSchedule, onChangeDay}) {
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
                renderTabBar={props => <MTabBar {...props}/>}
                renderScene={(scene) => <Scene scene={scene} weekSchedule={weekSchedule}/>}
                onIndexChange={index => setIndex(index)}
                navigationState={{index: index, routes: routes}}
                initialLayout={styles.view}
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
