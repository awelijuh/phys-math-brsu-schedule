import {ScrollView, StyleSheet, View} from "react-native";
import React from "react";
import {SubjectSchedule} from "./SubjectSchedule";

function DaySchedule({daySchedule}) {
    if (daySchedule?.length === 0) {
        return (
            <View style={styles.scene}>
                <SubjectSchedule
                    time={""}
                    subject={"НИЧЕГО НЕ НАЙДЕНО"}
                />
            </View>
        )
    }

    return (
        <View style={styles.scene}>
            <ScrollView contentContainerStyle={{paddingBottom: 150}}>
                {daySchedule?.map?.((value, index) => (
                    <SubjectSchedule
                        key={index}
                        time={value?.time}
                        subject={value?.subject}
                        group={value?.group}
                    />
                ))}
            </ScrollView>
        </View>

    )
}

const styles = StyleSheet.create({
    scene: {
        flex: 1,
        margin: 4,
        height: 'auto',
    },
});


export {DaySchedule}
