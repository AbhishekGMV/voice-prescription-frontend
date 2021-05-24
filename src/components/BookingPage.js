import React, { Component } from "react";
import { Card, Row, Col, Button } from "react-bootstrap";
import { Redirect } from "react-router";
import moment from "moment";
import "./../styles/booking-page.css";
import api from "./../api";

export class BookingPage extends Component {
  pid = this.props.match.params.id;
  initialState = {
    slots: [],
    showTiming: false,
    selectedField: null,
    selectedSlot: null,
    redirect: false,
  };

  state = this.initialState;

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
              field: this.state.selectedField,
              pid: this.pid,
              slot: this.state.selectedSlot,
            },
          }}
        />
      );
    }

    return (
      <div className="slots-card">
        <Col>
          <Row>
            {[
              "OPD",
              "Gynecology",
              "Neurosurgeon",
              "Psychiatrist",
              "Dental",
            ].map((field, idx) => {
              return (
                <Card
                  className="field"
                  onClick={(e) => {
                    this.setState({ showTiming: true, selectedField: field });
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

            {this.state.showTiming && (
              <h5>Available slots for {this.state.selectedField}</h5>
            )}
            {this.state.showTiming &&
              this.state.slots.map((slot) => {
                return (
                  <Card
                    className="slot"
                    onClick={() =>
                      this.setState({ selectedSlot: slot.slot_no })
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

export default BookingPage;
