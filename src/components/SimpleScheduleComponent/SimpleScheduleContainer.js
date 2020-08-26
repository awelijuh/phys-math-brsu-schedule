import {connect} from 'react-redux';
import {SimpleScheduleComponent} from './SimpleScheduleComponent';
import {
  fetchSchedule,
  updateCourseGroup,
} from '../../redux/actions/ScheduleRawAction';

const mapStateToProps = state => ({
  schedule: state?.scheduleRaw?.schedule,
  courseIndex: state?.scheduleRaw?.courseIndex,
  groupIndex: state?.scheduleRaw?.groupIndex,
});

const mapDispatchToProps = dispatch => ({
  updateSchedule: () => dispatch(fetchSchedule()),
  updateCourseGroup: (courseIndex, groupIndex) =>
    dispatch(updateCourseGroup(courseIndex, groupIndex)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SimpleScheduleComponent);
