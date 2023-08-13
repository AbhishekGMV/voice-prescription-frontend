import { React } from "react";
import { Card, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useParams } from "react-router-dom";

export default function DoctorCard({ doctor }) {
  const navigate = useNavigate();
  const { pid } = useParams();

  return (
    <Card style={{ width: "18rem" }}>
      <FontAwesomeIcon className="fa-icon" icon={faUser} />{" "}
      {/*replace Font awesome icon with doctor image*/}
      <Card.Body>
        <Card.Title>{doctor.dname}</Card.Title>
        <Card.Text>{doctor.role}</Card.Text>
        <Card.Text>{doctor.demail}</Card.Text>
        <Button
          variant="primary"
          onClick={() =>
            navigate(`/patient/${pid}/book-doctor`, {
              state: {
                pid,
                doctor,
              },
            })
          }
        >
          Consult
        </Button>
      </Card.Body>
    </Card>
  );
}
