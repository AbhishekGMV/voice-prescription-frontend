import React, { useEffect, useState } from "react";
import { Card, Row, Col, Button } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowAltCircleLeft } from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
import "./../../styles/booking-page.css";
import api from "./../../api";

export function BookingPage() {
  const navigate = useNavigate();
  const [slots, setSlots] = useState([]);
  const [showTiming, setShowTiming] = useState(false);
  const [selectedField, setSelectedField] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState({});
  const { pid } = useParams();

  useEffect(() => {
    api.get("./get-available-slots").then(({ data }) => {
      data.map((slot) => {
        slot["slot_start"] = moment(slot.slot_start, "hh:mm a").format(
          "h:mm a"
        );
        slot["slot_end"] = moment(slot.slot_end, "hh:mm").format("h:mm a");
        return slot; //ignore
      });

      setSlots(data);
    });
  }, []);

  return (
    <div className="slots-card">
      <Button onClick={() => navigate(-1)}>
        <FontAwesomeIcon icon={faArrowAltCircleLeft} />
        Go Back
      </Button>
      <Col>
        <Row>
          {[
            "General",
            "Gynecologist",
            "Neurosurgeon",
            "Psychiatrist",
            "Dental",
          ].map((field, idx) => {
            return (
              <Card
                className="field"
                onClick={(e) => {
                  setShowTiming(true);
                  setSelectedField(field);
                }}
                style={{ width: "18rem" }}
                key={idx}
              >
                <Card.Body>
                  <Card.Title>{field}</Card.Title>
                </Card.Body>
              </Card>
            );
          })}

          {showTiming && (
            <center>
              <h4 style={{ paddingTop: "40px" }}>
                Available slots for {selectedField}
              </h4>
            </center>
          )}
          {showTiming &&
            slots.map((slot) => {
              return (
                <Card
                  className="slot"
                  onClick={() =>
                    setSelectedSlot({
                      slot_no: slot.slot_no,
                      start_time: slot.slot_start,
                      end_time: slot.slot_end,
                    })
                  }
                  style={{ width: "18rem" }}
                  key={slot.slot_no}
                >
                  <Card.Body>
                    <Card.Title>Slot {slot.slot_no}</Card.Title>
                    <Card.Text>Start time: {slot.slot_start}</Card.Text>
                    <Card.Text>End time: {slot.slot_end}</Card.Text>
                  </Card.Body>
                </Card>
              );
            })}
        </Row>
      </Col>
      {selectedSlot.slot_no && (
        <center>
          <h4 style={{ paddingTop: "40px" }}>
            Selected slot: {selectedSlot.slot_no}
          </h4>
        </center>
      )}
      {Object.keys(selectedSlot).length > 0 && (
        <>
          <center>
            <Button
              variant="primary"
              onClick={() =>
                navigate(`/patient/${pid}/booking-summary`, {
                  state: {
                    field: selectedField.toLowerCase(),
                    pid,
                    selectedSlot,
                  },
                })
              }
            >
              Book now
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                setSelectedSlot({});
                setSelectedField(null);
              }}
            >
              Reset
            </Button>
          </center>
        </>
      )}
    </div>
  );
}

export default BookingPage;
