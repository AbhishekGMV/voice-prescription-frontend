import { React } from "react";
import { Card, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

export default function DoctorCard({ doctor }) {
  return (
    <Card style={{ width: "18rem" }}>
      <FontAwesomeIcon className="fa-icon" icon={faUser} />{" "}
      {/*replace with doctor image*/}
      <Card.Body>
        <Card.Title>{doctor.dname}</Card.Title>
        <Card.Text>{doctor.role}</Card.Text>
        <Card.Text>{doctor.demail}</Card.Text>
        <Button variant="primary">Profile</Button>
      </Card.Body>
    </Card>
  );
}
