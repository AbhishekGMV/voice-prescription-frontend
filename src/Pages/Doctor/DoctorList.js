import { React, useState, useEffect } from "react";
import { Button, Container, Col, Row } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowAltCircleLeft } from "@fortawesome/free-solid-svg-icons";
import DoctorCard from "../../components/DoctorCard";
import api from "../../api";
import { useNavigate } from "react-router-dom";

export default function Doctor({ match }) {
  const [doctors, setDoctors] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/booking/get-available-doctors").then((res) => {
      setDoctors(res.data);
    });
  }, []);

  return (
    <Container>
      <div style={{ paddingLeft: "35px" }}>
        <Button onClick={() => navigate(-1)}>
          <FontAwesomeIcon icon={faArrowAltCircleLeft} />
          Go Back
        </Button>
        <Col>
          <Row>
            {doctors && doctors.length > 0 ? (
              doctors.map((doc) => {
                return <DoctorCard key={doc.did} match={match} doctor={doc} />;
              })
            ) : (
              <strong>Fetching doctors list...</strong>
            )}
          </Row>
        </Col>
      </div>
    </Container>
  );
}
