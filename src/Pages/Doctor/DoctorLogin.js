import React, { useState } from "react";
import api from "./../../api";
import { Link, useNavigate } from "react-router-dom";
import "./../../styles/login.css";

export default function DoctorLogin() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(false);
    api
      .post("/doctor/login", {
        phno: phoneNumber,
        password: password,
      })
      .then((response) => {
        const did = response.data.did;
        navigate(`/doctor/${did}`, {
          state: { did },
        });
      })
      .catch(() => {
        setError(true);
      });
  };

  const handleClearForm = () => {
    setError(false);
    setPassword("");
    setPhoneNumber("");
  };

  return (
    <div>
      <div className="split left"></div>

      <div className="form-group split right">
        <div style={{ fontfamily: "Sans-Serif" }}>
          <h2>Doctor login</h2>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              value={phoneNumber}
              placeholder="Phone number"
              required
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>
          <div className="input-group mb-3">
            <input
              type="password"
              className="form-control"
              placeholder="Password"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="btn-section">
            <input type="submit" className="btn btn-success" />
            <input
              type="reset"
              className="btn btn-danger"
              onClick={handleClearForm}
            />
          </div>
          {error ? <div className="error"> Unable to login</div> : ""}
          <span>
            <b>Don't have an account?</b>
          </span>{" "}
          <Link to="/doctor/register">Register here</Link>
        </form>
      </div>
    </div>
  );
}
