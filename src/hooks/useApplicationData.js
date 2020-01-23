import { useEffect, useReducer } from 'react';
import axios from 'axios';



export const useApplicationData = () => {

  const SET_DAY = "SET_DAY";
  const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
  const SET_INTERVIEW = "SET_INTERVIEW";
  

  
  
  const reducer = (state, action) => {
    switch (action.type) {
      case SET_DAY:
        return {...state, day: action.day};
      case SET_APPLICATION_DATA:
        return {
          ...state,
          days: action.days,
          appointments : action.appointments,
          interviewers : action.interviewers,
         
        };
      case SET_INTERVIEW:
        return {
          ...state,
          appointments: action.appointments,
          days: action.days,
      };
      default:
        throw new Error(
          `Tried to reduce with unsupported action type: ${action.type}`
        );
    }
  }
  
  useEffect(() => {
    const days = axios.get(`http://localhost:8001/api/days`)
    const appointments = axios.get(`http://localhost:8001/api/appointments`)
    const interviewers = axios.get(`http://localhost:8001/api/interviewers`)
    Promise.all([
      days,
      appointments,
      interviewers
    ]).then((all) => {
      console.log('ALL', all)
      dispatch({ type : SET_APPLICATION_DATA, days: all[0].data, appointments: all[1].data, interviewers: all[2].data });
    })
  }, []);

  

  const setDay = day => dispatch({ type: SET_DAY, day });

  const [state, dispatch] = useReducer(reducer, {
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {},
  });

  const cancelInterview = (id) => {

    const appointment = {
      ...state.appointments[id],
      interview: null
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    return axios.delete(`/api/appointments/${id}`, appointment).then(() => dispatch({
      type : SET_INTERVIEW,
      ...state,
       appointments 
    }))
  }

  const bookInterview = (id, interview) => {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    return axios.put(`/api/appointments/${id}`, appointment).then(() => dispatch({
        type : SET_INTERVIEW,
        ...state,
        appointments
    }))
  }

  return {
    state,
    setDay,
    bookInterview,
    cancelInterview,
  }


}