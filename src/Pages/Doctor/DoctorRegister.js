import React from "react";
import api from "./../../api";
import { Link } from "react-router-dom";
import { Dropdown, DropdownButton } from "react-bootstrap";
import "./../../styles/register.css";

export default class PatientRegister extends React.Component {
  dropDownOptions = [
    "OPD",
    "Gynecology",
    "Neurosurgeon",
    "Psychiatrist",
    "Dental",
  ];

  initialState = {
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    error: false,
    specialization: null,
    dropdownError: false,
  };

  state = this.initialState;

  handleSubmit = (e) => {
    e.preventDefault();
    if (!this.state.specialization) {
      this.setState({ dropdownError: true });
      return;
    }
    this.setState({ error: false });
    if (this.state.password !== this.state.confirmPassword) {
      this.setState({ error: true });
    } else {
      api
        .post("/doctor/register", {
          name: this.state.name,
          email: this.state.email,
          phno: this.state.phoneNumber,
          password: this.state.password,
          role: this.state.specialization,
        })
        .then((response) => {
          this.setState({ dropdownError: false, error: false });
          alert(response.statusText);
        })
        .catch(() => {
          this.setState({ error: true });
        });
    }
  };

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <label>Doctor register</label>
          <div className="input-group mb-3">
            <input
              type="text"
              value={this.state.name}
              className="form-control"
              required
              placeholder="Name"
              onChange={(e) => this.setState({ name: e.target.value })}
            />
          </div>
          <div className="input-group mb-3">
            <input
              type="email"
              placeholder="example@email.com"
              className="form-control"
              value={this.state.email}
              onChange={(e) => this.setState({ email: e.target.value })}
            />{" "}
          </div>
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              value={this.state.phoneNumber}
              placeholder="Phone number"
              required
              onChange={(e) => this.setState({ phoneNumber: e.target.value })}
            />
          </div>
          <div className="input-group mb-3">
            <input
              type="password"
              className="form-control"
              value={this.state.password}
              placeholder="Password"
              required
              onChange={(e) => this.setState({ password: e.target.value })}
            />
          </div>
          <div className="input-group mb-3">
            <input
              type="password"
              className="form-control"
              value={this.state.confirmPassword}
              placeholder="Confirm password"
              required
              onChange={(e) =>
                this.setState({ confirmPassword: e.target.value })
              }
            />
          </div>
          <div>
            <label>Specialization:</label>
            <DropdownButton
              onSelect={(value) =>
                this.setState({ specialization: value, dropdownError: false })
              }
              title={
                this.state.specialization === null
                  ? "Specialization"
                  : this.state.specialization
              }
            >
              {this.dropDownOptions.map((title) => {
                return (
                  <Dropdown.Item key={title} eventKey={title}>
                    {title}
                  </Dropdown.Item>
                );
              })}
            </DropdownButton>
          </div>
          <div className="Dropdown-required-error">
            {this.state.dropdownError ? (
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
              onClick={() => this.setState(this.initialState)}
            />
          </div>
          {this.state.error ? (
            <div className="error"> Unable to register</div>
          ) : (
            ""
          )}
          <span>Already have an account? </span>{" "}
          <Link to="/patient/login">Login here</Link>
        </form>
      </div>
    );
  }
}
