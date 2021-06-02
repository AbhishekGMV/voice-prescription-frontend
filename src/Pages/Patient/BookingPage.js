import React, { Component } from "react";
import { Card, Row, Col, Button } from "react-bootstrap";
import { Redirect } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowAltCircleLeft } from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
import "./../../styles/booking-page.css";
import api from "./../../api";

export class BookingPage extends Component {
  pid = this.props.match.params.id;
  initialState = {
    slots: [],
    showTiming: false,
    selectedField: null,
    selectedSlot: {},
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
              field: this.state.selectedField.toLowerCase(),
              pid: this.pid,
              selectedSlot: this.state.selectedSlot,
            },
          }}
        />
      );
    }

    return (
      <div className="slots-card">
        <Button onClick={() => this.props.history.goBack()}>
          <FontAwesomeIcon icon={faArrowAltCircleLeft} />
          Go Back
        </Button>
        <Col>
          <Row>
            {[
              "OPD",
              "Gynecologist",
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
                      this.setState({
                        selectedSlot: {
                          slot: slot.slot_no,
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
        {Object.keys(this.state.selectedSlot).length > 0 && (
          <>
            <Button
              variant="primary"
              onClick={() => this.setState({ redirect: true })}
            >
              Book now
            </Button>
            <Button
              variant="danger"
              onClick={() =>
                this.setState({ selectedSlot: {}, selectedField: null })
              }
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
