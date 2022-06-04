import { React, useState } from "react";
import { Card, Button } from "react-bootstrap";
import { Navigate } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

export default function DoctorCard({ doctor, match }) {
  const pid = match.params.id;
  const [redirect, setRedirect] = useState(false);

  if (redirect) {
    return (
      <Navigate
        to={{
          pathname: `/patient/${pid}/book-doctor`,
          state: {
            pid: pid,
            doctor: doctor,
          },
        }}
      />
    );
  }

  return (
    <Card style={{ width: "18rem" }}>
      <FontAwesomeIcon className="fa-icon" icon={faUser} />{" "}
      {/*replace Font awesome icon with doctor image*/}
      <Card.Body>
        <Card.Title>{doctor.dname}</Card.Title>
        <Card.Text>{doctor.role}</Card.Text>
        <Card.Text>{doctor.demail}</Card.Text>
        <Button variant="primary" onClick={() => setRedirect(true)}>
          Consult
        </Button>
      </Card.Body>
    </Card>
  );
}
