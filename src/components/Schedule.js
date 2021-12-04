import React, {useEffect, useState} from "react";
import {Image, StyleSheet, Text, ToastAndroid, TouchableOpacity, View} from "react-native";
import {Picker} from "@react-native-community/picker";
import searchIcon from "../res/baseline_search_black_24dp.png"
import backIcon from "../res/baseline_arrow_back_black_24dp.png"
import {
    dateFormat,
    getCourseList,
    getCourseSchedule,
    getCurrentDateIndex,
    getDateList,
    getDayText,
    getGroupList,
    getGroupSchedule,
    getSearchSchedule,
    getWeekSchedule,
    search
} from "../utils/ScheduleUtils";
import AsyncStorage from '@react-native-community/async-storage';
import {WeekSchedule} from "./WeekSchedule";
import ActionBar from "react-native-action-bar";
import {SearchBar} from "react-native-elements";
import {readSchedule, writeSchedule} from "../parsers/StorageManager";
import firestore from "@react-native-firebase/firestore";

function StartLoad() {
    return (
        <View style={styles.viewLoading}>
            <Image
                style={styles.imageLoad}
                source={require('../res/splash.jpg')}
            />
        </View>
    )
}

function ActionSearchBar({isSearch = false, onChangeSearch, onChangeText, text, dayText}) {
    if (isSearch) {
        return (
            <View style={styles.searchCont}>
                <View style={styles.backIconContStyle}>
                    <TouchableOpacity onPress={() => onChangeSearch?.(false)}>
                        <Image
                            resizeMode="contain"
                            style={styles.backIconStyle}
                            source={backIcon}/>
                    </TouchableOpacity>
                </View>
                <SearchBar platform="ios"
                           value={text}
                           onChangeText={t => onChangeText?.(t)}
                           containerStyle={styles.searchbar}
                           onCancel={() => onChangeSearch?.(false)}
                           cancelButtonTitle={''}
                />
            </View>
        )
    }
    return (
        <>
            <ActionBar
                containerStyle={styles.bar}
                title={'Расписание'}
                titleStyle={styles.titleStyle}
                badgeColor="black"
                badgeTextColor="black"
                leftBadge={''}
                rightIconImageStyle={styles.rightIconStyle}
                rightIconContainerStyle={styles.rightIconCont}
                disableStatusBarHandling={true}
                renderRightSide={
                    props => (
                        <View style={styles.rightIconCont}>
                            <Text>{dayText}</Text>
                            <TouchableOpacity onPress={() => onChangeSearch?.(true)}>
                                <Image
                                    resizeMode="contain"
                                    style={styles.rightIconStyle}
                                    source={searchIcon}/>
                            </TouchableOpacity>
                        </View>
                    )
                }
            />
        </>
    )
}

