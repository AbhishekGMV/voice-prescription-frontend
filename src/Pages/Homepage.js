import React from "react";
import { Card } from "react-bootstrap";
import "./../styles/homepage.css";
import { Link } from "react-router-dom";
import doc from "./../images/docc.jpeg";
import pat from "./../images/patt.jpeg";

export default function Homepage() {
  return (
    <>
      <div className="backk">
        <center>
          <div className="container">
            <div className="flexx">
              <Card style={{ width: "30rem", height: "30rem" }}>
                <Card.Body>
                  <img
                    src={pat}
                    width="400px"
                    alt="patient"
                    height="400px"
                  ></img>
                  <Card.Text>
                    <button type="button" className="rand">
                      <Link to="/patient/login">Patient Login </Link>
                    </button>
                  </Card.Text>
                </Card.Body>
              </Card>
              <Card
                style={{ width: "30rem", height: "30rem", marginLeft: "50px" }}
              >
                <Card.Body>
                  <img
                    src={doc}
                    width="400px"
                    alt="patient"
                    height="400px"
                  ></img>
                  <Card.Text>
                    <button type="button" className="rand">
                      <Link to="/doctor/login">Doctor Login </Link>
                    </button>
                  </Card.Text>
                </Card.Body>
              </Card>
            </div>
          </div>
        </center>{" "}
      </div>
    </>
  );
}
