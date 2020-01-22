 


export const getAppointmentsForDay = (state, day) => {
  const selectedDay = state.days.find((d) => d.name === day);
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

export const getInterview = (state, interview) => {

  if (!interview) {
    return null;
  }

  const outputInterview = {
    ...interview,
    interviewer: state.interviewers[interview.interviewer],
  }

  return outputInterview;
}

