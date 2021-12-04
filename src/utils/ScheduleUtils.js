import moment from "moment";

export function getCurrentDateIndex(dateList) {
    var date = moment(new Date());
    for (var i in dateList) {
        let s = moment(dateList[i]);
        if (s.add(-1, 'days') <= date && date <= s.add(6, 'days')) {
            return dateList[i];
        }
    }
    return dateList[dateList.length - 1];
}

export function getDayText(dateStr) {
    if (dateStr == null || dateStr === '') {
        return ''
    }
    let date = moment(new Date(dateStr).setHours(0, 0, 0, 0))
    if (date == null) {
        return ''
    }
    let todayDate = moment(new Date().setHours(0, 0, 0, 0))
    if (date.diff(todayDate) === 0) {
        return 'Сегодня';
    }
    if (date.add(1, "day").diff(todayDate) === 0) {
        return 'Вчера'
    }
    if (todayDate.add(1, 'day').diff(date) === 0) {
        return 'Завтра'
    }
    if (date.week() === todayDate.week() && date.year() === todayDate.year()) {
        return 'Текущая неделя'
    }
    if (date.week() - 1 === todayDate.week() && date.year() === todayDate.year()) {
        return 'Следующая неделя'
    }
    if (date.week() + 1 === todayDate.week() && date.year() === todayDate.year()) {
        return 'Прошлая неделя'
    }
    if (date < todayDate) {
        return 'Прошлое'
    }
    return 'Будующее'
}

export function getWeekSchedule(fullSchedule, date) {
    return fullSchedule?.[date]?.schedule;
}

export function getDateList(fullSchedule) {
    if (fullSchedule == null) {
        return null
    }
    return Object.keys(fullSchedule).sort();
}

export function getCourseSchedule(weekSchedule, courseIndex) {
    return weekSchedule?.[courseIndex]?.schedule;
}

export function getCourseList(weekSchedule) {
    return weekSchedule?.map?.(value => value.courseName);
}

export function getGroupList(courseSchedule) {
    return courseSchedule?.map?.(value => value.groupName);
}

export function getGroupSchedule(courseSchedule, groupIndex) {
    return courseSchedule?.[groupIndex]?.schedule;
}

export function getDaySchedule(groupSchedule, day) {
    return groupSchedule?.[day]
}

export function dateFormat(s) {
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

export function getWeekDay(date) {
    date = date || new Date();

    const day = date.getDay();

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

export function getSearchSchedule(weekSchedule) {
    const courseList = getCourseList(weekSchedule)
    const schedule = {}
    for (let course in courseList) {
        const courseSchedule = getCourseSchedule(weekSchedule, course)
        const groupList = getGroupList(courseSchedule)
        for (let group in groupList) {
            const groupSchedule = getGroupSchedule(courseSchedule, group)
            for (let day in groupSchedule) {
                if (schedule[day] == null) {
                    schedule[day] = []
                }
                for (let itemIndex in groupSchedule[day]) {
                    let item = groupSchedule[day][itemIndex]
                    if (item?.subject != null && item?.subject?.replace?.(' ', '') !== '') {
                        let pushed = false
                        let ssd = schedule[day]
                        for (let i in ssd) {
                            if (ssd[i].time === item.time && ssd[i].subject === item.subject) {
                                ssd[i].group += "\n" + groupList[group]
                                pushed = true
                                break
                            }
                        }

                        if (!pushed) {
                            schedule[day].push(
                                {
                                    ...item,
                                    group: groupList[group],
                                    fullSearchText: replaceAll(item.subject.toLowerCase(), ' ', '')
                                })
                        }
                    }
                }
            }
        }
    }
    for (let day in schedule) {
        schedule[day] = schedule[day].sort((a, b) => {
            if (a.time > b.time) {
                return 1;
            }
            if (a.time < b.time) {
                return -1;
            }
            return 0;
        })
    }
    return schedule

}

function replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);
}


export function search(searchSchedule, text) {
    if (text == null || text === '') {
        return searchSchedule;
    }
    text = replaceAll(text, ' ', '').toLowerCase()

    const schedule = {}

    for (let day in searchSchedule) {
        schedule[day] = []
        let s = searchSchedule[day]
        for (let i in s) {
            let item = s[i]
            if (item.fullSearchText.includes(text)) {
                schedule[day].push(item)
            }
        }
    }
    return schedule
}
