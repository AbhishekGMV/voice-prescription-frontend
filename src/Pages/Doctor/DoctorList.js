import { React, useState, useEffect } from "react";
import { Button, Container, Col, Row } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowAltCircleLeft } from "@fortawesome/free-solid-svg-icons";
import DoctorCard from "../../components/Doctor/DoctorCard";
import api from "../../api";

export default function Doctor({ history, match }) {
  const [doctors, setDoctors] = useState([]);
  useEffect(() => {
    api.get("./get-available-doctors").then((res) => {
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
              return <DoctorCard key={doc.did} match={match} doctor={doc} />;
            })}
          </Row>
        </Col>
      </div>
    </Container>
  );
}
