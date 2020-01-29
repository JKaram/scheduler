import { useEffect, useReducer } from 'react';
import axios from 'axios';
import { getDayForAppointment } from '../helpers/selectors'


const SET_DAY = "SET_DAY";
const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
const SET_INTERVIEW = "SET_INTERVIEW";

//  ------ Reducer   ------  //
const reducer = (state, action) => {
  switch (action.type) {
    case SET_DAY:
      return { ...state, day: action.day };
    case SET_APPLICATION_DATA:
      return {
        ...state,
        days: action.days,
        appointments: action.appointments,
        interviewers: action.interviewers,
      };
    case SET_INTERVIEW:
      const appointments = {
        ...state.appointments,
        [action.appointment.id]: action.appointment
      };
      const dayIndex = getDayForAppointment(state, action.appointment.id)
      const days = JSON.parse(JSON.stringify(state.days));
      const day = days[dayIndex];
      day.spots = day.appointments.length - day.appointments.filter(id => appointments[id].interview).length
      return {
        ...state,
        appointments,
        days
      };
    default:
      throw new Error(
        `Tried to reduce with unsupported action type: ${action.type}`
      );
  }
}

export const useApplicationData = () => {

  const [state, dispatch] = useReducer(reducer, {
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {},
  });

  const setDay = day => dispatch({ type: SET_DAY, day });

  //  ------ API CALL  ------  //
  useEffect(() => {
    const days = axios.get(`/api/days`)
    const appointments = axios.get(`/api/appointments`)
    const interviewers = axios.get(`/api/interviewers`)
    Promise.all([
      days,
      appointments,
      interviewers
    ]).then((all) => {
      dispatch({ type: SET_APPLICATION_DATA, days: all[0].data, appointments: all[1].data, interviewers: all[2].data });
    })
  }, []);

  //  ------ API Functions  ------  //
  const cancelInterview = (id) => {

    const appointment = {
      ...state.appointments[id],
      interview: null
    };

    return axios.delete(`/api/appointments/${id}`, appointment)
      .then(() => dispatch({
        type: SET_INTERVIEW,
        appointment
      }))
  }

  const bookInterview = (id, interview) => {

    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };

    return axios.put(`/api/appointments/${id}`, appointment)
      .then(() => dispatch({
        type: SET_INTERVIEW,
        appointment
      }))
  }

  return {
    state,
    setDay,
    bookInterview,
    cancelInterview
  }


}