import React from 'react';
import "./styles.scss";

import Header from './Header';
import Show from './Show';
import Empty from './Empty';
import Form from './Form';
import Status from './Status';
import Confirm from './Confirm';
import Error from './Error';
import { useVisualMode } from "../../hooks/useVisualMode"


const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const SAVING = "SAVING";
const CONFIRM = "CONFIRM";
const DELETING = "DELETE";
const ERROR_SAVE = "ERROR_SAVE ";
const ERROR_DELETE = "ERROR_DELETE";



export default function Appointment(props) {

  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );


  function cancelInterview(id) {
    transition(DELETING, true);
    props
      .cancelInterview(props.id)
      .then(() => transition(EMPTY))
      .catch(error => transition(ERROR_DELETE, true));
  }


  function onEdit() {

    transition(CREATE)
    props.bookInterview(props.id, props.interview)
  }

  function onDelete() {
    transition(CONFIRM);
  }

  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };

    transition(SAVING);
    props
      .bookInterview(props.id, interview)
      .then(res => transition(SHOW))
      .catch(
        error => transition(ERROR_SAVE, true)
      );
  };


  return (
    <article className="appointment" data-testid="appointment">

      <Header
        time={props.time}
      />

      {mode === EMPTY && (
        <Empty
          onAdd={() => transition(CREATE)}
        />
      )}

      {mode === CREATE && (
        <Form
          id={props.id}
          interviewers={props.interviewers}
          onCancel={back}
          onSave={save}
          name={props.interview && props.interview.student}
          interviewer={props.interview && props.interview.interviewer.id}

        />
      )}


      {mode === SHOW && (
        <Show
          id={props.id}
          student={props.interview.student}
          interviewer={props.interview.interviewer}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      )}

      {mode === CONFIRM && (
        <Confirm
          id={props.id}
          message={"Are you sure you would like to delete?"}
          onCancel={() => back()}
          cancelInterview={cancelInterview}

        />
      )}

      {mode === SAVING && (
        <Status
          message={'Saving'}
        />
      )}

      {mode === DELETING && (
        <Status
          message={'Deleting'}
        />
      )}

      {mode === ERROR_SAVE && (
        <Error
          message={'Could not save appointment.'}
          onCancel={() => back()}
        />
      )}

      {mode === ERROR_DELETE && (
        <Error
          message={'Could not cancel appointment.'}
          onCancel={() => back()}
        />
      )}

    </article>
  );
};

