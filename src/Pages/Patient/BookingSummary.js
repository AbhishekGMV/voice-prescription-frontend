import React, { useEffect, useState } from "react";
import { Button, Card } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowAltCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useLocation } from "react-router-dom";
import api from "./../../api";

export function BookingSummary() {
  const [doctorInfo, setDoctorInfo] = useState(null);
  const { state } = useLocation();
  const navigate = useNavigate();
  const bookingInfo = state;
  const doctor = bookingInfo.doctor;
  const role = bookingInfo.field ? bookingInfo.field : "";
  const pid = bookingInfo.pid;
  const selectedSlot = bookingInfo.selectedSlot;

  useEffect(() => {
    if (role.length > 0) {
      api
        .post("/get-doctor-with-role", {
          role,
        })
        .then(({ data }) => {
          setDoctorInfo(data);
        })
        .catch((err) => {
          console.error(err);
        });
    } else {
      setDoctorInfo(doctor);
    }
  }, [doctor, role]);

  const handleBookingConfirmation = () => {
    api
      .post("/book-slot", {
        slotNo: selectedSlot.slot_no,
        pid,
        did: doctorInfo.did,
      })
      .then((res) => {
        if (res.status === 200 && res.statusText === "OK") {
          alert("Booking successful");
          navigate(`/patient/${pid}/appointment`);
        } else {
          alert("Doctors currently available");
        }
      })
      .catch(() => {
        alert("Doctors currently available");
      });
  };

  return (
    <>
      <Button onClick={() => navigate(-1)}>
        <FontAwesomeIcon icon={faArrowAltCircleLeft} />
        Go Back
      </Button>
      {doctorInfo && selectedSlot ? (
        <div className="rand2">
          <Card>
            <Card.Title>
              <h3>Doctor details</h3>
            </Card.Title>
            <Card.Text>Name: {doctorInfo.dname}</Card.Text>
            <Card.Text>Email: {doctorInfo.demail}</Card.Text>
            <Card.Text>Phone: {doctorInfo.dphno}</Card.Text>
            <Card.Text>Specialization: {doctorInfo.role}</Card.Text>
            <Card.Title>
              <h3>Slot details</h3>
            </Card.Title>
            <Card.Text>
              Timings : {selectedSlot.start_time} - {selectedSlot.end_time}
            </Card.Text>

            <Button onClick={handleBookingConfirmation}>Confirm booking</Button>
          </Card>
        </div>
      ) : (
        <h2>No doctors available for selected slot</h2>
      )}
    </>
  );
}

export default BookingSummary;
