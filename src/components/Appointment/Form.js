import React, { useState } from "react";
import "./styles.scss";

import InterviewerList from '../InterviewerList';
import Button from "../Button";

export default function Form(props) {
  let [name, setName] = useState(props.name ? props.name : '');
  let [interviewer, setInterviewer] = useState(props.interviewer || null);

  const reset = () => {
    setName("");
    setInterviewer(null);
  }

  const cancel = () => {
    reset();
    props.onCancel();
  }

  return (
    <main className="appointment__card appointment__card--create">
      <section className="appointment__card-left">
        <form autoComplete="off" onSubmit={event => event.preventDefault()}>
          <input
            className="appointment__create-input text--semi-bold"
            value={name}
            name="name"
            type="text"
            placeholder="Enter Student Name"
            onChange={(event) => setName(event.target.value)}
          />
        </form>
        <InterviewerList interviewers={props.interviewers} interviewer={interviewer} onChange={setInterviewer} />
      </section>
      <section className="appointment__card-right">
        <section className="appointment__actions">
          <Button danger
            onClick={() => cancel()}>
            Cancel</Button>
          <Button confirm onClick={(() => props.onSave(name, interviewer))}>Save</Button>
        </section>
      </section>
    </main>
  );
}



