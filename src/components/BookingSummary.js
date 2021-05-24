import React, { Component } from "react";
import { Button } from "react-bootstrap";
import api from "./../api";
export class BookingSummary extends Component {
  // {field: "Gynecology", pid: "1", slot: 2}
  state = { doctorInfo: null };
  bookingInfo = this.props.location.state;

  componentDidMount() {
    api
      .post("/get-doctor-with-role", {
        role: this.bookingInfo.field,
      })
      .then(({ data }) => this.setState({ doctorInfo: data }));
  }

  handleBookingConfirmation() {
    api
      .post("/book-slot", {
        slotNo: this.bookingInfo.slot,
        pid: this.bookingInfo.pid,
        did: this.state.doctorInfo.did,
      })
      .then((res) => {
        if (res.status === 200 && res.statusText === "OK") {
          alert("Booking successful");
        } else {
          alert("Doctors currently available");
        }
      })
      .catch(() => {
        alert("Doctors currently available");
      });
  }
  render() {
    return (
      <div className="jumbotron">
        {/* {this.state.doctorInfo} */}
        <Button onClick={() => this.handleBookingConfirmation()}>
          Confirm booking
        </Button>
      </div>
    );
  }
}

export default BookingSummary;
