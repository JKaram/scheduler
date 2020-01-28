
export const getAppointmentsForDay = (state, day) => {
  const selectedDay = state.days.find((x) => x.name === day);
  const selectedAppointments = [];

  if (!selectedDay) {
    return selectedAppointments;
  }
  for (let index in state.appointments) {
    const id = state.appointments[index].id
    if (selectedDay.appointments.includes(id)) {
      selectedAppointments.push(state.appointments[index]);
    }
  }
  return selectedAppointments;
}

export const getDayForAppointment = (state, id) => {
  return state.days.findIndex(day => day.appointments.includes(id));
}

export const getInterviewersForDay = (state, day) => {
  const selectedDay = state.days.filter((d) => d.name === day)[0];
  
  if (!selectedDay) { 
    return []
  }
  
  const interviewers = selectedDay.interviewers.map((object) => state.interviewers[object]);
  
  return interviewers;
}


export const getInterview = (state, interview) => {
  if (!interview) {
    return null;
  }
  const outputInterview = { ...interview, interviewer: state.interviewers[interview.interviewer] }
  return outputInterview;
}

