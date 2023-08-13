import React, { useState } from "react";
import api from "./../../api";
import { Link, useNavigate } from "react-router-dom";
import { Dropdown, DropdownButton } from "react-bootstrap";
import "./../../styles/register.css";

export default function DoctorRegister() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(false);
  const [dropdownError, setDropdownError] = useState(false);

  const dropDownOptions = [
    "General",
    "Gynecology",
    "Neurosurgeon",
    "Psychiatrist",
    "Dental",
  ];

  const formData = new FormData();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!specialization) {
      setDropdownError(true);
      return;
    }
    setError(false);
    if (password !== confirmPassword) {
      setError(true);
    } else {
      formData.append("name", name);
      formData.append("email", email);
      formData.append("phno", phoneNumber);
      formData.append("password", password);
      formData.append("role", specialization);
      api
        .post("/doctor/register", formData)
        .then(({ data }) => {
          setDropdownError(false);
          setError(false);
          let did = data[0];
          navigate(`/doctor/${did}`);
        })
        .catch(() => {
          setError(true);
        });
    }
  };

  const handleDigitalSignUpload = (e) => {
    let file = e.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      formData.append("signature", reader.result.toString());
    };
  };

  return (
    <div className="pic">
      <form className="form-group" onSubmit={handleSubmit}>
        <div style={{ fontfamily: "Sans-Serif" }}>
          <h2>Doctor Register</h2>
        </div>
        <br></br>
        <div className="input-group mb-3">
          <input
            type="text"
            value={name}
            className="form-control"
            required
            placeholder="Name"
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="input-group mb-3">
          <input
            type="email"
            placeholder="example@email.com"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />{" "}
        </div>
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
            value={password}
            placeholder="Password"
            required
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="input-group mb-3">
          <input
            type="password"
            className="form-control"
            value={confirmPassword}
            placeholder="Confirm password"
            required
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <div>
          <label>Specialization:</label>
          <DropdownButton
            onSelect={(value) => {
              setSpecialization(value);
              setDropdownError(false);
            }}
            title={specialization === null ? "Specialization" : specialization}
          >
            {dropDownOptions.map((title) => {
              return (
                <Dropdown.Item key={title} eventKey={title}>
                  {title}
                </Dropdown.Item>
              );
            })}
          </DropdownButton>
        </div>
        <div>
          <label>Add signature</label>
          <input
            className="form-control"
            type="file"
            onChange={(e) => handleDigitalSignUpload(e)}
          />
        </div>
        <div className="Dropdown-required-error">
          {dropdownError ? (
            <div className="error">Specialization is required</div>
          ) : (
            ""
          )}
        </div>
        <div className="btn-section">
          <input type="submit" className="btn btn-success" />
          <input
            className="btn btn-danger"
            type="reset"
            onClick={() => console.log("clear")}
          />
        </div>
        {error ? <div className="error"> Unable to register</div> : ""}
        <span>Already have an account? </span>{" "}
        <Link to="/doctor/login">Login here</Link>
      </form>
    </div>
  );
}
