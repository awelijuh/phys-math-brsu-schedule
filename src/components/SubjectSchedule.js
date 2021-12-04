import {StyleSheet, Text, View} from "react-native";
import React from "react";


function SubjectSchedule({time, subject, group}) {
    return (
        <View style={styles.container}>
            <View style={styles.timeView}>
                <Text style={styles.timeText}>{time}</Text>
            </View>
            {
                group != null && (
                    <View style={styles.groupView}>
                        <Text style={styles.groupText}>{group}</Text>
                    </View>
                )
            }
            <View style={styles.subjectView}>
                <Text style={styles.subjectText}>{subject}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        marginTop: 6,
        backgroundColor: '#cfd8dc',
        padding: 2,
    },
    timeView: {
        flexDirection: 'column',
        flex: 0,
        flexShrink: 1,
        flexWrap: 'wrap',
        // marginLeft: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    timeText: {
        width: 80,
        margin: 4,
        flexWrap: 'wrap',
        textAlign: 'center',
        // fontSize: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
    subjectView: {
        flexDirection: 'row',
        flex: 1,
        flexShrink: 1,
        flexWrap: 'wrap',
        marginLeft: 10,
    },
    groupView: {
        flexDirection: 'column',
        flex: 0,
        flexShrink: 1,
        flexWrap: 'wrap',
        width: 45,
        // marginLeft: 10,
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
    },
    subjectText: {
        // textAlign: 'center',
        // fontSize: 16,
    },
    groupText: {
        fontWeight: 'bold'
    },
});

export {SubjectSchedule}
