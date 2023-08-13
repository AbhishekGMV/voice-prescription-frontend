import React, { useState } from "react";
import api from "./../../api";
import { Link, useNavigate } from "react-router-dom";
import "./../../styles/register.css";

export default function PatientRegister() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(false);

    if (password !== confirmPassword) {
      setError(true);
      return;
    }
    const payload = {
      name: name,
      email: email,
      dob: dob,
      phno: phoneNumber,
      password: password,
      gender: gender,
    };

    api
      .post("/patient/register", payload)
      .then(({ data }) => {
        let pid = data[0];
        navigate(`/patient/${pid}`, {
          state: {
            pid,
          },
        });
      })
      .catch((err) => {
        console.log(err);
        setError(true);
      });
  };

  const handleFormClear = () => {
    setName("");
    setEmail("");
    setGender("");
    setPassword("");
    setConfirmPassword("");
    setDob("");
    setPhoneNumber("");
    setError(false);
  };

  return (
    <div className="pic">
      <div className="outFormControl">
        <div style={{ marginBottom: "10%", fontfamily: "Sans-Serif" }}>
          <h2>Patient Register</h2>
        </div>
        <br></br>
        {}
        <form onSubmit={handleSubmit} id="form">
          <div className="input-group mb-3">
            <input
              type="text"
              value={name}
              className="form-control"
              placeholder="Name"
              required
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="input-group mb-3">
            <input
              type="email"
              className="form-control"
              value={email}
              placeholder="example@email.com(optional)"
              onChange={(e) => setEmail(e.target.value)}
            />{" "}
          </div>
          <div className="input-group mb-3">
            <input
              type="date"
              className="form-control"
              value={dob}
              required
              onChange={(e) => setDob(e.target.value)}
            />
          </div>
          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              name="flexRadioDefault"
              required
              onChange={(e) => setGender(e.target.value)}
              checked={gender === "M"}
              value="M"
            />
            <label>Male</label>
          </div>
          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              required
              name="flexRadioDefault"
              onChange={(e) => setGender(e.target.value)}
              value="F"
              checked={gender === "F"}
            />
            <label>Female</label>
          </div>
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              value={phoneNumber}
              required
              placeholder="Phone number"
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>
          <div className="input-group mb-3">
            <input
              type="password"
              className="form-control"
              value={password}
              required
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="input-group mb-3">
            <input
              type="password"
              className="form-control"
              value={confirmPassword}
              required
              placeholder="Confirm password"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <div className="btn-section">
            <input type="submit" className="btn btn-success" />
            <input
              className="btn btn-danger"
              type="reset"
              onClick={handleFormClear}
            />
          </div>
          {error ? <div className="error"> Unable to register</div> : ""}
          <span>Already have an account? </span>{" "}
          <Link to="/patient/login">Login here</Link>
        </form>
      </div>
    </div>
  );
}
