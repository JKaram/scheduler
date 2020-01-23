import React, { useState, useEffect } from "react";
import axios from 'axios'

import "components/Application.scss";
import DayList from "./DayList";
import Appointment from "components/Appointment";
import { getAppointmentsForDay, getInterviewersForDay, getInterview } from "../helpers/selectors";



export default function Application(props) {


  const setDay = day => setState({ ...state, day });
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {},
  });


  function bookInterview(id, interview) {
    console.log(id, interview);

    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };

    const appointments = { 
      ...state.appointments,
      [id]: appointment
    };

    setState({
      ...state,
      appointments
    });
    
    return axios.put(`/api/appointments/${id}`, appointment).then(() => setState(prev => ({...state, appointments})))
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
      setState(prev => ({ ...prev, days: all[0].data, appointments: all[1].data, interviewers: all[2].data }));
    });
  }, []);
  return (
    <main className="layout">
      <section className="sidebar">
        <img
          className="sidebar--centered"
          src="images/logo.png"
          alt="Interview Scheduler"
        />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
          <DayList
            days={state.days}
            day={state.day}
            setDay={setDay}
          />
        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
      </section>
      <section className="schedule">


        {getAppointmentsForDay(state, state.day).map(appointment => {
          const interview = getInterview(state, appointment.interview);

          return (
            <Appointment
              key={appointment.id}
              id={appointment.id}
              time={appointment.time}
              interview={interview}
              interviewers={getInterviewersForDay(state, state.day)}
              bookInterview={bookInterview}
            />
          )
        })}

        <Appointment key="last" time="5pm" />
      </section>
    </main>
  );
}
