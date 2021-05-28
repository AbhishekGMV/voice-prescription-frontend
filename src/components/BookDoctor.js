import React, { Component } from "react";
import { Card, Row, Col, Button } from "react-bootstrap";
import { Redirect } from "react-router";
import moment from "moment";
import "./../styles/booking-page.css";
import api from "./../api";

export class BookDoctor extends Component {
  doctor = this.props.location.state.doctor;
  pid = this.props.match.params.id;
  state = {
    slots: [],
    redirect: false,
    selectedSlot: {},
  };

  componentDidMount() {
    api.get("./get-available-slots").then(({ data }) => {
      data.map((slot) => {
        slot["slot_start"] = moment(slot.slot_start, "hh:mm a").format(
          "h:mm a"
        );
        slot["slot_end"] = moment(slot.slot_end, "hh:mm").format("h:mm a");
        return slot; //ignore
      });

      this.setState({ slots: data });
    });
  }

  render() {
    if (this.state.redirect) {
      return (
        <Redirect
          to={{
            pathname: `/patient/${this.pid}/booking-summary`,
            state: {
              pid: this.pid,
              selectedSlot: this.state.selectedSlot,
              doctor: this.doctor,
            },
          }}
        />
      );
    }
    return (
      <div className="slots-card">
        <Col>
          <Row>
            {this.state.slots.length &&
              this.state.slots.map((slot) => {
                return (
                  <Card
                    className="slot"
                    onClick={() =>
                      this.setState({
                        selectedSlot: {
                          slot_no: slot.slot_no,
                          start_time: slot.slot_start,
                          end_time: slot.slot_end,
                        },
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
        {this.state.selectedSlot && (
          <>
            <Button
              variant="primary"
              onClick={() => this.setState({ redirect: true })}
            >
              Book now
            </Button>
            <Button
              variant="danger"
              onClick={() => this.setState(this.initialState)}
            >
              reset
            </Button>
          </>
        )}
      </div>
    );
  }
}

export default BookDoctor;
