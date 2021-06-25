import React from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./../styles/homepage.css";

export default function Homepage() {
  return (
    <center>
    <div className="container">
      <Button>
        <Link className="login-link" to="/patient/login">
          Login as patient
        </Link>
      </Button>
      <Button>
        <Link className="login-link" to="/doctor/login">
          Login as doctor
        </Link>
      </Button>
    </div>
    </center>
  );
}
