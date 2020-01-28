import React from "react";
import Button from "../Button";
import "./styles.scss";

export default function Empty(props) {

  return (
    <main className="appointment__card appointment__card--confirm">
      <h1 className="text--semi-bold">Are you sure you would like to delete?</h1>
      <section className="appointment__actions">
        <Button danger onClick={props.onCancel}>Cancel</Button>
        <Button danger onClick={() => props.cancelInterview(props.id)}>Confirm</Button>
      </section>
    </main>
  );
}

