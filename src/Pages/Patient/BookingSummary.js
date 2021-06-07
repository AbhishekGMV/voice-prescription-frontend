import React, { Component } from "react";
import { Button, Card } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowAltCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { Redirect } from "react-router";
import api from "./../../api";
export class BookingSummary extends Component {
  state = { doctorInfo: null, redirect: false };
  bookingInfo = this.props.location.state;
  doctorInfo = this.bookingInfo.doctor;
  role = this.bookingInfo.field ? this.bookingInfo.field : "";
  pid = this.bookingInfo.pid;
  selectedSlot = this.bookingInfo.selectedSlot;

  componentDidMount() {
    if (this.role.length > 0) {
      return api
        .post("/get-doctor-with-role", {
          role: this.role,
        })
        .then(({ data }) => {
          this.setState({ doctorInfo: data });
        })
        .catch((err) => {
          console.error(err);
        });
    } else {
      this.setState({ doctorInfo: this.doctorInfo });
    }
  }

  handleBookingConfirmation() {
    api
      .post("/book-slot", {
        slotNo: this.selectedSlot.slot_no,
        pid: this.bookingInfo.pid,
        did: this.state.doctorInfo.did,
      })
      .then((res) => {
        if (res.status === 200 && res.statusText === "OK") {
          alert("Booking successful");
          this.setState({ redirect: true });
        } else {
          alert("Doctors currently available");
        }
      })
      .catch(() => {
        alert("Doctors currently available");
      });
  }

  render() {
    if (this.state.redirect) {
      return (
        <Redirect
          to={{
            pathname: `/patient/${this.pid}/appointment`,
          }}
        />
      );
    }

    <Button onClick={() => this.props.history.goBack()}>
      <FontAwesomeIcon icon={faArrowAltCircleLeft} />
      Go Back
    </Button>;
    if (this.state.doctorInfo && this.selectedSlot) {
      return (
        <div>
          <Card>
            <Card.Title>Doctor details</Card.Title>
            <Card.Text>Name: {this.state.doctorInfo.dname}</Card.Text>
            <Card.Text>Email: {this.state.doctorInfo.demail}</Card.Text>
            <Card.Text>Phone: {this.state.doctorInfo.dphno}</Card.Text>
            <Card.Title>Slot details</Card.Title>
            <Card.Text>
              Timings : {this.selectedSlot.start_time} -
              {this.selectedSlot.end_time}
            </Card.Text>

            <Button onClick={() => this.handleBookingConfirmation()}>
              Confirm booking
            </Button>
          </Card>
        </div>
      );
    } else {
      return <h2>No doctors available for selected slot</h2>;
    }
  }
}

export default BookingSummary;
