import { React, useState, useEffect } from "react";
import { Button, Container, Col, Row } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowAltCircleLeft } from "@fortawesome/free-solid-svg-icons";
import DoctorCard from "./DoctorCard";
import api from "./../api";

export default function Doctor({ history }) {
  const [doctors, setDoctors] = useState([]);
  useEffect(() => {
    api.get("./doctor").then((res) => {
      setDoctors(res.data);
    });
  }, []);

  return (
    <Container>
      <div>
        <Button onClick={() => history.goBack()}>
          <FontAwesomeIcon icon={faArrowAltCircleLeft} />
          Go Back
        </Button>
        <Col>
          <Row>
            {doctors.map((doc) => {
              return <DoctorCard key={doc.did} doctor={doc} />;
            })}
          </Row>
        </Col>
      </div>
    </Container>
  );
}
