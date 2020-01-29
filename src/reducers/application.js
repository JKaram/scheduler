
const SET_DAY = "SET_DAY";
const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
const SET_INTERVIEW = "SET_INTERVIEW";


const getDayForAppointment = (state, id) => {
  return state.days.findIndex(day => day.appointments.includes(id));
}

export default function reducer(state, action) {
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