function ScheduleComponent(props) {
    const [fullSchedule, setFullSchedule] = useState()

    const [currentDate, setCurrentDate] = useState()
    const [courseIndex, setCourseIndex] = useState()

    const [groupIndex, setGroupIndex] = useState()

    const [isSearch, setIsSearch] = useState(false)

    const [searchText, setSearchText] = useState()

    const [searchSchedule, setSearchSchedule] = useState()

    const [day, setDay] = useState()

    const weekSchedule = getWeekSchedule(fullSchedule, currentDate)
    const dateList = getDateList(fullSchedule)

    const courseSchedule = getCourseSchedule(weekSchedule, courseIndex)
    const groupSchedule = getGroupSchedule(courseSchedule, groupIndex)
    const courseList = getCourseList(weekSchedule)
    const groupList = getGroupList(courseSchedule)

    async function updateSchedule() {
        let s = await readSchedule()
        if (s != null) {
            setFullSchedule(s)
        }
        try {
            const ref = await firestore()
                .collection('scheduleRaw')
                .get();
            const docs = ref.docs;
            const d = {};
            docs.forEach(doc => {
                d[doc.id] = doc.data();
            });
            setFullSchedule(d)
            ToastAndroid.show('Загружено!', ToastAndroid.SHORT);
            await writeSchedule(d);
        } catch (e) {
            ToastAndroid.show('Не загружено!', ToastAndroid.SHORT);
        }
    }

    useEffect(() => {
        if (fullSchedule == null) {
            updateSchedule()
            AsyncStorage.getItem('courseIndex').then(r => {
                if (r == null) {
                    r = 0
                }
                r = parseInt(r)
                setCourseIndex(r);
            })
            AsyncStorage.getItem('groupIndex').then(r => {
                if (r == null) {
                    r = 0
                }
                r = parseInt(r)
                setGroupIndex(r);
            })

        } else {
            if (currentDate == null) {
                setCurrentDate(getCurrentDateIndex(dateList))
            }
        }
    }, [fullSchedule])

    useEffect(() => {
        if (groupIndex != null) {
            AsyncStorage.setItem('groupIndex', groupIndex.toString())
        }
    }, [groupIndex])

    useEffect(() => {
        if (courseIndex != null) {
            AsyncStorage.setItem('courseIndex', courseIndex.toString())
        }
    }, [courseIndex])

    useEffect(() => {
        if (fullSchedule != null) {
            setSearchSchedule(getSearchSchedule(weekSchedule))
        }
    }, [fullSchedule, currentDate])


    if (fullSchedule == null || courseIndex == null || groupIndex == null || currentDate == null) {
        return <StartLoad/>
    }

    return (
        <View style={styles.view}>
            <ActionSearchBar
                text={searchText}
                isSearch={isSearch}
                dayText={getDayText(day)}
                onChangeSearch={isSearch => {
                    setIsSearch(isSearch)
                    setSearchText(null)
                }}
                onChangeText={t => setSearchText(t)}
            />
            <Picker
                style={styles.datePicker}
                mode="dropdown"
                selectedValue={currentDate}
                onValueChange={itemValue => setCurrentDate(itemValue)}>
                {
                    dateList.map((value, index) => (
                        <Picker.Item key={index} label={dateFormat(value)} value={value}/>
                    ))
                }
            </Picker>

            {
                !isSearch && (
                    <View style={styles.pickerView}>
                        <Picker
                            style={styles.picker}
                            mode="dropdown"
                            selectedValue={courseIndex}
                            onValueChange={itemValue => setCourseIndex(itemValue)}>
                            {
                                courseList.map((value, index) => (
                                    <Picker.Item key={index} label={value} value={index}/>
                                ))
                            }
                        </Picker>
                        <Picker
                            style={styles.picker}
                            mode="dropdown"
                            selectedValue={groupIndex}
                            onValueChange={itemValue => setGroupIndex(itemValue)}>
                            {
                                groupList.map((value, index) => (
                                    <Picker.Item key={index} label={value} value={index}/>
                                ))
                            }
                        </Picker>
                    </View>

                )
            }
            <WeekSchedule onChangeDay={setDay} isSearch={isSearch}
                          weekSchedule={isSearch ? search(searchSchedule, searchText) : groupSchedule}/>
        </View>

    )

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
    viewDate: {},
    bar: {
        fontSize: 20,
        backgroundColor: '#607d8b',
        height: 50,
    },
    titleStyle: {
        color: 'black',
        fontSize: 20,
    },
    rightIconStyle: {
        height: 34,
        // width: 'auto',
        tintColor: 'black',
    },
    backIconStyle: {
        // height: '100%',
        // width: '100%',
        width: 34,
        tintColor: 'black',
    },
    backIconContStyle: {
        height: '100%',
        width: 50,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#607d8b',

    },
    rightIconCont: {
        flexDirection: 'row',
        height: '100%',
        // width: 'auto',
        justifyContent: 'center',
        alignItems: 'center',

    },
    searchCont: {
        flexDirection: 'row',
        height: 60
    },
    searchbar: {
        // width: "80%",
        flex: 1,
        padding: 0,
        backgroundColor: '#607d8b',
    }
});


export {ScheduleComponent}
