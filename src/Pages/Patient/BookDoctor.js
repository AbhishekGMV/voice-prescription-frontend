import React, { useEffect, useState } from "react";
import { Card, Row, Col, Button } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import moment from "moment";
import "./../../styles/booking-page.css";
import api from "./../../api";

export function BookDoctor() {
  const { state } = useLocation();
  const doctor = state.doctor;
  const { pid } = state;
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlots] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/get-available-slots").then(({ data }) => {
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
      <Col>
        <Row>
          {slots.length &&
            slots.map((slot) => {
              return (
                <Card
                  className="slot"
                  onClick={() =>
                    setSelectedSlots({
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
      {selectedSlot.slot_no && <h5>Selected slot: {selectedSlot.slot_no}</h5>}
      {selectedSlot && (
        <>
          <center>
            <Button
              variant="primary"
              onClick={() =>
                navigate(`/patient/${pid}/booking-summary`, {
                  state: {
                    pid,
                    selectedSlot,
                    doctor,
                  },
                })
              }
            >
              Book now
            </Button>
            <Button variant="danger" onClick={() => console.log("reset")}>
              Reset
            </Button>
          </center>
        </>
      )}
    </div>
  );
}

export default BookDoctor;
